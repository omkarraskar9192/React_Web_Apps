import { createSlice } from '@reduxjs/toolkit'

const getInitialAuthState = () => {
  try {
    const savedUser = localStorage.getItem('collegeFinder_adminUser')
    const token = localStorage.getItem('collegeFinder_adminToken')
    if (savedUser && token) {
      return {
        isAuthenticated: true,
        user: JSON.parse(savedUser),
        token,
        error: null,
        loading: false
      }
    }
  } catch (e) {
    console.warn('Could not read admin session', e)
  }

  return {
    isAuthenticated: false,
    user: null,
    token: null,
    error: null,
    loading: false
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialAuthState(),
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.error = null

      localStorage.setItem('collegeFinder_adminUser', JSON.stringify(action.payload.user))
      localStorage.setItem('collegeFinder_adminToken', action.payload.token)
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.isAuthenticated = false
      state.user = null
      state.token = null
      state.error = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
      state.error = null
      state.loading = false

      localStorage.removeItem('collegeFinder_adminUser')
      localStorage.removeItem('collegeFinder_adminToken')
    },
    clearAuthError: (state) => {
      state.error = null
    }
  }
})

export const { loginStart, loginSuccess, loginFailure, logout, clearAuthError } = authSlice.actions

// Thunk for simulated secure login
export const loginAdmin = ({ email, password }) => async (dispatch) => {
  dispatch(loginStart())

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  const cleanEmail = email.trim().toLowerCase()

  // Allowed admin credentials check
  // You can change or add allowed admin email addresses here
  if (
    (cleanEmail === 'admin@collegefinder.com' && password === 'admin123') ||
    (cleanEmail.endsWith('@collegefinder.com') && password.length >= 6) ||
    (cleanEmail === 'admin@admin.com' && password === 'admin')
  ) {
    const user = {
      email: cleanEmail,
      name: cleanEmail.split('@')[0].toUpperCase() + ' (Admin)',
      role: 'SUPER_ADMIN',
      lastLogin: new Date().toISOString()
    }
    const token = 'cf_token_' + Date.now() + '_' + Math.random().toString(36).substring(2)

    dispatch(loginSuccess({ user, token }))
    return { success: true }
  } else {
    const errorMsg = 'Invalid Admin email or password. Use demo credentials (admin@collegefinder.com / admin123)'
    dispatch(loginFailure(errorMsg))
    return { success: false, error: errorMsg }
  }
}

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAdminUser = (state) => state.auth.user
export const selectAuthError = (state) => state.auth.error
export const selectAuthLoading = (state) => state.auth.loading

export default authSlice.reducer

