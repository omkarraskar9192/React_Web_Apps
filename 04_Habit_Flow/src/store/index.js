import { configureStore } from '@reduxjs/toolkit'
import habitsReducer from './habitsSlice'
import userReducer from './userSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    user: userReducer,
    ui: uiReducer,
  },
})

export default store

