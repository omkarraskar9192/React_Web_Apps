import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card } from '@heroui/react'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Flame,
  Award,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { setSelectedDate } from '../store/habitsSlice'

export default function CalendarPage() {
  const dispatch = useDispatch()
  const history = useSelector((state) => state.habits.history)
  const habits = useSelector((state) => state.habits.habits)
  const selectedDate = useSelector((state) => state.habits.selectedDate)
  const user = useSelector((state) => state.user)

  // Current calendar viewing month/year
  const [viewDate, setViewDate] = useState(new Date())

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth() // 0-indexed

  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // Days in month calculation
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()

  // Day of week index for 1st day (0 = Sunday, 1 = Monday)
  // We align starting on Monday (0 = Mon, 6 = Sun)
  const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const handleSelectDay = (dayNumber) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`
    dispatch(setSelectedDate(formattedDate))
  }

  const getHabitCreatedDateKey = (createdAt) => {
    if (!createdAt) return ''
    if (typeof createdAt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(createdAt)) {
      return createdAt
    }
    try {
      const d = new Date(createdAt)
      if (isNaN(d.getTime())) return ''
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    } catch {
      return ''
    }
  }

  const isSelectedToday = selectedDate === new Date().toISOString().slice(0, 10)

  // Filter habits that actually existed on selectedDate
  const habitsOnSelectedDay = habits.filter((habit) => {
    if (isSelectedToday) return true
    const createdDate = getHabitCreatedDateKey(habit.createdAt)
    if (!createdDate) return true
    if (createdDate <= selectedDate) return true
    if (habit.completedDates?.includes(selectedDate)) return true
    return false
  })

  // Selected date details
  const selectedHistory =
    history[selectedDate] ||
    (() => {
      const completed = habitsOnSelectedDay.filter((h) => h.completedDates?.includes(selectedDate)).length
      const total = habitsOnSelectedDay.length
      if (completed > 0 && total > 0) {
        return { completed, total, percent: Math.round((completed / total) * 100) }
      }
      return null
    })()
  const isStreakBroken = user.streakCount === 0

  // Monthly summary stats
  const historyEntries = Object.entries(history).filter(([d]) => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`))
  const perfectDays = historyEntries.filter(([, v]) => v.percent === 100).length
  const totalLogged = historyEntries.length
  const monthlyConsistency = totalLogged > 0 ? Math.round((perfectDays / totalLogged) * 100) : 0

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in">
      {/* Header */}
      <header className="space-y-2 pt-1">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-[#0284c7] dark:text-[#38bdf8]">
          <CalendarIcon className="w-4 h-4 text-[#00e5ff]" />
          <span>Calendar & Habit History</span>
        </div>
        <div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            Rhythm & Consistency
          </h1>
          <p className="mt-1.5 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400">
            Review your streak timeline, track progress, and celebrate discipline.
          </p>
        </div>
      </header>

      {/* Monthly Stats Overview */}
      <div className="grid gap-3.5 sm:grid-cols-3">
        <Card className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#071722] border border-[#cfe6ee] dark:border-[#0e2c3d] shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#e0f7fa] dark:bg-[#0b2d3c] flex items-center justify-center text-[#0284c7] dark:text-[#00e5ff]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#528499] dark:text-[#7eb6cc]">
                Perfect Days
              </p>
              <p className="font-display text-2xl sm:text-3xl font-black text-[#082836] dark:text-[#f0f9ff]">
                {perfectDays} days
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#071722] border border-[#cfe6ee] dark:border-[#0e2c3d] shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                isStreakBroken
                  ? 'bg-[#ffe4e6] dark:bg-[#2b1014] text-[#e11d48]'
                  : 'bg-[#e0f8fb] dark:bg-[#092938] text-[#00e5ff]'
              }`}
            >
              {isStreakBroken ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <Flame className="w-6 h-6 fill-[#00e5ff]" />
              )}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#528499] dark:text-[#7eb6cc]">
                Active Streak
              </p>
              <p className="font-display text-2xl sm:text-3xl font-black text-[#082836] dark:text-[#f0f9ff]">
                {user.streakCount} days {isStreakBroken && <span className="text-xs text-rose-500 font-bold">(Broken)</span>}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#071722] border border-[#cfe6ee] dark:border-[#0e2c3d] shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#ede9fe] dark:bg-[#201533] flex items-center justify-center text-[#8b5cf6]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#528499] dark:text-[#7eb6cc]">
                Monthly Flow
              </p>
              <p className="font-display text-2xl sm:text-3xl font-black text-[#082836] dark:text-[#f0f9ff]">
                {monthlyConsistency}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Interactive Calendar Card */}
      <Card className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#071722] border border-[#cfe6ee] dark:border-[#0e2c3d] shadow-sm">
        {/* Month Stepper Header */}
        <div className="flex items-center justify-between border-b border-[#e2f1f5] dark:border-[#0e2c3d] pb-4 mb-4">
          <h2 className="font-serif text-xl sm:text-2xl font-black text-[#082836] dark:text-[#f0f9ff]">
            {monthName}
          </h2>

          <div className="flex items-center gap-1.5 bg-[#e4f3f7] dark:bg-[#0a202d] rounded-full p-1 border border-[#cfe6ee] dark:border-[#0e2c3d]">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#48788c] hover:text-[#082836] dark:text-[#7eb6cc] dark:hover:text-white hover:bg-white dark:hover:bg-[#103448] transition-all"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#48788c] hover:text-[#082836] dark:text-[#7eb6cc] dark:hover:text-white hover:bg-white dark:hover:bg-[#103448] transition-all"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
          {/* Day of Week Labels */}
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="py-2 text-[11px] font-black uppercase tracking-wider text-[#528499] dark:text-[#7eb6cc]"
            >
              {day}
            </div>
          ))}

          {/* Empty padding slots before 1st of month */}
          {Array.from({ length: startDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-12 sm:h-14 opacity-0" />
          ))}

          {/* Days of Month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
            const dayRecord = history[dateKey]
            const isSelected = selectedDate === dateKey
            const isToday = dateKey === new Date().toISOString().slice(0, 10)

            const existedOnDay = habits.filter((h) => {
              if (isToday) return true
              const createdDate = getHabitCreatedDateKey(h.createdAt)
              return !createdDate || createdDate <= dateKey || Boolean(h.completedDates?.includes(dateKey))
            })
            const completedCount = existedOnDay.filter((h) => h.completedDates?.includes(dateKey)).length
            const percentCount = existedOnDay.length > 0 ? Math.round((completedCount / existedOnDay.length) * 100) : 0
            const effectiveRecord = dayRecord || (completedCount > 0 ? { percent: percentCount } : null)

            let statusBadge = null
            if (effectiveRecord) {
              if (effectiveRecord.percent === 100) {
                statusBadge = <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] shadow-xs shadow-[#00e5ff]/50" />
              } else if (effectiveRecord.percent > 0) {
                statusBadge = <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
              }
            }

            return (
              <button
                type="button"
                key={dateKey}
                onClick={() => handleSelectDay(dayNum)}
                className={`relative h-12 sm:h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#0c4a6e] text-white dark:bg-[#00e5ff] dark:text-[#04141c] font-black shadow-sm scale-102 ring-2 ring-[#0c4a6e] dark:ring-[#00e5ff]'
                    : isToday
                    ? 'bg-[#e0f8fb] text-[#0284c7] dark:bg-[#0c2f40] dark:text-[#00e5ff] font-extrabold border border-[#a5f3fc] dark:border-[#0e4f68]'
                    : 'hover:bg-[#e4f3f7] dark:hover:bg-[#0a2331] text-[#0e3b4d] dark:text-[#d3eef7]'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold">{dayNum}</span>
                <div className="h-2 flex items-center justify-center">{statusBadge}</div>
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 pt-4 mt-3 border-t border-[#e2f1f5] dark:border-[#0e2c3d] text-xs text-[#528499] dark:text-[#7eb6cc]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00e5ff]" /> 100% Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Partially Done
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#94c3d4] dark:bg-[#204456]" /> Upcoming / Rest
          </span>
        </div>
      </Card>

      {/* Selected Day Log Details */}
      <Card className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#071722] border border-[#cfe6ee] dark:border-[#0e2c3d] shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e2f1f5] dark:border-[#0e2c3d] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0284c7] dark:text-[#00e5ff]" />
            <h3 className="font-serif text-base sm:text-lg font-black text-[#082836] dark:text-[#f0f9ff]">
              {selectedDate} {isSelectedToday && '(Today)'}
            </h3>
          </div>
          {selectedHistory ? (
            <span className="rounded-full bg-[#e0f8fb] dark:bg-[#092938] px-3 py-1 text-xs font-black text-[#0284c7] dark:text-[#00e5ff] border border-[#a5f3fc] dark:border-[#0e4f68]">
              {selectedHistory.completed} of {selectedHistory.total} Habits Done ({selectedHistory.percent}%)
            </span>
          ) : (
            <span className="text-xs text-[#528499] dark:text-[#7eb6cc]">No record saved</span>
          )}
        </div>

        {/* Day's habit overview */}
        <div className="space-y-2">
          {habitsOnSelectedDay.length === 0 ? (
            <div className="py-6 text-center text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 bg-[#f7fcfe] dark:bg-[#06141d] rounded-2xl border border-dashed border-[#cfe6ee] dark:border-[#0e2c3d]">
              No habits were active on this day.
            </div>
          ) : (
            habitsOnSelectedDay.map((habit) => {
              const isDoneOnDay = isSelectedToday ? habit.done : Boolean(habit.completedDates?.includes(selectedDate))
              return (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#f7fcfe] dark:bg-[#06141d] border border-[#d2e7ee] dark:border-[#0e2c3d]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{habit.icon}</span>
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold text-[#082836] dark:text-[#f0f9ff]">
                        {habit.name}
                      </p>
                      <p className="text-[11px] text-[#528499] dark:text-[#7eb6cc]">{habit.detail}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                      isDoneOnDay
                        ? 'bg-[#e0f8fb] text-[#0284c7] dark:bg-[#0a2d3e] dark:text-[#00e5ff]'
                        : 'bg-[#e8f4f7] text-[#528499] dark:bg-[#0c2331] dark:text-[#7eb6cc]'
                    }`}
                  >
                    {isDoneOnDay ? '✓ Done' : 'Pending'}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </Card>
    </div>
  )
}

