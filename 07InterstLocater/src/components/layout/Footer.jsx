import { Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-300">PassionCompass</span>
          <span>• Discover what makes you feel alive</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>React 19 + Redux Toolkit + React Hook Form + Vite</span>
        </div>
      </div>
    </footer>
  );
}
