import Navbar from './components/common/Navbar'
import SakuraCanvas from './components/common/SakuraCanvas'
import HeroSection from './components/hero/HeroSection'
import ProjectsSection from './components/projects/ProjectsSection'
import AboutSection from './components/about/AboutSection'
import PhilosophySection from './components/about/PhilosophySection'
import Footer from './components/common/Footer'
import ProjectDetailModal from './components/projects/ProjectDetailModal'
import ContactModal from './components/contact/ContactModal'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-pink-100 selection:text-pink-900 relative">
      {/* Subtle Falling Petals Physics */}
      <SakuraCanvas />

      {/* Modern Minimalist Navigation */}
      <Navbar />

      {/* Main Portfolio Sections */}
      <main>
        {/* Hero with Exact User Tree & Clean English Typography */}
        <HeroSection />

        {/* Curated Projects Showcase */}
        <ProjectsSection />

        {/* Creator Bio & Capabilities */}
        <AboutSection />

        {/* Craftsmanship & Design Philosophy */}
        <PhilosophySection />
      </main>

      {/* Clean Footer */}
      <Footer />

      {/* Interactive Modals */}
      <ProjectDetailModal />
      <ContactModal />
    </div>
  )
}
