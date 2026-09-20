import { NavLink } from 'react-router-dom'
import { Calendar, CheckCircle2, Mic, User } from 'lucide-react'
import { useSelector } from 'react-redux'

export default function BottomNavBar({ className = '' }) {
  const isListening = useSelector((state) => state.ui.isListening)

  const navItems = [
    { to: '/', label: 'Today', icon: CheckCircle2 },
    { to: '/calendar', label: 'Calendar', icon: Calendar },
    { to: '/assistant', label: 'Assistant', icon: Mic, pulse: isListening },
    { to: '/profile', label: 'Profile', icon: User },
  ]

  return (
    <nav
      className={`sticky bottom-0 z-40 flex items-center justify-around border-t border-[#d2e7ee] dark:border-[#0e2c3d] bg-[#f0f8fb]/95 dark:bg-[#050e14]/95 backdrop-blur-md px-2 py-2 safe-area-pb ${className}`}
      aria-label="Mobile Navigation Bar"
    >
      {navItems.map(({ to, label, icon: Icon, pulse }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200 ${
              isActive
                ? 'text-[#0284c7] dark:text-[#00e5ff] font-black'
                : 'text-[#5d8b9e] dark:text-[#6c99ac] hover:text-[#0c3140] font-bold'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`relative flex items-center justify-center p-1.5 rounded-full transition-all ${
                  isActive
                    ? 'bg-[#e0f7fa] dark:bg-[#0b2938] shadow-xs shadow-[#00e5ff]/20'
                    : 'hover:bg-[#e4f3f7] dark:hover:bg-[#091f2b]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    pulse ? 'text-red-500 animate-bounce' : ''
                  }`}
                />
                {pulse && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                )}
              </div>
              <span className="text-[11px] tracking-tight">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

