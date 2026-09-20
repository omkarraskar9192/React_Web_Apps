import { createSlice } from '@reduxjs/toolkit'
import { getIconForHabit } from '../utils/habitIcons'
import {
  saveHabitAPI,
  updateHabitAPI,
  deleteHabitAPI,
  saveHistoryRecordAPI,
} from '../services/api'

// Format local date string YYYY-MM-DD
export const getTodayKey = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Get previous day YYYY-MM-DD from given date string
export const getYesterdayKey = (dateKey = getTodayKey()) => {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() - 1)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Accurately calculate a single habit's consecutive streak
export const calculateHabitStreak = (completedDates = [], todayKey = getTodayKey()) => {
  if (!Array.isArray(completedDates) || completedDates.length === 0) return 0
  const set = new Set(completedDates)
  const doneToday = set.has(todayKey)
  const yesterdayKey = getYesterdayKey(todayKey)
  const doneYesterday = set.has(yesterdayKey)

  // If not completed yesterday and not completed today, streak is broken!
  if (!doneToday && !doneYesterday) {
    return 0
  }

  let count = 0
  let checkDate = doneToday ? todayKey : yesterdayKey

  while (set.has(checkDate)) {
    count++
    checkDate = getYesterdayKey(checkDate)
  }

  return count
}

// Calculate overall consistency streak across all habits
export const calculateOverallStreak = (history = {}, habits = [], todayKey = getTodayKey()) => {
  const todayCompleted = habits.filter((h) => h.done).length
  const todayTotal = habits.length
  // Today is considered complete if all habits are finished and total > 0
  const isTodayDone = todayTotal > 0 && todayCompleted === todayTotal

  const yesterdayKey = getYesterdayKey(todayKey)
  const yesterdayRecord = history[yesterdayKey]
  const isYesterdayDone = Boolean(yesterdayRecord && yesterdayRecord.percent === 100)

  // If yesterday was NOT completed and today is NOT completed, streak is broken!
  if (!isTodayDone && !isYesterdayDone) {
    return 0
  }

  let count = 0
  let checkDate = isTodayDone ? todayKey : yesterdayKey

  while (true) {
    if (checkDate === todayKey) {
      if (isTodayDone) {
        count++
        checkDate = getYesterdayKey(checkDate)
      } else {
        break
      }
    } else {
      const rec = history[checkDate]
      if (rec && rec.percent === 100) {
        count++
        checkDate = getYesterdayKey(checkDate)
      } else {
        break
      }
    }
  }

  return count
}

const initialHabits = [
  {
    id: 1,
    name: 'Morning sun & walk',
    detail: '15 mins in natural outdoor sunlight',
    icon: '☀️',
    color: 'yellow',
    category: 'wellness',
    completedDates: [],
    done: false,
    streak: 0,
    frequency: 'daily',
    createdAt: getTodayKey(),
  },
  {
    id: 2,
    name: 'Movement & workout',
    detail: '30 mins functional movement',
    icon: '💪',
    color: 'peach',
    category: 'fitness',
    completedDates: [],
    done: false,
    streak: 0,
    frequency: 'daily',
    createdAt: getTodayKey(),
  },
  {
    id: 3,
    name: 'Deep reading',
    detail: '20 pages of quiet reading',
    icon: '📖',
    color: 'lilac',
    category: 'mind',
    completedDates: [],
    done: false,
    streak: 0,
    frequency: 'daily',
    createdAt: getTodayKey(),
  },
  {
    id: 4,
    name: 'No screens past 10 PM',
    detail: 'Wind down gently for restorative sleep',
    icon: '📵',
    color: 'mint',
    category: 'routine',
    completedDates: [],
    done: false,
    streak: 0,
    frequency: 'daily',
    createdAt: getTodayKey(),
  },
]

const initialHistory = {}

