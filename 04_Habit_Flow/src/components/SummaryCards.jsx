import { useSelector } from 'react-redux'
import { Card, ProgressBar } from '@heroui/react'
import { Flame, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { getTodayKey, getYesterdayKey } from '../store/habitsSlice'

export default function SummaryCards({ completed, total, className = '', streakCount = 0 }) {
  const history = useSelector((state) => state.habits.history)
  const user = useSelector((state) => state.user)

  // Calculate progress percentage
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0
  const remaining = Math.max(0, total - completed)
  const isAllDone = total > 0 && completed === total
  const isStreakBroken = streakCount === 0

  // Calculate rolling last 7 days up to today based on real history
  const todayKey = getTodayKey()
  const last7Days = []
  let currDate = todayKey

  for (let i = 0; i < 7; i++) {
    const isToday = currDate === todayKey
    const [y, m, d] = currDate.split('-').map(Number)
    const dateObj = new Date(y, m - 1, d)
    const label = dateObj.toLocaleDateString('en-US', { weekday: 'narrow' })
    const full = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

    const done = isToday ? isAllDone : Boolean(history[currDate]?.percent === 100)

    last7Days.unshift({ key: currDate, label, full, done, isToday })
    currDate = getYesterdayKey(currDate)
  }

  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${className}`} id="progress">
      {/* Today's progress card */}
      <Card className="group relative overflow-hidden p-6 sm:p-7 bg-white dark:bg-[#071722] border border-[#cfe6ee] dark:border-[#0e2c3d] shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl">
        {/* Subtle background aqua glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 w-40 h-40 rounded-full bg-[#00e5ff]/10 blur-2xl group-hover:bg-[#00e5ff]/20 transition-colors" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#e0f7fa] dark:bg-[#0b2d3c] flex items-center justify-center text-[#0284c7] dark:text-[#00e5ff]">
                <CheckCircle className="w-4 h-4" />
              </div>
              <p className="text-xs font-black tracking-wider uppercase text-[#528499] dark:text-[#7eb6cc]">
                Today's Target
              </p>
            </div>
            <span className="rounded-full bg-[#e0f7fa] dark:bg-[#092634] px-3 py-1 text-xs font-black text-[#0284c7] dark:text-[#00e5ff] border border-[#a5f3fc] dark:border-[#0f4b62]">
              {progress}%
            </span>
          </div>

          <div>
            <div className="font-display text-3xl sm:text-4xl font-black tracking-tight text-[#082836] dark:text-[#f0f9ff]">
              {completed} of {total} completed
            </div>
            <p className="mt-1 text-xs sm:text-sm font-medium text-[#528499] dark:text-[#8cbacc]">
              {isAllDone
                ? '⚡ Full completion! You crushed every single habit today.'
                : remaining > 0
                ? `${remaining} task${remaining > 1 ? 's' : ''} remaining. Lock in and finish strong!`
                : 'Add daily tasks to begin your discipline run.'}
            </p>
          </div>

          {/* Animated HeroUI ProgressBar in Electric Aqua */}
          <div className="pt-1">
            <ProgressBar
              value={progress}
              aria-label="Habit completion progress"
              className="w-full"
            >
              <ProgressBar.Track className="h-3.5 w-full rounded-full bg-[#e1f1f5] dark:bg-[#0b2432] overflow-hidden p-0.5">
                <ProgressBar.Fill className="h-full rounded-full bg-gradient-to-r from-[#0284c7] via-[#06b6d4] to-[#00e5ff] shadow-xs shadow-[#00e5ff]/30 transition-all duration-700 ease-out" />
              </ProgressBar.Track>
            </ProgressBar>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-[#528499] dark:text-[#8cbacc] pt-1.5 border-t border-[#e2f1f5] dark:border-[#0e2c3d]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff]" />
              Completed: <strong className="text-[#082836] dark:text-[#f0f9ff] font-bold">{completed}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Pending: <strong className="text-[#082836] dark:text-[#f0f9ff] font-bold">{remaining}</strong>
            </span>
          </div>
        </div>
      </Card>

      {/* Consistency Streak Card */}
      <Card className="group relative overflow-hidden p-6 sm:p-7 bg-white dark:bg-[#071722] border border-[#cfe6ee] dark:border-[#0e2c3d] shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl flex flex-col justify-between">
        {/* Subtle glow */}
        <div
          className={`pointer-events-none absolute -right-12 -top-12 w-40 h-40 rounded-full blur-2xl transition-colors ${
            isStreakBroken ? 'bg-red-500/10' : 'bg-[#00e5ff]/15 group-hover:bg-[#00e5ff]/25'
          }`}
        />

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  isStreakBroken
                    ? 'bg-[#ffe4e6] dark:bg-[#2e1014] text-[#e11d48]'
                    : 'bg-[#e0f7fa] dark:bg-[#0b2d3c] text-[#00e5ff]'
                }`}
              >
                {isStreakBroken ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <Flame className="w-4 h-4 fill-[#00e5ff]" />
                )}
              </div>
              <p className="text-xs font-black tracking-wider uppercase text-[#528499] dark:text-[#7eb6cc]">
                Consistency Streak
              </p>
            </div>
            <span
              className={`text-xs font-black px-3 py-1 rounded-full border ${
                isStreakBroken
                  ? 'text-[#be123c] dark:text-[#fb7185] bg-[#fff1f2] dark:bg-[#240d12] border-[#fecdd3] dark:border-[#4d1620]'
                  : 'text-[#0284c7] dark:text-[#00e5ff] bg-[#e0f8fb] dark:bg-[#092837] border-[#b2f2fa] dark:border-[#0f4e66]'
              }`}
            >
              {isStreakBroken ? 'Broken' : `Active • Level ${Math.max(1, Math.floor(streakCount / 5) + 1)}`}
            </span>
          </div>

          <div className="mt-3.5 flex items-baseline gap-2.5">
            <span className="font-display text-3xl sm:text-4xl font-black tracking-tight text-[#082836] dark:text-[#f0f9ff]">
              {streakCount} {streakCount === 1 ? 'Day' : 'Days'}
            </span>
            <span
              className={`text-xs sm:text-sm font-bold ${
                isStreakBroken
                  ? 'text-[#e11d48] dark:text-[#fb7185]'
                  : 'text-[#0284c7] dark:text-[#00e5ff]'
              }`}
            >
              {isStreakBroken ? '⚠️ streak reset' : '⚡ unstoppable'}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm font-medium text-[#528499] dark:text-[#8cbacc]">
            {isStreakBroken
              ? 'Yesterday was missed. Check off all today’s tasks to start a fresh run!'
              : `Personal best: ${user.bestStreak || 0} days • Keep showing up every single day!`}
          </p>
        </div>

        {/* 7-day rolling circular tracker from actual history */}
        <div className="mt-5 pt-3.5 border-t border-[#e2f1f5] dark:border-[#0e2c3d]">
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            {last7Days.map((day) => {
              return (
                <div key={day.key} className="flex flex-col items-center gap-1.5 flex-1">
                  <div
                    title={`${day.full}: ${day.done ? '100% Completed' : 'Incomplete / Missed'}`}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center text-xs sm:text-sm font-black transition-all duration-200 ${
                      day.done
                        ? 'bg-gradient-to-tr from-[#0284c7] to-[#00e5ff] text-white shadow-xs shadow-[#00e5ff]/40 scale-105'
                        : day.isToday
                        ? 'border-2 border-dashed border-[#06b6d4] text-[#06b6d4] bg-transparent'
                        : 'bg-[#e2eff3] text-[#7199aa] dark:bg-[#0d222e] dark:text-[#4d798c]'
                    }`}
                  >
                    {day.done ? '✓' : day.label}
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold ${
                      day.isToday
                        ? 'text-[#00e5ff] font-black'
                        : 'text-[#6493a7] dark:text-[#6a97aa]'
                    }`}
                  >
                    {day.isToday ? 'Today' : day.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}