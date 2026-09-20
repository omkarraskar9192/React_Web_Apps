import { useDispatch, useSelector } from 'react-redux';
import { setJoinModalOpen } from '../../store/slices/uiSlice';
import {
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Boxes,
} from 'lucide-react';

export default function About() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);

  const pillars = [
    {
      icon: Terminal,
      title: 'Open Source First',
      color: 'from-cyan-500 to-blue-600',
      description: 'We believe code should be shared, audited, and improved collaboratively. All our flagship tools and libraries are published under permissive open-source licenses.',
    },
    {
      icon: Cpu,
      title: 'Low-Latency & Systems',
      color: 'from-amber-500 to-orange-600',
      description: 'From operating system kernels in Rust to WebAssembly memory sandboxes, we prioritize mechanical sympathy, algorithmic efficiency, and sub-millisecond execution.',
    },
    {
      icon: Boxes,
      title: 'Edge AI & Neural Inference',
      color: 'from-rose-500 to-pink-600',
      description: 'Bringing machine intelligence directly to the client. We build WebGPU-accelerated models, edge embeddings, and distributed computer vision pipelines.',
    },
    {
      icon: Trophy,
      title: 'Hackathon Mastery',
      color: 'from-purple-500 to-violet-600',
      description: 'Our competitive teams participate in premier global collegiate hackathons, consistently taking top honors and creating viral developer software in 48-hour sprints.',
    },
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Founded by 5 Builders',
      desc: 'Formed at University CS lab with an initial focus on low-level Linux systems and competitive CTFs.',
    },
    {
      year: '2025',
      title: 'First Hackathon Grand Slam',
      desc: 'Took 1st place in 3 major collegiate hackathons. Open-sourced the Aether OS simulator which reached 1,000+ GitHub stars.',
    },
    {
      year: '2026',
      title: 'Cyber Tech v2.0',
      desc: 'Expanded to 320+ active student contributors, 38 production repositories, and established mentorship networks with alumni at top tech firms.',
    },
    {
      year: '2027 & Beyond',
      title: 'Decentralized Campus Cloud',
      desc: 'Building a student-run distributed GPU compute cluster to train open edge AI models for collegiate research projects.',
    },
  ];

  const techStack = [
    { category: 'Frontend & UI', items: ['React 19', 'Three.js / WebGL', 'Tailwind CSS v4', 'Redux Toolkit', 'HeroUI', 'Vite'] },
    { category: 'Systems & Runtime', items: ['Rust', 'WebAssembly (WASM)', 'Go', 'C++', 'Linux eBPF', 'Protobuf'] },
    { category: 'Cloud & Infrastructure', items: ['Docker', 'Kubernetes', 'Cloudflare Workers', 'GraphQL', 'gRPC', 'CI/CD Pipelines'] },
    { category: 'AI & Edge Inference', items: ['PyTorch', 'TensorFlow.js', 'ONNX Runtime', 'WebGPU', 'Python', 'Hugging Face'] },
  ];

  return (
    <div className={`flex-1 w-full py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-500 ${
      isDarkMode ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Background ambient lighting - Dynamic Cosmic Flares */}
      {isDarkMode ? (
        <>
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-r from-cyan-500/20 via-purple-600/25 to-pink-500/20 rounded-full blur-[140px] -z-10 animate-pulse" />
          <div className="pointer-events-none absolute bottom-40 left-10 w-[650px] h-[550px] bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-transparent rounded-full blur-[150px] -z-10" />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[500px] bg-gradient-to-r from-amber-200/30 via-sky-300/20 to-teal-200/20 rounded-full blur-[130px] -z-10" />
          <div className="pointer-events-none absolute bottom-40 left-10 w-[600px] h-[500px] bg-gradient-to-r from-blue-200/25 via-cyan-200/20 to-transparent rounded-full blur-[140px] -z-10" />
        </>
      )}

      <div className="max-w-7xl mx-auto space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono shadow-sm backdrop-blur-md ${
            isDarkMode
              ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
              : 'bg-cyan-100 border-cyan-300 text-cyan-900 font-bold'
          }`}>
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>ENGINEERING PHILOSOPHY & STORY</span>
          </div>

          <h1 className={`text-4xl sm:text-6xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
            We Don’t Just Study Code.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-fuchsia-400 bg-clip-text text-transparent">
              We Ship It.
            </span>
          </h1>

          <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Cyber Tech was founded on a simple premise: the best way to become a world-class engineer is by collaborating on ambitious, production-grade software with curious peers.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className={`rounded-3xl p-8 border backdrop-blur-2xl shadow-xl transition-all duration-300 group hover:-translate-y-1 ${
                  isDarkMode
                    ? 'bg-slate-900/80 border-white/15 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/10'
                    : 'bg-white/95 border-slate-200/90 hover:border-cyan-500 hover:shadow-xl hover:shadow-slate-300/40'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${pillar.color} p-[1px] mb-6 shadow-lg`}>
                  <div className={`w-full h-full rounded-[15px] flex items-center justify-center ${
                    isDarkMode ? 'bg-slate-950' : 'bg-white'
                  }`}>
                    <Icon className="w-6 h-6 text-cyan-500 group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{pillar.title}</h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Milestones Timeline */}
        <div className={`p-8 sm:p-12 rounded-3xl border backdrop-blur-2xl shadow-2xl transition-all ${
          isDarkMode ? 'bg-slate-900/80 border-white/15' : 'bg-white/95 border-slate-200 shadow-slate-200/50'
        }`}>
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className={`text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full border ${
              isDarkMode
                ? 'bg-purple-950/80 border-purple-500/40 text-purple-300'
                : 'bg-purple-100 border-purple-300 text-purple-900 font-bold'
            }`}>
              Growth Trajectory
            </span>
            <h3 className={`text-2xl sm:text-3xl font-extrabold mt-3 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
              Our Journey So Far
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {milestones.map((m, idx) => (
              <div
                key={m.year}
                className={`relative p-6 rounded-2xl border transition-colors ${
                  isDarkMode
                    ? 'bg-slate-950/85 border-white/15 hover:border-purple-400/50'
                    : 'bg-slate-50 border-slate-200 hover:border-purple-400/50 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-black font-mono bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {m.year}
                  </span>
                  <span className={`text-[10px] font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>#{idx + 1}</span>
                </div>
                <h4 className={`text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{m.title}</h4>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Matrix */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className={`text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full border ${
              isDarkMode
                ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
                : 'bg-cyan-100 border-cyan-300 text-cyan-900 font-bold'
            }`}>
              Tooling & Ecosystem
            </span>
            <h3 className={`text-2xl sm:text-3xl font-extrabold mt-3 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
              Technologies We Master
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((stack) => (
              <div
                key={stack.category}
                className={`p-6 rounded-3xl border backdrop-blur-2xl shadow-xl transition-all ${
                  isDarkMode ? 'bg-slate-900/80 border-white/15' : 'bg-white/95 border-slate-200 shadow-slate-200/50'
                }`}
              >
                <h4 className={`text-sm font-bold font-mono uppercase tracking-wider pb-3 mb-3 border-b text-cyan-400 ${
                  isDarkMode ? 'border-white/10' : 'border-slate-200'
                }`}>
                  {stack.category}
                </h4>
                <ul className="space-y-2">
                  {stack.items.map((item) => (
                    <li key={item} className={`text-xs font-mono flex items-center gap-2 ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-700'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Join CTA Banner */}
        <div className={`p-8 sm:p-12 rounded-3xl border backdrop-blur-2xl text-center space-y-4 shadow-2xl ${
          isDarkMode
            ? 'bg-gradient-to-r from-cyan-950/70 via-slate-900/85 to-purple-950/70 border-white/15'
            : 'bg-gradient-to-r from-cyan-100 via-white to-purple-100 border-cyan-200'
        }`}>
          <Sparkles className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
          <h3 className={`text-2xl sm:text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
            Ready to Hack, Ship, and Learn with Us?
          </h3>
          <p className={`max-w-xl mx-auto text-xs sm:text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Whether you are writing your first lines of Rust or tuning neural networks, there is a place for you in Cyber Tech.
          </p>
          <button
            onClick={() => dispatch(setJoinModalOpen(true))}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 mx-auto hover:scale-105 transition-transform cursor-pointer"
          >
            <span>Join Cyber Tech Today</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
