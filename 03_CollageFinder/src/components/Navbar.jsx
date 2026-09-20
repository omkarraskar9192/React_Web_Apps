import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  GraduationCap,
  Search,
  Sparkles,
  User,
  ShieldCheck,
  Menu,
  X,
  LogOut
} from 'lucide-react'
import { selectIsAuthenticated, selectAdminUser, logout } from '../store/slices/authSlice'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isAuthenticated = useSelector(selectIsAuthenticated)
  const adminUser = useSelector(selectAdminUser)

  // Public links visible to students
  const publicLinks = [
    { name: 'Home', path: '/', icon: GraduationCap },
    { name: 'Explore Colleges', path: '/search', icon: Search },
    { name: 'Find College (Counselor)', path: '/recommend', icon: Sparkles, badge: 'AI Match' },
    { name: 'My Profile', path: '/profile', icon: User }
  ]

  // Admin link only added when logged in as admin
  const navLinks = isAuthenticated
    ? [...publicLinks, { name: 'Admin Portal', path: '/admin', icon: ShieldCheck, adminBadge: true }]
    : publicLinks

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1">
                College<span className="text-indigo-600">Finder</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-600 font-medium -mt-1">
                Cutoff Predictor & Counseling
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path)

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      {link.badge}
                    </span>
                  )}
                  {link.adminBadge && (
                    <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                      Admin
                    </span>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Right Action CTA & Admin Status */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {adminUser?.name || 'Admin'}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Logout from Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <NavLink
                to="/recommend"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Predict Colleges</span>
              </NavLink>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive =
              link.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.path)

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            )
          })}

          {isAuthenticated && (
            <button
              onClick={() => {
                handleLogout()
                setMobileMenuOpen(false)
              }}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout from Admin</span>
            </button>
          )}
        </div>
      )}
    </header>
  )
}
