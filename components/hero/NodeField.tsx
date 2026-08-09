'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  linesFragment,
  linesVertex,
  pointsFragment,
  pointsVertex,
} from './shaders'

/** PRNG con semilla: el campo se ve igual en cada carga y es reproducible. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Ritmo de la animación de entrada, en segundos. */
const DELAY = 0.45
const DURATION = 2.6

type Field = {
  chaos: Float32Array
  grid: Float32Array
  seeds: Float32Array
  count: number
  lineChaos: Float32Array
  lineGrid: Float32Array
  lineSeeds: Float32Array
}

/**
 * Construye las dos posiciones de cada partícula —dispersa y ordenada— y los
 * segmentos que las unirán. Los vecinos se calculan sobre la retícula final,
 * porque es ahí donde las conexiones tienen que verse limpias.
 */
function buildField(count: number, withLines: boolean, maxLines: number): Field {
  const rand = mulberry32(20260809)

  const chaos = new Float32Array(count * 3)
  const grid = new Float32Array(count * 3)
  const seeds = new Float32Array(count)

  // Retícula proporcional al número de partículas, ligeramente apaisada.
  const cols = Math.ceil(Math.sqrt(count * 1.7))
  const rows = Math.ceil(count / cols)

  // El jitter tiene que ser una fracción pequeña del espaciado. Con ±0.045
  // sobre un paso de 0.1 la retícula se lee tan revuelta como el caos y toda
  // la transición deja de notarse.
  const jitterX = (2 / cols) * 0.07
  const jitterY = (2 / rows) * 0.07

  for (let i = 0; i < count; i++) {
    // Disperso: nube ancha sin estructura.
    chaos[i * 3] = (rand() * 2 - 1) * 1.15
    chaos[i * 3 + 1] = (rand() * 2 - 1) * 1.05
    chaos[i * 3 + 2] = (rand() * 2 - 1) * 0.5

    // Ordenado: retícula con un jitter mínimo para que no se vea mecánica.
    const col = i % cols
    const row = Math.floor(i / cols)
    grid[i * 3] = ((col + 0.5) / cols) * 2 - 1 + (rand() - 0.5) * jitterX
    grid[i * 3 + 1] = ((row + 0.5) / rows) * 2 - 1 + (rand() - 0.5) * jitterY
    grid[i * 3 + 2] = (rand() - 0.5) * 0.08

    seeds[i] = rand()
  }

  if (!withLines) {
    const empty = new Float32Array(0)
    return { chaos, grid, seeds, count, lineChaos: empty, lineGrid: empty, lineSeeds: empty }
  }

  // Cada nodo se une a su vecino de la derecha y al de abajo: da una malla
  // legible sin tener que ordenar distancias de todos contra todos.
  const pairs: Array<[number, number]> = []
  for (let i = 0; i < count && pairs.length < maxLines; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)

    const right = i + 1
    if (col + 1 < cols && right < count && rand() > 0.25) pairs.push([i, right])

    const down = i + cols
    if (row + 1 < rows && down < count && rand() > 0.45) pairs.push([i, down])
  }

  const segments = Math.min(pairs.length, maxLines)
  const lineChaos = new Float32Array(segments * 6)
  const lineGrid = new Float32Array(segments * 6)
  const lineSeeds = new Float32Array(segments * 2)

  for (let s = 0; s < segments; s++) {
    const [a, b] = pairs[s]
    for (let v = 0; v < 2; v++) {
      const src = v === 0 ? a : b
      const dst = s * 6 + v * 3
      lineChaos[dst] = chaos[src * 3]
      lineChaos[dst + 1] = chaos[src * 3 + 1]
      lineChaos[dst + 2] = chaos[src * 3 + 2]
      lineGrid[dst] = grid[src * 3]
      lineGrid[dst + 1] = grid[src * 3 + 1]
      lineGrid[dst + 2] = grid[src * 3 + 2]
      lineSeeds[s * 2 + v] = seeds[src]
    }
  }

  return { chaos, grid, seeds, count, lineChaos, lineGrid, lineSeeds }
}

