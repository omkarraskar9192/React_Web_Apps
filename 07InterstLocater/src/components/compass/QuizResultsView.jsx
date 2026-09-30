import { useSelector, useDispatch } from 'react-redux';
import { restartQuiz } from '../../features/quiz/quizSlice';
import { addInterest } from '../../features/interests/interestsSlice';
import { selectCategory } from '../../features/constellation/constellationSlice';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Plus, 
  Check, 
  Compass, 
  Award,
  Layers
} from 'lucide-react';
import { useState } from 'react';
import confetti from 'canvas-confetti';

export default function QuizResultsView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categoryScores, topCategory, recommendedProfile } = useSelector((state) => state.quiz);
  const existingInterests = useSelector((state) => state.interests.items);

  const [trackedSparks, setTrackedSparks] = useState({});

  const maxScore = Math.max(...Object.values(categoryScores || {}), 1);

  const handleTrackSpark = (sparkTitle, category) => {
    const isAlreadyTracked = existingInterests.some(i => i.title.toLowerCase() === sparkTitle.toLowerCase());
    if (isAlreadyTracked) {
      setTrackedSparks(prev => ({ ...prev, [sparkTitle]: true }));
      return;
    }

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // fallback
    }

    dispatch(addInterest({
      title: sparkTitle,
      category: category || topCategory || 'Tech & Coding',
      stage: 'Exploring',
      progress: 10,
      notes: `Discovered through Passion Compass AI Diagnostic as a recommended spark.`
    }));

    setTrackedSparks(prev => ({ ...prev, [sparkTitle]: true }));
  };

  const handleFocusConstellation = () => {
    if (topCategory) {
      dispatch(selectCategory(topCategory));
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col h-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-slate-700/60 animate-in fade-in duration-300">
      {/* Header Badge */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Archetype Match Found
          </span>
        </div>
        <button
          onClick={() => dispatch(restartQuiz())}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retake Quiz</span>
        </button>
      </div>

      {/* Main Archetype Banner */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Top Realm: {topCategory}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          {recommendedProfile?.title || 'Passionate Creator'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
          {recommendedProfile?.tagline}
        </p>
      </div>

      {/* Category Resonance Spectrum Breakdown */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Passion Resonance Breakdown
          </span>
          <span>Score</span>
        </div>

        <div className="space-y-1.5">
          {Object.entries(categoryScores || {}).map(([category, score]) => {
            const percent = Math.min(100, Math.round((score / maxScore) * 100));
            const isTop = category === topCategory;
            return (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className={isTop ? 'font-semibold text-white' : 'text-slate-400'}>
                    {category}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{score} pts</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isTop
                        ? 'bg-gradient-to-r from-cyan-400 to-indigo-500'
                        : 'bg-slate-600'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggested Sparks to Track */}
      <div className="mb-6 flex-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
          <span>Recommended Starter Sparks</span>
          <span className="text-[10px] text-cyan-400 lowercase font-normal">(1-click to track)</span>
        </h4>
        <div className="space-y-2">
          {recommendedProfile?.suggestedInterests?.map((interest, idx) => {
            const isTracked = trackedSparks[interest.title] || existingInterests.some(i => i.title.toLowerCase() === interest.title.toLowerCase());
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-semibold text-white truncate">
                    {interest.title}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">
                    {interest.desc}
                  </div>
                </div>

                <button
                  onClick={() => handleTrackSpark(interest.title, topCategory)}
                  disabled={isTracked}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    isTracked
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                  }`}
                >
                  {isTracked ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tracking</span>
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

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleFocusConstellation}
          className="w-full sm:w-1/2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>View Realm Constellation</span>
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full sm:w-1/2 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all cursor-pointer"
        >
          <span>Open My Tracker</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
