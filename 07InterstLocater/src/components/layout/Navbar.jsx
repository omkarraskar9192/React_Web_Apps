import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery } from '../../features/interests/interestsSlice';
import { 
  Compass, 
  LayoutGrid, 
  Sparkles, 
  BarChart3, 
  Plus, 
  Search, 
  Flame
} from 'lucide-react';

export default function Navbar({ onOpenAddModal }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchQuery = useSelector((state) => state.interests.searchQuery);
  const trackedCount = useSelector((state) => state.interests.items.length);
  const activeInterests = useSelector((state) => 
    state.interests.items.filter(i => i.stage !== 'Mastered').length
  );

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1.5px] shadow-[0_0_20px_rgba(99,102,241,0.35)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-indigo-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              PassionCompass
            </span>
            <span className="hidden sm:inline-block text-[10px] text-cyan-400 font-mono ml-2 px-1.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/50">
              LOCATOR
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-full border border-slate-800/80">
          <NavLink to="/" end className={navItemClass}>
            <Compass className="w-4 h-4" />
            <span>Finder & Constellation</span>
          </NavLink>
          <NavLink to="/dashboard" className={navItemClass}>
            <LayoutGrid className="w-4 h-4" />
            <span>My Tracker</span>
            <span className="ml-1 text-xs px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
              {trackedCount}
            </span>
          </NavLink>
          <NavLink to="/explore" className={navItemClass}>
            <Sparkles className="w-4 h-4" />
            <span>Catalog</span>
          </NavLink>
          <NavLink to="/analytics" className={navItemClass}>
            <BarChart3 className="w-4 h-4" />
            <span>Insights</span>
          </NavLink>
        </nav>

        {/* Search Bar & Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="relative hidden lg:block w-48 xl:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search passions..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (window.location.pathname !== '/dashboard') {
                  navigate('/dashboard');
                }
              }}
              className="w-full bg-slate-900/70 border border-slate-800 text-xs rounded-full pl-9 pr-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Quick Streak / Status pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{activeInterests} In Progress</span>
          </div>

          {/* Add Interest Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full text-xs sm:text-sm font-medium shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Add Interest</span>
          </button>
        </div>

      </div>

      {/* Mobile Nav strip */}
      <div className="flex md:hidden border-t border-slate-800/80 px-2 py-1.5 justify-around bg-slate-950/90 text-xs">
        <NavLink to="/" end className={navItemClass}>
          <Compass className="w-3.5 h-3.5" />
          <span>Compass</span>
        </NavLink>
        <NavLink to="/dashboard" className={navItemClass}>
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Tracker ({trackedCount})</span>
        </NavLink>
        <NavLink to="/explore" className={navItemClass}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Catalog</span>
        </NavLink>
        <NavLink to="/analytics" className={navItemClass}>
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics</span>
        </NavLink>
      </div>
    </header>
  );
}
