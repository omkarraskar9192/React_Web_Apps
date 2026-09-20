import Badge from '../common/Badge'
import HankoSeal from '../common/HankoSeal'
import { Layers, ShieldCheck, Heart } from 'lucide-react'

export default function PhilosophySection() {
  const principles = [
    {
      num: '01',
      title: 'Intentional Simplicity',
      desc: 'Removing non-essential elements to elevate clarity, eliminate cognitive friction, and let the core content communicate with quiet confidence.',
      icon: Layers,
    },
    {
      num: '02',
      title: 'Relentless Refinement',
      desc: 'Obsessing over sub-second initial paint times, 60fps gestures, strict semantic accessibility, and modular, scalable codebases.',
      icon: ShieldCheck,
    },
    {
      num: '03',
      title: 'Harmonious Interaction',
      desc: 'Crafting digital interfaces that feel calm, natural, and intuitive—technology that serves human intent rather than demanding attention.',
      icon: Heart,
    },
  ]

  return (
    <section id="philosophy" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
      <div className="relative z-10 max-w-3xl mb-16">
        <Badge label="Guiding Principles" dot={true} className="mb-3" />
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 font-sans mt-2">
          Design & Engineering Philosophy
        </h2>
        <p className="text-base sm:text-lg text-neutral-600 mt-3 leading-relaxed font-normal">
          Minimalism is not the absence of energy; it is the deliberate presence of focus and purpose.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {principles.map((p, index) => {
          const Icon = p.icon
          return (
            <div
              key={index}
              className="jp-glass-card rounded-3xl p-8 flex flex-col justify-between border border-neutral-200/80 group hover:border-[#ea4c89]/40 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-800 group-hover:bg-pink-50 group-hover:text-[#ea4c89] transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-400">
                    {p.num} // CORE
                  </span>
                </div>

                <h3 className="text-xl font-bold text-neutral-900 mb-3 font-sans">
                  {p.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                  {p.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between">
                <HankoSeal text="CRAFT" subtext="2026" size="sm" />
                <span className="text-xs text-neutral-400 font-mono">STANDARDS</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
