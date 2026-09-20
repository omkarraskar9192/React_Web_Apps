import { configureStore } from '@reduxjs/toolkit';
import clubReducer from './slices/clubSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    club: clubReducer,
    ui: uiReducer,
  },
});

export default store;

