import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { openContact, togglePetals } from '../../store/portfolioSlice'
import { Menu, X, ArrowRight } from 'lucide-react'

export default function Navbar() {
  const dispatch = useDispatch()
  const enablePetals = useSelector((state) => state.portfolio.enablePetals)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Projects', href: '#projects' },
    { name: 'About', href: '#about' },
    { name: 'Philosophy', href: '#philosophy' },
    { name: 'Contact', href: '#contact' },
  ]

  const handleNavClick = (href) => {
    setMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-xs py-3.5 border-b border-neutral-100'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          className="flex items-center gap-2 text-neutral-900 group select-none cursor-pointer"
        >
          <span className="font-bold tracking-tight text-base sm:text-lg font-sans">
            PORTFOLIO
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#ea4c89]" />
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-medium hidden sm:inline">
            // CREATIVE DEV
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className="text-sm font-medium tracking-wide text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer relative py-1 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#ea4c89] transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Subtle Petals Toggle */}
          <button
            onClick={() => dispatch(togglePetals())}
            title={enablePetals ? 'Disable Falling Petals' : 'Enable Falling Petals'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
              enablePetals
                ? 'bg-pink-50 border-pink-200 text-pink-700'
                : 'bg-neutral-50 border-neutral-200 text-neutral-400'
            }`}
          >
            <span>🌸</span>
            <span className="text-[11px]">Petals</span>
          </button>

          {/* Contact Button */}
          <button
            onClick={() => dispatch(openContact())}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ea4c89] to-[#ec4899] text-white text-sm font-medium tracking-wide shadow-md shadow-pink-500/20 hover:shadow-lg hover:shadow-pink-500/30 hover:opacity-95 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <span>Get in Touch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-xl border-b border-neutral-200 px-6 py-5 shadow-xl">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-left text-base font-medium text-neutral-800 hover:text-[#ea4c89] py-2 border-b border-neutral-100 cursor-pointer"
              >
                {link.name}
              </button>
            ))}

            <div className="pt-2 flex items-center justify-between text-sm text-neutral-600">
              <span className="flex items-center gap-2">
                <span>🌸</span>
                <span>Falling Petals Effect</span>
              </span>
              <button
                onClick={() => dispatch(togglePetals())}
                className="text-xs font-bold px-3 py-1 rounded bg-neutral-100"
              >
                {enablePetals ? 'ON' : 'OFF'}
              </button>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false)
                dispatch(openContact())
              }}
              className="mt-3 w-full py-3 rounded-full bg-gradient-to-r from-[#ea4c89] to-[#ec4899] text-white text-sm font-medium text-center shadow-md shadow-pink-500/20"
            >
              Get in Touch
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
