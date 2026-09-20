import { useState } from 'react'
import { Card, TextArea, Button } from '@heroui/react'
import { BookOpen, Sparkles, Check, ChevronDown, ChevronUp, Clock, History } from 'lucide-react'

const PROMPTS = [
  '🌱 What was your biggest win today?',
  '☀️ What are you genuinely grateful for?',
  '💡 What will you do slightly better tomorrow?',
]

const loadHistory = () => {
  try {
    const items = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('habitflow-reflection-')) {
        const dateStr = key.replace('habitflow-reflection-', '')
        const text = localStorage.getItem(key)
        if (text) {
          items.push({ date: dateStr, text })
        }
      }
    }
    return items.sort((a, b) => b.date.localeCompare(a.date))
  } catch {
    return []
  }
}

export default function ReflectionCard({ className = '' }) {
  const todayKey = `habitflow-reflection-${new Date().toISOString().slice(0, 10)}`

  const [reflection, setReflection] = useState(() => {
    try {
      return localStorage.getItem(todayKey) || ''
    } catch {
      return ''
    }
  })

  const [isSaved, setIsSaved] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [historyList, setHistoryList] = useState(loadHistory)

  const handlePromptClick = (prompt) => {
    setReflection((prev) => (prev ? `${prev}\n\n${prompt}\n` : `${prompt}\n`))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!reflection.trim()) return

    try {
      localStorage.setItem(todayKey, reflection.trim())
      setIsSaved(true)
      setHistoryList(loadHistory())
      setTimeout(() => setIsSaved(false), 3500)
    } catch {
      // ignore
    }
  }

  const wordCount = reflection.trim() ? reflection.trim().split(/\s+/).length : 0

  return (
    <Card
      className={`group relative overflow-hidden p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#071924] border border-cyan-100 dark:border-cyan-900/40 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
      id="journal"
    >
      {/* Background ambient accent */}
      <div className="pointer-events-none absolute -right-16 -bottom-16 w-44 h-44 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-cyan-100 dark:border-cyan-900/30 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-[#0c4a6e]/40 flex items-center justify-center text-xl text-cyan-600 dark:text-[#00e5ff] shadow-2xs">
              <BookOpen className="w-5 h-5 text-cyan-600 dark:text-[#00e5ff]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Daily Reflection & Journal
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-700 dark:text-[#00e5ff] bg-cyan-100/70 dark:bg-[#0c4a6e]/50 px-2 py-0.5 rounded-full">
                  Evening
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Close your day with gratitude and clear intention
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSaved && (
              <span className="flex items-center gap-1 text-xs font-bold text-cyan-700 dark:text-[#00e5ff] bg-cyan-50 dark:bg-[#0c4a6e]/50 px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-800 animate-fade-in">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Saved! ✨</span>
              </span>
            )}

            {historyList.length > 0 && (
              <button
                type="button"
                onClick={() => setShowHistory((v) => !v)}
                className="flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#0c2433] transition-colors"
              >
                <History className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>{showHistory ? 'Hide Past' : `Past Notes (${historyList.length})`}</span>
                {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>
        </div>

        {/* Guided prompt suggestions */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Tap a guided prompt to insert:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PROMPTS.map((prompt) => (
              <button
                type="button"
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
                className="rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#0c2433] dark:hover:bg-[#0f2e42] px-3 py-1 text-xs font-medium text-slate-700 dark:text-cyan-200 border border-slate-200 dark:border-cyan-900/50 transition-all hover:scale-102"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Form and textarea */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <TextArea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What went well today? What brought you peace? Write your honest thoughts..."
              rows={4}
              className="w-full rounded-2xl border border-cyan-100 dark:border-cyan-900/50 bg-slate-50 dark:bg-[#06141d] p-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {wordCount} words
            </span>
            <Button
              type="submit"
              variant="solid"
              size="sm"
              disabled={!reflection.trim()}
              className="flex items-center gap-1.5 rounded-2xl px-5 py-2 text-xs font-black bg-gradient-to-r from-[#0284c7] via-[#06b6d4] to-[#00e5ff] text-slate-950 hover:opacity-95 shadow-md shadow-cyan-500/20 disabled:opacity-40 transition-all hover:scale-102"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Save Reflection</span>
            </Button>
          </div>
        </form>

        {/* Past Reflections Collapsible List */}
        {showHistory && (
          <div className="mt-4 pt-4 border-t border-cyan-100 dark:border-cyan-900/30 space-y-3 animate-fade-in">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
              Recent Journal Entries
            </span>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {historyList.map((entry) => (
                <div
                  key={entry.date}
                  className="rounded-2xl bg-slate-50 dark:bg-[#06141d] p-3 border border-cyan-100/70 dark:border-cyan-900/30 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                      {entry.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 whitespace-pre-line">
                    {entry.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}