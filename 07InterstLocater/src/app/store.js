import { configureStore } from '@reduxjs/toolkit';
import interestsReducer from '../features/interests/interestsSlice';
import quizReducer from '../features/quiz/quizSlice';
import constellationReducer from '../features/constellation/constellationSlice';

export const store = configureStore({
  reducer: {
    interests: interestsReducer,
    quiz: quizReducer,
    constellation: constellationReducer,
  },
});

export default store;
