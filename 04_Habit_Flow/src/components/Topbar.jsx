import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Dropdown, Avatar } from '@heroui/react'
import {
  Sun,
  Moon,
  Menu as MenuIcon,
  Flame,
  Mic,
  AlertTriangle,
  Cloud,
  CloudOff,
  LogIn,
  LogOut,
  Database,
} from 'lucide-react'
import { toggleTheme, setMobileNavOpen, setAuthModalOpen } from '../store/uiSlice'
import { logout } from '../store/userSlice'
import { resetHabitsOnLogout } from '../store/habitsSlice'
import { setAuthToken } from '../services/api'
import { subscribeSyncStatus } from '../services/syncEngine'
import BrandLogo from './BrandLogo'



export default function Topbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isDark = useSelector((state) => state.ui.isDark)
  const isListening = useSelector((state) => state.ui.isListening)
  const dbStatus = useSelector((state) => state.ui.dbStatus)
  const user = useSelector((state) => state.user)

  const [syncInfo, setSyncInfo] = useState({ isOnline: true, isFlushing: false, pendingCount: 0 })

  useEffect(() => {
    const unsubscribe = subscribeSyncStatus((status) => {
      setSyncInfo(status)
    })
    return unsubscribe
  }, [])

  const isStreakBroken = user.streakCount === 0

  const handleLogout = () => {
    setAuthToken(null)
    dispatch(logout())
    dispatch(resetHabitsOnLogout())
  }

  return (
    <header className="flex h-16 items-center justify-between px-4 sm:px-6 border-b border-[#d2e7ee] dark:border-[#0e2938] bg-[#f0f8fb]/85 dark:bg-[#050e14]/85 backdrop-blur-md sticky top-0 z-30 transition-colors">
      {/* Mobile brand / menu button */}
      <div className="flex items-center gap-2 md:hidden">
        <Button
          variant="light"
          size="sm"
          onClick={() => dispatch(setMobileNavOpen(true))}
          aria-label="Open navigation menu"
          className="p-1 text-[#0e3b4d] dark:text-[#a5e8f8] hover:bg-[#e0f2f7] dark:hover:bg-[#0d2533] rounded-xl min-w-0"
        >
          <MenuIcon className="w-5 h-5" />
        </Button>
        <BrandLogo size="sm" showText={true} />
      </div>

      {/* Center status: Cloud & Streak info */}
      <div className="hidden md:flex items-center gap-2.5">
        {/* Cloud / Offline Sync Status Badge */}
        {!syncInfo.isOnline ? (
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black bg-amber-50 dark:bg-[#271d0b] border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-400"
            title="Internet is offline. All habits are safely saved in on-device storage and will auto-sync when online."
          >
            <CloudOff className="w-3.5 h-3.5" />
            <span>Offline Mode ({syncInfo.pendingCount > 0 ? `${syncInfo.pendingCount} pending` : 'Saved locally'})</span>
          </div>
        ) : dbStatus === 'connected' ? (
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black bg-cyan-50 dark:bg-[#082635] border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-[#00e5ff]"
            title="Connected to MongoDB. Your habits and streaks are backed up to the cloud."
          >
            <Cloud className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>Cloud Synced</span>
          </div>
        ) : (
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold bg-slate-100 dark:bg-[#0c2432] border-slate-200 dark:border-cyan-950 text-slate-600 dark:text-slate-300"
            title="Habits saved to local device memory. Connect MongoDB in profile to backup."
          >
            <Database className="w-3.5 h-3.5 text-slate-500 dark:text-cyan-400" />
            <span>Device Storage</span>
          </div>
        )}

        {/* Streak status pill */}
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold transition-all ${
            isStreakBroken
              ? 'bg-[#fff1f2] dark:bg-[#200d11] border-[#fecdd3] dark:border-[#4c151e] text-[#be123c] dark:text-[#fb7185]'
              : 'bg-[#e2f7fa] dark:bg-[#092533] border-[#a5f3fc] dark:border-[#0e485e] text-[#0369a1] dark:text-[#38bdf8]'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isStreakBroken ? 'bg-[#f43f5e]' : 'bg-[#00e5ff] animate-pulse'
            }`}
          />
          <span>
            {isStreakBroken ? (
              <>Streak Broken: <strong>0 days</strong></>
            ) : (
              <>Active Streak: <strong>{user.streakCount} days</strong></>
            )}
          </span>
        </div>
      </div>

      {/* Right side controls: Voice Assistant, Cloud Auth, Streak, Profile, Theme Toggle */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Voice Assistant Shortcut */}
        <button
          type="button"
          onClick={() => navigate('/assistant')}
          className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
            isListening
              ? 'bg-red-500 text-white border-red-500 animate-pulse'
              : 'bg-[#e0f7fa] hover:bg-[#cffafe] text-[#0284c7] border-[#bae6fd] dark:bg-[#0c2f3e] dark:hover:bg-[#113f54] dark:text-[#38bdf8] dark:border-[#164e63]'
          }`}
          title="Voice Assistant"
        >
          <Mic className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Voice AI</span>
        </button>

        {/* Cloud Login / Backup Button if guest */}
        {!user.isAuthenticated && (
          <button
            type="button"
            onClick={() => dispatch(setAuthModalOpen(true))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-[#0284c7] via-[#06b6d4] to-[#00e5ff] text-slate-950 shadow-sm shadow-cyan-500/20 hover:scale-102 transition-all"
            title="Sign in to save your habits permanently across devices"
          >
            <Cloud className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Cloud Backup</span>
          </button>
        )}

        {/* Streak Pill */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-extrabold shadow-2xs transition-all ${
            isStreakBroken
              ? 'bg-[#fff1f2] dark:bg-[#220d12] border-[#fecdd3] dark:border-[#4d1721] text-[#e11d48] dark:text-[#fb7185]'
              : 'bg-[#e0f8fb] dark:bg-[#072430] border-[#b2f2fa] dark:border-[#0f4b62] text-[#0891b2] dark:text-[#00e5ff]'
          }`}
          title={isStreakBroken ? 'Streak broken — complete habits to start again!' : `${user.streakCount} day active streak`}
        >
          {isStreakBroken ? (
            <AlertTriangle className="w-3.5 h-3.5 text-[#e11d48] dark:text-[#fb7185]" />
          ) : (
            <Flame className="w-3.5 h-3.5 fill-[#00e5ff] text-[#00e5ff] drop-shadow-xs" />
          )}
          <span>{user.streakCount}d</span>
        </div>

        {/* User Profile Dropdown */}
        <Dropdown>
          <Dropdown.Trigger className="flex items-center gap-2 rounded-full p-1 hover:bg-[#e2f3f8] dark:hover:bg-[#0b2432] cursor-pointer outline-none transition-colors">
            <div className="relative">
              <Avatar
                name={user.name}
                src={user.avatar}
                className="w-8 h-8 rounded-full border border-[#bae6fd] dark:border-[#154a61]"
              />
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#050e14] ${
                  user.isAuthenticated ? 'bg-[#00e5ff]' : 'bg-slate-400'
                }`}
              />
            </div>
            <span className="hidden xl:inline text-xs font-bold text-[#0c3140] dark:text-[#dcf2f9]">
              {user.isAuthenticated ? user.name : 'Guest'}
            </span>
          </Dropdown.Trigger>
          <Dropdown.Popover className="min-w-56 rounded-2xl bg-white dark:bg-[#091b26] p-2 shadow-2xl border border-[#d2e7ee] dark:border-[#0e2c3d] z-50 animate-fade-in">
            <div className="px-3 py-2 border-b border-[#e5f3f7] dark:border-[#123042] mb-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-extrabold text-[#092836] dark:text-[#e4f6fc]">
                  {user.isAuthenticated ? user.name : 'Guest Achiever'}
                </p>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                  user.isAuthenticated
                    ? 'bg-cyan-100 text-cyan-800 dark:bg-[#0e3b4d] dark:text-[#00e5ff]'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {user.isAuthenticated ? 'Cloud User' : 'Guest'}
                </span>
              </div>
              <p className="text-[11px] text-[#528499] dark:text-[#7eb6cc] truncate">
                {user.isAuthenticated ? user.email : user.title}
              </p>
            </div>
            <Dropdown.Menu className="outline-none space-y-0.5">
              {!user.isAuthenticated && (
                <Dropdown.Item
                  id="login"
                  textValue="Sign In / Register"
                  onAction={() => dispatch(setAuthModalOpen(true))}
                  className="rounded-xl px-3 py-1.5 text-xs font-black cursor-pointer bg-cyan-50 dark:bg-[#082a39] text-[#0284c7] dark:text-[#00e5ff] hover:opacity-90 outline-none"
                >
                  <div className="flex items-center gap-2">
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In / Create Account</span>
                  </div>
                </Dropdown.Item>
              )}
              <Dropdown.Item
                id="profile"
                textValue="Profile"
                onAction={() => navigate('/profile')}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold cursor-pointer hover:bg-[#eef8fb] dark:hover:bg-[#0e2a3b] text-[#0e3b4d] dark:text-[#d3eef7] outline-none"
              >
                Profile
              </Dropdown.Item>
              <Dropdown.Item
                id="calendar"
                textValue="Calendar"
                onAction={() => navigate('/calendar')}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold cursor-pointer hover:bg-[#eef8fb] dark:hover:bg-[#0e2a3b] text-[#0e3b4d] dark:text-[#d3eef7] outline-none"
              >
                Calendar & History
              </Dropdown.Item>
              <Dropdown.Item
                id="assistant"
                textValue="Voice Assistant"
                onAction={() => navigate('/assistant')}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold cursor-pointer hover:bg-[#eef8fb] dark:hover:bg-[#0e2a3b] text-[#0e3b4d] dark:text-[#d3eef7] outline-none"
              >
                Voice Assistant
              </Dropdown.Item>
              {user.isAuthenticated && (
                <Dropdown.Item
                  id="logout"
                  textValue="Log Out"
                  onAction={handleLogout}
                  className="rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 outline-none"
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </div>
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>

        {/* Theme Toggle Button */}
        <Button
          onClick={() => dispatch(toggleTheme())}
          variant="light"
          size="sm"
          className="w-9 h-9 min-w-0 p-0 rounded-full border border-[#cbe6ee] bg-[#e4f4f8] text-[#0c4a6e] dark:border-[#0f3447] dark:bg-[#09212f] dark:text-[#38bdf8] hover:bg-[#d6eff6] dark:hover:bg-[#0e2e42] shadow-2xs transition-all"
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-[#38bdf8] transition-transform rotate-0 hover:rotate-45 duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-[#0369a1] transition-transform -rotate-12 hover:rotate-0 duration-300" />
          )}
        </Button>
      </div>
    </header>
  )
}