import { useSelector } from 'react-redux';
import QuizCard from '../components/compass/QuizCard';
import QuizResultsView from '../components/compass/QuizResultsView';
import ConstellationGraph from '../components/compass/ConstellationGraph';
import CategoryDetailModal from '../components/compass/CategoryDetailModal';
import { Sparkles, Flame, Target, Plus } from 'lucide-react';

export default function CompassPage({ onOpenAddModal }) {
  const isQuizCompleted = useSelector((state) => state.quiz.isCompleted);
  const trackedInterests = useSelector((state) => state.interests.items);

  const totalHours = trackedInterests.reduce((acc, curr) => acc + (Number(curr.hoursSpent) || 0), 0);
  const activeCount = trackedInterests.filter(i => i.stage !== 'Mastered').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border border-slate-800 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-900 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Layout C • Diagnostic Compass & Constellation Finder</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Locate Your True <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">Sparks & Passions</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Take the self-discovery diagnostic questionnaire to calculate your creative archetype, or explore the luminous constellation galaxy to inspect beginner starter roadmaps.
            </p>
          </div>

          {/* Quick Stats Pill Panel */}
          <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4 shrink-0">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tracked</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                {trackedInterests.length}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Time Spent</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300">
                {totalHours} hrs
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md hidden xl:block">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>In Progress</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-300">
                {activeCount}
              </div>
            </div>

            <button
              onClick={onOpenAddModal}
              className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Spark</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dual-Column Workspace: Diagnostic on Left, Constellation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Interactive Diagnostic Quiz or Results (5 Cols on LG) */}
        <div className="lg:col-span-5 h-[580px] sm:h-[640px]">
          {isQuizCompleted ? (
            <QuizResultsView />
          ) : (
            <QuizCard />
          )}
        </div>

        {/* Right Column: Interactive Constellation Galaxy (7 Cols on LG) */}
        <div className="lg:col-span-7 h-[580px] sm:h-[640px]">
          <ConstellationGraph />
        </div>
      </div>

      {/* Detail Blueprint Modal */}
      <CategoryDetailModal />
    </div>
  );
}
