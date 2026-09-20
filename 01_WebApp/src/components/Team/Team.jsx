import { useDispatch, useSelector } from 'react-redux';
import { setJoinModalOpen } from '../../store/slices/uiSlice';
import {
  Users2,
  Sparkles,
  ArrowRight,
  Code,
  Award,
} from 'lucide-react';
import { GithubIcon, TwitterIcon } from '../common/Icons';

export default function Team() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);

  const coreTeam = [
    {
      name: 'Alex Rivera',
      handle: '@arivera_dev',
      role: 'President & Systems Lead',
      badgeColor: 'from-amber-400 to-orange-500 text-amber-950',
      borderColor: 'hover:border-amber-500/50',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      bio: 'Low-level systems geek. Built the Aether OS simulator in Rust & WebAssembly. Specializes in kernel drivers and distributed consensus.',
      skills: ['Rust', 'C++', 'WASM', 'Linux Kernel'],
      github: 'https://github.com',
      twitter: 'https://twitter.com',
    },
    {
      name: 'Sarah Chen',
      handle: '@sarahcodes',
      role: 'VP of AI & Research Lead',
      badgeColor: 'from-rose-400 to-pink-500 text-rose-950',
      borderColor: 'hover:border-pink-500/50',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      bio: 'Pioneering edge neural networks. Trained real-time vision transformers running client-side with WebGL acceleration.',
      skills: ['PyTorch', 'TensorFlow.js', 'Three.js', 'Python'],
      github: 'https://github.com',
      twitter: 'https://twitter.com',
    },
    {
      name: 'Marcus Brody',
      handle: '@brody_cloud',
      role: 'Cloud Infra & DevOps Lead',
      badgeColor: 'from-emerald-400 to-teal-500 text-emerald-950',
      borderColor: 'hover:border-emerald-500/50',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      bio: 'Kubernetes wizard & eBPF enthusiast. Built custom edge routing protocols for real-time hackathon judging platforms.',
      skills: ['Kubernetes', 'Go', 'Docker', 'eBPF', 'Terraform'],
      github: 'https://github.com',
      twitter: 'https://twitter.com',
    },
    {
      name: 'Devon Wright',
      handle: '@devon_ui',
      role: 'Lead UI/UX Architect',
      badgeColor: 'from-cyan-400 to-blue-500 text-cyan-950',
      borderColor: 'hover:border-cyan-500/50',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bio: 'Obsessed with fluid interactions and micro-animations. Crafts award-winning 3D web applications with Three.js and GLSL shaders.',
      skills: ['Three.js', 'React', 'GLSL', 'Tailwind', 'Figma'],
      github: 'https://github.com',
      twitter: 'https://twitter.com',
    },
    {
      name: 'Priya Sharma',
      handle: '@priya_ml',
      role: 'Head of Hackathons',
      badgeColor: 'from-purple-400 to-violet-500 text-purple-950',
      borderColor: 'hover:border-purple-500/50',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
      bio: 'Competitive programmer & full-stack architect. Winner of 5 national hackathons. Mentors 100+ students in algorithmic problem solving.',
      skills: ['Python', 'FastAPI', 'PostgreSQL', 'Next.js', 'Algorithms'],
      github: 'https://github.com',
      twitter: 'https://twitter.com',
    },
    {
      name: 'Leo Tanaka',
      handle: '@leo_web3',
      role: 'Web3 & Security Fellow',
      badgeColor: 'from-fuchsia-400 to-pink-500 text-fuchsia-950',
      borderColor: 'hover:border-fuchsia-500/50',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      bio: 'Smart contract security auditor and zero-knowledge researcher. Discovered critical vulnerabilities in DeFi lending primitives.',
      skills: ['Solidity', 'Rust', 'Foundry', 'Cryptography', 'EVM'],
      github: 'https://github.com',
      twitter: 'https://twitter.com',
    },
  ];

  const mentors = [
    { name: 'Jordan Vance', company: 'Google Cloud', role: 'Staff SRE', tag: 'Distributed Systems' },
    { name: 'Chloe Dubois', company: 'Vercel', role: 'Frontend Engineer', tag: 'Next.js & Turborepo' },
    { name: 'Liam O’Connor', company: 'Stripe', role: 'Security Architect', tag: 'Cryptography' },
    { name: 'Aaliyah Patel', company: 'DeepMind', role: 'Research Fellow', tag: 'LLM Alignment' },
  ];

  return (
    <div className={`flex-1 w-full py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-500 ${
      isDarkMode ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Background ambient lighting - Dynamic Cosmic Flares */}
      {isDarkMode ? (
        <>
          <div className="pointer-events-none absolute top-0 left-1/4 -translate-x-1/2 w-[700px] h-[650px] bg-gradient-to-tr from-purple-600/25 via-pink-600/20 to-cyan-500/20 rounded-full blur-[140px] -z-10 animate-pulse" />
          <div className="pointer-events-none absolute top-40 right-10 w-[650px] h-[600px] bg-gradient-to-bl from-cyan-500/25 via-emerald-500/20 to-purple-600/20 rounded-full blur-[140px] -z-10" />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute top-0 left-1/4 -translate-x-1/2 w-[650px] h-[600px] bg-gradient-to-tr from-purple-300/30 via-pink-200/25 to-transparent rounded-full blur-[130px] -z-10" />
          <div className="pointer-events-none absolute top-40 right-10 w-[600px] h-[550px] bg-gradient-to-bl from-amber-200/30 via-sky-300/25 to-transparent rounded-full blur-[130px] -z-10" />
        </>
      )}

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono shadow-sm backdrop-blur-md ${
            isDarkMode
              ? 'bg-purple-950/80 border-purple-500/40 text-purple-300'
              : 'bg-purple-100 border-purple-300 text-purple-900 font-bold'
          }`}>
            <Users2 className="w-3.5 h-3.5 text-purple-400" />
            <span>CORE DIRECTORS & FELLOWS</span>
          </div>

          <h1 className={`text-4xl sm:text-6xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
            Meet the{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Collective Core.
            </span>
          </h1>

          <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Passionate student leaders, researchers, and engineers driving the Cyber Tech technical roadmap.
          </p>
        </div>

        {/* Core Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreTeam.map((member) => (
            <div
              key={member.name}
              className={`rounded-3xl p-6 border backdrop-blur-2xl shadow-xl flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1.5 ${
                isDarkMode
                  ? `bg-slate-900/80 border-white/15 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/10 ${member.borderColor}`
                  : `bg-white/95 border-slate-200/90 hover:border-cyan-500 hover:shadow-xl hover:shadow-slate-300/40 ${member.borderColor}`
              }`}
            >
              <div>
                {/* Member Avatar & Role Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className={`w-16 h-16 rounded-2xl object-cover ring-2 transition-all shadow-lg ${
                        isDarkMode ? 'ring-white/20 group-hover:ring-cyan-400' : 'ring-slate-300 group-hover:ring-cyan-500'
                      }`}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 ring-2 ring-slate-950" title="Active Contributor" />
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${member.badgeColor} shadow-sm`}>
                    {member.role}
                  </span>
                </div>

                {/* Name & Handle */}
                <h3 className={`text-xl font-bold transition-colors ${
                  isDarkMode ? 'text-white group-hover:text-cyan-400' : 'text-slate-950 group-hover:text-cyan-600'
                }`}>
                  {member.name}
                </h3>
                <p className={`text-xs font-mono mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {member.handle}
                </p>

                {/* Bio */}
                <p className={`text-xs sm:text-sm mt-3 leading-relaxed ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-600'
                }`}>
                  {member.bio}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {member.skills.map((s) => (
                    <span
                      key={s}
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-md border font-medium ${
                        isDarkMode
                          ? 'bg-slate-950/90 text-cyan-300 border-cyan-500/25'
                          : 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className={`mt-6 pt-4 border-t flex items-center justify-between ${
                isDarkMode ? 'border-white/10' : 'border-slate-200'
              }`}>
                <span className={`text-[11px] font-mono flex items-center gap-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <Code className="w-3.5 h-3.5 text-cyan-400" /> Core Contributor
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2 rounded-xl border transition-colors ${
                      isDarkMode
                        ? 'bg-white/5 hover:bg-white/15 text-slate-200 border-white/10'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2 rounded-xl border transition-colors ${
                      isDarkMode
                        ? 'bg-white/5 hover:bg-white/15 text-slate-200 border-white/10'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    <TwitterIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mentors & Industry Advisory Section */}
        <div className={`p-8 sm:p-10 rounded-3xl border backdrop-blur-2xl shadow-2xl transition-all ${
          isDarkMode ? 'bg-slate-900/80 border-white/15' : 'bg-white/95 border-slate-200 shadow-slate-200/50'
        }`}>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-2">
            <Award className="w-4 h-4" />
            <span className="font-bold">INDUSTRY ADVISORY & ALUMNI MENTORS</span>
          </div>
          <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
            Supported by Leading Tech Alumni
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mentors.map((m) => (
              <div
                key={m.name}
                className={`p-4 rounded-2xl border transition-colors ${
                  isDarkMode
                    ? 'bg-slate-950/80 border-white/15 hover:border-cyan-400/40'
                    : 'bg-slate-50 border-slate-200 hover:border-cyan-500/40 shadow-sm'
                }`}
              >
                <p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{m.name}</p>
                <p className="text-xs font-mono text-cyan-400 mt-0.5">{m.company} &bull; {m.role}</p>
                <span className={`inline-block mt-3 text-[10px] font-mono px-2 py-0.5 rounded border ${
                  isDarkMode ? 'bg-white/5 text-slate-400 border-white/5' : 'bg-slate-200/60 text-slate-700 border-slate-200'
                }`}>
                  {m.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Join the Core Team Banner */}
        <div className={`p-8 sm:p-12 rounded-3xl border backdrop-blur-2xl text-center space-y-4 shadow-2xl ${
          isDarkMode
            ? 'bg-gradient-to-r from-purple-950/70 via-slate-900/85 to-cyan-950/70 border-white/15'
            : 'bg-gradient-to-r from-purple-100 via-white to-cyan-100 border-purple-200'
        }`}>
          <Sparkles className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
          <h3 className={`text-2xl sm:text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
            Want to Lead a Track or Mentor New Builders?
          </h3>
          <p className={`max-w-xl mx-auto text-xs sm:text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            We are always scouting for passionate developers to run workshops, organize CTFs, and lead research cohorts.
          </p>
          <button
            onClick={() => dispatch(setJoinModalOpen(true))}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 mx-auto hover:scale-105 transition-transform cursor-pointer"
          >
            <span>Apply for Leadership</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
