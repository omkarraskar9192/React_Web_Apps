import { useSelector, useDispatch } from 'react-redux'
import SummaryCards from '../components/SummaryCards'
import HabitList from '../components/HabitList'
import ReflectionCard from '../components/ReflectionCard'
import { toggleHabit, deleteHabit, createHabit } from '../store/habitsSlice'
import { setShowComposer } from '../store/uiSlice'

export default function TodayPage() {
  const dispatch = useDispatch()
  const habits = useSelector((state) => state.habits.habits)
  const showComposer = useSelector((state) => state.ui.showComposer)
  const user = useSelector((state) => state.user)

  const completed = habits.filter(({ done }) => done).length

  // Current date formatting
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  // Time of day greeting
  const currentHour = new Date().getHours()
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening'

  const handleToggle = (id) => {
    dispatch(toggleHabit(id))
  }

  const handleDelete = (id) => {
    dispatch(deleteHabit(id))
  }

  const handleCreate = (habitData) => {
    dispatch(createHabit(habitData))
  }

  return (
    <div className="space-y-7 sm:space-y-9 animate-fade-in">
      {/* Header Greeting */}
      <header id="today" className="space-y-2 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-cyan-700 dark:text-[#38bdf8]">
            {todayStr}
          </span>
          <span className="text-sm text-cyan-400 dark:text-cyan-600">•</span>
          <span className="text-xs sm:text-sm font-black text-[#0284c7] dark:text-[#00e5ff]">
            {greeting}, {user.isAuthenticated ? user.name : 'Disciplinarian'}
          </span>
        </div>

        <div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            Make today count.
          </h1>
          <p className="mt-1.5 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400 max-w-2xl">
            Discipline is built one rep, one task, and one day at a time. Execute without excuses.
          </p>
        </div>
      </header>

      {/* Summary Cards with HeroUI Progress */}
      <SummaryCards
        completed={completed}
        total={habits.length}
        streakCount={user.streakCount}
      />

      <hr className="border-t border-cyan-100 dark:border-cyan-900/40" />

      {/* Habits List */}
      <HabitList
        habits={habits}
        showComposer={showComposer}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onAddClick={() => dispatch(setShowComposer(true))}
        onCreate={handleCreate}
        onCancel={() => dispatch(setShowComposer(false))}
      />

      <hr className="border-t border-cyan-100 dark:border-cyan-900/40" />

      {/* Reflection and Journaling */}
      <ReflectionCard />
    </div>
  )
}

