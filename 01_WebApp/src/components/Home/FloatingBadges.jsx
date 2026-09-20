import { Code2, Cpu, Globe, Boxes, Sparkles } from 'lucide-react';

const badges = [
  { name: 'React 19', icon: Globe, color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30' },
  { name: 'Three.js WebGL', icon: Boxes, color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30' },
  { name: 'Rust & WASM', icon: Cpu, color: 'from-orange-500/20 to-amber-500/20 text-amber-400 border-amber-500/30' },
  { name: 'Edge AI / PyTorch', icon: Sparkles, color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30' },
  { name: 'Redux Toolkit', icon: Code2, color: 'from-violet-500/20 to-indigo-500/20 text-violet-400 border-violet-500/30' },
];

export default function FloatingBadges() {
  return (
    <div className="flex flex-wrap items-center gap-2.5 pt-4">
      {badges.map((b) => {
        const Icon = b.icon;
        return (
          <div
            key={b.name}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium backdrop-blur-md bg-gradient-to-r ${b.color} border shadow-lg transition-transform hover:-translate-y-0.5`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{b.name}</span>
          </div>
        );
      })}
    </div>
  );
}
