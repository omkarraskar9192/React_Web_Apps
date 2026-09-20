import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Input, Button } from '@heroui/react'
import { X, CheckCircle2, AlertCircle, Cloud } from 'lucide-react'
import { loginAPI, registerAPI } from '../services/api'
import { loginSuccess } from '../store/userSlice'
import { setHabitsFromDB, setHistoryFromDB } from '../store/habitsSlice'
import { setDbStatus } from '../store/uiSlice'

export default function AuthModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const habits = useSelector((state) => state.habits.habits)

  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.')
      return
    }

    setLoading(true)

    try {
      if (mode === 'register') {
        const res = await registerAPI({
          email: email.trim(),
          password: password.trim(),
          name: name.trim() || 'Flow Disciplinarian',
          initialHabits: habits,
        })

        if (res.ok && res.token) {
          dispatch(loginSuccess({ user: res.user, token: res.token }))
          dispatch(setDbStatus('connected'))
          setSuccessMsg('Account created & habits backed up to cloud!')
          setTimeout(() => {
            onClose()
          }, 1500)
        } else {
          setError(res.error || 'Failed to create account. Please try again.')
        }
      } else {
        const res = await loginAPI({
          email: email.trim(),
          password: password.trim(),
        })

        if (res.ok && res.token) {
          dispatch(loginSuccess({ user: res.user, token: res.token }))
          dispatch(setDbStatus('connected'))

          // Restore habits and history from MongoDB
          if (res.habits && res.habits.length > 0) {
            dispatch(setHabitsFromDB(res.habits))
          }
          if (res.history) {
            dispatch(setHistoryFromDB(res.history))
          }

          setSuccessMsg('Logged in successfully! Your habits are restored.')
          setTimeout(() => {
            onClose()
          }, 1500)
        } else {
          setError(res.error || 'Invalid email or password.')
        }
      }
    } catch (err) {
      setError(err.message || 'Connection error. Check if backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <Card className="relative w-full max-w-md p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#071924] border border-cyan-100 dark:border-cyan-900/50 shadow-2xl space-y-5">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#0c2433] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 pt-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#0284c7] via-[#06b6d4] to-[#00e5ff] flex items-center justify-center text-slate-950 shadow-md shadow-[#00e5ff]/30">
            <Cloud className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h3 className="font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Cloud Account'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'login'
              ? 'Log in to sync your habits, streaks, and journals from MongoDB'
              : 'Never lose your progress. Access your habits across any device'}
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-[#092230] p-1 border border-slate-200 dark:border-cyan-950">
          <button
            type="button"
            onClick={() => {
              setMode('login')
              setError(null)
            }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-[#0c354a] text-slate-950 dark:text-[#00e5ff] shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register')
              setError(null)
            }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-[#0c354a] text-slate-950 dark:text-[#00e5ff] shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Register
          </button>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs font-semibold text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/60 text-xs font-bold text-cyan-800 dark:text-[#00e5ff]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Your Name
              </label>
              <div className="relative">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Hunter"
                  className="w-full rounded-2xl border border-cyan-100 dark:border-cyan-900/50 bg-slate-50 dark:bg-[#06141d] px-4 py-2.5 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              required
              className="w-full rounded-2xl border border-cyan-100 dark:border-cyan-900/50 bg-slate-50 dark:bg-[#06141d] px-4 py-2.5 text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              className="w-full rounded-2xl border border-cyan-100 dark:border-cyan-900/50 bg-slate-50 dark:bg-[#06141d] px-4 py-2.5 text-sm text-slate-900 dark:text-white"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-2xl text-xs sm:text-sm font-black bg-gradient-to-r from-[#0284c7] via-[#06b6d4] to-[#00e5ff] text-slate-950 shadow-md shadow-cyan-500/20 hover:opacity-95 transition-all"
          >
            {loading ? (
              <span>Connecting to Cloud...</span>
            ) : mode === 'login' ? (
              <span>Sign In & Restore Habits</span>
            ) : (
              <span>Create Account & Backup Data</span>
            )}
          </Button>
        </form>

        <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
          💡 <strong>Offline Friendly:</strong> All your habits are always preserved on your device memory even with zero internet connection.
        </p>
      </Card>
    </div>
  )
}

