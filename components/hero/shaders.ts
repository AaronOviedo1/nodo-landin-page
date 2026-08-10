/**
 * Shaders del campo de nodos.
 *
 * La escena cuenta la propuesta de valor sin texto: las partículas empiezan
 * dispersas y desconectadas (la operación desordenada) y al hacer scroll se
 * acomodan en una retícula donde aparecen las conexiones (la operación
 * conectada). uProgress es el único uniform que gobierna esa transición.
 *
 * Las posiciones llegan normalizadas en [-1, 1] y se escalan aquí con uScale,
 * de modo que un cambio de tamaño de ventana solo actualiza un uniform en vez
 * de regenerar toda la geometría.
 */

const COMMON = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform vec2  uScale;
  uniform vec2  uMouse;
  uniform float uMouseRadius;
  uniform float uMouseStrength;

  /* Deriva browniana barata: sin acumular, solo dos senos desfasados. */
  vec3 drift(vec3 base, float seed) {
    float t = uTime * 0.25;
    return vec3(
      sin(t + seed * 6.2831) * 0.16,
      cos(t * 1.13 + seed * 4.7123) * 0.14,
      sin(t * 0.71 + seed * 2.3456) * 0.10
    );
  }

  /* Posición final de un vértice, compartida por puntos y líneas para que las
     conexiones nunca se despeguen de sus nodos. */
  vec3 resolve(vec3 chaos, vec3 grid, float seed) {
    float ease = uProgress * uProgress * (3.0 - 2.0 * uProgress);

    vec3 loose = chaos + drift(chaos, seed) * (1.0 - ease);
    vec3 norm  = mix(loose, grid, ease);

    vec3 pos = vec3(norm.xy * uScale, norm.z * 2.0);

    /* El cursor empuja lo que tiene cerca y abre un hueco a su alrededor. La
       caída es (1 - t²)²: llega al borde del radio con pendiente cero, así que
       no se ve una costura donde termina la influencia. */
    vec2 away = pos.xy - uMouse;
    float dist = length(away);
    float t = clamp(dist / uMouseRadius, 0.0, 1.0);
    float k = 1.0 - t * t;
    float force = k * k * uMouseStrength;
    pos.xy += normalize(away + 1e-4) * force * uMouseRadius * 0.42;

    return pos;
  }
`

export const pointsVertex = /* glsl */ `
  attribute vec3  aChaos;
  attribute vec3  aGrid;
  attribute float aSeed;

  uniform float uSize;
  uniform float uPixelRatio;

  varying float vSeed;
  varying float vDepth;

  ${COMMON}

  void main() {
    vec3 pos = resolve(aChaos, aGrid, aSeed);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    /* Perspectiva: lo que está más lejos se dibuja más chico. */
    gl_PointSize = uSize * uPixelRatio * (1.0 + aSeed * 0.6) * (8.0 / -mvPosition.z);

    vSeed = aSeed;
    vDepth = clamp((-mvPosition.z - 6.0) / 4.0, 0.0, 1.0);
  }
`

export const pointsFragment = /* glsl */ `
  /* highp para igualar la precisión por defecto del vertex shader: si difieren,
     el enlace del programa falla con "Precisions of uniform ... differ". */
  precision highp float;

  uniform vec3  uColorDim;
  uniform vec3  uColorBright;
  uniform vec3  uColorSignal;
  uniform float uProgress;

  varying float vSeed;
  varying float vDepth;

  void main() {
    /* Punto circular con borde suave; sin esto se ven cuadrados. */
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.32, d);
    if (alpha < 0.01) discard;

    /* Al ordenarse, parte del campo se enciende hacia Cal. */
    float lift = step(0.68, vSeed) * uProgress;
    vec3 color = mix(uColorDim, uColorBright, max(lift, uProgress * 0.4));

    /* Un puñado de nodos en Señal: ~3% de las partículas, muy por debajo del
       tope del 5% de área que fija el manual de marca. */
    float signal = step(0.968, vSeed);
    color = mix(color, uColorSignal, signal * (0.45 + uProgress * 0.55));

    gl_FragColor = vec4(color, alpha * (1.0 - vDepth * 0.4) * 0.92);
  }
`

export const linesVertex = /* glsl */ `
  attribute vec3  aChaos;
  attribute vec3  aGrid;
  attribute float aSeed;

  varying float vFade;

  ${COMMON}

  void main() {
    vec3 pos = resolve(aChaos, aGrid, aSeed);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    /* Las conexiones solo existen cuando el campo ya se ordenó. */
    vFade = smoothstep(0.45, 1.0, uProgress);
  }
`

export const linesFragment = /* glsl */ `
  /* highp para igualar la precisión por defecto del vertex shader: si difieren,
     el enlace del programa falla con "Precisions of uniform ... differ". */
  precision highp float;

  uniform vec3 uColor;

  varying float vFade;

  void main() {
    if (vFade < 0.01) discard;
    gl_FragColor = vec4(uColor, vFade * 0.85);
  }
`
