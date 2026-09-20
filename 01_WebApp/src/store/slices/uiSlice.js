import { createSlice } from '@reduxjs/toolkit';

const initialTerminalHistory = [
  { type: 'system', text: 'Initializing Cyber Tech Core v2.4.0...' },
  { type: 'system', text: 'WebGL 3D Engine: Active (60 FPS)' },
  { type: 'info', text: 'Type "help" to see available commands or click quick chips below.' },
];

// Calculate real-world local solar time on website entry (0.0 to 1.0)
export const getRealWorldSolarTime = () => {
  const now = new Date();
  const hours = now.getHours() + now.getMinutes() / 60;
  return Math.round((hours / 24) * 1000) / 1000;
};

export const getPhaseFromSolarTime = (t) => {
  // 0.0: Midnight, 0.25: 6am Dawn, 0.5: 12pm Noon, 0.75: 6pm Dusk, 1.0: Midnight
  if (t >= 0.20 && t < 0.32) {
    return { phase: 'dawn', isDarkMode: false };
  } else if (t >= 0.32 && t < 0.72) {
    return { phase: 'day', isDarkMode: false }; // Full White/Light Mode
  } else if (t >= 0.72 && t < 0.82) {
    return { phase: 'dusk', isDarkMode: true };
  } else {
    return { phase: 'night', isDarkMode: true }; // Deep Dark Mode
  }
};

const getSavedThemePreference = () => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('cybertech_theme');
  } catch {
    return null;
  }
};

const savedTheme = getSavedThemePreference();
const realWorldSolarTime = getRealWorldSolarTime();
const calculatedPhase = getPhaseFromSolarTime(realWorldSolarTime);

let initialSolarTime = realWorldSolarTime;
let initialPhase = calculatedPhase.phase;
let initialIsDarkMode = calculatedPhase.isDarkMode;

if (savedTheme === 'light') {
  initialIsDarkMode = false;
  initialSolarTime = 0.5;
  initialPhase = 'day';
} else if (savedTheme === 'dark') {
  initialIsDarkMode = true;
  initialSolarTime = 0.0;
  initialPhase = 'night';
}

const initialState = {
  isJoinModalOpen: false,
  active3DGeometry: 'polyhedron', // 'polyhedron' | 'torus' | 'octahedron'
  active3DScene: 'solar', // 'solar' | 'cyber'
  selectedPlanet: 'all', // 'all' | 'sun' | 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune'
  solarTime: initialSolarTime,
  dayNightPhase: initialPhase, // 'night' | 'dawn' | 'day' | 'dusk'
  isDarkMode: initialIsDarkMode, // False = Light mode (pure white), True = Dark mode
  isOrbitPlaying: true,
  terminalHistory: initialTerminalHistory,
  toastMessage: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setJoinModalOpen: (state, action) => {
      state.isJoinModalOpen = action.payload;
    },
    setActive3DGeometry: (state, action) => {
      state.active3DGeometry = action.payload;
    },
    setActive3DScene: (state, action) => {
      state.active3DScene = action.payload;
    },
    setSelectedPlanet: (state, action) => {
      state.selectedPlanet = action.payload;
    },
    setSolarTime: (state, action) => {
      const t = Math.max(0, Math.min(1, action.payload));
      state.solarTime = Math.round(t * 1000) / 1000;
      const { phase, isDarkMode } = getPhaseFromSolarTime(t);
      state.dayNightPhase = phase;
      state.isDarkMode = isDarkMode;
      try {
        localStorage.setItem('cybertech_theme', isDarkMode ? 'dark' : 'light');
      } catch {
        // ignore
      }
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      // If toggled to light mode, set time to high noon (0.50)
      // If toggled to dark mode, set time to midnight (0.00)
      if (state.isDarkMode) {
        state.solarTime = 0.0;
        state.dayNightPhase = 'night';
      } else {
        state.solarTime = 0.5;
        state.dayNightPhase = 'day';
      }
      try {
        localStorage.setItem('cybertech_theme', state.isDarkMode ? 'dark' : 'light');
      } catch {
        // ignore
      }
    },
    syncToRealTime: (state) => {
      const t = getRealWorldSolarTime();
      state.solarTime = t;
      const { phase, isDarkMode } = getPhaseFromSolarTime(t);
      state.dayNightPhase = phase;
      state.isDarkMode = isDarkMode;
      try {
        localStorage.setItem('cybertech_theme', isDarkMode ? 'dark' : 'light');
      } catch {
        // ignore
      }
    },
    setIsOrbitPlaying: (state, action) => {
      state.isOrbitPlaying = action.payload;
    },
    addTerminalCommand: (state, action) => {
      state.terminalHistory.push(action.payload);
    },
    clearTerminal: (state) => {
      state.terminalHistory = [
        { type: 'system', text: 'Terminal session cleared. Type "help" for command list.' },
      ];
    },
    setToast: (state, action) => {
      state.toastMessage = action.payload;
    },
  },
});

export const {
  setJoinModalOpen,
  setActive3DGeometry,
  setActive3DScene,
  setSelectedPlanet,
  setSolarTime,
  toggleDarkMode,
  syncToRealTime,
  setIsOrbitPlaying,
  addTerminalCommand,
  clearTerminal,
  setToast,
} = uiSlice.actions;

export default uiSlice.reducer;
