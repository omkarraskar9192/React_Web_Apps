import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { openContact } from '../../store/portfolioSlice'
import HankoSeal from './HankoSeal'
import { Clock, ArrowUp, Send } from 'lucide-react'

export default function Footer() {
  const dispatch = useDispatch()
  const [currentTime, setCurrentTime] = useState('')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }
      setCurrentTime(new Intl.DateTimeFormat('en-GB', options).format(now))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!newsletterEmail) return
    setSubscribed(true)
    setTimeout(() => {
      setNewsletterEmail('')
    }, 2500)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer id="contact" className="bg-white border-t border-neutral-200/70 pt-16 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-100">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-lg font-sans">
                PORTFOLIO
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ea4c89]" />
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-medium">
                // CREATIVE DEVELOPER
              </span>
            </div>

            <p className="text-sm text-neutral-500 leading-relaxed max-w-sm">
              Designing and building thoughtful web applications and minimalist digital interfaces with clean code and high performance.
            </p>

            {/* Live Clock Display */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-50 border border-neutral-200/80 text-xs font-mono text-neutral-700">
              <Clock className="w-3.5 h-3.5 text-[#ea4c89]" />
              <span className="text-neutral-400">Local Time:</span>
              <span className="font-bold text-neutral-900">{currentTime || '12:00:00'}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <a href="#home" className="hover:text-[#ea4c89] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-[#ea4c89] transition-colors">
                  Selected Work
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#ea4c89] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#philosophy" className="hover:text-[#ea4c89] transition-colors">
                  Philosophy
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Contact & Updates */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
              Stay Connected
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Interested in collaborating or discussing a new project? Reach out directly.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-pink-50 border border-pink-200 text-xs text-[#ea4c89] font-medium">
                Thank you! Your email is registered for updates.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="your.email@company.com"
                  className="flex-1 px-4 py-2 text-xs rounded-full border border-neutral-200 focus:outline-none focus:border-[#ea4c89]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="pt-2 flex items-center gap-3">
              <HankoSeal text="STUDIO" subtext="2026" size="sm" />
              <button
                onClick={() => dispatch(openContact())}
                className="text-xs font-semibold text-[#ea4c89] hover:underline cursor-pointer"
              >
                Open Inquiry Form →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright and back-to-top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© 2026 Creative Portfolio. Crafted with simplicity, performance & care.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
