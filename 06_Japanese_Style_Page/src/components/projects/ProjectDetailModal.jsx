import { useSelector, useDispatch } from 'react-redux'
import { closeProjectDetail, openContact } from '../../store/portfolioSlice'
import HankoSeal from '../common/HankoSeal'
import { X, ArrowRight } from 'lucide-react'

export default function ProjectDetailModal() {
  const dispatch = useDispatch()
  const isOpen = useSelector((state) => state.portfolio.isProjectDetailOpen)
  const project = useSelector((state) => state.portfolio.selectedProject)

  if (!isOpen || !project) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-neutral-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => dispatch(closeProjectDetail())}
          className="absolute top-6 right-6 p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 rounded-full bg-pink-50 text-[#ea4c89] text-xs font-mono font-bold">
            CASE STUDY // {project.year}
          </span>
          <HankoSeal text="PROJ" subtext="VERIFIED" size="sm" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold font-sans text-neutral-950 mb-1">
          {project.title}
        </h3>
        <p className="text-xs sm:text-sm font-mono text-neutral-400 uppercase tracking-wider mb-6">
          {project.tagline}
        </p>

        {/* Banner image */}
        <div className="relative h-56 rounded-2xl overflow-hidden mb-6 bg-neutral-100">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono">
            {project.metrics}
          </div>
        </div>

        {/* Description & Overview */}
        <div className="space-y-4 mb-6 text-sm text-neutral-600 leading-relaxed">
          <p>{project.description}</p>
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/70 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-400 font-medium">Client / Context:</span>
              <span className="font-bold text-neutral-800">{project.client}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 font-medium">Core Stack:</span>
              <span className="font-mono text-neutral-800">{project.tags.join(' • ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 font-medium">Key Result:</span>
              <span className="font-semibold text-emerald-700">{project.metrics}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-neutral-100">
          <button
            onClick={() => {
              dispatch(closeProjectDetail())
              dispatch(openContact())
            }}
            className="w-full sm:flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-[#ea4c89] to-[#ec4899] text-white font-medium text-xs sm:text-sm tracking-wider uppercase hover:opacity-95 transition-all text-center shadow-md shadow-pink-500/20 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Inquire About Similar Project</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => dispatch(closeProjectDetail())}
            className="w-full sm:w-auto py-3 px-6 rounded-full border border-neutral-200 text-neutral-700 text-xs sm:text-sm font-medium hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
