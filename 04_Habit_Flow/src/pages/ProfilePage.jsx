import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Input, Button, Avatar } from '@heroui/react'
import {
  User,
  Flame,
  Award,
  CheckCircle2,
  Sparkles,
  Download,
  AlertCircle,
  Cloud,
  LogIn,
  LogOut,
  ShieldCheck,
  Lock,
  Unlock,
  BookOpen,
  Clock,
  ShieldAlert,
} from 'lucide-react'
import { updateProfile, logout } from '../store/userSlice'
import { setAuthModalOpen } from '../store/uiSlice'
import { resetHabitsOnLogout } from '../store/habitsSlice'
import { setAuthToken } from '../services/api'

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face',
]

const loadReflectionsList = () => {
  try {
    const list = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('habitflow-reflection-')) {
        const date = key.replace('habitflow-reflection-', '')
        const text = localStorage.getItem(key)
        if (text && text.trim()) {
          list.push({ date, text: text.trim() })
        }
      }
    }
    return list.sort((a, b) => b.date.localeCompare(a.date))
  } catch {
    return []
  }
}

export default function ProfilePage() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const habits = useSelector((state) => state.habits.habits)

  const [name, setName] = useState(user.name || '')
  const [title, setTitle] = useState(user.title || '')
  const [bio, setBio] = useState(user.bio || '')
  const [avatar, setAvatar] = useState(user.avatar || '')
  const [dailyGoal, setDailyGoal] = useState(user.dailyGoal || 4)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Security Lock for Display Name
  const [isNameLocked, setIsNameLocked] = useState(true)
  const [showUnlockNotice, setShowUnlockNotice] = useState(false)

  // Personal Reflections Diary
  const [reflections, setReflections] = useState(loadReflectionsList)

  // Live synchronization: Whenever the user logs in, registers, or updates Redux, sync local inputs immediately
  useEffect(() => {
    setName(user.name || '')
    setTitle(user.title || '')
    setBio(user.bio || '')
    setAvatar(user.avatar || '')
    setDailyGoal(user.dailyGoal || 4)
  }, [user.name, user.title, user.bio, user.avatar, user.dailyGoal])

  useEffect(() => {
    setReflections(loadReflectionsList())
  }, [])

  const handleLogout = () => {
    setAuthToken(null)
    dispatch(logout())
    dispatch(resetHabitsOnLogout())
  }

  const handleToggleNameLock = () => {
    if (isNameLocked) {
      setIsNameLocked(false)
      setShowUnlockNotice(true)
    } else {
      setIsNameLocked(true)
      setShowUnlockNotice(false)
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    dispatch(
      updateProfile({
        name: name.trim() || 'Guest User',
        title: title.trim() || 'Disciplined Achiever',
        bio: bio.trim(),
        avatar: avatar.trim(),
        dailyGoal: Number(dailyGoal) || 4,
      })
    )
    setIsNameLocked(true)
    setShowUnlockNotice(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const exportDataJSON = () => {
    const data = {
      user,
      habits,
      reflections,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `habitflow-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in">
      {/* Top Executive Header Card */}
      <Card className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-[#f4fafc] to-[#e8f6f9] dark:from-[#071924] dark:via-[#092230] dark:to-[#0b2b3d] border border-cyan-100 dark:border-cyan-900/40 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
          <div className="relative">
            <Avatar
              name={name}
              src={avatar}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-3 border-[#00e5ff] shadow-md shadow-[#00e5ff]/25"
            />
            <span
              className={`absolute -bottom-1 -right-1 p-1 rounded-xl text-white shadow-xs ${
                user.isAuthenticated ? 'bg-cyan-600' : 'bg-slate-500'
              }`}
              title={user.isAuthenticated ? 'Cloud Verified User' : 'Guest Mode'}
            >
              {user.isAuthenticated ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </span>
          </div>

          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white truncate">
                {name || 'Guest User'}
              </h1>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  user.isAuthenticated
                    ? 'bg-cyan-100 text-cyan-800 dark:bg-[#0c4a6e] dark:text-[#00e5ff]'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {user.isAuthenticated ? (
                  <>
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Account</span>
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3" />
                    <span>Guest Session</span>
                  </>
                )}
              </span>
            </div>

            <p className="text-sm font-semibold text-cyan-700 dark:text-[#38bdf8]">
              {title || 'Disciplined Achiever'}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
              {bio || 'Building relentless habits one day at a time.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {user.email && (
                <span className="px-2.5 py-1 rounded-xl bg-white/70 dark:bg-[#06141d]/70 border border-cyan-100 dark:border-cyan-900/40">
                  📧 {user.email}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-xl bg-white/70 dark:bg-[#06141d]/70 border border-cyan-100 dark:border-cyan-900/40">
                🗓️ Member since {user.joinedDate || 'Recently'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* User Stats Card */}
      <div className="grid gap-3.5 sm:grid-cols-3">
        <Card className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#071722] border border-[#cfe6ee] dark:border-[#0e2c3d] shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#e0f7fa] dark:bg-[#0b2d3c] flex items-center justify-center text-[#0284c7] dark:text-[#00e5ff]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#528499] dark:text-[#7eb6cc]">
                Daily Habit Goal
              </p>
              <p className="font-display text-2xl sm:text-3xl font-black text-[#082836] dark:text-[#f0f9ff]">
                {user.dailyGoal || 4} habits/day
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#071722] border border-[#cfe6ee] dark:border-[#0e2c3d] shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                user.streakCount === 0
                  ? 'bg-[#ffe4e6] dark:bg-[#2b1014] text-[#e11d48]'
                  : 'bg-[#e0f8fb] dark:bg-[#092938] text-[#00e5ff]'
              }`}
            >
              {user.streakCount === 0 ? (
                <AlertCircle className="w-6 h-6" />
              ) : (
                <Flame className="w-6 h-6 fill-[#00e5ff]" />
              )}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#528499] dark:text-[#7eb6cc]">
                Active Streak
              </p>
              <p className="font-display text-2xl sm:text-3xl font-black text-[#082836] dark:text-[#f0f9ff]">
                {user.streakCount || 0} days {user.streakCount === 0 && <span className="text-xs text-rose-500 font-bold">(Broken)</span>}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#071722] border border-[#cfe6ee] dark:border-[#0e2c3d] shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#ede9fe] dark:bg-[#201533] flex items-center justify-center text-[#8b5cf6]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#528499] dark:text-[#7eb6cc]">
                Tracked Habits
              </p>
              <p className="font-display text-2xl sm:text-3xl font-black text-[#082836] dark:text-[#f0f9ff]">
                {habits.length} habits
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Cloud Account & Offline Protection Card */}
      <Card className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#071722] border border-cyan-100 dark:border-cyan-900/40 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-cyan-100/80 dark:border-cyan-900/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-[#0b2d3c] flex items-center justify-center text-[#0284c7] dark:text-[#00e5ff] shadow-2xs">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-black text-[#082836] dark:text-[#f0f9ff]">
                Cloud Account & Backup
              </h3>
              <p className="text-xs text-[#528499] dark:text-[#8cbacc]">
                {user.isAuthenticated
                  ? `Logged in as ${user.email}. Habits automatically sync across devices.`
                  : 'Currently in Guest Mode. Connect an account to backup habits.'}
              </p>
            </div>
          </div>

          <div>
            {user.isAuthenticated ? (
              <Button
                onClick={handleLogout}
                variant="light"
                size="sm"
                className="rounded-2xl px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </Button>
            ) : (
              <Button
                onClick={() => dispatch(setAuthModalOpen(true))}
                variant="solid"
                size="sm"
                className="rounded-2xl px-5 py-2 text-xs font-black bg-gradient-to-r from-[#0284c7] via-[#06b6d4] to-[#00e5ff] text-slate-950 shadow-sm shadow-cyan-500/20 hover:opacity-95 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Create Account</span>
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 dark:bg-[#051119] p-3.5 border border-cyan-100/70 dark:border-cyan-900/40 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#00e5ff] shrink-0 mt-0.5" />
          <p className="text-slate-600 dark:text-slate-300">
            <strong>Offline-First Resilience:</strong> All habits are stored in your device storage first. If the internet goes offline, you can continue tracking and journaling without interruption.
          </p>
        </div>
      </Card>

      {/* Profile Form Card with Locked Name */}
      <Card className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#071722] border border-[#cfe6ee] dark:border-[#0e2c3d] shadow-sm">
        <form onSubmit={handleSave} className="space-y-5">
          {/* Header of settings */}
          <div className="flex items-center justify-between border-b border-[#e2f1f5] dark:border-[#0e2c3d] pb-4">
            <div>
              <h3 className="font-display text-lg font-black text-[#082836] dark:text-[#f0f9ff]">
                Account Settings & Preferences
              </h3>
              <p className="text-xs text-[#528499] dark:text-[#7eb6cc]">
                Configure your verified identity and daily consistency standards
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-700 dark:text-[#00e5ff] bg-[#e0f7fa] dark:bg-[#0a2c3d] px-3 py-1 rounded-full">
              <Lock className="w-3 h-3" />
              <span>Identity Guard</span>
            </span>
          </div>

          {/* Avatar live preview and presets */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-[#e2f1f5] dark:border-[#0e2c3d] pb-5">
            <Avatar
              name={name}
              src={avatar}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl border-2 border-[#bae6fd] dark:border-[#0f4e66] shadow-sm"
            />
            <div className="space-y-1.5 flex-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#528499] dark:text-[#7eb6cc]">
                Select Avatar Preset
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {AVATAR_PRESETS.map((pUrl, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setAvatar(pUrl)}
                    className={`w-9 h-9 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      avatar === pUrl
                        ? 'border-[#00e5ff] scale-110 shadow-xs shadow-[#00e5ff]/30'
                        : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img src={pUrl} alt="Avatar option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Fields: Display Name (Protected with Lock) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black uppercase tracking-wider text-[#528499] dark:text-[#7eb6cc] flex items-center gap-1.5">
                {isNameLocked ? <Lock className="w-3 h-3 text-cyan-600" /> : <Unlock className="w-3 h-3 text-amber-500" />}
                <span>Display Name (Identity Protected)</span>
              </label>

              <button
                type="button"
                onClick={handleToggleNameLock}
                className="flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-[#00e5ff] hover:underline cursor-pointer"
              >
                {isNameLocked ? (
                  <>
                    <Unlock className="w-3 h-3" />
                    <span>Unlock Name</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3" />
                    <span>Lock Name</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isNameLocked}
                placeholder="Your Name"
                className={`w-full rounded-2xl border px-3.5 py-2.5 text-sm font-semibold transition-all ${
                  isNameLocked
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-[#061219] text-slate-700 dark:text-slate-300 cursor-not-allowed select-none'
                    : 'border-cyan-300 dark:border-cyan-700 bg-white dark:bg-[#071924] text-[#082836] dark:text-[#f0f9ff] focus:border-[#00e5ff]'
                }`}
              />
              {isNameLocked && (
                <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Locked</span>
                </span>
              )}
            </div>

            {showUnlockNotice && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs font-medium text-amber-800 dark:text-amber-300 animate-fade-in">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  <strong>Security Note:</strong> Changing your official display name updates your identity across your cloud database and all linked devices.
                </span>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-[#528499] dark:text-[#7eb6cc]">
                Flow Motto / Standard
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Relentless Performer, Marathoner"
                className="w-full rounded-2xl border border-[#cfe6ee] dark:border-[#0e2c3d] bg-[#f7fcfe] dark:bg-[#050e14] px-3.5 py-2.5 text-sm font-semibold text-[#082836] dark:text-[#f0f9ff] placeholder-[#7ea6b7] focus:border-[#00e5ff] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-[#528499] dark:text-[#7eb6cc]">
                Daily Target Goal
              </label>
              <Input
                type="number"
                min={1}
                max={20}
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
                placeholder="4"
                className="w-full rounded-2xl border border-[#cfe6ee] dark:border-[#0e2c3d] bg-[#f7fcfe] dark:bg-[#050e14] px-3.5 py-2.5 text-sm font-semibold text-[#082836] dark:text-[#f0f9ff] placeholder-[#7ea6b7] focus:border-[#00e5ff] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-[#528499] dark:text-[#7eb6cc]">
              Personal Bio
            </label>
            <Input
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What fuels your daily execution?"
              className="w-full rounded-2xl border border-[#cfe6ee] dark:border-[#0e2c3d] bg-[#f7fcfe] dark:bg-[#050e14] px-3.5 py-2.5 text-sm font-semibold text-[#082836] dark:text-[#f0f9ff] placeholder-[#7ea6b7] focus:border-[#00e5ff] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-[#528499] dark:text-[#7eb6cc]">
              Custom Avatar Image URL
            </label>
            <Input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-2xl border border-[#cfe6ee] dark:border-[#0e2c3d] bg-[#f7fcfe] dark:bg-[#050e14] px-3.5 py-2.5 text-sm font-semibold text-[#082836] dark:text-[#f0f9ff] placeholder-[#7ea6b7] focus:border-[#00e5ff] focus:outline-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#e2f1f5] dark:border-[#0e2c3d]">
            <div className="flex items-center gap-3">
              {savedSuccess ? (
                <span className="text-xs font-black text-[#0284c7] dark:text-[#00e5ff] flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" /> Profile Updated & Locked! ⚡
                </span>
              ) : (
                <Button
                  type="button"
                  onClick={exportDataJSON}
                  variant="light"
                  size="sm"
                  className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-[#528499] hover:bg-[#e4f3f7] dark:text-[#7eb6cc] dark:hover:bg-[#0c2432] cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Backup JSON</span>
                </Button>
              )}
            </div>

            <Button
              type="submit"
              variant="solid"
              size="sm"
              className="flex items-center gap-1.5 rounded-2xl px-6 py-2.5 text-xs font-black bg-[#0c4a6e] text-white hover:bg-[#075985] dark:bg-[#00e5ff] dark:text-[#04141c] dark:hover:bg-[#38bdf8] shadow-sm transition-all hover:scale-102 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </Card>

      {/* Personal Diary & Reflections History Section */}
      <Card className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#071722] border border-[#cfe6ee] dark:border-[#0e2c3d] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#e2f1f5] dark:border-[#0e2c3d] pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-[#0b2d3c] flex items-center justify-center text-[#0284c7] dark:text-[#00e5ff]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-black text-[#082836] dark:text-[#f0f9ff]">
                Personal Diary & Reflections
              </h3>
              <p className="text-xs text-[#528499] dark:text-[#7eb6cc]">
                Your archived daily thoughts, wins, and journal entries
              </p>
            </div>
          </div>

          <span className="text-xs font-black px-3 py-1 rounded-full bg-[#e0f7fa] dark:bg-[#0b2938] text-[#0284c7] dark:text-[#00e5ff] border border-[#bae6fd] dark:border-[#0e485e]">
            {reflections.length} {reflections.length === 1 ? 'Entry' : 'Entries'}
          </span>
        </div>

        {reflections.length > 0 ? (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {reflections.map((item) => (
              <div
                key={item.date}
                className="p-4 rounded-2xl bg-[#f7fcfe] dark:bg-[#06141d] border border-[#d2e7ee] dark:border-[#0e2c3d] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-bold text-cyan-700 dark:text-[#00e5ff]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                    {item.text.split(/\s+/).length} words
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed font-serif italic">
                  "{item.text}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 rounded-2xl bg-[#f7fcfe] dark:bg-[#06141d] border border-dashed border-cyan-100 dark:border-cyan-900/40 space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-600" />
            <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
              No journal reflections recorded yet
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Complete your habits on the <strong>Today</strong> page and write your evening reflections in the Daily Reflection card to build your consistency diary.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
