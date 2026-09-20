import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { closeContact, submitContactForm, resetContactForm } from '../../store/portfolioSlice'
import confetti from 'canvas-confetti'
import { X, Send, CheckCircle2, Mail, Copy, Check } from 'lucide-react'

export default function ContactModal() {
  const dispatch = useDispatch()
  const isOpen = useSelector((state) => state.portfolio.isContactOpen)
  const isSubmitted = useSelector((state) => state.portfolio.contactFormSubmitted)

  const [form, setForm] = useState({
    name: '',
    email: '',
    projectType: 'Web Application',
    message: '',
  })
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email) {
      alert('Please provide your name and email.')
      return
    }
    dispatch(submitContactForm())
    try {
      confetti({
        particleCount: 70,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#ea4c89', '#ec4899', '#fda4af', '#e11d48', '#ffffff']
      })
    } catch {
      // fallback
    }
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hello@portfolio.design')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-neutral-200">
        {/* Close Button */}
        <button
          onClick={() => dispatch(closeContact())}
          className="absolute top-6 right-6 p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#ea4c89]" />
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">
            GET IN TOUCH
          </span>
        </div>

        <h3 className="text-2xl font-bold font-sans text-neutral-950 mb-1">
          {isSubmitted ? 'Message Dispatched' : "Let's Build Something Meaningful"}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-500 mb-6">
          {isSubmitted
            ? 'Thank you for reaching out. I will review your message and reply within 24 hours.'
            : 'Whether you have a specific project in mind, an open role, or just want to connect.'}
        </p>

        {isSubmitted ? (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 rounded-2xl bg-pink-50/50 border border-pink-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-[#ea4c89] shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-900 mb-1">
                  Thank you, {form.name}!
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Your inquiry regarding <span className="font-semibold">{form.projectType}</span> has been securely recorded. A confirmation receipt has been sent to <span className="font-semibold">{form.email}</span>.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <div className="flex items-center gap-2 text-xs text-neutral-600">
                <Mail className="w-4 h-4 text-neutral-400" />
                <span className="font-mono">hello@portfolio.design</span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-1 text-xs font-semibold text-[#ea4c89] hover:underline cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                dispatch(closeContact())
                dispatch(resetContactForm())
              }}
              className="w-full py-3 rounded-full bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Return to Portfolio
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Alex Morgan"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#ea4c89]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="alex@company.com"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#ea4c89]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Project Category
              </label>
              <select
                value={form.projectType}
                onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#ea4c89] bg-white"
              >
                <option value="Web Application">Web Application Development</option>
                <option value="UI/UX Design System">UI/UX Design System</option>
                <option value="Frontend Architecture">Frontend Architecture & Refactor</option>
                <option value="Consultation">General Inquiry / Consultation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Message / Overview
              </label>
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me a bit about your timeline, goals, or requirements..."
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#ea4c89] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 rounded-full bg-gradient-to-r from-[#ea4c89] to-[#ec4899] text-white font-medium text-xs sm:text-sm tracking-wider uppercase shadow-md shadow-pink-500/20 hover:opacity-95 transition-all text-center cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Send Message</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
