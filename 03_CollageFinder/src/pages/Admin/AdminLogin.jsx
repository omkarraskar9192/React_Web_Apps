import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardContent,
  Button
} from '@heroui/react'
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  KeyRound,
  CheckCircle2
} from 'lucide-react'
import {
  loginAdmin,
  selectAuthLoading,
  selectAuthError,
  clearAuthError
} from '../../store/slices/authSlice'

export default function AdminLogin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const loading = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)

  const [email, setEmail] = useState('admin@collegefinder.com')
  const [password, setPassword] = useState('admin123')
  const [showPassword, setShowPassword] = useState(false)

  const from = location.state?.from?.pathname || '/admin'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return

    dispatch(clearAuthError())
    const res = await dispatch(loginAdmin({ email, password }))
    if (res.success) {
      navigate(from, { replace: true })
    }
  }

  const fillDemo = () => {
    setEmail('admin@collegefinder.com')
    setPassword('admin123')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to College Finder</span>
        </button>

        <Card className="bg-white border border-slate-200 shadow-xl rounded-3xl overflow-hidden">
          {/* Header Banner */}
          <CardHeader className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-8 text-white flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 mb-3 shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black tracking-tight">Admin Authentication</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xs">
              Restricted portal. Only authorized administrators can add or update college data & cutoffs.
            </p>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-5">
            {/* Error Message */}
            {authError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Admin Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="admin@collegefinder.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Security Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                color="primary"
                isLoading={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-indigo-600/30"
              >
                {loading ? 'Authenticating...' : 'Sign In as Administrator'}
              </Button>
            </form>

            {/* Quick Demo Credentials Card */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                  Default Admin Credentials
                </span>
                <button
                  type="button"
                  onClick={fillDemo}
                  className="text-[11px] font-bold text-indigo-600 hover:underline"
                >
                  Autofill
                </button>
              </div>
              <div className="text-[11px] text-slate-500 space-y-0.5">
                <p>Email: <strong className="text-slate-800">admin@collegefinder.com</strong></p>
                <p>Password: <strong className="text-slate-800">admin123</strong></p>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Protected by Redux Secure Session & Token
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
