import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCategory, upvoteProject } from '../../store/slices/clubSlice';
import { setJoinModalOpen } from '../../store/slices/uiSlice';
import {
  Code2,
  Star,
  Search,
  ExternalLink,
  Plus,
  Sparkles,
} from 'lucide-react';
import { GithubIcon } from '../common/Icons';

export default function Content() {
  const dispatch = useDispatch();
  const { projects, selectedCategory } = useSelector((state) => state.club);
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'all', label: 'All Projects', color: 'from-cyan-500 to-blue-600' },
    { key: 'systems', label: 'Systems & OS', color: 'from-amber-500 to-orange-600' },
    { key: 'ai', label: 'AI & Vision', color: 'from-rose-500 to-pink-600' },
    { key: 'cloud', label: 'Cloud & DevOps', color: 'from-emerald-500 to-teal-600' },
    { key: 'web', label: 'Web3 & Apps', color: 'from-purple-500 to-violet-600' },
  ];

  // Extended project list for the full Projects showcase
  const allProjects = [
    ...projects,
    {
      id: '5',
      title: 'ChronoKV Distributed Database',
      description: 'RAFT-consensus distributed key-value store with time-travel snapshots and sub-millisecond tail latency.',
      category: 'systems',
      stars: 198,
      forks: 43,
      tags: ['Rust', 'gRPC', 'Protobuf', 'Linux'],
      author: 'David Kim',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      demoUrl: '#',
      repoUrl: 'https://github.com',
    },
    {
      id: '6',
      title: 'NeuroSound Spatial Audio',
      description: 'Real-time WebAudio binaural HRTF 3D sound synthesiser and acoustic room simulator powered by WebAssembly.',
      category: 'ai',
      stars: 312,
      forks: 76,
      tags: ['C++', 'WASM', 'WebAudio', 'React'],
      author: 'Maya Lin',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      demoUrl: '#',
      repoUrl: 'https://github.com',
    },
    {
      id: '7',
      title: 'DevMesh Container Mesh',
      description: 'Zero-config local service mesh proxy for Docker Compose environments with automatic mutual TLS and traffic replay.',
      category: 'cloud',
      stars: 247,
      forks: 58,
      tags: ['Go', 'eBPF', 'Docker', 'Envoy'],
      author: 'Tariq Al-Mansoor',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      demoUrl: '#',
      repoUrl: 'https://github.com',
    },
    {
      id: '8',
      title: 'VoxelEngine WebGL Sandbox',
      description: 'Infinite procedurally-generated voxel world with dynamic lighting, greedy meshing, and multiplayer WebSockets.',
      category: 'web',
      stars: 489,
      forks: 112,
      tags: ['Three.js', 'WebGL', 'TypeScript', 'WebSockets'],
      author: 'Elena Rostova',
      authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      demoUrl: '#',
      repoUrl: 'https://github.com',
    },
  ];

  // Filter by category and search query
  const filtered = allProjects.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className={`flex-1 w-full py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-500 ${
      isDarkMode ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Background ambient lighting - Dynamic Cosmic Flares */}
      {isDarkMode ? (
        <>
          <div className="pointer-events-none absolute top-10 left-1/3 -translate-x-1/2 w-[750px] h-[550px] bg-gradient-to-r from-cyan-500/20 via-purple-600/20 to-pink-500/20 rounded-full blur-[140px] -z-10 animate-pulse" />
          <div className="pointer-events-none absolute bottom-40 right-10 w-[650px] h-[550px] bg-gradient-to-l from-emerald-500/15 via-blue-600/15 to-purple-600/15 rounded-full blur-[150px] -z-10" />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute top-10 left-1/3 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-r from-amber-300/30 via-sky-400/20 to-teal-200/20 rounded-full blur-[130px] -z-10" />
          <div className="pointer-events-none absolute bottom-40 right-10 w-[600px] h-[500px] bg-gradient-to-l from-blue-300/25 via-cyan-300/20 to-transparent rounded-full blur-[140px] -z-10" />
        </>
      )}

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono shadow-sm backdrop-blur-md ${
            isDarkMode
              ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
              : 'bg-cyan-100 border-cyan-300 text-cyan-900 font-bold'
          }`}>
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>OPEN SOURCE REPOSITORY INDEX</span>
          </div>

          <h1 className={`text-4xl sm:text-6xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
            Engineering{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent">
              Showcase.
            </span>
          </h1>

          <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Production-grade open-source systems, experimental research projects, and developer tools crafted by our members.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className={`flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl border backdrop-blur-2xl shadow-2xl transition-all duration-300 ${
          isDarkMode
            ? 'bg-slate-900/80 border-white/15 shadow-cyan-950/20'
            : 'bg-white/90 border-slate-200 shadow-slate-200/50'
        }`}>
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by repo, stack, tag..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs font-mono transition-colors focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? 'bg-slate-950/90 border-white/15 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-500/25'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500/25'
              }`}
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => dispatch(setSelectedCategory(cat.key))}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25 scale-105'
                    : isDarkMode
                    ? 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/15 border border-white/10'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Submit Project CTA */}
          <button
            onClick={() => dispatch(setJoinModalOpen(true))}
            className="w-full md:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit Repo</span>
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div
              key={project.id}
              className={`rounded-3xl p-6 border backdrop-blur-2xl shadow-xl flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1.5 ${
                isDarkMode
                  ? 'bg-slate-900/80 border-white/15 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/10'
                  : 'bg-white/95 border-slate-200/90 hover:border-cyan-500 hover:shadow-xl hover:shadow-slate-300/40'
              }`}
            >
              <div>
                {/* Card Top */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                    isDarkMode
                      ? 'bg-slate-950/90 border border-cyan-500/30 text-cyan-300'
                      : 'bg-cyan-50 border border-cyan-200 text-cyan-800'
                  }`}>
                    {project.category}
                  </span>

                  <button
                    onClick={() => dispatch(upvoteProject(project.id))}
                    className={`flex items-center gap-1.5 text-xs font-mono border px-2.5 py-1 rounded-full transition-colors cursor-pointer shadow-sm ${
                      isDarkMode
                        ? 'text-amber-300 hover:text-amber-200 bg-amber-950/60 border-amber-500/40'
                        : 'text-amber-800 hover:text-amber-900 bg-amber-50 border-amber-300'
                    }`}
                    title="Star project"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{project.stars}</span>
                  </button>
                </div>

                <h3 className={`text-xl font-bold transition-colors ${
                  isDarkMode
                    ? 'text-white group-hover:text-cyan-400'
                    : 'text-slate-950 group-hover:text-cyan-600'
                }`}>
                  {project.title}
                </h3>

                <p className={`text-xs sm:text-sm mt-2.5 leading-relaxed ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-md border font-medium ${
                        isDarkMode
                          ? 'bg-slate-950/90 text-cyan-300 border-cyan-500/25'
                          : 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className={`mt-6 pt-4 border-t flex items-center justify-between ${
                isDarkMode ? 'border-white/10' : 'border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <img
                    src={project.authorAvatar}
                    alt={project.author}
                    className="w-6 h-6 rounded-full ring-1 ring-cyan-400/50 object-cover"
                  />
                  <span className={`text-xs font-mono truncate max-w-[120px] ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {project.author}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2 rounded-xl border transition-colors ${
                      isDarkMode
                        ? 'bg-white/5 hover:bg-white/15 text-slate-200 border-white/10'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                    title="GitHub Repository"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>

                  <a
                    href={project.demoUrl}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold transition-colors"
                  >
                    <span>Demo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className={`py-20 text-center rounded-3xl border ${
            isDarkMode ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200 shadow-lg'
          }`}>
            <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No projects found</h4>
            <p className="text-xs font-mono text-slate-400 mt-1">Try adjusting your search query or filter category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
