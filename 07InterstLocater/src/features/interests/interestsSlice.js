import { createSlice } from '@reduxjs/toolkit';
import { initialInterests } from '../../data/initialInterests';

const STORAGE_KEY = 'passion_compass_interests_v2';

let idSeq = 1000;
const createId = (p = 'id') => `${p}-${++idSeq}`;

const loadSavedInterests = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return initialInterests;
};

const saveToLocalStorage = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // fallback
  }
};

const initialState = {
  items: loadSavedInterests(),
  searchQuery: '',
  categoryFilter: 'All',
  stageFilter: 'All',
  selectedInterestId: null,
};

export const interestsSlice = createSlice({
  name: 'interests',
  initialState,
  reducers: {
    addInterest: (state, action) => {
      const payload = action.payload;
      const parsedMilestones = (payload.milestones || []).map((m) => {
        if (typeof m === 'string') {
          return { id: createId('m'), title: m, completed: false };
        }
        return m;
      });

      const newInterest = {
        id: createId('int'),
        progress: Number(payload.progress) || 15,
        hoursSpent: 0,
        streakDays: 1,
        resources: [],
        ...payload,
        milestones: parsedMilestones,
      };
      state.items.unshift(newInterest);
      saveToLocalStorage(state.items);
    },
    updateInterest: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
        saveToLocalStorage(state.items);
      }
    },
    deleteInterest: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      if (state.selectedInterestId === action.payload) {
        state.selectedInterestId = null;
      }
      saveToLocalStorage(state.items);
    },
    toggleMilestone: (state, action) => {
      const { interestId, milestoneId } = action.payload;
      const interest = state.items.find(item => item.id === interestId);
      if (interest && interest.milestones) {
        const milestone = interest.milestones.find(m => m.id === milestoneId);
        if (milestone) {
          milestone.completed = !milestone.completed;
          const total = interest.milestones.length;
          const completedCount = interest.milestones.filter(m => m.completed).length;
          if (total > 0) {
            interest.progress = Math.min(100, Math.round((completedCount / total) * 100));
            if (interest.progress === 100) {
              interest.stage = 'Mastered';
            } else if (interest.progress > 40) {
              interest.stage = 'Practicing';
            }
          }
          saveToLocalStorage(state.items);
        }
      }
    },
    addMilestone: (state, action) => {
      const { interestId, title } = action.payload;
      const interest = state.items.find(item => item.id === interestId);
      if (interest) {
        if (!interest.milestones) interest.milestones = [];
        interest.milestones.push({
          id: createId('m'),
          title,
          completed: false
        });
        saveToLocalStorage(state.items);
      }
    },
    logActivity: (state, action) => {
      const { interestId, hours, notes } = action.payload;
      const interest = state.items.find(item => item.id === interestId);
      if (interest) {
        const addHrs = Number(hours) || 0;
        interest.hoursSpent = (Number(interest.hoursSpent) || 0) + addHrs;
        interest.streakDays = (Number(interest.streakDays) || 0) + 1;
        if (interest.progress < 95) {
          interest.progress = Math.min(95, interest.progress + Math.max(2, Math.round(addHrs * 1.5)));
        }
        if (notes && notes.trim()) {
          if (!interest.activityNotes) interest.activityNotes = [];
          interest.activityNotes.unshift(notes.trim());
        }
        saveToLocalStorage(state.items);
      }
    },
    updateStage: (state, action) => {
      const { interestId, stage } = action.payload;
      const interest = state.items.find(item => item.id === interestId);
      if (interest) {
        interest.stage = stage;
        saveToLocalStorage(state.items);
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
    },
    setStageFilter: (state, action) => {
      state.stageFilter = action.payload;
    },
    setSelectedInterestId: (state, action) => {
      state.selectedInterestId = action.payload;
    },
    resetDefaults: (state) => {
      state.items = initialInterests;
      saveToLocalStorage(state.items);
    }
  }
});

export const {
  addInterest,
  updateInterest,
  deleteInterest,
  toggleMilestone,
  addMilestone,
  logActivity,
  updateStage,
  setSearchQuery,
  setCategoryFilter,
  setStageFilter,
  setSelectedInterestId,
  resetDefaults
} = interestsSlice.actions;

export default interestsSlice.reducer;
