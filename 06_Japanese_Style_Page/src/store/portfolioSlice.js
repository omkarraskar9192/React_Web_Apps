import { createSlice } from '@reduxjs/toolkit'

const initialProjects = [
  {
    id: 'proj_zenith',
    category: 'web',
    title: 'Zenith Studio',
    tagline: 'Minimalist Architecture & Design System',
    description: 'A bespoke web platform created for a contemporary architecture studio. Features fluid editorial typography, subtle scroll parallax, and interactive spatial galleries.',
    tags: ['React', 'Tailwind CSS', 'Framer Motion'],
    year: '2026',
    client: 'Zenith Architectural Lab',
    link: '#',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    metrics: '99/100 Lighthouse Performance',
  },
  {
    id: 'proj_aura',
    category: 'ui',
    title: 'Aura Telemetry',
    tagline: 'Real-Time Analytics & Data Visualization',
    description: 'An enterprise cloud telemetry dashboard providing instant telemetry monitoring, sensory anomaly detection, and customizable dark/light view modes.',
    tags: ['React', 'Redux Toolkit', 'D3.js', 'Vite'],
    year: '2025',
    client: 'Aura Cloud Systems',
    link: '#',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
    metrics: '<15ms Real-time Latency',
  },
  {
    id: 'proj_komorebi',
    category: 'web',
    title: 'Komorebi Journal',
    tagline: 'Distraction-Free Minimalist Editorial App',
    description: 'A calm, reader-first publishing interface crafted with intentional white space, fluid responsive type scales, and offline-first reading sync.',
    tags: ['Next.js', 'Tailwind CSS', 'IndexedDB'],
    year: '2025',
    client: 'Independent Publishing',
    link: '#',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
    metrics: 'Featured in Design Weekly',
  },
  {
    id: 'proj_nova',
    category: 'motion',
    title: 'Nova Component System',
    tagline: 'Accessible Motion & Interaction Primitives',
    description: 'An open-source design library of accessible interactive components, micro-animations, and fluid physics-based gestures built for modern web standards.',
    tags: ['TypeScript', 'Framer Motion', 'Radix UI'],
    year: '2024',
    client: 'Open Source Community',
    link: '#',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
    metrics: '12k+ Downloads',
  }
]

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    projects: initialProjects,
    activeCategory: 'all',
    selectedProject: null,
    isContactOpen: false,
    isProjectDetailOpen: false,
    enablePetals: true,
    contactFormSubmitted: false,
  },
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload
    },
    openProjectDetail: (state, action) => {
      state.selectedProject = action.payload
      state.isProjectDetailOpen = true
    },
    closeProjectDetail: (state) => {
      state.isProjectDetailOpen = false
      state.selectedProject = null
    },
    openContact: (state) => {
      state.isContactOpen = true
      state.contactFormSubmitted = false
    },
    closeContact: (state) => {
      state.isContactOpen = false
    },
    togglePetals: (state) => {
      state.enablePetals = !state.enablePetals
    },
    submitContactForm: (state) => {
      state.contactFormSubmitted = true
    },
    resetContactForm: (state) => {
      state.contactFormSubmitted = false
    }
  }
})

export const {
  setActiveCategory,
  openProjectDetail,
  closeProjectDetail,
  openContact,
  closeContact,
  togglePetals,
  submitContactForm,
  resetContactForm
} = portfolioSlice.actions

export default portfolioSlice.reducer