const loadInitialState = () => {
  const todayKey = getTodayKey()
  try {
    const savedHabitsRaw = localStorage.getItem('habitflow-habits')
    const savedHistoryRaw = localStorage.getItem('habitflow-history')
    const savedLastDate = localStorage.getItem('habitflow-last-date')

    const token = localStorage.getItem('habitflow_auth_token')
    const purgeGuestKey = 'habitflow_guest_raw_cleaned_v4'
    if (!token && !localStorage.getItem(purgeGuestKey)) {
      localStorage.setItem(purgeGuestKey, 'true')
      const cleanHabits = initialHabits.map((h) => ({
        ...h,
        completedDates: [],
        done: false,
        streak: 0,
        createdAt: todayKey,
      }))
      try {
        localStorage.setItem('habitflow-habits', JSON.stringify(cleanHabits))
        localStorage.setItem('habitflow-history', JSON.stringify({}))
        localStorage.setItem('habitflow-last-date', todayKey)
      } catch {
        // ignore
      }
      return {
        habits: cleanHabits,
        history: {},
        filter: 'all',
        selectedDate: todayKey,
        lastActiveDate: todayKey,
      }
    }

    // If completely new user / no local storage, start with zero raw data and zero streak
    if (!savedHabitsRaw) {
      return {
        habits: initialHabits.map((h) => ({
          ...h,
          completedDates: [],
          done: false,
          streak: 0,
          createdAt: todayKey,
        })),
        history: {},
        filter: 'all',
        selectedDate: todayKey,
        lastActiveDate: todayKey,
      }
    }

    let habits = JSON.parse(savedHabitsRaw)
    let history = savedHistoryRaw ? JSON.parse(savedHistoryRaw) : {}

    // Clean legacy test history dates if present
    const legacyDummyDates = ['2026-09-03', '2026-09-04', '2026-09-05', '2026-09-06', '2026-09-07', '2026-09-08']
    legacyDummyDates.forEach((d) => {
      delete history[d]
    })

    const isNewDay = savedLastDate && savedLastDate !== todayKey

    habits = habits.map((h) => {
      const completedDates = Array.isArray(h.completedDates) ? [...h.completedDates] : []
      // If habit was legitimately completed on savedLastDate, ensure savedLastDate is recorded
      if (h.done && isNewDay && savedLastDate && !completedDates.includes(savedLastDate)) {
        completedDates.push(savedLastDate)
      }

      // Today is completed ONLY if today was checked
      const done = completedDates.includes(todayKey)
      const streak = calculateHabitStreak(completedDates, todayKey)

      return {
        ...h,
        completedDates,
        done,
        streak,
      }
    })

    // If new day, save yesterday's completion status into history only if there were actual completed habits
    if (isNewDay && savedLastDate) {
      const completedCount = habits.filter((h) => h.completedDates?.includes(savedLastDate)).length
      const totalCount = habits.length
      if (completedCount > 0 && totalCount > 0) {
        const percent = Math.round((completedCount / totalCount) * 100)
        history[savedLastDate] = { date: savedLastDate, completed: completedCount, total: totalCount, percent }
      }
    }

    // Save updated normalized state
    try {
      localStorage.setItem('habitflow-habits', JSON.stringify(habits))
      localStorage.setItem('habitflow-history', JSON.stringify(history))
      localStorage.setItem('habitflow-last-date', todayKey)
    } catch {
      // ignore
    }

    return {
      habits,
      history,
      filter: 'all',
      selectedDate: todayKey,
      lastActiveDate: todayKey,
    }
  } catch {
    return {
      habits: initialHabits.map((h) => ({
        ...h,
        completedDates: [],
        done: false,
        streak: 0,
        createdAt: todayKey,
      })),
      history: {},
      filter: 'all',
      selectedDate: todayKey,
      lastActiveDate: todayKey,
    }
  }
}

const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem('habitflow-habits', JSON.stringify(state.habits))
    localStorage.setItem('habitflow-history', JSON.stringify(state.history))
    localStorage.setItem('habitflow-last-date', state.lastActiveDate || getTodayKey())
  } catch {
    // ignore
  }
}

