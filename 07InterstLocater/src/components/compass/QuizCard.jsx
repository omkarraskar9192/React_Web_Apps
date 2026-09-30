import { useSelector, useDispatch } from 'react-redux';
import { 
  selectOption, 
  nextQuestion, 
  prevQuestion, 
  submitQuiz 
} from '../../features/quiz/quizSlice';
import { quizQuestions } from '../../data/quizQuestions';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizCard() {
  const dispatch = useDispatch();
  const { currentQuestionIndex, answers } = useSelector((state) => state.quiz);

  const currentQ = quizQuestions[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100);
  const selectedAnswer = answers[currentQ?.id];
  const isAnswered = !!selectedAnswer;
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  const handleSelect = (opt) => {
    dispatch(selectOption({
      questionId: currentQ.id,
      optionId: opt.id,
      weights: opt.weights
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // fallback
      }
      dispatch(submitQuiz());
    } else {
      dispatch(nextQuestion());
    }
  };

  const handlePrev = () => {
    dispatch(prevQuestion());
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col h-full shadow-[0_8px_32px_rgba(0,0,0,0.36)] border border-slate-700/60">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            AI Quiz Questionnaire
          </span>
        </div>
        <div className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-full">
          {progressPercent}% Complete
        </div>
      </div>

      <div className="space-y-1.5 mb-5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
          <span>{currentQ?.part || 'Part 1: Discover Sparks'}</span>
          <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
          {currentQ?.question}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Pick the option that resonates most naturally with you.
        </p>
      </div>

      <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
        {currentQ?.options.map((opt, idx) => {
          const isSelected = selectedAnswer?.optionId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              className={`w-full text-left p-3.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer group ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 border border-indigo-400/80 text-white shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                  : 'bg-slate-900/50 hover:bg-slate-800/70 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 transition-colors ${
                  isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                }`}>
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{opt.text}</span>
              </div>
              <div className="shrink-0">
                {isSelected ? (
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-600 block group-hover:border-slate-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800/80">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            currentQuestionIndex === 0
              ? 'text-slate-600 cursor-not-allowed'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/70 cursor-pointer'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
            isAnswered
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
          }`}
        >
          <span>{isLastQuestion ? 'Reveal My Constellation' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
