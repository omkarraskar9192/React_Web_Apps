import { useState } from 'react'
import { Card, Button } from '@heroui/react'
import { Plus, Trash2, Check, Flame } from 'lucide-react'
import HabitForm from './HabitForm'
import { getIconForHabit } from '../utils/habitIcons'

const colorStyles = {
  mint: { bg: '#e0f8fb', text: '#0891b2', border: '#b2f2fa', darkBg: '#082837', darkText: '#00e5ff' },
  aqua: { bg: '#e0f8fb', text: '#0891b2', border: '#b2f2fa', darkBg: '#082837', darkText: '#00e5ff' },
  blue: { bg: '#e0f2fe', text: '#0284c7', border: '#bae6fd', darkBg: '#092334', darkText: '#38bdf8' },
  yellow: { bg: '#fef3c7', text: '#d97706', border: '#fde68a', darkBg: '#35250c', darkText: '#fbbf24' },
  peach: { bg: '#ffedd5', text: '#ea580c', border: '#fed7aa', darkBg: '#371c10', darkText: '#fb923c' },
  lilac: { bg: '#ede9fe', text: '#7c3aed', border: '#ddd6fe', darkBg: '#251b3a', darkText: '#c084fc' },
}

function HabitCard({ habit, onToggle, onDelete }) {
  const scheme = colorStyles[habit.color] || colorStyles.aqua
  const hasActiveStreak = (habit.streak || 0) > 0

  return (
    <Card
      onClick={() => onToggle(habit.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle(habit.id)
        }
      }}
      className={`group relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 lg:p-5.5 rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer select-none active:scale-[0.99] ${
        habit.done
          ? 'bg-[#f0f9fc]/80 dark:bg-[#071722]/85 border-[#cfe6ee] dark:border-[#0e2c3d]'
          : 'bg-white dark:bg-[#081e2b] border-[#d2e7ee] dark:border-[#0f3447] hover:border-[#00e5ff] dark:hover:border-[#00e5ff] shadow-2xs hover:shadow-lg'
      }`}
    >
      {/* Left side: Checkbox + Big Icon + Habit Info */}
      <div className="flex items-center gap-3.5 sm:gap-4.5 min-w-0 flex-1">
        {/* Toggle check button with checkmark */}
        <button
          type="button"
          className={`w-9 h-9 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-300 ${
            habit.done
              ? 'bg-gradient-to-tr from-[#0284c7] via-[#06b6d4] to-[#00e5ff] text-slate-950 shadow-md shadow-[#00e5ff]/40 scale-95'
              : 'border-2 border-[#8ebccf] dark:border-[#1a475c] group-hover:border-[#00e5ff] bg-cyan-50/50 dark:bg-[#071924] group-hover:scale-105'
          }`}
          onClick={(e) => {
            e.stopPropagation()
            onToggle(habit.id)
          }}
          aria-label={`Mark ${habit.name} as ${habit.done ? 'incomplete' : 'complete'}`}
        >
          {habit.done && <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3.5] animate-fade-in text-slate-950" />}
        </button>

        {/* Habit icon badge */}
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center rounded-2xl transition-transform group-hover:scale-105 duration-200 shadow-2xs"
          style={{
            backgroundColor: scheme.bg,
          }}
        >
          <span className="text-2xl sm:text-3xl select-none">
            {habit.icon || getIconForHabit(habit.name)}
          </span>
        </div>

        {/* Habit Details */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`font-display text-base sm:text-lg lg:text-xl font-black tracking-tight transition-colors duration-200 ${
                habit.done
                  ? 'text-slate-400 dark:text-slate-500 line-through decoration-[#00e5ff]/60 decoration-2'
                  : 'text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-[#00e5ff]'
              }`}
            >
              {habit.name}
            </h3>
            {habit.category && (
              <span className="rounded-full bg-cyan-100/70 dark:bg-[#0c2f40] px-2.5 py-0.5 text-[10px] sm:text-[11px] font-extrabold text-cyan-800 dark:text-[#38bdf8] uppercase tracking-wider">
                {habit.category}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {habit.detail}
          </p>
        </div>
      </div>

      {/* Right side: Streak Badge + Status Pill + Delete Action */}
      <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/60">
        {/* Streak indicator */}
        {hasActiveStreak ? (
          <span className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#0284c7] dark:text-[#00e5ff] bg-cyan-50 dark:bg-[#0b2938] px-3 py-1.5 rounded-full border border-cyan-200 dark:border-cyan-800 shadow-2xs">
            <Flame className="w-3.5 h-3.5 fill-[#00e5ff] text-[#00e5ff]" />
            <span>{habit.streak}d streak</span>
          </span>
        ) : (
          <span className="inline-flex items-center text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-[#0a1e2a] px-2.5 py-1 rounded-full border border-slate-200 dark:border-cyan-950">
            0d streak
          </span>
        )}

        {/* Completion Status Badge */}
        {habit.done ? (
          <span className="flex items-center gap-1.5 rounded-full bg-cyan-100/90 dark:bg-[#00e5ff]/20 px-3.5 py-1.5 text-xs sm:text-sm font-black text-cyan-900 dark:text-[#00e5ff] border border-cyan-300 dark:border-cyan-600 shadow-2xs">
            <Check className="w-3.5 h-3.5 stroke-[3.5]" />
            <span>Completed</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-[#092230] px-3.5 py-1.5 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-cyan-900/60 group-hover:border-cyan-400 dark:group-hover:border-[#00e5ff] group-hover:text-cyan-700 dark:group-hover:text-[#00e5ff] transition-all">
            <span>Mark Done</span>
          </span>
        )}

        {/* Delete button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(habit.id)
          }}
          className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-all hover:scale-110"
          aria-label={`Delete ${habit.name}`}
          title="Delete habit"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </Card>
  )
}

export default function HabitList({
  habits,
  showComposer,
  onToggle,
  onDelete,
  onAddClick,
  onCreate,
  onCancel,
}) {
  const [filter, setFilter] = useState('all') // 'all', 'active', 'completed'

  const completedHabits = habits.filter((h) => h.done)
  const activeHabits = habits.filter((h) => !h.done)

  const filteredHabits = habits.filter((habit) => {
    if (filter === 'active') return !habit.done
    if (filter === 'completed') return habit.done
    return true
  })

  const isAllComplete = habits.length > 0 && completedHabits.length === habits.length

  return (
    <div className="space-y-4">
      {/* Section Header & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[#082836] dark:text-[#f0f9ff]">
              Daily Disciplines
            </h2>
            <span className="rounded-full bg-[#deeff4] dark:bg-[#0c2636] px-3 py-0.5 text-xs sm:text-sm font-black text-[#0369a1] dark:text-[#38bdf8]">
              {habits.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-[#528499] dark:text-[#8cbacc] mt-1">
            Non-negotiable daily standards built for unstoppable momentum
          </p>
        </div>

        {!showComposer && (
          <Button
            onClick={onAddClick}
            variant="solid"
            size="sm"
            className="self-start sm:self-auto flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs sm:text-sm font-black bg-[#0c4a6e] text-white hover:bg-[#075985] dark:bg-[#00e5ff] dark:text-[#04141c] dark:hover:bg-[#38bdf8] shadow-sm transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Habit</span>
          </Button>
        )}
      </div>

      {/* Habit Composer form if open */}
      {showComposer && <HabitForm onCreate={onCreate} onCancel={onCancel} />}

      {/* Filter Tabs */}
      {habits.length > 0 && (
        <div className="flex items-center justify-between gap-2 border-b border-[#cfe6ee] dark:border-[#0e2c3d] pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`rounded-xl px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-extrabold transition-all ${
                filter === 'all'
                  ? 'bg-[#0c4a6e] text-white dark:bg-[#00e5ff] dark:text-[#04141c] shadow-2xs'
                  : 'text-[#528499] hover:bg-[#e4f3f7] dark:text-[#7eb6cc] dark:hover:bg-[#0b2432]'
              }`}
            >
              All ({habits.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('active')}
              className={`rounded-xl px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-extrabold transition-all ${
                filter === 'active'
                  ? 'bg-[#0c4a6e] text-white dark:bg-[#00e5ff] dark:text-[#04141c] shadow-2xs'
                  : 'text-[#528499] hover:bg-[#e4f3f7] dark:text-[#7eb6cc] dark:hover:bg-[#0b2432]'
              }`}
            >
              To Do ({activeHabits.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`rounded-xl px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-extrabold transition-all ${
                filter === 'completed'
                  ? 'bg-[#0c4a6e] text-white dark:bg-[#00e5ff] dark:text-[#04141c] shadow-2xs'
                  : 'text-[#528499] hover:bg-[#e4f3f7] dark:text-[#7eb6cc] dark:hover:bg-[#0b2432]'
              }`}
            >
              Completed ({completedHabits.length})
            </button>
          </div>
        </div>
      )}

      {/* 100% Complete celebratory banner */}
      {isAllComplete && (
        <div className="flex items-center gap-3.5 rounded-3xl bg-gradient-to-r from-[#e0f8fb] to-[#d4f3f9] dark:from-[#092938] dark:to-[#071f2b] p-5 border border-[#a5f3fc] dark:border-[#0e4f68] shadow-xs animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#0b3347] flex items-center justify-center text-3xl shadow-2xs shrink-0">
            🏆
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black text-[#0369a1] dark:text-[#00e5ff]">
              Full Daily Target Achieved!
            </h4>
            <p className="text-xs sm:text-sm text-[#528499] dark:text-[#a0d6eb]">
              You completed every single task scheduled for today. Respect the discipline!
            </p>
          </div>
        </div>
      )}

      {/* Habit Cards List */}
      <div className="space-y-3.5 sm:space-y-4">
        {filteredHabits.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#cfe6ee] dark:border-[#0e2c3d] py-12 px-6 text-center bg-[#f7fcfe]/60 dark:bg-[#071824]/60">
            <span className="text-4xl mb-3">⚡</span>
            <p className="text-base font-extrabold text-[#082836] dark:text-[#f0f9ff]">
              {filter === 'completed'
                ? 'No habits completed yet today'
                : filter === 'active'
                ? 'No pending habits remaining!'
                : 'No habits scheduled for today'}
            </p>
            <p className="text-xs text-[#528499] dark:text-[#7eb6cc] mt-1 max-w-sm">
              {filter === 'completed'
                ? 'Check off your first task above to record your progress.'
                : 'Consistency is your edge. Set your first habit and start executing!'}
            </p>
            {filter === 'all' && (
              <Button
                onClick={onAddClick}
                variant="light"
                size="sm"
                className="mt-4 rounded-xl px-4 py-2 text-xs font-black text-[#0284c7] dark:text-[#00e5ff] bg-[#e0f7fa] dark:bg-[#0b2d3c] border border-[#a5f3fc] dark:border-[#0e485e]"
              >
                + Create your first habit
              </Button>
            )}
          </div>
        ) : (
          filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}