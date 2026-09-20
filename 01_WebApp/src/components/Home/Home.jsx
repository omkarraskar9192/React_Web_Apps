import { useDispatch, useSelector } from 'react-redux';
import {
  setJoinModalOpen,
  setActive3DScene,
  setSolarTime,
  syncToRealTime,
} from '../../store/slices/uiSlice';
import ThreeScene from '../ThreeCanvas/ThreeScene';
import SolarSystem from '../ThreeCanvas/SolarSystem';
import HeroTerminal from './HeroTerminal';
import FloatingBadges from './FloatingBadges';
import ClubBento from './ClubBento';
import {
  ArrowRight,
  Terminal,
  Orbit,
  Sparkles,
  Globe2,
  Sun,
  Moon,
  Clock,
} from 'lucide-react';

export default function Home() {
  const dispatch = useDispatch();
  const active3DScene = useSelector((state) => state.ui.active3DScene);
  const dayNightPhase = useSelector((state) => state.ui.dayNightPhase);
  const solarTime = useSelector((state) => state.ui.solarTime);
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);

  const scrollToBento = () => {
    window.scrollTo({
      top: 920,
      behavior: 'smooth',
    });
  };

  // Dynamic Theme Colors based on Earth Day/Night Engine
  const getThemeStyles = () => {
    if (!isDarkMode) {
      return {
        bg: 'bg-white transition-colors duration-500',
        textColor: 'text-slate-900',
        headingColor: 'text-slate-950',
        subtextColor: 'text-slate-700',
        flare1: 'bg-amber-200/25 blur-[120px]',
        flare2: 'bg-sky-200/20 blur-[130px]',
        flare3: 'bg-amber-100/20 blur-[140px]',
        pillColor: 'bg-amber-100/90 text-amber-900 border-amber-300 shadow-sm font-semibold',
        badge: '☀️ SOLAR DAY ILLUMINATION (WHITE LIGHT MODE)',
      };
    } else if (dayNightPhase === 'dusk') {
      return {
        bg: 'bg-[#0d0718] transition-colors duration-500',
        textColor: 'text-slate-100',
        headingColor: 'text-white',
        subtextColor: 'text-slate-300',
        flare1: 'bg-purple-600/30 blur-[130px]',
        flare2: 'bg-pink-500/25 blur-[130px]',
        flare3: 'bg-indigo-600/25 blur-[140px]',
        pillColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        badge: '🌆 TWILIGHT DUSK / SUNSET TERMINATOR',
      };
    } else {
      // Cosmic Midnight Dark Mode
      return {
        bg: 'bg-[#030712] transition-colors duration-500',
        textColor: 'text-slate-100',
        headingColor: 'text-white',
        subtextColor: 'text-slate-300',
        flare1: 'bg-fuchsia-600/25 blur-[130px]',
        flare2: 'bg-cyan-500/25 blur-[130px]',
        flare3: 'bg-blue-600/20 blur-[160px]',
        pillColor: 'bg-cyan-950/80 text-cyan-400 border-cyan-500/30',
        badge: '🌌 COSMIC DEEP NIGHT MODE',
      };
    }
  };

  const theme = getThemeStyles();

  return (
    <div className={`w-full flex-1 flex flex-col ${theme.bg} ${theme.textColor} overflow-hidden relative selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-500`}>
      {/* Background ambient lighting flares - Dynamic with Celestial Time */}
      <div className={`pointer-events-none absolute top-[-50px] left-1/4 -translate-x-1/2 w-[650px] h-[650px] rounded-full -z-10 animate-pulse transition-all duration-700 ${theme.flare1}`} />
      <div className={`pointer-events-none absolute top-20 right-0 w-[600px] h-[600px] rounded-full -z-10 transition-all duration-700 ${theme.flare2}`} />
      <div className={`pointer-events-none absolute top-[900px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full -z-10 transition-all duration-700 ${theme.flare3}`} />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-10 pb-16 lg:pt-14 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-8">

          {/* Top Row: Scene Switcher & Celestial Phase Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Celestial Phase Badge */}
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono shadow-lg backdrop-blur-md transition-all duration-500 ${theme.pillColor}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-ping" />
              <span>{theme.badge}</span>
              <span className="text-[10px] opacity-75 font-bold">({Math.round(solarTime * 24)}:00 HRS)</span>
            </div>

            {/* 3D Scene Toggle (Solar System vs Cyber Core) */}
            <div className={`flex items-center gap-1.5 p-1 rounded-2xl border backdrop-blur-xl shadow-xl transition-colors ${
              isDarkMode
                ? 'bg-slate-950/80 border-white/15'
                : 'bg-white/90 border-slate-200 shadow-md'
            }`}>
              <button
                onClick={() => dispatch(setActive3DScene('solar'))}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  active3DScene === 'solar'
                    ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 shadow-md'
                    : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>3D Solar System</span>
              </button>

              <button
                onClick={() => dispatch(setActive3DScene('cyber'))}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  active3DScene === 'cyber'
                    ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-slate-950 shadow-md'
                    : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Orbit className="w-3.5 h-3.5" />
                <span>Cyber Crystal</span>
              </button>
            </div>
          </div>

          {/* Main Hero Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 text-left">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] transition-colors duration-500">
                <span className={isDarkMode ? 'text-white' : 'text-slate-950'}>EXPLORE. </span>
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                  SIMULATE.
                </span>{' '}
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  ENGINEER.
                </span>
              </h1>
              <p className={`text-base sm:text-lg max-w-xl leading-relaxed transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                The premier collegiate developer society. Explore our real-time interactive 3D Solar System, test the Earth Day/Night illumination engine, and build production open-source software.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => dispatch(setJoinModalOpen(true))}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-300 hover:from-cyan-300 hover:to-teal-200 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Join The Collective</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={scrollToBento}
                  className={`px-6 py-3.5 rounded-2xl font-medium text-sm border backdrop-blur-md shadow-lg flex items-center gap-2 transition-all cursor-pointer ${
                    isDarkMode
                      ? 'bg-slate-900/80 hover:bg-slate-800 text-white border-white/15 hover:border-white/30'
                      : 'bg-white/90 hover:bg-white text-slate-900 border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <span>Discover Repos</span>
                  <Terminal className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Floating Tech Stacks */}
              <FloatingBadges />
            </div>

            {/* Micro Stats Banner */}
            <div className={`lg:col-span-5 p-6 rounded-3xl border backdrop-blur-xl shadow-xl space-y-4 transition-all duration-500 ${
              isDarkMode
                ? 'bg-slate-900/60 border-white/10'
                : 'bg-white/90 border-slate-200 shadow-slate-200/50'
            }`}>
              <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>INTERACTIVE CELESTIAL ENGINE</span>
              </div>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Features full 8-planet orbital physics, Saturn’s 3D rings, and Earth-Moon terminator light simulation synced with dynamic theme shifts.
              </p>
              <div className={`grid grid-cols-3 gap-2 pt-2 border-t text-center font-mono ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-slate-950/60' : 'bg-slate-100/90'}`}>
                  <p className="text-lg font-bold text-amber-500">8</p>
                  <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Planets</p>
                </div>
                <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-slate-950/60' : 'bg-slate-100/90'}`}>
                  <p className="text-lg font-bold text-cyan-500">360°</p>
                  <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Cursor Orbit</p>
                </div>
                <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-slate-950/60' : 'bg-slate-100/90'}`}>
                  <p className="text-lg font-bold text-emerald-500">24H</p>
                  <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Day/Night</p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= 3D CANVAS SHOWCASE (SOLAR SYSTEM OR CYBER CORE) ================= */}
          <div className="w-full relative pt-2">
            {active3DScene === 'solar' ? (
              <SolarSystem />
            ) : (
              <div className={`h-[520px] sm:h-[600px] w-full rounded-3xl border backdrop-blur-xl shadow-2xl relative overflow-hidden ${
                isDarkMode ? 'bg-slate-950/80 border-white/15' : 'bg-white/80 border-slate-200'
              }`}>
                <ThreeScene />
              </div>
            )}
          </div>

          {/* ================= GAMIFIED CELESTIAL DAY / NIGHT CONTROLLER BAR ================= */}
          <div className={`w-full p-4 sm:p-6 rounded-3xl border backdrop-blur-2xl shadow-2xl transition-all duration-500 flex flex-col gap-4 ${
            isDarkMode
              ? 'bg-slate-950/90 border-cyan-500/30'
              : 'bg-white/95 border-amber-400/50 shadow-amber-500/10'
          }`}>
            {/* Controller Header Row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform ${
                  isDarkMode
                    ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-300'
                    : 'bg-amber-100 border border-amber-400/80 text-amber-600 shadow-amber-200'
                }`}>
                  {isDarkMode ? (
                    <Moon className="w-6 h-6 text-cyan-400" />
                  ) : (
                    <Sun className="w-6 h-6 text-amber-500 animate-spin" style={{ animationDuration: '12s' }} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold font-mono uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                      Interactive Celestial Day / Night Engine
                    </h3>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      isDarkMode
                        ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
                        : 'bg-amber-100 border-amber-400/80 text-amber-900 font-extrabold shadow-sm'
                    }`}>
                      {isDarkMode ? '🌙 DARK MODE ACTIVE' : '☀️ WHITE LIGHT MODE ACTIVE'}
                    </span>
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Slide across the 24-hour cycle below to move the Sun & Moon around Earth — dynamically transforming the website between Light Mode and Dark Mode!
                  </p>
                </div>
              </div>

              {/* Real-time local sync button */}
              <button
                onClick={() => dispatch(syncToRealTime())}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                  isDarkMode
                    ? 'bg-white/5 hover:bg-white/15 text-slate-200 border-white/15'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-sm'
                }`}
                title="Synchronize time with your computer's local clock"
              >
                <Clock className="w-3.5 h-3.5 text-cyan-500" />
                <span>Sync Local Clock ({new Date().getHours().toString().padStart(2, '0')}:{new Date().getMinutes().toString().padStart(2, '0')})</span>
              </button>
            </div>

            {/* Interactive Slider Bar */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-mono flex items-center gap-1 shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Moon className="w-3.5 h-3.5 text-cyan-400" /> 00:00 (Night)
                </span>

                <div className="relative flex-1 flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.002"
                    value={solarTime}
                    onChange={(e) => dispatch(setSolarTime(parseFloat(e.target.value)))}
                    className="w-full h-3 rounded-lg cursor-pointer appearance-none bg-gradient-to-r from-indigo-950 via-amber-300 to-indigo-950 accent-cyan-400"
                    title="Slide to change time of day and website illumination"
                  />
                </div>

                <span className={`text-xs font-mono flex items-center gap-1 shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Moon className="w-3.5 h-3.5 text-cyan-400" /> 24:00 (Night)
                </span>
              </div>

              {/* Time Presets Quick Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => dispatch(setSolarTime(0.0))}
                    className={`px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1 border ${
                      solarTime < 0.1 || solarTime > 0.9
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 font-bold shadow-sm'
                        : isDarkMode
                        ? 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/5'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Moon className="w-3 h-3 text-cyan-400" />
                    <span>00:00 Midnight (Dark)</span>
                  </button>

                  <button
                    onClick={() => dispatch(setSolarTime(0.25))}
                    className={`px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1 border ${
                      solarTime >= 0.2 && solarTime < 0.32
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400/60 font-bold shadow-sm'
                        : isDarkMode
                        ? 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/5'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>🌅 06:00 Dawn</span>
                  </button>

                  <button
                    onClick={() => dispatch(setSolarTime(0.5))}
                    className={`px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 border ${
                      solarTime >= 0.32 && solarTime < 0.72
                        ? 'bg-amber-400 text-amber-950 border-amber-500 font-extrabold shadow-md scale-105'
                        : isDarkMode
                        ? 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/5'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                    <span>12:00 Noon (Full Light Mode)</span>
                  </button>

                  <button
                    onClick={() => dispatch(setSolarTime(0.75))}
                    className={`px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1 border ${
                      solarTime >= 0.72 && solarTime < 0.82
                        ? 'bg-purple-500/20 text-purple-300 border-purple-400/60 font-bold shadow-sm'
                        : isDarkMode
                        ? 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/5'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>🌆 18:00 Dusk</span>
                  </button>
                </div>

                <div className="text-right font-mono text-xs font-bold">
                  <span className={isDarkMode ? 'text-cyan-400' : 'text-amber-600 font-extrabold'}>
                    {Math.floor(solarTime * 24).toString().padStart(2, '0')}:{Math.floor((solarTime * 24 % 1) * 60).toString().padStart(2, '0')} HRS
                  </span>
                  <span className={`text-[10px] ml-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    ({isDarkMode ? 'Cosmic Dark' : 'Daylight White'})
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3D Parallax Interactive CLI Terminal */}
        <div className="mt-20 flex flex-col items-center">
          <div className="text-center mb-6">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider bg-cyan-950/60 border border-cyan-500/20 px-3 py-1 rounded-full">
              Developer Playground
            </span>
            <p className={`text-sm mt-2 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Interact with the live club CLI below or run commands to test integrations.
            </p>
          </div>
          <HeroTerminal />
        </div>
      </section>

      {/* ================= METRICS STATS RIBBON ================= */}
      <div className={`border-y py-8 backdrop-blur-md transition-colors duration-500 ${
        isDarkMode
          ? 'border-white/10 bg-slate-950/70'
          : 'border-slate-200 bg-white/85 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className={`text-3xl sm:text-4xl font-black font-mono transition-colors ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>320+</p>
              <p className={`text-xs sm:text-sm font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Student Engineers</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black font-mono text-cyan-500">1,842</p>
              <p className={`text-xs sm:text-sm font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Monthly Git Commits</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black font-mono text-purple-500">38</p>
              <p className={`text-xs sm:text-sm font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Production Repos</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black font-mono text-emerald-500">$85K+</p>
              <p className={`text-xs sm:text-sm font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Hackathon Winnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BENTO GRID SECTION ================= */}
      <ClubBento />

      {/* ================= CALL TO ACTION FOOTER BANNER ================= */}
      <section className="py-20 relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className={`p-8 sm:p-14 rounded-3xl border backdrop-blur-2xl shadow-2xl relative overflow-hidden transition-all duration-500 ${
          isDarkMode
            ? 'bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-[#020617] border-white/15 shadow-cyan-950/30'
            : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 border-slate-200/90 shadow-xl shadow-slate-200/60'
        }`}>
          <div className={`pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl ${
            isDarkMode ? 'bg-cyan-500/20' : 'bg-amber-400/20'
          }`} />

          <h3 className={`text-2xl sm:text-4xl font-extrabold tracking-tight relative z-10 transition-colors duration-500 ${
            isDarkMode ? 'text-white' : 'text-slate-950'
          }`}>
            Ready to Build Something Extraordinary?
          </h3>
          <p className={`max-w-xl mx-auto mt-4 text-sm sm:text-base relative z-10 leading-relaxed transition-colors duration-500 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Join Cyber Tech today. Gain access to private hackathons, mentorship from alumni at top tech firms, and high-performance server clusters.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 relative z-10">
            <button
              onClick={() => dispatch(setJoinModalOpen(true))}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-300 hover:opacity-90 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <span>Apply for Membership</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}