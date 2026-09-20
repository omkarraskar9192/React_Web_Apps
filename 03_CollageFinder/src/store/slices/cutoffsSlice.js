import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Mock cutoff records for colleges
const initialCutoffs = [
  // IIT Delhi (collegeId: '1')
  {
    id: '1',
    collegeId: '1',
    branch: 'Computer Science and Engineering',
    examType: 'JEE Advanced',
    year: 2024,
    openingRank: 1,
    closingRank: 115,
    categoryCutoffs: {
      General: 115,
      OBC: 65,
      SC: 32,
      ST: 18,
      EWS: 98
    }
  },
  {
    id: '2',
    collegeId: '1',
    branch: 'Electrical Engineering',
    examType: 'JEE Advanced',
    year: 2024,
    openingRank: 120,
    closingRank: 580,
    categoryCutoffs: {
      General: 580,
      OBC: 340,
      SC: 180,
      ST: 95,
      EWS: 450
    }
  },
  {
    id: '3',
    collegeId: '1',
    branch: 'Mechanical Engineering',
    examType: 'JEE Advanced',
    year: 2024,
    openingRank: 600,
    closingRank: 1750,
    categoryCutoffs: {
      General: 1750,
      OBC: 820,
      SC: 460,
      ST: 280,
      EWS: 1400
    }
  },

  // IIT Bombay (collegeId: '2')
  {
    id: '4',
    collegeId: '2',
    branch: 'Computer Science and Engineering',
    examType: 'JEE Advanced',
    year: 2024,
    openingRank: 1,
    closingRank: 68,
    categoryCutoffs: {
      General: 68,
      OBC: 35,
      SC: 20,
      ST: 12,
      EWS: 55
    }
  },
  {
    id: '5',
    collegeId: '2',
    branch: 'Electrical Engineering',
    examType: 'JEE Advanced',
    year: 2024,
    openingRank: 80,
    closingRank: 450,
    categoryCutoffs: {
      General: 450,
      OBC: 230,
      SC: 140,
      ST: 80,
      EWS: 380
    }
  },
  {
    id: '6',
    collegeId: '2',
    branch: 'Aerospace Engineering',
    examType: 'JEE Advanced',
    year: 2024,
    openingRank: 500,
    closingRank: 2400,
    categoryCutoffs: {
      General: 2400,
      OBC: 1200,
      SC: 690,
      ST: 350,
      EWS: 1900
    }
  },

  // IIT Madras (collegeId: '3')
  {
    id: '7',
    collegeId: '3',
    branch: 'Computer Science and Engineering',
    examType: 'JEE Advanced',
    year: 2024,
    openingRank: 30,
    closingRank: 148,
    categoryCutoffs: {
      General: 148,
      OBC: 78,
      SC: 45,
      ST: 24,
      EWS: 120
    }
  },
  {
    id: '8',
    collegeId: '3',
    branch: 'Aerospace Engineering',
    examType: 'JEE Advanced',
    year: 2024,
    openingRank: 1200,
    closingRank: 3200,
    categoryCutoffs: {
      General: 3200,
      OBC: 1600,
      SC: 850,
      ST: 420,
      EWS: 2800
    }
  },

  // BITS Pilani (collegeId: '4')
  {
    id: '9',
    collegeId: '4',
    branch: 'Computer Science',
    examType: 'BITSAT',
    year: 2024,
    openingRank: 1,
    closingRank: 335,
    categoryCutoffs: {
      General: 335,
      OBC: 335,
      SC: 335,
      ST: 335,
      EWS: 335
    }
  },
  {
    id: '10',
    collegeId: '4',
    branch: 'Electronics & Communication',
    examType: 'BITSAT',
    year: 2024,
    openingRank: 340,
    closingRank: 295,
    categoryCutoffs: {
      General: 295,
      OBC: 295,
      SC: 295,
      ST: 295,
      EWS: 295
    }
  },

  // NIT Trichy (collegeId: '5')
  {
    id: '11',
    collegeId: '5',
    branch: 'Computer Science and Engineering',
    examType: 'JEE Main',
    year: 2024,
    openingRank: 250,
    closingRank: 1500,
    categoryCutoffs: {
      General: 1500,
      OBC: 650,
      SC: 340,
      ST: 180,
      EWS: 1200
    }
  },
  {
    id: '12',
    collegeId: '5',
    branch: 'Electronics and Communication',
    examType: 'JEE Main',
    year: 2024,
    openingRank: 1600,
    closingRank: 4200,
    categoryCutoffs: {
      General: 4200,
      OBC: 1800,
      SC: 980,
      ST: 520,
      EWS: 3600
    }
  },

  // COEP Pune (collegeId: '6')
  {
    id: '13',
    collegeId: '6',
    branch: 'Computer Engineering',
    examType: 'MHT-CET',
    year: 2024,
    openingRank: 1,
    closingRank: 120,
    categoryCutoffs: {
      General: 120,
      OBC: 280,
      SC: 550,
      ST: 980,
      EWS: 160
    }
  },
  {
    id: '14',
    collegeId: '6',
    branch: 'Artificial Intelligence and Data Science',
    examType: 'MHT-CET',
    year: 2024,
    openingRank: 125,
    closingRank: 350,
    categoryCutoffs: {
      General: 350,
      OBC: 560,
      SC: 950,
      ST: 1450,
      EWS: 420
    }
  },

  // VJTI Mumbai (collegeId: '7')
  {
    id: '15',
    collegeId: '7',
    branch: 'Computer Engineering',
    examType: 'MHT-CET',
    year: 2024,
    openingRank: 20,
    closingRank: 160,
    categoryCutoffs: {
      General: 160,
      OBC: 340,
      SC: 620,
      ST: 1100,
      EWS: 210
    }
  },
  {
    id: '16',
    collegeId: '7',
    branch: 'Information Technology',
    examType: 'MHT-CET',
    year: 2024,
    openingRank: 170,
    closingRank: 420,
    categoryCutoffs: {
      General: 420,
      OBC: 720,
      SC: 1250,
      ST: 1800,
      EWS: 510
    }
  },

  // DTU Delhi (collegeId: '8')
  {
    id: '17',
    collegeId: '8',
    branch: 'Computer Engineering',
    examType: 'JEE Main',
    year: 2024,
    openingRank: 500,
    closingRank: 3800,
    categoryCutoffs: {
      General: 3800,
      OBC: 9200,
      SC: 18000,
      ST: 28000,
      EWS: 5500
    }
  }
]

