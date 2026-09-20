import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTerminalCommand, clearTerminal, setJoinModalOpen } from '../../store/slices/uiSlice';
import { Terminal, CornerDownLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function HeroTerminal() {
  const dispatch = useDispatch();
  const terminalHistory = useSelector((state) => state.ui.terminalHistory);
  const projects = useSelector((state) => state.club.projects);
  const stats = useSelector((state) => state.club.stats);
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);

  const [inputVal, setInputVal] = useState('');
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const terminalRef = useRef(null);
  const endRef = useRef(null);

  // Auto scroll to bottom of terminal on update
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  // 3D Tilt calculation on mouse move
  const handleMouseMove = (e) => {
    if (!terminalRef.current) return;
    const rect = terminalRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 9;
    const rotateY = ((x - centerX) / centerX) * 9;

    setTilt({
      rotateX,
      rotateY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  const executeCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Log the user's entered command
    dispatch(addTerminalCommand({ type: 'user', text: `cyber-tech@core:~$ ${trimmed}` }));

    const lower = trimmed.toLowerCase();

    if (lower === 'clear' || lower === 'cls') {
      dispatch(clearTerminal());
    } else if (lower === 'help') {
      dispatch(addTerminalCommand({
        type: 'response',
        text: 'Available commands: [help] [join] [projects] [stats] [stack] [clear]'
      }));
    } else if (lower === 'join' || lower === 'apply') {
      dispatch(addTerminalCommand({
        type: 'success',
        text: '⚡ Launching Club Application Portal...'
      }));
      setTimeout(() => {
        dispatch(setJoinModalOpen(true));
      }, 400);
    } else if (lower === 'projects') {
      const topProjects = projects.slice(0, 3).map((p) => `• ${p.title} (${p.category}) - ${p.tags.join(', ')}`);
      dispatch(addTerminalCommand({
        type: 'response',
        text: `Active Flagship Repos:\n${topProjects.join('\n')}`
      }));
    } else if (lower === 'stats') {
      dispatch(addTerminalCommand({
        type: 'response',
        text: `Club Metrics:\n• Active Builders: ${stats.activeBuilders}\n• Commits This Month: ${stats.githubCommitsThisMonth}\n• Shipped Products: ${stats.projectsShipped}\n• Hackathon Trophies: ${stats.hackathonWins}`
      }));
    } else if (lower === 'stack') {
      dispatch(addTerminalCommand({
        type: 'response',
        text: 'Club Core Stack: React 19, TypeScript, Rust, Three.js, PyTorch, Go, Tailwind CSS, Docker'
      }));
    } else {
      dispatch(addTerminalCommand({
        type: 'error',
        text: `Command not found: "${trimmed}". Type "help" for a list of valid commands.`
      }));
    }

    setInputVal('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeCommand(inputVal);
  };

  return (
    <div
      ref={terminalRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      className={`relative w-full max-w-lg rounded-2xl border backdrop-blur-xl overflow-hidden group transition-all duration-500 ${
        isDarkMode
          ? 'border-white/15 bg-slate-950/90 shadow-2xl shadow-cyan-950/30'
          : 'border-slate-300/90 bg-[#0f172a] shadow-2xl shadow-slate-300/60 ring-1 ring-slate-200'
      }`}
    >
      {/* Dynamic light reflection / glare effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.4), transparent 60%)`,
        }}
      />

      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900/80">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            cyber-tech@cli: ~/workspace
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] uppercase font-mono text-emerald-400 font-semibold tracking-wider">
            Connected
          </span>
        </div>
      </div>

      {/* Terminal Content Area */}
      <div className="p-4 font-mono text-xs text-slate-300 h-64 overflow-y-auto space-y-2 select-text scrollbar-thin scrollbar-thumb-slate-700">
        {terminalHistory.map((item, idx) => (
          <div key={idx} className="leading-relaxed whitespace-pre-line">
            {item.type === 'user' && (
              <span className="text-cyan-400 font-semibold">{item.text}</span>
            )}
            {item.type === 'system' && (
              <span className="text-slate-500">{item.text}</span>
            )}
            {item.type === 'info' && (
              <span className="text-purple-300">{item.text}</span>
            )}
            {item.type === 'response' && (
              <span className="text-slate-300">{item.text}</span>
            )}
            {item.type === 'success' && (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 inline" /> {item.text}
              </span>
            )}
            {item.type === 'error' && (
              <span className="text-rose-400 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 inline" /> {item.text}
              </span>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Interactive Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center px-4 py-2.5 border-t border-white/10 bg-slate-900/50">
        <span className="text-emerald-400 font-mono text-xs mr-2 font-bold select-none">&gt;</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="type 'help', 'join', 'projects'..."
          className="flex-1 bg-transparent text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          className="ml-2 text-slate-400 hover:text-cyan-400 transition-colors p-1"
          title="Run command"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Quick Action Suggestion Chips */}
      <div className="flex flex-wrap items-center gap-1.5 px-4 py-2 bg-slate-950/90 border-t border-white/5 text-[11px] font-mono">
        <span className="text-slate-500 text-[10px]">Quick:</span>
        {['join', 'projects', 'stats', 'help', 'clear'].map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => executeCommand(cmd)}
            className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
