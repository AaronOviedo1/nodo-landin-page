import Nav from '@/components/Nav'
import Hero from '@/components/hero/Hero'
import ClientsMarquee from '@/components/ClientsMarquee'
import ProblemBlock from '@/components/ProblemBlock'
import ServicesGrid from '@/components/ServicesGrid'
import ProjectsGrid from '@/components/ProjectsGrid'
import StatsCounter from '@/components/StatsCounter'
import ProcessTimeline from '@/components/ProcessTimeline'
import StackRow from '@/components/StackRow'
import Faq from '@/components/Faq'
import FinalCta from '@/components/FinalCta'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ClientsMarquee />
        <ProblemBlock />
        <ServicesGrid />
        <ProjectsGrid />
        <StatsCounter />
        <ProcessTimeline />
        <StackRow />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
