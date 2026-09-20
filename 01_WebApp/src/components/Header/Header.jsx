import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setJoinModalOpen, toggleDarkMode } from '../../store/slices/uiSlice';
import { Code2, Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';
import { GithubIcon } from '../common/Icons';

const navItems = [
  { name: 'Home', path: '/', end: true },
  { name: 'Projects', path: '/content' },
  { name: 'Team', path: '/team' },
  { name: 'About', path: '/about' },
];

export default function Header() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);
  const solarTime = useSelector((state) => state.ui.solarTime);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-all duration-500 ${
      isDarkMode
        ? 'border-white/10 bg-slate-950/85 text-white'
        : 'border-slate-200/90 bg-white/90 shadow-sm text-slate-950'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-500 to-pink-500 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                isDarkMode ? 'bg-slate-950' : 'bg-slate-900'
              }`}>
                <Code2 className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <span className={`font-extrabold text-base tracking-tight flex items-center gap-1.5 ${
                isDarkMode ? 'text-white' : 'text-slate-950'
              }`}>
                CYBER <span className="text-cyan-400 font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">TECH</span>
              </span>
              <p className={`text-[10px] font-mono hidden sm:block ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Collegiate Engineering Collective
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden md:flex items-center gap-1 border rounded-full px-3 py-1.5 backdrop-blur-md transition-colors ${
            isDarkMode
              ? 'bg-white/5 border-white/10'
              : 'bg-slate-100/90 border-slate-200 shadow-xs'
          }`}>
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : isDarkMode
                      ? 'text-slate-300 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/80'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* CTA Buttons & Day/Night Toggle */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Celestial Day/Night Theme Toggle */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium border transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-900/80 border-cyan-500/30 text-cyan-300 hover:bg-slate-800'
                  : 'bg-amber-100/90 border-amber-400/50 text-amber-900 hover:bg-amber-200 shadow-sm'
              }`}
              title={isDarkMode ? 'Switch to Light Mode (Daylight)' : 'Switch to Dark Mode (Cosmic Night)'}
            >
              {isDarkMode ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Night ({Math.round(solarTime * 24)}h)</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '12s' }} />
                  <span>Day ({Math.round(solarTime * 24)}h)</span>
                </>
              )}
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className={`p-2 rounded-full transition-colors ${
                isDarkMode
                  ? 'text-slate-400 hover:text-white hover:bg-white/10'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
              title="GitHub Organization"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            <button
              onClick={() => dispatch(setJoinModalOpen(true))}
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-300 hover:opacity-90 shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Join Club</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Theme Toggle & Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className={`p-2 rounded-full border text-xs cursor-pointer transition-all ${
                isDarkMode
                  ? 'border-amber-400/40 bg-slate-900/90 text-amber-400 hover:bg-slate-800'
                  : 'border-amber-400/70 bg-amber-100/90 text-amber-900 hover:bg-amber-200 shadow-sm'
              }`}
              title={isDarkMode ? 'Switch to Light Mode (White)' : 'Switch to Dark Mode'}
              aria-label="Toggle Light and Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-700" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 cursor-pointer ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'}`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b px-4 pt-3 pb-6 space-y-4 transition-colors ${
          isDarkMode
            ? 'border-white/10 bg-slate-950 text-white'
            : 'border-slate-200 bg-white text-slate-900 shadow-2xl'
        }`}>
          {/* Mobile Theme Switcher Bar */}
          <div className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-xs font-mono font-semibold">
              Mode: {isDarkMode ? 'Cosmic Dark' : 'Pure White Light'}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  if (isDarkMode) dispatch(toggleDarkMode());
                }}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                  !isDarkMode
                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm font-extrabold'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                onClick={() => {
                  if (!isDarkMode) dispatch(toggleDarkMode());
                }}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                  isDarkMode
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-sm font-extrabold'
                    : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-xl ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-400 font-bold'
                      : isDarkMode
                      ? 'text-slate-300 hover:bg-white/5'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className={`pt-3 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                dispatch(setJoinModalOpen(true));
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 text-center shadow-lg cursor-pointer"
            >
              Join Club Application
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
