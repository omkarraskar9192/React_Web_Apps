import { createSlice } from '@reduxjs/toolkit'

const loadInitialUI = () => {
  let isDark = false
  let androidPreview = false
  try {
    isDark = localStorage.getItem('habitflow-theme') === 'dark'
    androidPreview = localStorage.getItem('habitflow-android-mode') === 'true'
  } catch {
    // ignore
  }
  return {
    isDark,
    androidPreview,
    mobileNavOpen: false,
    showComposer: false,
    // Voice Assistant state
    isListening: false,
    isSpeaking: false,
    voiceTranscript: '',
    lastVoiceResponse: '',
    dbStatus: 'local', // 'connected' | 'local' | 'connecting'
    authModalOpen: false,
    syncStatus: 'synced', // 'synced' | 'syncing' | 'offline' | 'pending'
    pendingSyncCount: 0,
  }
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState: loadInitialUI(),
  reducers: {
    setAuthModalOpen: (state, action) => {
      state.authModalOpen = action.payload
    },
    setSyncStatus: (state, action) => {
      state.syncStatus = action.payload
    },
    setPendingSyncCount: (state, action) => {
      state.pendingSyncCount = action.payload
    },
    toggleTheme: (state) => {
      state.isDark = !state.isDark
      try {
        localStorage.setItem('habitflow-theme', state.isDark ? 'dark' : 'light')
        document.documentElement.classList.toggle('dark', state.isDark)
      } catch {
        // ignore
      }
    },
    setTheme: (state, action) => {
      state.isDark = action.payload
      try {
        localStorage.setItem('habitflow-theme', state.isDark ? 'dark' : 'light')
        document.documentElement.classList.toggle('dark', state.isDark)
      } catch {
        // ignore
      }
    },
    toggleAndroidPreview: (state) => {
      state.androidPreview = !state.androidPreview
      try {
        localStorage.setItem('habitflow-android-mode', state.androidPreview ? 'true' : 'false')
      } catch {
        // ignore
      }
    },
    setMobileNavOpen: (state, action) => {
      state.mobileNavOpen = action.payload
    },
    setShowComposer: (state, action) => {
      state.showComposer = action.payload
    },
    setListening: (state, action) => {
      state.isListening = action.payload
    },
    setSpeaking: (state, action) => {
      state.isSpeaking = action.payload
    },
    setVoiceTranscript: (state, action) => {
      state.voiceTranscript = action.payload
    },
    setLastVoiceResponse: (state, action) => {
      state.lastVoiceResponse = action.payload
    },
    setDbStatus: (state, action) => {
      state.dbStatus = action.payload
    },
  },
})

export const {
  toggleTheme,
  setTheme,
  toggleAndroidPreview,
  setMobileNavOpen,
  setShowComposer,
  setListening,
  setSpeaking,
  setVoiceTranscript,
  setLastVoiceResponse,
  setDbStatus,
  setAuthModalOpen,
  setSyncStatus,
  setPendingSyncCount,
} = uiSlice.actions

export default uiSlice.reducer

