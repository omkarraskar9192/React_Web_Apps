import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addInterest } from '../../features/interests/interestsSlice';
import { X, Sparkles, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES = [
  'Tech & Coding',
  'Art & Design',
  'Outdoor & Adventure',
  'Wellness & Mind',
  'Music & Audio',
  'Gastronomy',
  'General Craft'
];

const STAGES = ['Exploring', 'Learning', 'Practicing', 'Mastered'];

export default function AddInterestModal({ isOpen, onClose }) {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      title: '',
      category: 'Tech & Coding',
      stage: 'Exploring',
      progress: 15,
      notes: '',
      milestone1: '',
      milestone2: '',
      milestone3: ''
    }
  });

  const currentProgress = watch('progress');

  if (!isOpen) return null;

  const onSubmit = (data) => {
    const rawMilestones = [data.milestone1, data.milestone2, data.milestone3]
      .map(m => m ? m.trim() : '')
      .filter(Boolean);

    const initialMilestones = rawMilestones.length > 0 
      ? rawMilestones 
      : ['Set up starter environment', 'Complete first 10 hours', 'Build personal project'];

    dispatch(addInterest({
      title: data.title.trim(),
      category: data.category,
      stage: data.stage,
      progress: Number(data.progress) || 15,
      notes: data.notes?.trim() || '',
      milestones: initialMilestones
    }));

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }

    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/80 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Add New Passion / Interest
              </h3>
              <p className="text-xs text-slate-400">
                Register a new craft, hobby, or domain to your personal radar.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body with React Hook Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Interest Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Modern React & Three.js, Bouldering, Acoustic Guitar"
              className={`w-full bg-slate-950 border text-xs sm:text-sm rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                errors.title 
                  ? 'border-rose-500/80 focus:ring-rose-500' 
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
              {...register('title', {
                required: 'Please provide a title for this interest',
                minLength: { value: 2, message: 'Title must be at least 2 characters' }
              })}
            />
            {errors.title && (
              <p className="text-xs text-rose-400 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Category & Stage Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Category Realm
              </label>
              <select
                className="w-full bg-slate-950 border border-slate-800 text-xs sm:text-sm rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                {...register('category')}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Current Stage
              </label>
              <select
                className="w-full bg-slate-950 border border-slate-800 text-xs sm:text-sm rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                {...register('stage')}
              >
                {STAGES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Initial Progress Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Initial Familiarity / Progress
              </label>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 px-2 py-0.5 rounded-full">
                {currentProgress}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              className="w-full accent-indigo-500 cursor-pointer"
              {...register('progress')}
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
              <span>Novice (0%)</span>
              <span>Practicing (50%)</span>
              <span>Mastery (100%)</span>
            </div>
          </div>

          {/* Starter Milestones */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Initial Target Milestones (Optional)
            </label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="1. First step (e.g. Watch 3 tutorials or get gear)"
                className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                {...register('milestone1')}
              />
              <input
                type="text"
                placeholder="2. Milestone 2 (e.g. Build starter artifact)"
                className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                {...register('milestone2')}
              />
              <input
                type="text"
                placeholder="3. Milestone 3 (e.g. Share with someone or hit 20 hrs)"
                className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                {...register('milestone3')}
              />
            </div>
          </div>

          {/* Notes / Motivation */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Personal Motivation / Notes
            </label>
            <textarea
              rows="2"
              placeholder="Why does this spark excite you? What do you want to accomplish?"
              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              {...register('notes')}
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.4)] active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Save to Tracker</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
