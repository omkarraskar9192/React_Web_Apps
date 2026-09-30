import { createSlice } from '@reduxjs/toolkit';
import { constellationNodes } from '../../data/constellationData';

const initialState = {
  selectedCategoryId: null,
  activeDetailNode: null,
  hoveredNodeId: null,
};

export const constellationSlice = createSlice({
  name: 'constellation',
  initialState,
  reducers: {
    selectCategory: (state, action) => {
      state.selectedCategoryId = action.payload;
      const node = constellationNodes.find(n => n.id === action.payload || n.category === action.payload);
      state.activeDetailNode = node || null;
    },
    setActiveDetailNode: (state, action) => {
      state.activeDetailNode = action.payload;
      if (action.payload) {
        state.selectedCategoryId = action.payload.category;
      }
    },
    clearActiveDetailNode: (state) => {
      state.activeDetailNode = null;
    },
    setHoveredNodeId: (state, action) => {
      state.hoveredNodeId = action.payload;
    }
  }
});

export const { selectCategory, setActiveDetailNode, clearActiveDetailNode, setHoveredNodeId } = constellationSlice.actions;

export default constellationSlice.reducer;