export const habitsSlice = createSlice({
  name: 'habits',
  initialState: loadInitialState(),
  reducers: {
    // Check if day changed (e.g. at midnight or app reopened the next day)
    checkDateRollover: (state) => {
      const todayKey = getTodayKey()
      if (state.lastActiveDate !== todayKey) {
        const prevDate = state.lastActiveDate || getYesterdayKey(todayKey)

        // Make sure habits completed yesterday include prevDate in completedDates
        state.habits.forEach((h) => {
          if (!Array.isArray(h.completedDates)) h.completedDates = []
          if (h.done && prevDate && !h.completedDates.includes(prevDate)) {
            h.completedDates.push(prevDate)
          }
        })

        // Save previous date record into history
        const completedCount = state.habits.filter((h) => h.completedDates?.includes(prevDate)).length
        const totalCount = state.habits.length
        const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
        if (prevDate && (!state.history[prevDate] || state.history[prevDate].completed < completedCount)) {
          if (completedCount > 0) {
            const record = { date: prevDate, completed: completedCount, total: totalCount, percent }
            state.history[prevDate] = record
            saveHistoryRecordAPI(record)
          }
        }

        // Reset done status for all habits on the fresh new day
        state.habits = state.habits.map((h) => {
          const completedDates = h.completedDates || []
          const done = completedDates.includes(todayKey)
          const streak = calculateHabitStreak(completedDates, todayKey)
          return {
            ...h,
            done,
            streak,
          }
        })

        state.lastActiveDate = todayKey
        state.selectedDate = todayKey
        saveToLocalStorage(state)
      }
    },

    toggleHabit: (state, action) => {
      const id = action.payload
      const habit = state.habits.find((h) => h.id === id)
      if (habit) {
        const todayKey = getTodayKey()
        habit.completedDates = Array.isArray(habit.completedDates) ? habit.completedDates : []

        habit.done = !habit.done

        if (habit.done) {
          if (!habit.completedDates.includes(todayKey)) {
            habit.completedDates.push(todayKey)
          }
        } else {
          habit.completedDates = habit.completedDates.filter((d) => d !== todayKey)
        }

        // Recalculate streak based on unbroken consecutive history
        habit.streak = calculateHabitStreak(habit.completedDates, todayKey)

        const completedCount = state.habits.filter((h) => h.done).length
        const totalCount = state.habits.length
        const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

        state.history[todayKey] = {
          completed: completedCount,
          total: totalCount,
          percent,
        }
        state.lastActiveDate = todayKey
        saveToLocalStorage(state)

        // Background sync to MongoDB API
        updateHabitAPI(habit.id, {
          done: habit.done,
          streak: habit.streak,
          completedDates: habit.completedDates,
        })
        saveHistoryRecordAPI({
          date: todayKey,
          completed: completedCount,
          total: totalCount,
          percent,
        })
      }
    },

    createHabit: (state, action) => {
      const { name, detail, color, category, icon, frequency } = action.payload
      const trimmedName = (name || '').trim()
      if (!trimmedName) return

      // Prevent adding duplicate habit with the same name
      const alreadyExists = state.habits.some(
        (h) => (h.name || '').toLowerCase().trim() === trimmedName.toLowerCase()
      )
      if (alreadyExists) return

      const todayKey = getTodayKey()
      const newHabit = {
        id: Date.now(),
        name: trimmedName,
        detail: detail?.trim() || 'A small daily action',
        icon: icon || getIconForHabit(trimmedName),
        color: color || 'mint',
        category: category || 'wellness',
        frequency: frequency || 'daily',
        completedDates: [],
        done: false,
        streak: 0,
        createdAt: todayKey,
      }
      state.habits.unshift(newHabit)
      saveToLocalStorage(state)

      // Background sync to MongoDB API
      saveHabitAPI(newHabit)
    },

    updateHabit: (state, action) => {
      const updated = action.payload
      const index = state.habits.findIndex((h) => h.id === updated.id)
      if (index !== -1) {
        state.habits[index] = { ...state.habits[index], ...updated }
        saveToLocalStorage(state)
        updateHabitAPI(updated.id, updated)
      }
    },

    deleteHabit: (state, action) => {
      const id = action.payload
      state.habits = state.habits.filter((h) => h.id !== id)
      saveToLocalStorage(state)

      // Background sync to MongoDB API
      deleteHabitAPI(id)
    },

    setFilter: (state, action) => {
      state.filter = action.payload
    },

    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload
    },

    setHabitsFromDB: (state, action) => {
      if (Array.isArray(action.payload)) {
        const todayKey = getTodayKey()
        const yesterdayKey = getYesterdayKey(todayKey)
        // Deduplicate incoming habits by normalized name
        const seenNames = new Set()
        const unique = []
        for (const h of action.payload) {
          const key = (h.name || '').toLowerCase().trim()
          if (key && !seenNames.has(key)) {
            seenNames.add(key)
            unique.push(h)
          } else if (!key) {
            unique.push(h)
          }
        }

        state.habits = unique.map((h) => ({
          ...h,
          completedDates: Array.isArray(h.completedDates) ? h.completedDates : (h.done ? [todayKey] : []),
          done: Array.isArray(h.completedDates) ? h.completedDates.includes(todayKey) : Boolean(h.done),
          streak: calculateHabitStreak(h.completedDates, todayKey),
        }))
        state.habits = unique.map((h) => {
          const completedDates = Array.isArray(h.completedDates) ? [...h.completedDates] : []
          // If legacy habit had done: true in DB without completedDates, it was done yesterday
          if (h.done && completedDates.length === 0) {
            completedDates.push(yesterdayKey)
          }
          // Today's done state is true ONLY if todayKey is present in completedDates
          const done = completedDates.includes(todayKey)
          const streak = calculateHabitStreak(completedDates, todayKey)

          return {
            ...h,
            completedDates,
            done,
            streak,
          }
        })

        // Ensure yesterday's completion is reflected in state.history if missing
        if (!state.history[yesterdayKey]) {
          const completedYesterday = state.habits.filter((h) => h.completedDates?.includes(yesterdayKey)).length
          const totalYesterday = state.habits.length
          if (completedYesterday > 0 && totalYesterday > 0) {
            const percent = Math.round((completedYesterday / totalYesterday) * 100)
            state.history[yesterdayKey] = {
              date: yesterdayKey,
              completed: completedYesterday,
              total: totalYesterday,
              percent,
            }
          }
        }

        saveToLocalStorage(state)
      }
    },

    setHistoryFromDB: (state, action) => {
      if (action.payload) {
        state.history = { ...state.history, ...action.payload }
        saveToLocalStorage(state)
      }
    },

    resetHabitsOnLogout: (state) => {
      state.habits = initialHabits.map((h) => ({
        ...h,
        completedDates: [],
        done: false,
        streak: 0,
      }))
      state.history = {}
      try {
        localStorage.removeItem('habitflow-history')
        localStorage.removeItem('habitflow-habits')
      } catch {
        // ignore
      }
      saveToLocalStorage(state)
    },
  },
})

export const {
  checkDateRollover,
  toggleHabit,
  createHabit,
  updateHabit,
  deleteHabit,
  setFilter,
  setSelectedDate,
  setHabitsFromDB,
  setHistoryFromDB,
  resetHabitsOnLogout,
} = habitsSlice.actions

export default habitsSlice.reducer
