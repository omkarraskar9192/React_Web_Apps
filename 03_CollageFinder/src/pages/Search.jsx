import { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  Button,
  Chip
} from '@heroui/react'
import {
  Search as SearchIcon,
  MapPin,
  BookOpen,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Globe,
  SlidersHorizontal,
  Layers
} from 'lucide-react'
import {
  fetchColleges,
  selectAllColleges
} from '../store/slices/collegesSlice'
import {
  fetchCutoffs,
  selectAllCutoffs
} from '../store/slices/cutoffsSlice'

export default function SearchPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const colleges = useSelector(selectAllColleges)
  const cutoffs = useSelector(selectAllCutoffs)

  // Filters State
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedExam, setSelectedExam] = useState('all')
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [maxNirfRank, setMaxNirfRank] = useState(100)
  const [expandedCollegeId, setExpandedCollegeId] = useState(null)

  useEffect(() => {
    dispatch(fetchColleges())
    dispatch(fetchCutoffs())
  }, [dispatch])

  // Extract filter options
  const statesList = useMemo(() => {
    const s = new Set(colleges.map((c) => c.location?.state).filter(Boolean))
    return ['all', ...Array.from(s).sort()]
  }, [colleges])

  const examsList = useMemo(() => {
    return ['all', 'JEE Advanced', 'JEE Main', 'MHT-CET', 'BITSAT', 'NEET']
  }, [])

  const branchesList = useMemo(() => {
    const b = new Set()
    colleges.forEach((c) => c.programs?.forEach((p) => b.add(p)))
    return ['all', ...Array.from(b).sort()]
  }, [colleges])

  // Filter Colleges
  const filteredColleges = useMemo(() => {
    return colleges.filter((college) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch =
        !q ||
        college.name.toLowerCase().includes(q) ||
        college.code.toLowerCase().includes(q) ||
        college.location?.city?.toLowerCase().includes(q) ||
        college.location?.state?.toLowerCase().includes(q)

      const matchesState = selectedState === 'all' || college.location?.state === selectedState
      const matchesType = selectedType === 'all' || college.type === selectedType

      const matchesBranch =
        selectedBranch === 'all' || college.programs?.includes(selectedBranch)

      const matchesRank = !college.nirfRank || Number(college.nirfRank) <= maxNirfRank

      // If exam filter is active, check if college has cutoffs for this exam
      const matchesExam =
        selectedExam === 'all' ||
        cutoffs.some((c) => c.collegeId === college.id && c.examType === selectedExam)

      return matchesSearch && matchesState && matchesType && matchesBranch && matchesRank && matchesExam
    }).sort((a, b) => (Number(a.nirfRank) || 9999) - (Number(b.nirfRank) || 9999))
  }, [colleges, cutoffs, searchTerm, selectedState, selectedType, selectedBranch, maxNirfRank, selectedExam])

  const toggleExpand = (id) => {
    setExpandedCollegeId(expandedCollegeId === id ? null : id)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedState('all')
    setSelectedType('all')
    setSelectedExam('all')
    setSelectedBranch('all')
    setMaxNirfRank(100)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 mb-4">
            <GraduationCap className="w-3.5 h-3.5" />
            Centralized College & Cutoff Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Explore Top Colleges, Cutoffs & Branch Placements
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            Search top engineering & university institutes across India. Compare past year closing ranks, NIRF standings, and find the perfect match for your entrance exams.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            color="primary"
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs shadow-lg shadow-indigo-500/30"
            startContent={<Sparkles className="w-4 h-4" />}
            onPress={() => navigate('/recommend')}
          >
            Predict Colleges by Marks
          </Button>
        </div>
      </div>

      {/* Main Content Layout: Filters on Left, Cards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                Filter Directory
              </span>
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                Reset All
              </button>
            </div>

            <div className="space-y-4 pt-4">
              {/* Search input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Search Keywords
                </label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="College, city, code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Entrance Exam */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Entrance Exam
                </label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {examsList.map((exam) => (
                    <option key={exam} value={exam}>
                      {exam === 'all' ? 'All Entrance Exams' : exam}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Location / State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {statesList.map((st) => (
                    <option key={st} value={st}>
                      {st === 'all' ? 'All States' : st}
                    </option>
                  ))}
                </select>
              </div>

              {/* College Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Institution Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Types</option>
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                  <option value="Deemed">Deemed University</option>
                  <option value="Autonomous">Autonomous</option>
                </select>
              </div>

              {/* Engineering Branch */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target Branch
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {branchesList.map((br) => (
                    <option key={br} value={br}>
                      {br === 'all' ? 'All Branches' : br}
                    </option>
                  ))}
                </select>
              </div>

              {/* NIRF Rank Range */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Max NIRF Rank</span>
                  <span className="text-indigo-600 font-bold">Top {maxNirfRank}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={maxNirfRank}
                  onChange={(e) => setMaxNirfRank(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Colleges Results Cards */}
        <div className="lg:col-span-3 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">
              Found <strong className="text-slate-900">{filteredColleges.length}</strong> institutions matching your criteria
            </span>
            <span className="text-xs text-slate-400">Sorted by NIRF Rank (Top First)</span>
          </div>

          {filteredColleges.length === 0 ? (
            <Card className="bg-white border border-slate-200 p-12 text-center rounded-2xl">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-slate-800 font-bold text-base">No colleges match your current filters</h3>
              <p className="text-xs text-slate-500 mt-1">Try expanding the NIRF range or clearing the state and branch filters.</p>
              <Button
                size="sm"
                color="primary"
                variant="flat"
                className="mt-4 text-xs font-semibold mx-auto"
                onPress={resetFilters}
              >
                Clear All Filters
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredColleges.map((college) => {
                const isExpanded = expandedCollegeId === college.id
                const collegeCutoffs = cutoffs.filter((c) => c.collegeId === college.id)

                return (
                  <Card
                    key={college.id}
                    className="bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all rounded-2xl overflow-hidden"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-700 text-sm shrink-0 shadow-xs">
                            {college.code || 'CLG'}
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                                {college.name}
                              </h3>
                              <Chip
                                size="sm"
                                variant="flat"
                                color={
                                  college.type === 'Government'
                                    ? 'primary'
                                    : college.type === 'Private'
                                    ? 'success'
                                    : 'secondary'
                                }
                                className="text-[11px] font-semibold"
                              >
                                {college.type}
                              </Chip>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {college.location?.city}, {college.location?.state}
                              </span>
                              {college.establishedYear && (
                                <span>&bull; Est. {college.establishedYear}</span>
                              )}
                              {college.naacRating && (
                                <span className="text-emerald-700 font-semibold">
                                  &bull; NAAC {college.naacRating}
                                </span>
                              )}
                              {college.website && (
                                <a
                                  href={college.website}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-indigo-600 hover:underline flex items-center gap-1"
                                >
                                  <Globe className="w-3 h-3" /> Visit Website
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* NIRF Rank Badge */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                          {college.nirfRank ? (
                            <div className="text-center bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-xl">
                              <span className="text-[10px] font-bold text-slate-500 block uppercase">NIRF Rank</span>
                              <span className="text-base font-black text-indigo-700">#{college.nirfRank}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">Unranked</span>
                          )}

                          <Button
                            size="sm"
                            variant="light"
                            className="text-indigo-600 text-xs font-semibold"
                            onPress={() => toggleExpand(college.id)}
                            endContent={isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          >
                            {isExpanded ? 'Hide Cutoffs' : 'View Cutoffs'}
                          </Button>
                        </div>
                      </div>

                      {/* Programs Badges */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-medium text-slate-500 mr-1">Programs:</span>
                        {college.programs?.slice(0, 4).map((prog, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg text-xs font-medium"
                          >
                            {prog}
                          </span>
                        ))}
                        {(college.programs?.length || 0) > 4 && (
                          <span className="text-xs text-indigo-600 font-semibold">
                            +{college.programs.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Expandable Cutoffs Section */}
                      {isExpanded && (
                        <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50/70 -mx-6 -mb-6 p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                              <Layers className="w-4 h-4 text-indigo-600" />
                              Historical Branch Cutoff Ranks
                            </h4>
                            <span className="text-xs text-slate-500 font-medium">
                              {collegeCutoffs.length} cutoff records recorded
                            </span>
                          </div>

                          {collegeCutoffs.length === 0 ? (
                            <p className="text-xs text-slate-500 py-2">
                              Cutoff data for this college has not been published yet. Check back soon or view other institutions.
                            </p>
                          ) : (
                            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold">
                                    <th className="py-2.5 px-3">Branch</th>
                                    <th className="py-2.5 px-3">Exam</th>
                                    <th className="py-2.5 px-3">Year</th>
                                    <th className="py-2.5 px-3">Closing Rank</th>
                                    <th className="py-2.5 px-3">General</th>
                                    <th className="py-2.5 px-3">OBC</th>
                                    <th className="py-2.5 px-3">SC/ST</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {collegeCutoffs.map((cutoff) => (
                                    <tr key={cutoff.id} className="hover:bg-slate-50">
                                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                                        {cutoff.branch}
                                      </td>
                                      <td className="py-2.5 px-3">
                                        <Chip size="sm" variant="flat" color="primary" className="text-[10px]">
                                          {cutoff.examType}
                                        </Chip>
                                      </td>
                                      <td className="py-2.5 px-3 font-medium text-slate-600">
                                        {cutoff.year}
                                      </td>
                                      <td className="py-2.5 px-3 font-bold text-indigo-700">
                                        #{cutoff.closingRank}
                                      </td>
                                      <td className="py-2.5 px-3 text-slate-700 font-medium">
                                        {cutoff.categoryCutoffs?.General || cutoff.closingRank}
                                      </td>
                                      <td className="py-2.5 px-3 text-slate-700">
                                        {cutoff.categoryCutoffs?.OBC || '-'}
                                      </td>
                                      <td className="py-2.5 px-3 text-slate-700">
                                        {cutoff.categoryCutoffs?.SC || cutoff.categoryCutoffs?.ST || '-'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          <div className="flex justify-end pt-2">
                            <Button
                              size="sm"
                              color="primary"
                              className="bg-indigo-600 text-white text-xs font-semibold"
                              startContent={<Sparkles className="w-3.5 h-3.5" />}
                              onPress={() => navigate('/recommend')}
                            >
                              Check My Admission Chances
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}