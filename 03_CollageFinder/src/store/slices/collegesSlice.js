import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Mock data for initial development
const initialColleges = [
  {
    id: '1',
    name: 'Indian Institute of Technology Delhi',
    code: 'IITD',
    location: {
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110016'
    },
    establishedYear: 1961,
    type: 'Government',
    affiliation: 'Autonomous (Institute of National Importance)',
    website: 'https://www.iitd.ac.in',
    logoUrl: '',
    naacRating: 'A++',
    nirfRank: 2,
    totalStudents: 8500,
    programs: ['Computer Science and Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Chemical Engineering'],
    facilities: ['Hostel', 'Central Research Facility', 'Sports Complex', 'High-Speed Wi-Fi', 'Incubation Centre'],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Indian Institute of Technology Bombay',
    code: 'IITB',
    location: {
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400076'
    },
    establishedYear: 1958,
    type: 'Government',
    affiliation: 'Autonomous (Institute of National Importance)',
    website: 'https://www.iitb.ac.in',
    logoUrl: '',
    naacRating: 'A++',
    nirfRank: 3,
    totalStudents: 10500,
    programs: ['Computer Science and Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Aerospace Engineering', 'Chemical Engineering'],
    facilities: ['Hostel', 'Tinkering Lab', 'Olympic-size Pool', 'Gymnasium', 'Supercomputing Facility'],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Indian Institute of Technology Madras',
    code: 'IITM',
    location: {
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600036'
    },
    establishedYear: 1959,
    type: 'Government',
    affiliation: 'Autonomous (Institute of National Importance)',
    website: 'https://www.iitm.ac.in',
    logoUrl: '',
    naacRating: 'A++',
    nirfRank: 1,
    totalStudents: 9800,
    programs: ['Computer Science and Engineering', 'Aerospace Engineering', 'Ocean Engineering', 'Electrical Engineering', 'Mechanical Engineering'],
    facilities: ['IITM Research Park', 'Hostel', 'Sports Stadium', 'Central Library', 'Medical Centre'],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Birla Institute of Technology and Science Pilani',
    code: 'BITS',
    location: {
      city: 'Pilani',
      state: 'Rajasthan',
      pincode: '333031'
    },
    establishedYear: 1964,
    type: 'Private',
    affiliation: 'Deemed University (Institute of Eminence)',
    website: 'https://www.bits-pilani.ac.in',
    logoUrl: '',
    naacRating: 'A++',
    nirfRank: 20,
    totalStudents: 6200,
    programs: ['Computer Science', 'Electronics & Communication', 'Mechanical Engineering', 'Chemical Engineering', 'Economics'],
    facilities: ['Hostel', 'Library', 'Sports Complex', 'Medical Facility', 'Practice School Hub'],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'National Institute of Technology Tiruchirappalli',
    code: 'NITT',
    location: {
      city: 'Tiruchirappalli',
      state: 'Tamil Nadu',
      pincode: '620015'
    },
    establishedYear: 1964,
    type: 'Government',
    affiliation: 'Autonomous (Institute of National Importance)',
    website: 'https://www.nitt.edu',
    logoUrl: '',
    naacRating: 'A++',
    nirfRank: 9,
    totalStudents: 7000,
    programs: ['Computer Science and Engineering', 'Electronics and Communication', 'Mechanical Engineering', 'Production Engineering', 'Civil Engineering'],
    facilities: ['Octagon Computer Centre', 'Hostels', 'Central Library', 'Sports Grounds', 'Wi-Fi Campus'],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '6',
    name: 'COEP Technological University',
    code: 'COEP',
    location: {
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411005'
    },
    establishedYear: 1854,
    type: 'Government',
    affiliation: 'State Unitary Technological University',
    website: 'https://www.coep.org.in',
    logoUrl: '',
    naacRating: 'A+',
    nirfRank: 73,
    totalStudents: 4500,
    programs: ['Computer Engineering', 'Artificial Intelligence and Data Science', 'Mechanical Engineering', 'Electronics and Telecommunication', 'Civil Engineering'],
    facilities: ['Hostel', 'Boat Club', 'Central Library', 'FabLab', 'Robotics Lab'],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '7',
    name: 'Veermata Jijabai Technological Institute',
    code: 'VJTI',
    location: {
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400019'
    },
    establishedYear: 1887,
    type: 'Government',
    affiliation: 'Autonomous State Institute (Affiliated to Mumbai University)',
    website: 'https://www.vjti.ac.in',
    logoUrl: '',
    naacRating: 'A+',
    nirfRank: 82,
    totalStudents: 4200,
    programs: ['Computer Engineering', 'Information Technology', 'Electronics Engineering', 'Electrical Engineering', 'Mechanical Engineering'],
    facilities: ['Hostel', 'Computing Centre', 'Library', 'Auditorium', 'Placement Cell'],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '8',
    name: 'Delhi Technological University',
    code: 'DTU',
    location: {
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110042'
    },
    establishedYear: 1941,
    type: 'Government',
    affiliation: 'State University',
    website: 'https://www.dtu.ac.in',
    logoUrl: '',
    naacRating: 'A+',
    nirfRank: 29,
    totalStudents: 9500,
    programs: ['Computer Engineering', 'Software Engineering', 'Information Technology', 'Mathematics and Computing', 'Mechanical Engineering'],
    facilities: ['Hostel', 'Library', 'Sports Complex', 'Incubation Foundation', 'Research Labs'],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
]

export const fetchColleges = createAsyncThunk(
  'colleges/fetchColleges',
  async (_, { rejectWithValue }) => {
    try {
      const stored = localStorage.getItem('collegeFinder_colleges')
      if (stored) {
        return JSON.parse(stored)
      }
      localStorage.setItem('collegeFinder_colleges', JSON.stringify(initialColleges))
      return initialColleges
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const addCollege = createAsyncThunk(
  'colleges/addCollege',
  async (collegeData, { getState }) => {
    const newCollege = {
      ...collegeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const current = getState().colleges.entities
    const updated = [newCollege, ...current]
    localStorage.setItem('collegeFinder_colleges', JSON.stringify(updated))
    return newCollege
  }
)

export const updateCollege = createAsyncThunk(
  'colleges/updateCollege',
  async ({ id, updates }, { getState }) => {
    const current = getState().colleges.entities
    const updatedCollege = {
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    }
    const nextEntities = current.map((c) => (c.id === id ? updatedCollege : c))
    localStorage.setItem('collegeFinder_colleges', JSON.stringify(nextEntities))
    return updatedCollege
  }
)

export const deleteCollege = createAsyncThunk(
  'colleges/deleteCollege',
  async (id, { getState }) => {
    const current = getState().colleges.entities
    const nextEntities = current.filter((c) => c.id !== id)
    localStorage.setItem('collegeFinder_colleges', JSON.stringify(nextEntities))
    return id
  }
)

const collegesSlice = createSlice({
  name: 'colleges',
  initialState: {
    entities: initialColleges,
    loading: 'idle',
    error: null,
    totalCount: initialColleges.length
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchColleges.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(fetchColleges.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.entities = action.payload
        state.totalCount = action.payload.length
        state.error = null
      })
      .addCase(fetchColleges.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload || action.error.message
      })
      .addCase(addCollege.fulfilled, (state, action) => {
        state.entities.unshift(action.payload)
        state.totalCount = state.entities.length
      })
      .addCase(updateCollege.fulfilled, (state, action) => {
        const index = state.entities.findIndex((c) => c.id === action.payload.id)
        if (index !== -1) {
          state.entities[index] = action.payload
        }
      })
      .addCase(deleteCollege.fulfilled, (state, action) => {
        state.entities = state.entities.filter((c) => c.id !== action.payload)
        state.totalCount = state.entities.length
      })
  }
})

export const { clearError } = collegesSlice.actions

export const selectAllColleges = (state) => state.colleges.entities
export const selectCollegesLoading = (state) => state.colleges.loading
export const selectCollegesError = (state) => state.colleges.error
export const selectCollegesCount = (state) => state.colleges.totalCount

export default collegesSlice.reducer