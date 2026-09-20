import { createSlice } from '@reduxjs/toolkit'

const getDynamicJoinDate = () =>
  new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

const initialUser = {
  name: 'Guest User',
  title: 'Disciplined Achiever',
  bio: 'Building consistency one day, one habit at a time.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
  email: '',
  streakCount: 0,
  bestStreak: 0,
  dailyGoal: 4,
  joinedDate: getDynamicJoinDate(),
  token: null,
  isAuthenticated: false,
}

const loadInitialUser = () => {
  try {
    const saved = localStorage.getItem('habitflow-user')
    const token = localStorage.getItem('habitflow_auth_token')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Unauthenticated guest must always start clean with 0 streak
      if (!token) {
        return {
          ...initialUser,
          streakCount: 0,
          bestStreak: 0,
          token: null,
          isAuthenticated: false,
        }
      }
      return {
        ...parsed,
        token: token || null,
        isAuthenticated: Boolean(token),
      }
    }
    return {
      ...initialUser,
      streakCount: 0,
      bestStreak: 0,
      token: token || null,
      isAuthenticated: Boolean(token),
    }
  } catch {
    return initialUser
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState: loadInitialUser(),
  reducers: {
    loginSuccess: (state, action) => {
      const { user, token } = action.payload
      state.token = token
      state.isAuthenticated = true
      if (user) {
        Object.assign(state, user)
      }
      try {
        localStorage.setItem('habitflow_auth_token', token)
        localStorage.setItem('habitflow-user', JSON.stringify(state))
      } catch {
        // ignore
      }
    },
    logout: (state) => {
      state.token = null
      state.isAuthenticated = false
      state.name = 'Guest User'
      state.email = ''
      state.title = 'Disciplined Achiever'
      state.bio = 'Building consistency one day, one habit at a time.'
      state.streakCount = 0
      state.bestStreak = 0
      state.joinedDate = getDynamicJoinDate()
      try {
        localStorage.removeItem('habitflow_auth_token')
        localStorage.removeItem('habitflow-user')
      } catch {
        // ignore
      }
    },
    updateProfile: (state, action) => {
      Object.assign(state, action.payload)
      try {
        localStorage.setItem('habitflow-user', JSON.stringify(state))
      } catch {
        // ignore
      }
    },
    setStreakCount: (state, action) => {
      state.streakCount = Math.max(0, action.payload)
      if (state.streakCount > (state.bestStreak || 0)) {
        state.bestStreak = state.streakCount
      }
      try {
        localStorage.setItem('habitflow-user', JSON.stringify(state))
      } catch {
        // ignore
      }
    },
    incrementStreak: (state) => {
      state.streakCount += 1
      if (state.streakCount > state.bestStreak) {
        state.bestStreak = state.streakCount
      }
      try {
        localStorage.setItem('habitflow-user', JSON.stringify(state))
      } catch {
        // ignore
      }
    },
    setUserFromDB: (state, action) => {
      if (action.payload) {
        Object.assign(state, action.payload)
      }
    },
  },
})

export const {
  loginSuccess,
  logout,
  updateProfile,
  incrementStreak,
  setStreakCount,
  setUserFromDB,
} = userSlice.actions

export default userSlice.reducer

