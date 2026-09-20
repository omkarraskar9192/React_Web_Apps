import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Avatar } from '@heroui/react'
import {
  X,
  Calendar,
  CheckCircle2,
  Mic,
  User,
  Zap,
} from 'lucide-react'
import BrandLogo from './BrandLogo'

const navLinks = [
  { to: '/', label: 'Today', icon: CheckCircle2 },
  { to: '/calendar', label: 'Calendar & History', icon: Calendar },
  { to: '/assistant', label: 'Voice Assistant', icon: Mic, badge: 'AI' },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const habits = useSelector((state) => state.habits.habits)
  const user = useSelector((state) => state.user)
  const completed = habits.filter((h) => h.done).length
  const total = habits.length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 sm:p-5 pt-6 pb-6">
      <div>
        {/* Brand logo & mobile close button */}
        <div className="mb-8 flex items-center justify-between px-1.5">
          <BrandLogo size="md" />

          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-2 rounded-xl text-[#528499] hover:bg-[#e0f1f5] dark:text-[#7eb6cc] dark:hover:bg-[#0e2938] transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main navigation links */}
        <nav className="space-y-1.5" aria-label="Main navigation">
          {navLinks.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex min-h-11 items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0c4a6e] text-white dark:bg-[#00e5ff] dark:text-[#04141c] shadow-xs shadow-[#00e5ff]/25 scale-101'
                    : 'text-[#48788c] hover:bg-[#e4f3f7] hover:text-[#082836] dark:text-[#7eb6cc] dark:hover:bg-[#092230] dark:hover:text-[#f0f9ff]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'text-white dark:text-[#04141c]'
                          : 'text-[#6a97aa] dark:text-[#5c8a9e]'
                      }`}
                    />
                    <span>{label}</span>
                  </div>
                  {badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/20 text-white dark:bg-black/20 dark:text-[#04141c]'
                          : 'bg-[#e0f7fa] dark:bg-[#0e374a] text-[#0284c7] dark:text-[#00e5ff]'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Daily Target Rhythm Mini Widget */}
        <div className="mt-8 rounded-3xl bg-[#eaf4f7] dark:bg-[#091f2b] p-4 border border-[#cfe6ee] dark:border-[#0e2c3d]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#0284c7] dark:text-[#00e5ff]" />
              <span className="text-xs font-black text-[#082836] dark:text-[#f0f9ff]">
                Today's Execution
              </span>
            </div>
            <span className="text-xs font-black text-[#0284c7] dark:text-[#00e5ff]">
              {percentage}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[#d6ebf1] dark:bg-[#0e2c3d] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0284c7] via-[#06b6d4] to-[#00e5ff] shadow-xs transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] font-semibold text-[#528499] dark:text-[#7eb6cc]">
            {completed === total && total > 0
              ? '⚡ 100% completed today!'
              : `${completed} of ${total} tasks finished`}
          </p>
        </div>
      </div>

      {/* Bottom section with user profile card */}
      <div className="pt-6">
        <NavLink
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 rounded-2xl border border-[#cfe6ee] dark:border-[#0e2c3d] bg-[#f0f9fb] hover:bg-[#e4f3f7] dark:bg-[#091b26] dark:hover:bg-[#0c2432] p-3 shadow-2xs transition-all group"
        >
          <Avatar
            name={user.name}
            src={user.avatar}
            className="w-9 h-9 rounded-2xl border border-[#bae6fd] dark:border-[#154a61]"
          />

          <div className="min-w-0 flex-1">
            <strong className="block text-xs font-extrabold text-[#082836] dark:text-[#f0f9ff] truncate group-hover:text-[#0284c7] dark:group-hover:text-[#00e5ff] transition-colors">
              {user.isAuthenticated ? user.name : 'Guest User'}
            </strong>
            <span className="flex items-center gap-1 text-[10px] text-[#0284c7] dark:text-[#00e5ff] font-bold">
              <span>{user.streakCount}d streak</span>
              <span>•</span>
              <span className="truncate text-[#528499] dark:text-[#7eb6cc]">{user.title}</span>
            </span>
          </div>
        </NavLink>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-[#d2e7ee] dark:border-[#0e2938] bg-[#f7fcfe] dark:bg-[#061219] md:flex transition-colors">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="relative z-10 w-72 max-w-[85vw] bg-[#f7fcfe] dark:bg-[#061219] shadow-2xl border-r border-[#d2e7ee] dark:border-[#0e2938]">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}