export const fetchCutoffs = createAsyncThunk(
  'cutoffs/fetchCutoffs',
  async (_, { rejectWithValue }) => {
    try {
      const stored = localStorage.getItem('collegeFinder_cutoffs')
      if (stored) {
        return JSON.parse(stored)
      }
      localStorage.setItem('collegeFinder_cutoffs', JSON.stringify(initialCutoffs))
      return initialCutoffs
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const addCutoff = createAsyncThunk(
  'cutoffs/addCutoff',
  async (cutoffData, { getState }) => {
    const newCutoff = {
      ...cutoffData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const current = getState().cutoffs.entities
    const updated = [newCutoff, ...current]
    localStorage.setItem('collegeFinder_cutoffs', JSON.stringify(updated))
    return newCutoff
  }
)

export const updateCutoff = createAsyncThunk(
  'cutoffs/updateCutoff',
  async ({ id, updates }, { getState }) => {
    const current = getState().cutoffs.entities
    const updatedCutoff = {
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    }
    const nextEntities = current.map((c) => (c.id === id ? updatedCutoff : c))
    localStorage.setItem('collegeFinder_cutoffs', JSON.stringify(nextEntities))
    return updatedCutoff
  }
)

export const deleteCutoff = createAsyncThunk(
  'cutoffs/deleteCutoff',
  async (id, { getState }) => {
    const current = getState().cutoffs.entities
    const nextEntities = current.filter((c) => c.id !== id)
    localStorage.setItem('collegeFinder_cutoffs', JSON.stringify(nextEntities))
    return id
  }
)

const cutoffsSlice = createSlice({
  name: 'cutoffs',
  initialState: {
    entities: initialCutoffs,
    loading: 'idle',
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCutoffs.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(fetchCutoffs.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.entities = action.payload
        state.error = null
      })
      .addCase(fetchCutoffs.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload || action.error.message
      })
      .addCase(addCutoff.fulfilled, (state, action) => {
        state.entities.unshift(action.payload)
      })
      .addCase(updateCutoff.fulfilled, (state, action) => {
        const index = state.entities.findIndex((c) => c.id === action.payload.id)
        if (index !== -1) {
          state.entities[index] = action.payload
        }
      })
      .addCase(deleteCutoff.fulfilled, (state, action) => {
        state.entities = state.entities.filter((c) => c.id !== action.payload)
      })
  }
})

export const { clearError } = cutoffsSlice.actions

export const selectAllCutoffs = (state) => state.cutoffs.entities
export const selectCutoffsLoading = (state) => state.cutoffs.loading
export const selectCutoffsError = (state) => state.cutoffs.error

export default cutoffsSlice.reducer