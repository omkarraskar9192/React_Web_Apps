import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Chip
} from '@heroui/react'
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  X,
  Check,
  Filter
} from 'lucide-react'
import {
  addCutoff,
  updateCutoff,
  deleteCutoff,
  selectAllCutoffs
} from '../../store/slices/cutoffsSlice'
import { selectAllColleges } from '../../store/slices/collegesSlice'

export default function CutoffsManagement() {
  const dispatch = useDispatch()
  const cutoffs = useSelector(selectAllCutoffs)
  const colleges = useSelector(selectAllColleges)

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExam, setSelectedExam] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCutoffId, setEditingCutoffId] = useState(null)
  const [actionMessage, setActionMessage] = useState('')

  // Form State
  const initialFormState = {
    collegeId: colleges[0]?.id || '1',
    branch: 'Computer Science and Engineering',
    examType: 'JEE Advanced',
    year: 2024,
    openingRank: 1,
    closingRank: 500,
    categoryCutoffs: {
      General: 450,
      OBC: 400,
      SC: 280,
      ST: 200,
      EWS: 420
    }
  }

  const [formData, setFormData] = useState(initialFormState)
  const [formErrors, setFormErrors] = useState({})

  // Unique exams and years for filters
  const examsList = useMemo(() => {
    return ['JEE Advanced', 'JEE Main', 'MHT-CET', 'BITSAT', 'NEET']
  }, [])

  const yearsList = useMemo(() => {
    const years = new Set(cutoffs.map((c) => c.year))
    return [2024, 2023, 2022, ...years].filter((v, i, a) => a.indexOf(v) === i).sort().reverse()
  }, [cutoffs])

  // Filtered Cutoffs
  const filteredCutoffs = useMemo(() => {
    return cutoffs.filter((cutoff) => {
      const college = colleges.find((c) => c.id === cutoff.collegeId)
      const collegeName = college ? college.name.toLowerCase() : ''
      const collegeCode = college ? college.code.toLowerCase() : ''
      const branchName = cutoff.branch.toLowerCase()

      const matchesSearch =
        collegeName.includes(searchTerm.toLowerCase()) ||
        collegeCode.includes(searchTerm.toLowerCase()) ||
        branchName.includes(searchTerm.toLowerCase())

      const matchesExam = selectedExam === 'all' || cutoff.examType === selectedExam
      const matchesYear = selectedYear === 'all' || String(cutoff.year) === String(selectedYear)

      return matchesSearch && matchesExam && matchesYear
    })
  }, [cutoffs, colleges, searchTerm, selectedExam, selectedYear])

  const openAddModal = () => {
    setEditingCutoffId(null)
    setFormData({
      ...initialFormState,
      collegeId: colleges[0]?.id || '1'
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const openEditModal = (cutoff) => {
    setEditingCutoffId(cutoff.id)
    setFormData({
      collegeId: cutoff.collegeId,
      branch: cutoff.branch,
      examType: cutoff.examType,
      year: cutoff.year,
      openingRank: cutoff.openingRank || '',
      closingRank: cutoff.closingRank || '',
      categoryCutoffs: {
        General: cutoff.categoryCutoffs?.General || '',
        OBC: cutoff.categoryCutoffs?.OBC || '',
        SC: cutoff.categoryCutoffs?.SC || '',
        ST: cutoff.categoryCutoffs?.ST || '',
        EWS: cutoff.categoryCutoffs?.EWS || ''
      }
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const validate = () => {
    const errs = {}
    if (!formData.collegeId) errs.collegeId = 'Please select a college'
    if (!formData.branch.trim()) errs.branch = 'Branch is required'
    if (!formData.year) errs.year = 'Year is required'
    if (!formData.closingRank) errs.closingRank = 'Closing rank is required'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      collegeId: formData.collegeId,
      branch: formData.branch,
      examType: formData.examType,
      year: Number(formData.year),
      openingRank: Number(formData.openingRank) || 1,
      closingRank: Number(formData.closingRank),
      categoryCutoffs: {
        General: Number(formData.categoryCutoffs.General) || Number(formData.closingRank),
        OBC: Number(formData.categoryCutoffs.OBC) || Number(formData.closingRank),
        SC: Number(formData.categoryCutoffs.SC) || Number(formData.closingRank),
        ST: Number(formData.categoryCutoffs.ST) || Number(formData.closingRank),
        EWS: Number(formData.categoryCutoffs.EWS) || Number(formData.closingRank)
      }
    }

    if (editingCutoffId) {
      dispatch(updateCutoff({ id: editingCutoffId, updates: payload }))
      setActionMessage('Cutoff record updated successfully!')
    } else {
      dispatch(addCutoff(payload))
      setActionMessage('New cutoff added to database!')
    }

    setTimeout(() => setActionMessage(''), 4000)
    setIsModalOpen(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this cutoff record?')) {
      dispatch(deleteCutoff(id))
      setActionMessage('Cutoff deleted.')
      setTimeout(() => setActionMessage(''), 4000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {actionMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between text-sm shadow-sm">
          <span className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            {actionMessage}
          </span>
          <button onClick={() => setActionMessage('')} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Control Bar */}
      <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search college, branch (e.g. Computer Science), or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Entrance Exams</option>
                  {examsList.map((exam) => (
                    <option key={exam} value={exam}>{exam}</option>
                  ))}
                </select>
              </div>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Years</option>
                {yearsList.map((yr) => (
                  <option key={yr} value={yr}>Year {yr}</option>
                ))}
              </select>

              <Button
                color="primary"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-md shadow-indigo-600/20"
                startContent={<Plus className="w-4 h-4" />}
                onPress={openAddModal}
              >
                Add Cutoff
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cutoffs Table */}
      <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="font-semibold text-slate-900 text-base">Entrance Cutoff & Closing Rank Database</h2>
            <p className="text-xs text-slate-500">Showing {filteredCutoffs.length} of {cutoffs.length} records</p>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {filteredCutoffs.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-700 font-semibold text-base">No cutoffs found</p>
              <p className="text-slate-400 text-xs mt-1">Add cutoff details for your colleges to power the predictor.</p>
              <Button
                color="primary"
                size="sm"
                className="mt-4 bg-indigo-600 text-white text-xs"
                onPress={openAddModal}
              >
                Add Cutoff
              </Button>
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-5">College & Code</th>
                  <th className="py-3.5 px-4">Branch / Stream</th>
                  <th className="py-3.5 px-4">Exam & Year</th>
                  <th className="py-3.5 px-4">Rank Range</th>
                  <th className="py-3.5 px-4">Category Cutoffs</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCutoffs.map((cutoff) => {
                  const college = colleges.find((c) => c.id === cutoff.collegeId)
                  return (
                    <tr key={cutoff.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-100">
                            {college?.code || 'CLG'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{college?.name || 'Unknown College'}</p>
                            <p className="text-xs text-slate-400">{college?.location?.city}, {college?.location?.state}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-medium text-slate-800 text-sm">
                        {cutoff.branch}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <Chip size="sm" variant="flat" color="primary" className="text-xs w-fit">
                            {cutoff.examType}
                          </Chip>
                          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" /> Year {cutoff.year}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-xs">
                          <span className="text-slate-500">Opening:</span> <strong className="text-slate-800">#{cutoff.openingRank || 1}</strong>
                          <br />
                          <span className="text-slate-500">Closing:</span> <strong className="text-indigo-700">#{cutoff.closingRank}</strong>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs text-[11px]">
                          {cutoff.categoryCutoffs && Object.entries(cutoff.categoryCutoffs).map(([cat, val]) => (
                            <span key={cat} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                              {cat}: <strong>{val}</strong>
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(cutoff)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit Cutoff"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cutoff.id)}
                            className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Cutoff"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Cutoff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingCutoffId ? 'Edit Cutoff Record' : 'Add New Cutoff Entry'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select College *
                </label>
                <select
                  value={formData.collegeId}
                  onChange={(e) => {
                    const selCol = colleges.find(c => c.id === e.target.value)
                    setFormData({
                      ...formData,
                      collegeId: e.target.value,
                      branch: selCol?.programs?.[0] || formData.branch
                    })
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {colleges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code}) - {c.location?.city}
                    </option>
                  ))}
                </select>
                {formErrors.collegeId && <p className="text-red-500 text-xs mt-1">{formErrors.collegeId}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Branch / Engineering Stream *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science and Engineering"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {formErrors.branch && <p className="text-red-500 text-xs mt-1">{formErrors.branch}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Entrance Exam
                  </label>
                  <select
                    value={formData.examType}
                    onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {examsList.map((ex) => (
                      <option key={ex} value={ex}>{ex}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Admission Year
                  </label>
                  <input
                    type="number"
                    placeholder="2024"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formErrors.year && <p className="text-red-500 text-xs mt-1">{formErrors.year}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Opening Rank
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1"
                    value={formData.openingRank}
                    onChange={(e) => setFormData({ ...formData, openingRank: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Closing Rank *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 600"
                    value={formData.closingRank}
                    onChange={(e) => setFormData({ ...formData, closingRank: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formErrors.closingRank && <p className="text-red-500 text-xs mt-1">{formErrors.closingRank}</p>}
                </div>
              </div>

              {/* Category-wise Cutoffs */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">Category Cutoff Marks / Rank</p>
                <div className="grid grid-cols-3 gap-3">
                  {['General', 'OBC', 'SC', 'ST', 'EWS'].map((cat) => (
                    <div key={cat}>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">{cat}</label>
                      <input
                        type="number"
                        placeholder="Cutoff"
                        value={formData.categoryCutoffs[cat]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            categoryCutoffs: {
                              ...formData.categoryCutoffs,
                              [cat]: e.target.value
                            }
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="light"
                  className="text-slate-600"
                  onPress={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/20"
                >
                  {editingCutoffId ? 'Save Cutoff' : 'Add Cutoff'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}