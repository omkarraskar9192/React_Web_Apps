import { useDispatch } from 'react-redux'
import { openContact } from '../../store/portfolioSlice'
import Badge from '../common/Badge'
import { ArrowRight, ArrowDown, Sparkles, MapPin, Zap } from 'lucide-react'

export default function HeroSection() {
  const dispatch = useDispatch()

  const scrollToProjects = () => {
    const element = document.querySelector('#projects')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-0 overflow-hidden bg-white"
      style={{
        backgroundImage: 'url(/user-tree-hero.png)',
        backgroundPosition: 'right bottom',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      {/* 
        Solid white gradient on the left that seamlessly masks the original baked-in text from the screenshot,
        while letting the user's exact tree, lake, and Mount Fuji on the right shine with complete clarity!
      */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent pointer-events-none md:w-[62%]" />

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center py-12 md:py-20">
        <div className="max-w-2xl">
          {/* Status Badge */}
          <div className="mb-6">
            <Badge label="Creative Developer & Designer • Open for Work" dot={true} />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.08] mb-6 font-sans">
            <span className="block text-neutral-950">Crafting digital experiences</span>
            <span className="block text-[#ea4c89] mt-1">with calm & precision.</span>
          </h1>

          {/* Subtitle Description */}
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-xl mb-9 font-normal">
            Designing and building modern web applications, bespoke user interfaces, and minimalist design systems with purposeful engineering and subtle motion.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={scrollToProjects}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#ea4c89] to-[#ec4899] text-white text-sm sm:text-base font-medium tracking-wide shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/35 hover:opacity-95 transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <span>Explore Selected Work</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              onClick={() => dispatch(openContact())}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200 text-neutral-800 text-sm sm:text-base font-medium hover:bg-white hover:border-neutral-300 shadow-2xs transition-all duration-200 cursor-pointer"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Information Ribbon */}
      <div className="relative z-10 w-full bg-white/90 backdrop-blur-md border-t border-neutral-200/60 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-neutral-600">
          <div className="flex items-center gap-2 text-neutral-800 font-medium">
            <Sparkles className="w-4 h-4 text-[#ea4c89]" />
            <span className="font-semibold tracking-wider uppercase text-neutral-900">
              CORE EXPERTISE
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-600 font-normal">
              React, Redux, Modern UI/UX, Motion Architecture
            </span>
          </div>

          <div className="flex items-center gap-2 text-neutral-700">
            <MapPin className="w-4 h-4 text-neutral-400" />
            <span>Available Worldwide • Remote</span>
          </div>

          <div className="flex items-center gap-2 text-neutral-700">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Accepting select contracts for 2026</span>
          </div>
        </div>

        {/* Minimalist divider line */}
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-dashed border-neutral-200 flex justify-between text-[10px] text-neutral-400 font-mono tracking-widest uppercase">
          <span>// CREATIVE PORTFOLIO</span>
          <span>CALM AESTHETICS • HIGH PERFORMANCE</span>
          <span>EST. 2026</span>
        </div>
      </div>
    </section>
  )
}
