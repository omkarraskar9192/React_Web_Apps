import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Chip,
  Spinner
} from '@heroui/react'
import {
  Building2,
  GraduationCap,
  TrendingUp,
  Award,
  Plus,
  ShieldCheck,
  LayoutDashboard,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  Database,
  LogOut,
  Upload,
  Download,
  FileCode,
  Check,
  AlertTriangle,
  FileUp,
  Sparkles,
  RefreshCw
} from 'lucide-react'
import {
  fetchColleges,
  selectAllColleges,
  selectCollegesLoading,
  selectCollegesError
} from '../../store/slices/collegesSlice'
import {
  fetchCutoffs,
  selectAllCutoffs
} from '../../store/slices/cutoffsSlice'
import { selectAdminUser, logout } from '../../store/slices/authSlice'
import CollegesManagement from './Colleges'
import CutoffsManagement from './Cutoffs'

export default function Admin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')

  const adminUser = useSelector(selectAdminUser)
  const colleges = useSelector(selectAllColleges)
  const cutoffs = useSelector(selectAllCutoffs)
  const loading = useSelector(selectCollegesLoading)
  const error = useSelector(selectCollegesError)

  // Direct Data JSON / CSV Import state
  const [directJsonInput, setDirectJsonInput] = useState('')
  const [importTarget, setImportTarget] = useState('colleges') // 'colleges' or 'cutoffs'
  const [importFormat, setImportFormat] = useState('csv') // 'csv' or 'json'
  const [importStatus, setImportStatus] = useState(null)

  useEffect(() => {
    dispatch(fetchColleges())
    dispatch(fetchCutoffs())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/admin/login')
  }

  // Statistics
  const totalColleges = colleges.length
  const govtColleges = colleges.filter((c) => c.type === 'Government').length
  const rankedColleges = colleges.filter((c) => c.nirfRank)
  const avgNirfRank = rankedColleges.length
    ? (rankedColleges.reduce((acc, c) => acc + Number(c.nirfRank), 0) / rankedColleges.length).toFixed(1)
    : 'N/A'

  const totalCutoffs = cutoffs.length
  const uniqueExams = [...new Set(cutoffs.map((c) => c.examType))].length
  const uniqueYears = [...new Set(cutoffs.map((c) => c.year))].sort().reverse()

  // CSV Parsing Helper Function
  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length < 2) throw new Error('CSV must contain a header row and at least one data row')

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''))
    const records = []

    for (let i = 1; i < lines.length; i++) {
      const currentline = lines[i].split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''))
      const obj = {}
      headers.forEach((header, index) => {
        obj[header] = currentline[index] || ''
      })
      records.push(obj)
    }
    return records
  }

  // Handle CSV File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result
      if (typeof content !== 'string') return

      try {
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content)
          processImportData(parsed)
        } else {
          const parsed = parseCSV(content)
          processImportData(parsed)
        }
      } catch (err) {
        setImportStatus({
          type: 'error',
          msg: `Failed to read file ${file.name}: ${err.message}`
        })
      }
    }
    reader.readAsText(file)
  }

  // Process and ingest records into storage
  const processImportData = (records) => {
    if (!Array.isArray(records) || records.length === 0) {
      throw new Error('No valid records found in data')
    }

    if (importTarget === 'colleges') {
      const formattedColleges = records.map((r, idx) => ({
        id: r.id || String(Date.now() + idx),
        name: r.name || 'Unnamed College',
        code: r.code || r.name?.slice(0, 4).toUpperCase() || 'CLG',
        type: r.type || 'Government',
        location: {
          city: r.city || r.location?.city || 'City',
          state: r.state || r.location?.state || 'State',
          pincode: r.pincode || r.location?.pincode || ''
        },
        nirfRank: r.nirfRank ? Number(r.nirfRank) : null,
        establishedYear: r.establishedYear ? Number(r.establishedYear) : null,
        website: r.website || '',
        naacRating: r.naacRating || 'A+',
        programs: Array.isArray(r.programs)
          ? r.programs
          : (r.programs || 'Computer Science and Engineering;Mechanical Engineering')
              .split(';')
              .map((p) => p.trim())
              .filter(Boolean),
        facilities: ['Hostel', 'Central Library', 'Wi-Fi Campus'],
        createdAt: new Date().toISOString()
      }))

      const current = JSON.parse(localStorage.getItem('collegeFinder_colleges') || '[]')
      const merged = [...formattedColleges, ...current]
      localStorage.setItem('collegeFinder_colleges', JSON.stringify(merged))
      dispatch(fetchColleges())

      setImportStatus({
        type: 'success',
        msg: `Successfully imported ${formattedColleges.length} colleges directly into database!`
      })
    } else {
      const formattedCutoffs = records.map((r, idx) => ({
        id: r.id || String(Date.now() + idx),
        collegeId: r.collegeId || '1',
        branch: r.branch || 'Computer Science and Engineering',
        examType: r.examType || 'JEE Advanced',
        year: Number(r.year) || 2024,
        openingRank: Number(r.openingRank) || 1,
        closingRank: Number(r.closingRank) || 500,
        categoryCutoffs: {
          General: Number(r.generalCutoff) || Number(r.closingRank) || 500,
          OBC: Number(r.obcCutoff) || Number(r.closingRank) || 500,
          SC: Number(r.scCutoff) || Number(r.closingRank) || 500,
          ST: Number(r.stCutoff) || Number(r.closingRank) || 500,
          EWS: Number(r.ewsCutoff) || Number(r.closingRank) || 500
        },
        createdAt: new Date().toISOString()
      }))

      const current = JSON.parse(localStorage.getItem('collegeFinder_cutoffs') || '[]')
      const merged = [...formattedCutoffs, ...current]
      localStorage.setItem('collegeFinder_cutoffs', JSON.stringify(merged))
      dispatch(fetchCutoffs())

      setImportStatus({
        type: 'success',
        msg: `Successfully imported ${formattedCutoffs.length} cutoff rows directly into database!`
      })
    }
  }

  // Handle Text/JSON submission
  const handleDirectImport = (e) => {
    e.preventDefault()
    setImportStatus(null)

    try {
      if (importFormat === 'csv') {
        const parsed = parseCSV(directJsonInput)
        processImportData(parsed)
      } else {
        const parsed = JSON.parse(directJsonInput)
        processImportData(parsed)
      }
      setDirectJsonInput('')
    } catch (err) {
      setImportStatus({
        type: 'error',
        msg: `Failed to parse data: ${err.message}`
      })
    }
  }

  // Download Sample CSV Template
  const downloadSampleTemplate = (type) => {
    let csvContent
    let filename

    if (type === 'colleges') {
      filename = 'sample_colleges_template.csv'
      csvContent =
        'name,code,type,city,state,nirfRank,establishedYear,website,programs\n' +
        'IIT Roorkee,IITR,Government,Roorkee,Uttarakhand,5,1847,https://www.iitr.ac.in,Computer Science and Engineering;Civil Engineering;Electrical Engineering\n' +
        'NIT Surathkal,NITK,Government,Surathkal,Karnataka,12,1960,https://www.nitk.ac.in,Computer Science and Engineering;Information Technology;Mechanical Engineering\n' +
        'IIIT Hyderabad,IIITH,Autonomous,Hyderabad,Telangana,55,1998,https://www.iiit.ac.in,Computer Science and Engineering;Electronics and Communication\n'
    } else {
      filename = 'sample_cutoffs_template.csv'
      csvContent =
        'collegeId,branch,examType,year,openingRank,closingRank,generalCutoff,obcCutoff,scCutoff,stCutoff,ewsCutoff\n' +
        '1,Computer Science and Engineering,JEE Advanced,2024,1,115,115,65,32,18,98\n' +
        '2,Computer Science and Engineering,JEE Advanced,2024,1,68,68,35,20,12,55\n' +
        '5,Computer Science and Engineering,JEE Main,2024,250,1500,1500,650,340,180,1200\n' +
        '6,Computer Engineering,MHT-CET,2024,1,120,120,280,550,980,160\n'
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // Export current database to JSON file
  const handleExportDatabase = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      exportedBy: adminUser?.email || 'admin',
      colleges,
      cutoffs
    }
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `college_finder_backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 1-Click Load Master Dataset
  const handleResetToMasterData = () => {
    if (
      window.confirm(
        'Reset local data and load the official master engineering dataset (IITs, NITs, BITS, Top State Institutes)?'
      )
    ) {
      localStorage.removeItem('collegeFinder_colleges')
      localStorage.removeItem('collegeFinder_cutoffs')
      dispatch(fetchColleges())
      dispatch(fetchCutoffs())
      setImportStatus({
        type: 'success',
        msg: 'Successfully loaded official Master Engineering dataset!'
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="p-2 bg-indigo-500/20 border border-indigo-400/30 rounded-lg text-indigo-300">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Management Portal</h1>
              <Chip color="success" variant="flat" size="sm" className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Authorized Admin
              </Chip>
            </div>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl">
              Logged in as <strong className="text-indigo-300 font-semibold">{adminUser?.email || 'admin@collegefinder.com'}</strong> &bull; Only authorized staff can add or modify institution datasets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <Button
              color="primary"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/30 text-xs"
              startContent={<Plus className="w-4 h-4" />}
              onPress={() => setActiveTab('colleges')}
            >
              Add College
            </Button>
            <Button
              variant="bordered"
              className="border-slate-600 text-slate-200 hover:bg-slate-800 text-xs"
              startContent={<FileSpreadsheet className="w-4 h-4" />}
              onPress={() => setActiveTab('cutoffs')}
            >
              Add Cutoff
            </Button>
            <Button
              color="danger"
              variant="flat"
              className="bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs"
              startContent={<LogOut className="w-4 h-4" />}
              onPress={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800/80 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-white text-slate-900 shadow-md font-semibold'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('colleges')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'colleges'
                ? 'bg-white text-slate-900 shadow-md font-semibold'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Colleges Directory ({totalColleges})
          </button>
          <button
            onClick={() => setActiveTab('cutoffs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'cutoffs'
                ? 'bg-white text-slate-900 shadow-md font-semibold'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Cutoffs & Ranks Database ({totalCutoffs})
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'data'
                ? 'bg-white text-slate-900 shadow-md font-semibold'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            Bulk CSV / Data Ingestion
          </button>
        </div>
      </div>

      {/* Loading & Error State */}
      {loading === 'pending' && (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Spinner size="lg" color="primary" />
          <p className="mt-3 text-slate-600 font-medium">Loading database records...</p>
        </div>
      )}

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between">
          <span>Failed to load admin data: {error}</span>
          <Button size="sm" color="danger" variant="flat" onPress={() => dispatch(fetchColleges())}>
            Retry
          </Button>
        </div>
      )}

      {/* Tab 1: Dashboard Overview */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="bg-white border border-slate-200 shadow-sm rounded-xl hover:border-indigo-300 transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Total Colleges</span>
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-slate-900">{totalColleges}</span>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Active in database
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm rounded-xl hover:border-emerald-300 transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Govt. Institutions</span>
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-slate-900">{govtColleges}</span>
                  <p className="text-xs text-slate-500 mt-1">
                    {totalColleges > 0 ? ((govtColleges / totalColleges) * 100).toFixed(0) : 0}% of total institutions
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm rounded-xl hover:border-purple-300 transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Cutoff Entries</span>
                  <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-slate-900">{totalCutoffs}</span>
                  <p className="text-xs text-slate-500 mt-1">
                    Across {uniqueExams} entrance exams
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm rounded-xl hover:border-amber-300 transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Average NIRF Rank</span>
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-slate-900">{avgNirfRank}</span>
                  <p className="text-xs text-slate-500 mt-1">
                    Among {rankedColleges.length} ranked colleges
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Management Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Colleges Panel */}
            <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
              <CardHeader className="flex justify-between items-center p-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <h2 className="font-semibold text-slate-900 text-lg">Recently Added Colleges</h2>
                </div>
                <Button
                  size="sm"
                  variant="light"
                  color="primary"
                  className="text-xs font-semibold"
                  onPress={() => setActiveTab('colleges')}
                >
                  Manage All &rarr;
                </Button>
              </CardHeader>
              <CardContent className="p-5">
                <div className="divide-y divide-slate-100">
                  {colleges.slice(0, 4).map((college) => (
                    <div key={college.id} className="py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                          {college.code || college.name.slice(0, 3).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{college.name}</p>
                          <p className="text-xs text-slate-500">{college.location?.city}, {college.location?.state} &bull; {college.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                          NIRF #{college.nirfRank || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cutoff Coverage by Exam */}
            <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
              <CardHeader className="flex justify-between items-center p-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-600" />
                  <h2 className="font-semibold text-slate-900 text-lg">Exam Cutoff Distribution</h2>
                </div>
                <Button
                  size="sm"
                  variant="light"
                  color="primary"
                  className="text-xs font-semibold"
                  onPress={() => setActiveTab('cutoffs')}
                >
                  View Cutoffs &rarr;
                </Button>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-4">
                  {['JEE Advanced', 'JEE Main', 'MHT-CET', 'BITSAT', 'NEET'].map((exam) => {
                    const count = cutoffs.filter((c) => c.examType === exam).length
                    const percentage = totalCutoffs > 0 ? (count / totalCutoffs) * 100 : 0
                    return (
                      <div key={exam} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-700">{exam}</span>
                          <span className="text-slate-500">{count} records ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(percentage, 4)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-between">
                  <span>Available dataset years: <strong>{uniqueYears.join(', ') || '2024, 2023'}</strong></span>
                  <Chip size="sm" variant="flat" color="primary">Verified</Chip>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Colleges Management */}
      {activeTab === 'colleges' && (
        <CollegesManagement />
      )}

      {/* Tab 3: Cutoffs Management */}
      {activeTab === 'cutoffs' && (
        <CutoffsManagement />
      )}

      {/* Tab 4: Bulk CSV / Data Ingestion */}
      {activeTab === 'data' && (
        <div className="space-y-8">
          {importStatus && (
            <div
              className={`p-4 rounded-xl text-sm flex items-center gap-2.5 ${
                importStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {importStatus.type === 'success' ? (
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <span>{importStatus.msg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Direct File & Text Import */}
            <div className="lg:col-span-2 space-y-6">
              {/* File Upload Box (Drag & Drop CSV / JSON) */}
              <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
                <CardHeader className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                      <FileUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Bulk File Upload (.CSV or .JSON)</h3>
                      <p className="text-xs text-slate-500">Upload entire JoSAA or State CET sheets without adding rows manually</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-700">Target:</span>
                      <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setImportTarget('colleges')}
                          className={`px-3 py-1.5 rounded-md transition-all ${
                            importTarget === 'colleges' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                          }`}
                        >
                          Colleges Sheet
                        </button>
                        <button
                          type="button"
                          onClick={() => setImportTarget('cutoffs')}
                          className={`px-3 py-1.5 rounded-md transition-all ${
                            importTarget === 'cutoffs' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                          }`}
                        >
                          Cutoffs Sheet
                        </button>
                      </div>
                    </div>

                    {/* Download Sample CSV */}
                    <button
                      type="button"
                      onClick={() => downloadSampleTemplate(importTarget)}
                      className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download {importTarget} Sample CSV Template
                    </button>
                  </div>

                  {/* Dropzone */}
                  <label className="border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group">
                    <FileSpreadsheet className="w-10 h-10 text-slate-400 group-hover:text-indigo-600 transition-colors mb-2" />
                    <span className="text-sm font-bold text-slate-800">
                      Click to choose CSV or JSON file
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      Supports comma-separated .csv sheets or .json arrays
                    </span>
                    <input
                      type="file"
                      accept=".csv, application/json, text/csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </CardContent>
              </Card>

              {/* Paste Text / Code Ingestion */}
              <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
                <CardHeader className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Paste Raw Data (CSV or JSON)</h3>
                      <p className="text-xs text-slate-500">Paste directly from Excel or API responses</p>
                    </div>
                  </div>

                  <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setImportFormat('csv')}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        importFormat === 'csv' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      CSV Text
                    </button>
                    <button
                      type="button"
                      onClick={() => setImportFormat('json')}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        importFormat === 'json' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      JSON Array
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <form onSubmit={handleDirectImport} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {importFormat === 'csv'
                          ? 'Paste CSV rows (Header row required on line 1)'
                          : 'Paste JSON Array [{ ... }, { ... }]'}
                      </label>
                      <textarea
                        rows={8}
                        required
                        placeholder={
                          importFormat === 'csv'
                            ? importTarget === 'colleges'
                              ? 'name,code,type,city,state,nirfRank,establishedYear\nIIT Roorkee,IITR,Government,Roorkee,Uttarakhand,5,1847\nNIT Surathkal,NITK,Government,Surathkal,Karnataka,12,1960'
                              : 'collegeId,branch,examType,year,openingRank,closingRank,generalCutoff,obcCutoff\n1,Computer Science and Engineering,JEE Advanced,2024,1,115,115,65\n2,Electrical Engineering,JEE Advanced,2024,80,450,450,230'
                            : '[\n  {\n    "name": "IIT Roorkee",\n    "code": "IITR",\n    "type": "Government",\n    "location": { "city": "Roorkee", "state": "Uttarakhand" },\n    "nirfRank": 5\n  }\n]'
                        }
                        value={directJsonInput}
                        onChange={(e) => setDirectJsonInput(e.target.value)}
                        className="w-full p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-800"
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        type="submit"
                        color="primary"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                        startContent={<Upload className="w-4 h-4" />}
                      >
                        Ingest & Save {importTarget}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar: Export, Reset, and Cloud Guide */}
            <div className="space-y-6">
              {/* 1-Click Master Dataset Loader */}
              <Card className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Instant Pre-loaded Database</span>
                </div>
                <h4 className="font-bold text-white text-sm">Official Master Dataset (1-Click)</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Instantly reload full verified records for all top IITs, NITs, BITS, and State CET institutes with 2024 cutoffs without entering any data.
                </p>
                <Button
                  color="primary"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                  startContent={<RefreshCw className="w-4 h-4" />}
                  onPress={handleResetToMasterData}
                >
                  Reload Master Dataset
                </Button>
              </Card>

              {/* Export Card */}
              <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Database Export & Backup</h4>
                    <p className="text-xs text-slate-500">Download active dataset as JSON file</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Export all currently saved colleges ({totalColleges}) and cutoffs ({totalCutoffs}) into a standard JSON snapshot for backup or server seeding.
                </p>

                <Button
                  color="success"
                  variant="flat"
                  className="w-full text-xs font-semibold"
                  startContent={<Download className="w-4 h-4" />}
                  onPress={handleExportDatabase}
                >
                  Download Complete Database JSON
                </Button>
              </Card>

              {/* Real-World Cloud Database Comparison */}
              <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                  <FileCode className="w-4 h-4" />
                  <span>Top Cloud Database Solutions</span>
                </div>
                <div className="text-xs text-slate-600 space-y-2">
                  <p>
                    <strong>1. Supabase (Postgres):</strong> Upload official JoSAA CSV files directly in Supabase table GUI. Public reads, admin-only writes via Row-Level Security.
                  </p>
                  <p>
                    <strong>2. Firebase Firestore:</strong> Use a simple 20-line Node.js script to read Excel sheets and batch-write 5,000 cutoffs at once.
                  </p>
                  <p>
                    <strong>3. MongoDB Atlas:</strong> Use <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">mongoimport --file josaa.csv</code> to seed database in 5 seconds.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}