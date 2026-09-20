import { useDispatch } from 'react-redux'
import { openContact } from '../../store/portfolioSlice'
import Badge from '../common/Badge'
import HankoSeal from '../common/HankoSeal'
import { ArrowRight, Code2, Palette, Terminal } from 'lucide-react'

export default function AboutSection() {
  const dispatch = useDispatch()

  const capabilities = [
    {
      title: 'Frontend Architecture',
      desc: 'Building performant Single Page Applications with React 19, Redux Toolkit, TypeScript, and modern component systems.',
      icon: Code2,
    },
    {
      title: 'UI/UX & Design Systems',
      desc: 'Crafting responsive, accessible design systems with Tailwind CSS, Figma tokens, micro-interactions, and typography hierarchy.',
      icon: Palette,
    },
    {
      title: 'Performance & Optimization',
      desc: 'Optimizing for Core Web Vitals, sub-second initial load times, image pipelines, and seamless 60fps animations.',
      icon: Terminal,
    },
  ]

  const skills = [
    'React 19',
    'TypeScript',
    'JavaScript (ESNext)',
    'Tailwind CSS v4',
    'Redux Toolkit',
    'Framer Motion',
    'Vite',
    'REST & GraphQL',
    'Node.js',
    'Git & CI/CD',
    'Figma to Code',
    'Responsive Design',
  ]

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Bio */}
        <div className="lg:col-span-5 space-y-6">
          <Badge label="About The Creator" dot={true} />
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 font-sans leading-tight">
            Bridging clean aesthetics with rigorous engineering.
          </h2>
          <p className="text-base text-neutral-600 leading-relaxed">
            I am a creative developer focused on building intuitive, high-performance digital experiences. Drawing inspiration from Japanese minimalism—where simplicity and intentional space take center stage—I build interfaces that feel effortless to navigate.
          </p>
          <p className="text-base text-neutral-600 leading-relaxed">
            Whether architecting scalable frontend systems from scratch or refining micro-interactions, my goal is always the same: delivering products that are visually calm and technically flawless.
          </p>

          <div className="pt-2">
            <button
              onClick={() => dispatch(openContact())}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-xs cursor-pointer"
            >
              <span>Initiate Collaboration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Capabilities & Skills */}
        <div className="lg:col-span-7 space-y-8">
          {/* Capabilities Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {capabilities.map((cap, i) => {
              const Icon = cap.icon
              return (
                <div key={i} className="jp-glass-card rounded-2xl p-6 border border-neutral-200/80">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#ea4c89] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 mb-2 font-sans">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Technical Stack Pills */}
          <div className="jp-glass rounded-3xl p-6 sm:p-8 border border-neutral-200/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
                Technologies & Tools
              </h3>
              <HankoSeal text="SKILLS" subtext="2026" size="sm" />
            </div>

            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/80 text-neutral-800 text-xs font-mono font-medium shadow-2xs hover:border-pink-300 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