function Field({
  progress,
  count,
  withLines,
}: {
  progress: React.RefObject<number>
  count: number
  withLines: boolean
}) {
  const { viewport, size } = useThree()

  const field = useMemo(
    () => buildField(count, withLines, 260),
    [count, withLines],
  )

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uScale: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(1e4, 1e4) },
      uMouseRadius: { value: 1.8 },
      uSize: { value: 11 },
      uPixelRatio: { value: 1 },
      uColorDim: { value: new THREE.Color('#8a929e') },
      uColorBright: { value: new THREE.Color('#eceef1') },
      uColorSignal: { value: new THREE.Color('#ffc400') },
    }),
    [],
  )

  const lineUniforms = useMemo(
    () => ({
      uTime: uniforms.uTime,
      uProgress: uniforms.uProgress,
      uScale: uniforms.uScale,
      uMouse: uniforms.uMouse,
      uMouseRadius: uniforms.uMouseRadius,
      uColor: { value: new THREE.Color('#39414d') },
    }),
    [uniforms],
  )

  const group = useRef<THREE.Group>(null)
  const pointsMat = useRef<THREE.ShaderMaterial>(null)
  const linesMat = useRef<THREE.ShaderMaterial>(null)
  const mouseTarget = useRef(new THREE.Vector2(1e4, 1e4))
  const elapsed = useRef(0)

  useFrame((state, delta) => {
    // Los uniforms se leen del material, no del objeto que se le pasó como
    // prop: r3f no garantiza que conserve esa referencia, y mutando el objeto
    // externo los valores nunca llegaban a la GPU —el campo se quedaba
    // congelado en su estado inicial.
    const pu = pointsMat.current?.uniforms
    if (!pu) return

    elapsed.current += delta
    pu.uTime.value += delta
    pu.uPixelRatio.value = Math.min(state.gl.getPixelRatio(), 1.5)
    pu.uSize.value = size.width < 768 ? 8 : 11

    // El campo cubre algo más que el viewport para que no se vean los bordes.
    pu.uScale.value.set(viewport.width * 0.62, viewport.height * 0.58)

    // El campo se ordena solo al cargar. Atarlo al scroll fue un error: la
    // transformación terminaba justo cuando el hero ya había salido de pantalla,
    // así que nadie la veía. Ahora ocurre a la vista y el scroll solo la deshace
    // un poco, como si el orden se soltara al alejarse.
    const intro = THREE.MathUtils.clamp((elapsed.current - DELAY) / DURATION, 0, 1)
    const eased = 1 - (1 - intro) ** 3
    const target = eased * (1 - (progress.current ?? 0) * 0.45)

    pu.uProgress.value = THREE.MathUtils.damp(pu.uProgress.value, target, 6, delta)

    // El puntero de r3f viene normalizado; se pasa a unidades del mundo.
    if (state.pointer.x !== 0 || state.pointer.y !== 0) {
      mouseTarget.current.set(
        (state.pointer.x * viewport.width) / 2,
        (state.pointer.y * viewport.height) / 2,
      )
    }
    pu.uMouse.value.lerp(mouseTarget.current, 1 - Math.exp(-6 * delta))

    // Las líneas comparten la misma transformación: si sus uniforms se
    // desincronizan, las conexiones se despegan de sus nodos.
    const lu = linesMat.current?.uniforms
    if (lu) {
      lu.uTime.value = pu.uTime.value
      lu.uProgress.value = pu.uProgress.value
      lu.uScale.value.copy(pu.uScale.value)
      lu.uMouse.value.copy(pu.uMouse.value)
      lu.uMouseRadius.value = pu.uMouseRadius.value
    }

    // En pantallas anchas el titular ocupa la izquierda, así que el campo se
    // corre hacia la derecha en vez de quedar debajo del texto.
    if (group.current) {
      group.current.position.x = size.width >= 1024 ? viewport.width * 0.17 : 0
    }
  })

  return (
    <group ref={group}>
      {withLines && field.lineSeeds.length > 0 && (
        <lineSegments frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[field.lineGrid, 3]}
            />
            <bufferAttribute attach="attributes-aChaos" args={[field.lineChaos, 3]} />
            <bufferAttribute attach="attributes-aGrid" args={[field.lineGrid, 3]} />
            <bufferAttribute attach="attributes-aSeed" args={[field.lineSeeds, 1]} />
          </bufferGeometry>
          <shaderMaterial
            ref={linesMat}
            vertexShader={linesVertex}
            fragmentShader={linesFragment}
            uniforms={lineUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      )}

      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[field.grid, 3]} />
          <bufferAttribute attach="attributes-aChaos" args={[field.chaos, 3]} />
          <bufferAttribute attach="attributes-aGrid" args={[field.grid, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[field.seeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={pointsMat}
          vertexShader={pointsVertex}
          fragmentShader={pointsFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </points>

    </group>
  )
}

export default function NodeField({
  progress,
  count,
  withLines,
}: {
  progress: React.RefObject<number>
  count: number
  withLines: boolean
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        // Solo en desarrollo: sin esto las capturas automatizadas devuelven un
        // framebuffer vacío. En producción cuesta memoria y no aporta nada.
        preserveDrawingBuffer: process.env.NODE_ENV === 'development',
      }}
      style={{ pointerEvents: 'none' }}
    >
      <Field progress={progress} count={count} withLines={withLines} />
    </Canvas>
  )
}
