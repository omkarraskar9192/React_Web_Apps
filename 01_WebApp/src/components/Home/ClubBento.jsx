import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCategory, upvoteProject } from '../../store/slices/clubSlice';
import { setJoinModalOpen } from '../../store/slices/uiSlice';
import {
  GitCommit,
  Star,
  Flame,
  Timer,
  Trophy,
  Code2,
  ArrowUpRight,
  GitBranch,
} from 'lucide-react';

export default function ClubBento() {
  const dispatch = useDispatch();
  const { projects, selectedCategory, stats, upcomingHackathon } = useSelector((state) => state.club);
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 26, hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const categories = [
    { key: 'all', label: 'All Projects' },
    { key: 'systems', label: 'Systems & OS' },
    { key: 'ai', label: 'AI & Vision' },
    { key: 'cloud', label: 'Cloud & DevOps' },
    { key: 'web', label: 'Web3 & Apps' },
  ];

  const filteredProjects =
    selectedCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  // Generate simulated GitHub contribution cells
  const commitGrid = Array.from({ length: 42 }).map((_, i) => {
    const levels = isDarkMode ? [
      'bg-slate-800',
      'bg-emerald-950 border border-emerald-800/40',
      'bg-emerald-700',
      'bg-emerald-500',
      'bg-emerald-400 shadow-sm shadow-emerald-500/50',
    ] : [
      'bg-slate-200',
      'bg-emerald-200 border border-emerald-300',
      'bg-emerald-400',
      'bg-emerald-500',
      'bg-emerald-600 shadow-sm shadow-emerald-600/30',
    ];
    // Deterministic pseudo-random pattern
    const levelIndex = ((i * 7 + 13) % 5);
    return levels[levelIndex];
  });

  return (
    <section className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            ENGINEERING ECOSYSTEM
          </div>
          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
            Built by Developers, <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Driven by Real Code.
            </span>
          </h2>
          <p className={`mt-4 text-base sm:text-lg transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Explore our open-source creations, upcoming hackathon challenges, and collaborative work.
          </p>
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {/* Card 1: Live GitHub Activity (Wide 2-col) */}
          <div className={`md:col-span-2 lg:col-span-2 rounded-3xl p-6 border backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between group ${
            isDarkMode
              ? 'bg-slate-900/60 border-white/10 hover:border-cyan-500/40'
              : 'bg-white/90 border-slate-200 shadow-slate-200/50 hover:border-cyan-500/50'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <GitCommit className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-base transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Club GitHub Velocity</h3>
                    <p className="text-xs text-slate-400 font-mono">live git commit stream</p>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  +1,842 commits
                </span>
              </div>

              {/* Commit Heatmap Grid */}
              <div className={`mt-4 p-4 rounded-2xl border transition-colors ${
                isDarkMode
                  ? 'bg-slate-950/70 border-white/5'
                  : 'bg-slate-100/90 border-slate-200'
              }`}>
                <div className={`text-[11px] font-mono mb-2 flex justify-between ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span>Last 6 Weeks Activity</span>
                  <span>{stats.activeBuilders} Active Contributors</span>
                </div>
                <div className="grid grid-flow-col grid-rows-6 gap-1.5 justify-between">
                  {commitGrid.map((color, idx) => (
                    <div
                      key={idx}
                      className={`w-3.5 h-3.5 rounded-[4px] transition-transform hover:scale-125 ${color}`}
                      title={`Activity index: ${idx}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className={`mt-6 flex items-center justify-between text-xs font-mono pt-4 border-t ${
              isDarkMode ? 'text-slate-400 border-white/5' : 'text-slate-500 border-slate-200'
            }`}>
              <span>Branch: <span className="text-cyan-400 font-bold">main</span></span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-1 transition-colors ${
                  isDarkMode ? 'text-slate-300 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'
                }`}
              >
                View Organization <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2: Upcoming Hackathon Countdown */}
          <div className={`md:col-span-1 lg:col-span-2 rounded-3xl p-6 border backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between ${
            isDarkMode
              ? 'bg-gradient-to-br from-purple-950/40 via-slate-900/60 to-slate-900/60 border-purple-500/20 hover:border-purple-500/50'
              : 'bg-gradient-to-br from-purple-50/90 via-white to-pink-50/90 border-purple-200 hover:border-purple-400 shadow-xl shadow-purple-500/5'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Timer className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-base transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Next Flagship Event</h3>
                    <p className={`text-xs font-mono ${isDarkMode ? 'text-purple-300/80' : 'text-purple-700'}`}>HackMatrix 2026</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  {upcomingHackathon.prize} Pool
                </span>
              </div>

              {/* Ticking Countdown Tiles */}
              <div className="grid grid-cols-4 gap-2 my-4">
                {[
                  { label: 'DAYS', val: timeLeft.days },
                  { label: 'HOURS', val: timeLeft.hours },
                  { label: 'MINS', val: timeLeft.minutes },
                  { label: 'SECS', val: timeLeft.seconds },
                ].map((slot) => (
                  <div
                    key={slot.label}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-colors ${
                      isDarkMode
                        ? 'bg-slate-950/80 border-white/5'
                        : 'bg-white border-purple-100 shadow-sm'
                    }`}
                  >
                    <span className={`text-xl sm:text-2xl font-black font-mono transition-colors ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {String(slot.val).padStart(2, '0')}
                    </span>
                    <span className={`text-[9px] font-mono tracking-wider mt-1 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {slot.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className={`text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                ⚡ Only <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{upcomingHackathon.slotsLeft}</span> team slots left
              </span>
              <button
                onClick={() => dispatch(setJoinModalOpen(true))}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-medium text-xs shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
              >
                Register Team
              </button>
            </div>
          </div>

          {/* Card 3: Interactive Filterable Flagship Projects (Full Width) */}
          <div className={`md:col-span-3 lg:col-span-4 rounded-3xl p-6 sm:p-8 border backdrop-blur-xl shadow-xl transition-all duration-300 ${
            isDarkMode
              ? 'bg-slate-900/60 border-white/10'
              : 'bg-white/90 border-slate-200 shadow-slate-200/50'
          }`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b ${
              isDarkMode ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div>
                <h3 className={`text-xl font-bold flex items-center gap-2 transition-colors ${
                  isDarkMode ? 'text-white' : 'text-slate-950'
                }`}>
                  <Code2 className="w-5 h-5 text-cyan-400" />
                  Flagship Student Repositories
                </h3>
                <p className={`text-sm mt-0.5 transition-colors ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Production-grade software engineered and open-sourced by club members.
                </p>
              </div>

              {/* Redux Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => dispatch(setSelectedCategory(cat.key))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      selectedCategory === cat.key
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                        : isDarkMode
                          ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 ${
                    isDarkMode
                      ? 'bg-slate-950/70 border-white/5 hover:border-cyan-500/30'
                      : 'bg-slate-50/90 border-slate-200 hover:border-cyan-500/50 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-md border ${
                        isDarkMode ? 'bg-white/5 text-slate-400 border-white/5' : 'bg-white text-slate-600 border-slate-200 shadow-xs'
                      }`}>
                        {p.category}
                      </span>
                      <button
                        onClick={() => dispatch(upvoteProject(p.id))}
                        className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors font-mono cursor-pointer"
                        title="Star project"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{p.stars}</span>
                      </button>
                    </div>

                    <h4 className={`text-base font-semibold transition-colors ${
                      isDarkMode ? 'text-white group-hover:text-cyan-400' : 'text-slate-900 group-hover:text-cyan-600'
                    }`}>
                      {p.title}
                    </h4>
                    <p className={`text-xs mt-2 line-clamp-3 leading-relaxed transition-colors ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {p.description}
                    </p>
                  </div>

                  <div className={`mt-5 pt-4 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                            isDarkMode
                              ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/20'
                              : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Author & Links */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={p.authorAvatar}
                          alt={p.author}
                          className="w-5 h-5 rounded-full ring-1 ring-white/20"
                        />
                        <span className={`text-[11px] truncate max-w-[90px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {p.author}
                        </span>
                      </div>

                      <a
                        href={p.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center gap-1 transition-colors ${
                          isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <GitBranch className="w-3 h-3" />
                        <span>Repo</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
