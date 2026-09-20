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
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  MapPin,
  Award,
  Globe,
  X,
  Check,
  Filter
} from 'lucide-react'
import {
  addCollege,
  updateCollege,
  deleteCollege,
  selectAllColleges
} from '../../store/slices/collegesSlice'

export default function CollegesManagement() {
  const dispatch = useDispatch()
  const colleges = useSelector(selectAllColleges)

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('rank')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCollegeId, setEditingCollegeId] = useState(null)
  const [newProgramInput, setNewProgramInput] = useState('')

  // Form State
  const initialFormState = {
    name: '',
    code: '',
    type: 'Government',
    establishedYear: 1960,
    nirfRank: '',
    naacRating: 'A++',
    website: '',
    logoUrl: '',
    location: {
      city: '',
      state: '',
      pincode: ''
    },
    programs: ['Computer Science and Engineering', 'Mechanical Engineering', 'Electronics and Communication'],
    facilities: ['Hostel', 'Library', 'Sports Complex', 'High-Speed Wi-Fi', 'Research Labs']
  }

  const [formData, setFormData] = useState(initialFormState)
  const [formErrors, setFormErrors] = useState({})
  const [actionSuccessMessage, setActionSuccessMessage] = useState('')

  // Filtered and Sorted Colleges
  const filteredColleges = useMemo(() => {
    return colleges
      .filter((college) => {
        const matchesSearch =
          college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          college.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          college.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          college.location?.state?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesType =
          filterType === 'all' || college.type.toLowerCase() === filterType.toLowerCase()

        return matchesSearch && matchesType
      })
      .sort((a, b) => {
        if (sortBy === 'rank') {
          return (Number(a.nirfRank) || 9999) - (Number(b.nirfRank) || 9999)
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name)
        }
        if (sortBy === 'year') {
          return (b.establishedYear || 0) - (a.establishedYear || 0)
        }
        return 0
      })
  }, [colleges, searchTerm, filterType, sortBy])

  const openAddModal = () => {
    setEditingCollegeId(null)
    setFormData(initialFormState)
    setFormErrors({})
    setIsModalOpen(true)
  }

  const openEditModal = (college) => {
    setEditingCollegeId(college.id)
    setFormData({
      name: college.name || '',
      code: college.code || '',
      type: college.type || 'Government',
      establishedYear: college.establishedYear || '',
      nirfRank: college.nirfRank || '',
      naacRating: college.naacRating || 'A++',
      website: college.website || '',
      logoUrl: college.logoUrl || '',
      location: {
        city: college.location?.city || '',
        state: college.location?.state || '',
        pincode: college.location?.pincode || ''
      },
      programs: college.programs || [],
      facilities: college.facilities || []
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const handleAddProgram = () => {
    if (newProgramInput.trim() && !formData.programs.includes(newProgramInput.trim())) {
      setFormData({
        ...formData,
        programs: [...formData.programs, newProgramInput.trim()]
      })
      setNewProgramInput('')
    }
  }

  const handleRemoveProgram = (prog) => {
    setFormData({
      ...formData,
      programs: formData.programs.filter((p) => p !== prog)
    })
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'College name is required'
    if (!formData.code.trim()) errors.code = 'College code is required'
    if (!formData.location.city.trim()) errors.city = 'City is required'
    if (!formData.location.state.trim()) errors.state = 'State is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    if (editingCollegeId) {
      dispatch(
        updateCollege({
          id: editingCollegeId,
          updates: {
            ...formData,
            nirfRank: formData.nirfRank ? Number(formData.nirfRank) : null,
            establishedYear: Number(formData.establishedYear) || null
          }
        })
      )
      setActionSuccessMessage('College updated successfully!')
    } else {
      dispatch(
        addCollege({
          ...formData,
          nirfRank: formData.nirfRank ? Number(formData.nirfRank) : null,
          establishedYear: Number(formData.establishedYear) || null
        })
      )
      setActionSuccessMessage('College added successfully!')
    }

    setTimeout(() => setActionSuccessMessage(''), 4000)
    setIsModalOpen(false)
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      dispatch(deleteCollege(id))
      setActionSuccessMessage(`${name} deleted from database.`)
      setTimeout(() => setActionSuccessMessage(''), 4000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Alert message */}
      {actionSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between text-sm shadow-sm">
          <span className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            {actionSuccessMessage}
          </span>
          <button onClick={() => setActionSuccessMessage('')} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Action and Filter Bar */}
      <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search college name, code (e.g. IITB, COEP), city, or state..."
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
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All College Types</option>
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                  <option value="Deemed">Deemed University</option>
                  <option value="Autonomous">Autonomous</option>
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="rank">Sort by NIRF Rank (Top First)</option>
                <option value="name">Sort by Name (A-Z)</option>
                <option value="year">Sort by Established Year</option>
              </select>

              <Button
                color="primary"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-md shadow-indigo-600/20"
                startContent={<Plus className="w-4 h-4" />}
                onPress={openAddModal}
              >
                Add College
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Colleges Table */}
      <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="font-semibold text-slate-900 text-base">Registered Colleges Directory</h2>
            <p className="text-xs text-slate-500">Showing {filteredColleges.length} of {colleges.length} colleges</p>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {filteredColleges.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-700 font-semibold text-base">No colleges found</p>
              <p className="text-slate-400 text-xs mt-1">Try refining your search terms or add a new college.</p>
              <Button
                color="primary"
                size="sm"
                className="mt-4 bg-indigo-600 text-white text-xs"
                onPress={openAddModal}
              >
                Add New College
              </Button>
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-5">College & Code</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">NIRF Rank</th>
                  <th className="py-3.5 px-4">Branches</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredColleges.map((college) => (
                  <tr key={college.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {college.code || 'CLG'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{college.name}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                            <span>Code: <strong>{college.code}</strong></span>
                            {college.establishedYear && <span>&bull; Est. {college.establishedYear}</span>}
                            {college.website && (
                              <a
                                href={college.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 hover:underline flex items-center gap-0.5"
                              >
                                <Globe className="w-3 h-3" /> site
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
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
                        className="text-xs font-medium"
                      >
                        {college.type}
                      </Chip>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{college.location?.city}, {college.location?.state}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {college.nirfRank ? (
                        <span className="inline-flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg text-xs border border-indigo-100">
                          <Award className="w-3 h-3 text-indigo-600" />
                          #{college.nirfRank}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Unranked</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {college.programs?.slice(0, 2).map((prog, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px]">
                            {prog}
                          </span>
                        ))}
                        {(college.programs?.length || 0) > 2 && (
                          <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[11px]">
                            +{college.programs.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(college)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit College"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(college.id, college.name)}
                          className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete College"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit College Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingCollegeId ? 'Edit College Details' : 'Add New College'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    College Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Indian Institute of Technology Bombay"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl border ${
                      formErrors.name ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                    } text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    College Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IITB, COEP, BITS"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className={`w-full px-3.5 py-2 rounded-xl border ${
                      formErrors.code ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                    } text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {formErrors.code && <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    College Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="Deemed">Deemed University</option>
                    <option value="Autonomous">Autonomous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    NIRF Rank
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 3"
                    value={formData.nirfRank}
                    onChange={(e) => setFormData({ ...formData, nirfRank: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    NAAC Rating
                  </label>
                  <select
                    value={formData.naacRating}
                    onChange={(e) => setFormData({ ...formData, naacRating: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="A++">A++</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B++">B++</option>
                    <option value="B">B</option>
                  </select>
                </div>
              </div>

              {/* Location Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={formData.location.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, city: e.target.value }
                      })
                    }
                    className={`w-full px-3.5 py-2 rounded-xl border ${
                      formErrors.city ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                    } text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maharashtra"
                    value={formData.location.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, state: e.target.value }
                      })
                    }
                    className={`w-full px-3.5 py-2 rounded-xl border ${
                      formErrors.state ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                    } text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Established Year
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1958"
                    value={formData.establishedYear}
                    onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Official Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://www.college.ac.in"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Programs / Branches */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Engineering Branches / Programs
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add branch (e.g. Artificial Intelligence & Data Science)"
                    value={newProgramInput}
                    onChange={(e) => setNewProgramInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddProgram()
                      }
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="bg-indigo-600 text-white rounded-xl"
                    onPress={handleAddProgram}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-100">
                  {formData.programs.map((prog, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs text-slate-700"
                    >
                      {prog}
                      <button
                        type="button"
                        onClick={() => handleRemoveProgram(prog)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Footer Actions */}
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
                  {editingCollegeId ? 'Save Changes' : 'Add College'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}