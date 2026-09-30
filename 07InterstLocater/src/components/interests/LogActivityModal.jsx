import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { logActivity } from '../../features/interests/interestsSlice';
import { X, Clock, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LogActivityModal({ interest, isOpen, onClose }) {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      hours: '1.5',
      notes: ''
    }
  });

  if (!isOpen || !interest) return null;

  const onSubmit = (data) => {
    dispatch(logActivity({
      interestId: interest.id,
      hours: parseFloat(data.hours) || 1,
      notes: data.notes
    }));

    try {
      confetti({
        particleCount: 40,
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
        className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/80 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Log Practice Session
              </h3>
              <p className="text-xs text-slate-400">
                {interest.title} • {interest.category}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Time Spent (Hours) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.25"
                min="0.25"
                max="24"
                className={`w-full bg-slate-950 border text-sm rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                  errors.hours 
                    ? 'border-rose-500 focus:ring-rose-500' 
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
                {...register('hours', {
                  required: 'Please enter practice duration',
                  min: { value: 0.25, message: 'Minimum 0.25 hours (15 min)' }
                })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">
                hrs
              </span>
            </div>
            {errors.hours && (
              <p className="text-xs text-rose-400 mt-1">{errors.hours.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Session Reflections / What did you practice?
            </label>
            <textarea
              rows="3"
              placeholder="e.g. Worked through chord progressions, solved 2 algorithmic challenges, designed a mobile header..."
              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              {...register('notes')}
            />
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-xs flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Logging time extends your consistency streak and boosts your mastery score!</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Log Session</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
