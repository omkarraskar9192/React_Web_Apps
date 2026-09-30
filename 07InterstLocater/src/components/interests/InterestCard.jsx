import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  toggleMilestone, 
  addMilestone, 
  deleteInterest, 
  updateStage 
} from '../../features/interests/interestsSlice';
import LogActivityModal from './LogActivityModal';
import { 
  Clock, 
  Flame, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  Circle, 
  ChevronDown,
  Layers
} from 'lucide-react';

const STAGE_COLORS = {
  Exploring: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  Learning: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  Practicing: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Mastered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
};

const CATEGORY_COLORS = {
  'Tech & Coding': '#38bdf8',
  'Art & Design': '#34d399',
  'Outdoor & Adventure': '#fb923c',
  'Wellness & Mind': '#c084fc',
  'Music & Audio': '#f472b6',
  'Gastronomy': '#22d3ee',
};

export default function InterestCard({ interest }) {
  const dispatch = useDispatch();
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [newMilestoneText, setNewMilestoneText] = useState('');
  const [showAddMilestone, setShowAddMilestone] = useState(false);

  const categoryColor = CATEGORY_COLORS[interest.category] || '#818cf8';

  const handleToggle = (mId) => {
    dispatch(toggleMilestone({ interestId: interest.id, milestoneId: mId }));
  };

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (newMilestoneText.trim()) {
      dispatch(addMilestone({ interestId: interest.id, title: newMilestoneText.trim() }));
      setNewMilestoneText('');
      setShowAddMilestone(false);
    }
  };

  const handleStageChange = (e) => {
    dispatch(updateStage({ interestId: interest.id, stage: e.target.value }));
  };

  const handleDelete = () => {
    if (window.confirm(`Remove "${interest.title}" from your active tracker?`)) {
      dispatch(deleteInterest(interest.id));
    }
  };

  return (
    <>
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-700/60 hover:border-slate-600/80 transition-all duration-300 flex flex-col justify-between group shadow-[0_4px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)] relative overflow-hidden">
        {/* Subtle Category Color Top Accent Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-1 transition-all"
          style={{ backgroundColor: categoryColor }}
        />

        <div>
          {/* Header Row: Category Badge & Stage Selector */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span 
              className="text-[11px] font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border"
              style={{
                borderColor: `${categoryColor}44`,
                backgroundColor: `${categoryColor}15`,
                color: categoryColor,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: categoryColor }} />
              {interest.category}
            </span>

            {/* Stage Selector */}
            <div className="relative">
              <select
                value={interest.stage}
                onChange={handleStageChange}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer appearance-none pr-6 focus:outline-none ${
                  STAGE_COLORS[interest.stage] || STAGE_COLORS.Exploring
                }`}
              >
                <option value="Exploring">Exploring</option>
                <option value="Learning">Learning</option>
                <option value="Practicing">Practicing</option>
                <option value="Mastered">Mastered</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
            </div>
          </div>

          {/* Title & Notes */}
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-indigo-200 transition-colors">
            {interest.title}
          </h3>
          {interest.notes && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {interest.notes}
            </p>
          )}

          {/* Progress Bar & Numerical Percentage */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Mastery Progress</span>
              <span className="font-mono text-cyan-400 font-bold">{interest.progress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${interest.progress}%` }}
              />
            </div>
          </div>

          {/* Metrics Row: Hours spent & Streak */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <div>
                <div className="text-[10px] text-slate-400">Total Practice</div>
                <div className="font-mono font-semibold text-slate-200">
                  {interest.hoursSpent || 0} hrs
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <div>
                <div className="text-[10px] text-slate-400">Active Streak</div>
                <div className="font-mono font-semibold text-amber-300">
                  {interest.streakDays || 1} days
                </div>
              </div>
            </div>
          </div>

          {/* Milestones Checklist */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-cyan-400" />
                Action Milestones
              </span>
              <button
                onClick={() => setShowAddMilestone(!showAddMilestone)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 lowercase font-normal flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add step</span>
              </button>
            </div>

            {/* Inline add milestone input */}
            {showAddMilestone && (
              <form onSubmit={handleAddMilestone} className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="New milestone..."
                  value={newMilestoneText}
                  onChange={(e) => setNewMilestoneText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium cursor-pointer"
                >
                  Add
                </button>
              </form>
            )}

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {(interest.milestones || []).map((milestone) => (
                <button
                  key={milestone.id}
                  onClick={() => handleToggle(milestone.id)}
                  className="w-full text-left flex items-start gap-2 p-1.5 rounded-lg hover:bg-slate-900/60 transition-colors group/item cursor-pointer"
                >
                  {milestone.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500 group-hover/item:text-slate-300 shrink-0 mt-0.5" />
                  )}
                  <span className={`text-xs leading-snug transition-all ${
                    milestone.completed 
                      ? 'line-through text-slate-500' 
                      : 'text-slate-300 group-hover/item:text-white'
                  }`}>
                    {milestone.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card Actions Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <button
            onClick={() => setIsLogOpen(true)}
            className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/50 hover:to-purple-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Log Practice</span>
          </button>

          <button
            onClick={handleDelete}
            title="Delete Interest"
            className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/60 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Activity Modal */}
      <LogActivityModal
        interest={interest}
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
      />
    </>
  );
}
