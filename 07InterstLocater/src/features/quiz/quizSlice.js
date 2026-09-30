import { createSlice } from '@reduxjs/toolkit';
import { quizQuestions, categoryRecommendations } from '../../data/quizQuestions';

const initialState = {
  currentQuestionIndex: 0,
  answers: {},
  categoryScores: {
    'Tech & Coding': 0,
    'Art & Design': 0,
    'Outdoor & Adventure': 0,
    'Wellness & Mind': 0,
    'Music & Audio': 0,
    'Gastronomy': 0
  },
  isCompleted: false,
  topCategory: null,
  recommendedProfile: null,
};

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    selectOption: (state, action) => {
      const { questionId, optionId, weights } = action.payload;
      state.answers[questionId] = { optionId, weights };
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < quizQuestions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    prevQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    submitQuiz: (state) => {
      const scores = {
        'Tech & Coding': 0,
        'Art & Design': 0,
        'Outdoor & Adventure': 0,
        'Wellness & Mind': 0,
        'Music & Audio': 0,
        'Gastronomy': 0
      };

      Object.values(state.answers).forEach((answer) => {
        if (answer.weights) {
          Object.entries(answer.weights).forEach(([cat, weight]) => {
            if (scores[cat] !== undefined) {
              scores[cat] += weight;
            }
          });
        }
      });

      let topCat = 'Tech & Coding';
      let maxScore = -1;
      Object.entries(scores).forEach(([cat, val]) => {
        if (val > maxScore) {
          maxScore = val;
          topCat = cat;
        }
      });

      state.categoryScores = scores;
      state.topCategory = topCat;
      state.recommendedProfile = categoryRecommendations[topCat] || null;
      state.isCompleted = true;
    },
    restartQuiz: (state) => {
      state.currentQuestionIndex = 0;
      state.answers = {};
      state.categoryScores = {
        'Tech & Coding': 0,
        'Art & Design': 0,
        'Outdoor & Adventure': 0,
        'Wellness & Mind': 0,
        'Music & Audio': 0,
        'Gastronomy': 0
      };
      state.isCompleted = false;
      state.topCategory = null;
      state.recommendedProfile = null;
    }
  }
});

export const { selectOption, nextQuestion, prevQuestion, submitQuiz, restartQuiz } = quizSlice.actions;

export default quizSlice.reducer;
