import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Button
} from '@heroui/react'
import {
  Sparkles,
  Search,
  User,
  ShieldCheck
} from 'lucide-react'
import {
  fetchColleges,
  selectAllColleges
} from '../store/slices/collegesSlice'
import {
  fetchCutoffs,
  selectAllCutoffs
} from '../store/slices/cutoffsSlice'

export default function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const colleges = useSelector(selectAllColleges)
  const cutoffs = useSelector(selectAllCutoffs)

  useEffect(() => {
    dispatch(fetchColleges())
    dispatch(fetchCutoffs())
  }, [dispatch])

  const totalColleges = colleges.length
  const govtColleges = colleges.filter((c) => c.type === 'Government').length
  const totalCutoffs = cutoffs.length

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI-Powered Entrance Counseling & Predictor</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Find Your Dream College With Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-300 to-cyan-400">
              Exam Scores
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Predict branch admissions for JEE Advanced, JEE Main, MHT-CET, BITSAT, and NEET. Filter by your preferred city, region, and branch — categorized into Safe, Target, and Dream choices sorted by college prestige.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              color="primary"
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-8 py-3 rounded-2xl shadow-xl shadow-indigo-600/30"
              startContent={<Sparkles className="w-5 h-5 text-amber-300" />}
              onPress={() => navigate('/recommend')}
            >
              Predict My College Now
            </Button>

            <Button
              variant="bordered"
              size="lg"
              className="border-slate-700 text-slate-200 hover:bg-white/10 font-semibold text-sm px-7 py-3 rounded-2xl"
              startContent={<Search className="w-4 h-4" />}
              onPress={() => navigate('/search')}
            >
              Explore College Database
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="max-w-4xl mx-auto mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
            <span className="text-2xl sm:text-3xl font-black text-white">{totalColleges}+</span>
            <p className="text-xs text-slate-400 mt-1">Verified Colleges</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
            <span className="text-2xl sm:text-3xl font-black text-indigo-400">{govtColleges}</span>
            <p className="text-xs text-slate-400 mt-1">Govt. Institutes</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
            <span className="text-2xl sm:text-3xl font-black text-cyan-400">{totalCutoffs}+</span>
            <p className="text-xs text-slate-400 mt-1">Branch Cutoffs</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">100%</span>
            <p className="text-xs text-slate-400 mt-1">Free Counselor</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Simple Process</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">How College Predictor Works</h2>
          <p className="text-xs sm:text-sm text-slate-500">From exam marks to final counseling choice filling in 3 easy steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 hover:border-indigo-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">Enter Your Exam Marks or AIR</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Input your entrance score (JEE Advanced, JEE Main, MHT-CET, BITSAT) along with your admission category (General, OBC, SC, ST, EWS).
            </p>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 hover:border-indigo-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">Set City, Region & Branch Filters</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Filter by specific cities or home states and choose target branches such as Computer Science, AI, Electronics, or Mechanical.
            </p>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 hover:border-indigo-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">View Ranked Matches & Shortlist</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Get an instant categorized list of Safe, Target, and Dream colleges sorted by NIRF rank and build your counseling choice list.
            </p>
          </Card>
        </div>
      </section>

      {/* Featured Portals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Explore App Features</h2>
            <p className="text-xs text-slate-500">Quickly jump into any section</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            onClick={() => navigate('/search')}
            className="group cursor-pointer p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">College & Cutoff Explorer</h3>
            <p className="text-xs text-slate-500">
              Browse top institutions, check cutoffs across past years, and filter by NIRF ranking.
            </p>
            <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Open Search &rarr;
            </span>
          </div>

          <div
            onClick={() => navigate('/recommend')}
            className="group cursor-pointer p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Find College Predictor</h3>
            <p className="text-xs text-slate-500">
              Smart predictor analyzing your rank, category, and preferred branches in descending NIRF order.
            </p>
            <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Start Predictor &rarr;
            </span>
          </div>

          <div
            onClick={() => navigate('/profile')}
            className="group cursor-pointer p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Student Counseling Hub</h3>
            <p className="text-xs text-slate-500">
              Save your scores, prioritize choice-filling order, and track shortlisted colleges.
            </p>
            <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              View Profile &rarr;
            </span>
          </div>

          <div
            onClick={() => navigate('/admin')}
            className="group cursor-pointer p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Admin Management</h3>
            <p className="text-xs text-slate-500">
              Add new colleges, configure cutoff records per year, and manage institution data.
            </p>
            <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Admin Portal &rarr;
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}