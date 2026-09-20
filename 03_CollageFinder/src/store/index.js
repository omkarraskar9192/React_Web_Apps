import { configureStore } from '@reduxjs/toolkit'
import collegesReducer from './slices/collegesSlice'
import cutoffsReducer from './slices/cutoffsSlice'
import authReducer from './slices/authSlice'

const store = configureStore({
  reducer: {
    colleges: collegesReducer,
    cutoffs: cutoffsReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store