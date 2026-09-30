import { useSelector, useDispatch } from 'react-redux';
import { clearActiveDetailNode } from '../../features/constellation/constellationSlice';
import { addInterest } from '../../features/interests/interestsSlice';
import { 
  X, 
  Sparkles, 
  Check, 
  Plus, 
  ArrowRight, 
  Compass, 
  BookOpen, 
  Zap
} from 'lucide-react';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

export default function CategoryDetailModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeNode = useSelector((state) => state.constellation.activeDetailNode);
  const trackedInterests = useSelector((state) => state.interests.items);

  const [trackedItems, setTrackedItems] = useState({});

  if (!activeNode) return null;

  const handleTrackInterest = (title, category) => {
    const isAlready = trackedInterests.some(i => i.title.toLowerCase() === title.toLowerCase());
    if (isAlready) {
      setTrackedItems(prev => ({ ...prev, [title]: true }));
      return;
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }

    dispatch(addInterest({
      title,
      category: category || activeNode.category,
      stage: 'Exploring',
      progress: 10,
      notes: `Discovered through the ${activeNode.title} Constellation Realm.`
    }));

    setTrackedItems(prev => ({ ...prev, [title]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div 
          className="p-6 border-b border-slate-800 relative"
          style={{
            background: `linear-gradient(135deg, ${activeNode.color}22 0%, rgba(15, 23, 42, 0.8) 100%)`
          }}
        >
          <button
            onClick={() => dispatch(clearActiveDetailNode())}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-750 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span 
              className="w-3.5 h-3.5 rounded-full shadow-[0_0_12px_currentColor]"
              style={{ backgroundColor: activeNode.color, color: activeNode.color }}
            />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
              {activeNode.category} Realm
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white tracking-tight">
            {activeNode.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {activeNode.tagline}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Realm Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Overview & Atmosphere
            </h4>
            <p className="text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
              {activeNode.description}
            </p>
          </div>

          {/* Starter Guide */}
          {activeNode.starterGuide && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                Beginner Starter Strategy
              </h4>
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 leading-relaxed flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{activeNode.starterGuide}</span>
              </div>
            </div>
          )}

          {/* Curated Sub-Interests in this realm */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Specialized Disciplines & Pathways
              </h4>
              <span className="text-[11px] text-slate-400">Click to track</span>
            </div>

            <div className="space-y-2">
              {activeNode.subInterests?.map((sub) => {
                const isTracked = trackedItems[sub.name] || trackedInterests.some(i => i.title.toLowerCase() === sub.name.toLowerCase());
                return (
                  <div
                    key={sub.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{sub.name}</span>
                        {sub.level && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                            {sub.level}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        High synergy with {activeNode.title}
                      </div>
                    </div>

                    <button
                      onClick={() => handleTrackInterest(sub.name, activeNode.category)}
                      disabled={isTracked}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                        isTracked
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                      }`}
                    >
                      {isTracked ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tracked</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Track</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => dispatch(clearActiveDetailNode())}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Close Blueprint
          </button>

          <button
            onClick={() => {
              dispatch(clearActiveDetailNode());
              navigate('/dashboard');
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.35)] transition-all cursor-pointer"
          >
            <span>View Active Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
