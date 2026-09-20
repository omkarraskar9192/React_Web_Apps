import { useState } from 'react'
import { Input, Button } from '@heroui/react'
import { Sparkles, Check, X } from 'lucide-react'
import { getIconForHabit, HABIT_PRESETS, HABIT_CATEGORIES } from '../utils/habitIcons'

const colors = [
  { name: 'Neon Aqua', value: 'aqua', color: '#00e5ff', bgLight: '#e0f8fb', textDark: '#0891b2' },
  { name: 'Electric Cyan', value: 'blue', color: '#06b6d4', bgLight: '#e0f2fe', textDark: '#0284c7' },
  { name: 'British Teal', value: 'mint', color: '#0f766e', bgLight: '#ccfbf1', textDark: '#115e59' },
  { name: 'Amber Glow', value: 'yellow', color: '#f59e0b', bgLight: '#fef3c7', textDark: '#b45309' },
  { name: 'Solar Coral', value: 'peach', color: '#f97316', bgLight: '#ffedd5', textDark: '#c2410c' },
  { name: 'Neon Lilac', value: 'lilac', color: '#8b5cf6', bgLight: '#ede9fe', textDark: '#6d28d9' },
]

export default function HabitForm({ onCreate, onCancel }) {
  const [name, setName] = useState('')
  const [detail, setDetail] = useState('')
  const [color, setColor] = useState('aqua')
  const [category, setCategory] = useState('wellness')

  const liveIcon = getIconForHabit(name)

  const handleApplyPreset = (preset) => {
    setName(preset.name)
    setDetail(preset.detail)
    setColor(preset.color || 'aqua')
    setCategory(preset.category)
  }

  const submitHabit = (event) => {
    event.preventDefault()
    if (!name.trim()) return
    onCreate({
      name: name.trim(),
      detail: detail.trim() || 'A non-negotiable daily standard',
      color,
      category,
      icon: liveIcon,
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  const selectedColorObj = colors.find((c) => c.value === color) || colors[0]

  return (
    <form
      onSubmit={submitHabit}
      onKeyDown={handleKeyDown}
      className="space-y-5 rounded-3xl border border-[#cfe6ee] dark:border-[#0e2c3d] bg-white dark:bg-[#071722] p-5 sm:p-6 shadow-xl animate-fade-in"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e2f1f5] dark:border-[#0e2c3d] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#e0f7fa] dark:bg-[#0b2d3c] flex items-center justify-center text-[#0284c7] dark:text-[#00e5ff]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-black text-[#082836] dark:text-[#f0f9ff]">
              Add New Daily Discipline
            </h3>
            <p className="text-[11px] text-[#528499] dark:text-[#8cbacc]">
              Build your streak with relentless consistency
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-full text-[#528499] hover:bg-[#e4f3f7] dark:text-[#7eb6cc] dark:hover:bg-[#0c2432] transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-wider text-[#528499] dark:text-[#7eb6cc]">
          Quick Inspiration Presets
        </label>
        <div className="flex flex-wrap gap-1.5">
          {HABIT_PRESETS.map((preset) => (
            <button
              type="button"
              key={preset.name}
              onClick={() => handleApplyPreset(preset)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-[#e8f4f7] hover:bg-[#d8eff4] dark:bg-[#0c2331] dark:hover:bg-[#123144] text-[#0e3b4d] dark:text-[#d3eef7] transition-all hover:scale-102"
            >
              <span>{preset.icon}</span>
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Inputs grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-[#528499] dark:text-[#7eb6cc]">
            Habit Name *
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-lg select-none pointer-events-none">
              {liveIcon}
            </span>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 5 AM Workout & Cold Shower"
              autoFocus
              className="w-full rounded-2xl border border-[#cfe6ee] dark:border-[#0e2c3d] bg-[#f7fcfe] dark:bg-[#050e14] pl-10 pr-3 py-2.5 text-sm font-semibold text-[#082836] dark:text-[#f0f9ff] placeholder-[#7ea6b7] focus:border-[#00e5ff] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-[#528499] dark:text-[#7eb6cc]">
            Goal / Standard
          </label>
          <Input
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="e.g. 45 mins high intensity"
            className="w-full rounded-2xl border border-[#cfe6ee] dark:border-[#0e2c3d] bg-[#f7fcfe] dark:bg-[#050e14] px-3.5 py-2.5 text-sm font-semibold text-[#082836] dark:text-[#f0f9ff] placeholder-[#7ea6b7] focus:border-[#00e5ff] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Category selector */}
      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-wider text-[#528499] dark:text-[#7eb6cc]">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {HABIT_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
            const isCatActive = category === cat.id
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all ${
                  isCatActive
                    ? 'bg-[#0c4a6e] text-white dark:bg-[#00e5ff] dark:text-[#04141c] shadow-xs scale-102'
                    : 'bg-[#e8f4f7] text-[#48788c] hover:bg-[#d8eff4] dark:bg-[#0c2331] dark:text-[#7eb6cc] dark:hover:bg-[#123144]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Color Swatch Selection */}
      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-wider text-[#528499] dark:text-[#7eb6cc]">
          Accent Glow
        </label>
        <div className="flex flex-wrap items-center gap-2.5">
          {colors.map((option) => {
            const isSelected = color === option.value
            return (
              <button
                type="button"
                key={option.value}
                onClick={() => setColor(option.value)}
                className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  isSelected
                    ? 'ring-2 ring-offset-2 ring-[#00e5ff] dark:ring-offset-[#071722] scale-105 shadow-xs'
                    : 'opacity-70 hover:opacity-100 hover:scale-102'
                }`}
                style={{
                  backgroundColor: option.bgLight,
                  color: option.textDark,
                }}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-2xs"
                  style={{ backgroundColor: option.color }}
                />
                <span>{option.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Live Habit Preview */}
      <div className="rounded-2xl border border-dashed border-[#cfe6ee] dark:border-[#0e2c3d] p-3 bg-[#f7fcfe]/60 dark:bg-[#050e14]/60">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#528499] dark:text-[#7eb6cc] block mb-2">
          Card Live Preview
        </span>
        <div className="flex items-center justify-between rounded-2xl bg-white dark:bg-[#091b26] p-3 border border-[#d2e7ee] dark:border-[#0f3447] shadow-xs">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shadow-2xs"
              style={{ backgroundColor: selectedColorObj.bgLight }}
            >
              <span>{liveIcon}</span>
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#082836] dark:text-[#f0f9ff]">
                {name.trim() || 'Your Discipline Title'}
              </p>
              <p className="text-xs text-[#528499] dark:text-[#7eb6cc]">
                {detail.trim() || 'A non-negotiable daily standard'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#0284c7] bg-[#e0f8fb] dark:bg-[#0a2c3d] dark:text-[#00e5ff] px-2.5 py-0.5 rounded-full">
            Preview
          </span>
        </div>
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#e2f1f5] dark:border-[#0e2c3d]">
        <Button
          type="button"
          onClick={onCancel}
          variant="light"
          size="sm"
          className="rounded-xl px-4 py-2 text-xs font-bold text-[#528499] hover:bg-[#e4f3f7] dark:text-[#7eb6cc] dark:hover:bg-[#0c2432]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="solid"
          size="sm"
          disabled={!name.trim()}
          className="flex items-center gap-1.5 rounded-xl px-6 py-2.5 text-xs font-black bg-[#0c4a6e] text-white hover:bg-[#075985] dark:bg-[#00e5ff] dark:text-[#04141c] dark:hover:bg-[#38bdf8] shadow-sm disabled:opacity-40 transition-all hover:scale-102"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Save Discipline</span>
        </Button>
      </div>
    </form>
  )
}