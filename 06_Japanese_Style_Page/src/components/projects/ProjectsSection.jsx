import { useSelector, useDispatch } from 'react-redux'
import { setActiveCategory, openProjectDetail } from '../../store/portfolioSlice'
import Badge from '../common/Badge'
import { ArrowUpRight } from 'lucide-react'

export default function ProjectsSection() {
  const dispatch = useDispatch()
  const { projects, activeCategory } = useSelector((state) => state.portfolio)

  const categories = [
    { key: 'all', label: 'All Projects' },
    { key: 'web', label: 'Web Applications' },
    { key: 'ui', label: 'UI & Systems' },
    { key: 'motion', label: 'Motion & Interaction' },
  ]

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === 'all') return true
    return p.category === activeCategory
  })

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-neutral-200/70">
        <div>
          <Badge label="Selected Work" dot={true} className="mb-3" />
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 font-sans mt-2">
            Featured Projects
          </h2>
          <p className="text-base text-neutral-500 max-w-xl mt-2 font-sans">
            A curated collection of web applications, design systems, and digital products built with calm aesthetics and high performance.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => dispatch(setActiveCategory(cat.key))}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider transition-all duration-200 cursor-pointer ${
                activeCategory === cat.key
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2x2 Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((project, index) => (
          <div
            key={project.id}
            onClick={() => dispatch(openProjectDetail(project))}
            className="jp-glass-card rounded-3xl overflow-hidden flex flex-col justify-between border border-neutral-200/80 hover:border-[#ea4c89]/40 group cursor-pointer"
          >
            {/* Project Image Banner */}
            <div className="relative h-64 overflow-hidden bg-neutral-100">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Number and Year */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-mono font-bold text-neutral-900 shadow-2xs">
                  0{index + 1}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-mono text-white">
                  {project.year}
                </span>
              </div>

              {/* Title & Tagline in Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-mono text-pink-200 uppercase tracking-wider mb-0.5">
                  {project.tagline}
                </p>
                <h3 className="text-2xl font-bold font-sans tracking-tight">
                  {project.title}
                </h3>
              </div>
            </div>

            {/* Project Details */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-mono font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400 font-medium">
                  {project.metrics}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 group-hover:text-[#ea4c89] transition-colors">
                  <span>View Case Study</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
