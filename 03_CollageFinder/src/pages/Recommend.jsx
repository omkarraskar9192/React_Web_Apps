import { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Card,
  CardContent,
  Button,
  Chip
} from '@heroui/react'
import {
  Sparkles,
  Calculator,
  MapPin,
  BookOpen,
  CheckCircle,
  Clock,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  HelpCircle
} from 'lucide-react'
import {
  fetchColleges,
  selectAllColleges
} from '../store/slices/collegesSlice'
import {
  fetchCutoffs,
  selectAllCutoffs
} from '../store/slices/cutoffsSlice'

export default function Recommend() {
  const dispatch = useDispatch()

  const colleges = useSelector(selectAllColleges)
  const cutoffs = useSelector(selectAllCutoffs)

  // Predictor Inputs
  const [examType, setExamType] = useState('JEE Advanced')
  const [inputType, setInputType] = useState('rank') // 'rank' or 'marks'
  const [studentRank, setStudentRank] = useState('350')
  const [studentMarks, setStudentMarks] = useState('220')
  const [studentPercentile, setStudentPercentile] = useState('98.5')
  const [category, setCategory] = useState('General')
  const [preferredState, setPreferredState] = useState('all')
  const [preferredCity, setPreferredCity] = useState('')
  const [preferredBranch, setPreferredBranch] = useState('all')
  const [preferredType, setPreferredType] = useState('all')

  // Shortlisted colleges stored in local state/storage
  const [shortlistedIds, setShortlistedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shortlistedColleges') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    dispatch(fetchColleges())
    dispatch(fetchCutoffs())
  }, [dispatch])

  // Extract available states and branches
  const availableStates = useMemo(() => {
    const states = new Set(colleges.map((c) => c.location?.state).filter(Boolean))
    return ['all', ...Array.from(states).sort()]
  }, [colleges])

  const availableBranches = useMemo(() => {
    const branches = new Set()
    colleges.forEach((c) => c.programs?.forEach((p) => branches.add(p)))
    return ['all', ...Array.from(branches).sort()]
  }, [colleges])

  // Toggle Shortlist
  const toggleShortlist = (item) => {
    const exists = shortlistedIds.some((s) => s.cutoffId === item.cutoffId)
    let updated
    if (exists) {
      updated = shortlistedIds.filter((s) => s.cutoffId !== item.cutoffId)
    } else {
      updated = [...shortlistedIds, item]
    }
    setShortlistedIds(updated)
    localStorage.setItem('shortlistedColleges', JSON.stringify(updated))
  }

  // Smart Counselor Algorithm
  const recommendations = useMemo(() => {
    if (!colleges.length || !cutoffs.length) return []

    // Effective rank calculation
    let effectiveRank = Number(studentRank) || 1000
    if (inputType === 'marks') {
      // Mock rank conversion based on marks/percentile
      const marks = Number(studentMarks) || 100
      if (examType === 'JEE Advanced') {
        effectiveRank = Math.max(1, Math.round(50000 * Math.exp(-0.015 * marks)))
      } else if (examType === 'BITSAT') {
        effectiveRank = Math.max(1, Math.round(30000 * Math.exp(-0.012 * marks)))
      } else {
        effectiveRank = Math.max(1, Math.round((100 - (Number(studentPercentile) || 90)) * 12000))
      }
    }

    const results = []

    cutoffs
      .filter((cutoff) => cutoff.examType === examType)
      .forEach((cutoff) => {
        const college = colleges.find((c) => c.id === cutoff.collegeId)
        if (!college) return

        // Region / State Filter
        if (preferredState !== 'all' && college.location?.state !== preferredState) {
          return
        }

        // City Filter
        if (
          preferredCity.trim() &&
          !college.location?.city?.toLowerCase().includes(preferredCity.trim().toLowerCase())
        ) {
          return
        }

        // Branch Filter
        if (
          preferredBranch !== 'all' &&
          !cutoff.branch.toLowerCase().includes(preferredBranch.toLowerCase())
        ) {
          return
        }

        // College Type Filter
        if (preferredType !== 'all' && college.type !== preferredType) {
          return
        }

        // Get category cutoff
        const categoryCutoffRank =
          cutoff.categoryCutoffs?.[category] || cutoff.closingRank || 500

        // Admission Chance Logic:
        // Safe: rank <= 85% of cutoff rank
        // Target: rank between 85% and 110% of cutoff rank
        // Dream: rank between 110% and 135% of cutoff rank
        let chance = null
        let chanceScore = 0

        if (effectiveRank <= categoryCutoffRank * 0.85) {
          chance = 'Safe'
          chanceScore = 3
        } else if (effectiveRank <= categoryCutoffRank * 1.1) {
          chance = 'Target'
          chanceScore = 2
        } else if (effectiveRank <= categoryCutoffRank * 1.35) {
          chance = 'Dream'
          chanceScore = 1
        }

        if (chance) {
          results.push({
            college,
            cutoff,
            cutoffId: cutoff.id,
            branch: cutoff.branch,
            closingRank: categoryCutoffRank,
            effectiveRank,
            chance,
            chanceScore,
            nirfRank: college.nirfRank || 9999
          })
        }
      })

    // Sort by best college quality / NIRF rank on top (descending order of quality)
    return results.sort((a, b) => a.nirfRank - b.nirfRank)
  }, [
    colleges,
    cutoffs,
    examType,
    inputType,
    studentRank,
    studentMarks,
    studentPercentile,
    category,
    preferredState,
    preferredCity,
    preferredBranch,
    preferredType
  ])

  // Count by probability
  const safeCount = recommendations.filter((r) => r.chance === 'Safe').length
  const targetCount = recommendations.filter((r) => r.chance === 'Target').length
  const dreamCount = recommendations.filter((r) => r.chance === 'Dream').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-xl">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/30 text-violet-200 border border-violet-400/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            AI Smart Counselor & Predictor
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Find Your Ideal College & Branch by Entrance Marks
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            Enter your entrance marks or category rank, select your preferred cities and branches, and our counselor engine will classify college options into <strong>Safe</strong>, <strong>Target</strong>, and <strong>Dream</strong> categories sorted by NIRF quality.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Counselor Input Form (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sticky top-24">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Your Exam Scorecard</h3>
                <p className="text-xs text-slate-500">Provide your score & preferences</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              {/* Exam Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target Entrance Exam
                </label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="JEE Advanced">JEE Advanced (IITs)</option>
                  <option value="JEE Main">JEE Main (NITs, IIITs, GFTIs)</option>
                  <option value="MHT-CET">MHT-CET (COEP, VJTI, SPIT)</option>
                  <option value="BITSAT">BITSAT (BITS Pilani, Goa, Hyd)</option>
                  <option value="NEET">NEET (Medical / Bio-eng)</option>
                </select>
              </div>

              {/* Input Mode: Rank vs Marks */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Input Mode</label>
                  <div className="flex bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setInputType('rank')}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        inputType === 'rank' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      All-India Rank
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputType('marks')}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        inputType === 'marks' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Marks / %ile
                    </button>
                  </div>
                </div>

                {inputType === 'rank' ? (
                  <input
                    type="number"
                    placeholder="Enter your AIR / Category Rank (e.g. 450)"
                    value={studentRank}
                    onChange={(e) => setStudentRank(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Total Marks (e.g. 210)"
                      value={studentMarks}
                      onChange={(e) => setStudentMarks(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Percentile (e.g. 98.45)"
                      value={studentPercentile}
                      onChange={(e) => setStudentPercentile(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Caste / Admission Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="General">General / Open</option>
                  <option value="OBC">OBC-NCL</option>
                  <option value="EWS">GEN-EWS</option>
                  <option value="SC">Scheduled Caste (SC)</option>
                  <option value="ST">Scheduled Tribe (ST)</option>
                </select>
              </div>

              {/* Preferred Branch */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preferred Engineering Branch
                </label>
                <select
                  value={preferredBranch}
                  onChange={(e) => setPreferredBranch(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Any Engineering Branch</option>
                  {availableBranches.filter((b) => b !== 'all').map((br) => (
                    <option key={br} value={br}>
                      {br}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Region / State */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preferred State / Region
                </label>
                <select
                  value={preferredState}
                  onChange={(e) => setPreferredState(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Any State across India</option>
                  {availableStates.filter((s) => s !== 'all').map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred City */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Specific City (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Delhi, Pune, Bangalore"
                  value={preferredCity}
                  onChange={(e) => setPreferredCity(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Institution Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  College Type
                </label>
                <select
                  value={preferredType}
                  onChange={(e) => setPreferredType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Types (Govt & Private)</option>
                  <option value="Government">Government / Autonomous Only</option>
                  <option value="Private">Private Universities Only</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Counselor Recommendations (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Counselor Probability Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Safe Choices
              </span>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-black">{safeCount}</span>
                <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">&gt; 85% Admission chance</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                Target Choices
              </span>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-black">{targetCount}</span>
                <p className="text-[11px] text-amber-700 mt-0.5 font-medium">Competitive match</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-rose-600" />
                Dream Reach
              </span>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-black">{dreamCount}</span>
                <p className="text-[11px] text-rose-700 mt-0.5 font-medium">Ambitious rounds</p>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">
                Found <strong className="text-slate-900">{recommendations.length}</strong> college & branch matches
              </span>
              <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2.5 py-1 rounded-lg">
                Ordered by NIRF Ranking (Prestige First)
              </span>
            </div>

            {recommendations.length === 0 ? (
              <Card className="bg-white border border-slate-200 p-12 text-center rounded-2xl">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-slate-800 font-bold text-base">No matches found for this specific score & filters</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Try widening your preferred state or branch filter, or check cutoff trends in the Explore Colleges section.
                </p>
                <Button
                  size="sm"
                  color="primary"
                  className="mt-4 bg-indigo-600 text-white text-xs font-semibold mx-auto"
                  onPress={() => {
                    setPreferredState('all')
                    setPreferredBranch('all')
                    setPreferredCity('')
                  }}
                >
                  Reset Preferences
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {recommendations.map((item, idx) => {
                  const isSaved = shortlistedIds.some((s) => s.cutoffId === item.cutoffId)
                  return (
                    <Card
                      key={`${item.cutoffId}-${idx}`}
                      className={`bg-white border transition-all rounded-2xl overflow-hidden shadow-xs hover:shadow-md ${
                        item.chance === 'Safe'
                          ? 'border-emerald-200 hover:border-emerald-300'
                          : item.chance === 'Target'
                          ? 'border-amber-200 hover:border-amber-300'
                          : 'border-rose-200 hover:border-rose-300'
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-800 text-xs shrink-0">
                              {item.college.code || 'CLG'}
                            </div>

                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-bold text-slate-900 leading-snug">
                                  {item.college.name}
                                </h3>
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  color={
                                    item.college.type === 'Government'
                                      ? 'primary'
                                      : 'success'
                                  }
                                  className="text-[10px] font-semibold"
                                >
                                  {item.college.type}
                                </Chip>
                              </div>

                              <p className="text-sm font-semibold text-indigo-700 flex items-center gap-1.5">
                                <BookOpen className="w-4 h-4 text-indigo-500" />
                                {item.branch}
                              </p>

                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                  {item.college.location?.city}, {item.college.location?.state}
                                </span>
                                {item.college.nirfRank && (
                                  <span className="font-semibold text-slate-700">
                                    &bull; NIRF #{item.college.nirfRank}
                                  </span>
                                )}
                                {item.college.naacRating && (
                                  <span className="text-emerald-600 font-medium">
                                    &bull; NAAC {item.college.naacRating}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Probability Badge & Save Button */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase flex items-center gap-1 ${
                                item.chance === 'Safe'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.chance === 'Target'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {item.chance === 'Safe' && <CheckCircle className="w-3.5 h-3.5" />}
                              {item.chance === 'Target' && <Clock className="w-3.5 h-3.5" />}
                              {item.chance === 'Dream' && <TrendingUp className="w-3.5 h-3.5" />}
                              {item.chance} Chance
                            </span>

                            <button
                              onClick={() => toggleShortlist(item)}
                              className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                                isSaved
                                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {isSaved ? (
                                <>
                                  <BookmarkCheck className="w-3.5 h-3.5 text-indigo-600" />
                                  Shortlisted
                                </>
                              ) : (
                                <>
                                  <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                                  Save to List
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Counselor Analysis Bar */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
                          <div>
                            <span>Cutoff Benchmark ({category}): </span>
                            <strong className="text-slate-900 font-bold">Closing #{item.closingRank}</strong>
                            <span className="text-slate-400 mx-1.5">&bull;</span>
                            <span>Your Target Rank: </span>
                            <strong className="text-indigo-700 font-bold">#{item.effectiveRank}</strong>
                          </div>

                          <span className="text-slate-500 font-medium">
                            {item.chance === 'Safe'
                              ? 'Highly recommended for top-choice priority.'
                              : item.chance === 'Target'
                              ? 'Keep in medium rounds of counseling.'
                              : 'Place above safe choices in option form.'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}