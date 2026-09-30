import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setSearchQuery, 
  setCategoryFilter, 
  setStageFilter,
  resetDefaults 
} from '../features/interests/interestsSlice';
import InterestCard from '../components/interests/InterestCard';
import { 
  Search, 
  Filter, 
  Plus, 
  LayoutGrid, 
  Kanban, 
  Sparkles, 
  Clock, 
  Flame, 
  Award,
  RotateCcw
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Tech & Coding',
  'Art & Design',
  'Outdoor & Adventure',
  'Wellness & Mind',
  'Music & Audio',
  'Gastronomy'
];

const STAGES = ['All', 'Exploring', 'Learning', 'Practicing', 'Mastered'];

export default function DashboardPage({ onOpenAddModal }) {
  const dispatch = useDispatch();
  const { items, searchQuery, categoryFilter, stageFilter } = useSelector((state) => state.interests);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'kanban'

  // Filter items
  const filteredInterests = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStage = stageFilter === 'All' || item.stage === stageFilter;

    return matchesSearch && matchesCategory && matchesStage;
  });

  // Calculate metrics
  const totalHours = items.reduce((acc, curr) => acc + (Number(curr.hoursSpent) || 0), 0);
  const activeStreakCount = items.filter(i => (i.streakDays || 0) > 2).length;
  const masteredCount = items.filter(i => i.stage === 'Mastered').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Stats Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Passion Tracker & Workspace</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
              {filteredInterests.length} of {items.length}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track daily hours, tick off milestone checkpoints, and level up your craft.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Kanban Board"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>

          {/* Add Interest Modal Trigger */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-[0_0_15px_rgba(99,102,241,0.3)] active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Passion</span>
          </button>
        </div>
      </div>

      {/* Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Passions</div>
            <div className="text-xl font-bold font-mono text-white">{items.length}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Logged Practice</div>
            <div className="text-xl font-bold font-mono text-cyan-300">{totalHours} hrs</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Habit Streaks</div>
            <div className="text-xl font-bold font-mono text-amber-300">{activeStreakCount} active</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Mastered Skills</div>
            <div className="text-xl font-bold font-mono text-emerald-300">{masteredCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, category, or notes..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 text-xs sm:text-sm rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Stage Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Stage:</span>
            <select
              value={stageFilter}
              onChange={(e) => dispatch(setStageFilter(e.target.value))}
              className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {STAGES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => dispatch(setCategoryFilter(cat))}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.35)]'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Grid vs Kanban */}
      {filteredInterests.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Filter className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No passions match your criteria</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query, or clear your category/stage filters.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                dispatch(setSearchQuery(''));
                dispatch(setCategoryFilter('All'));
                dispatch(setStageFilter('All'));
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
            >
              Clear Filters
            </button>
            <button
              onClick={() => dispatch(resetDefaults())}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Seed Sample Data</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInterests.map((interest) => (
            <InterestCard key={interest.id} interest={interest} />
          ))}
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {['Exploring', 'Learning', 'Practicing', 'Mastered'].map((stage) => {
            const stageInterests = filteredInterests.filter(i => i.stage === stage);
            return (
              <div key={stage} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    {stage}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    {stageInterests.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                  {stageInterests.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                      Empty column
                    </div>
                  ) : (
                    stageInterests.map((interest) => (
                      <InterestCard key={interest.id} interest={interest} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
