import { useSelector } from 'react-redux';
import { 
  BarChart3, 
  Clock, 
  Compass, 
  Layers, 
  Sparkles 
} from 'lucide-react';

const REALMS = [
  'Tech & Coding',
  'Art & Design',
  'Outdoor & Adventure',
  'Wellness & Mind',
  'Music & Audio',
  'Gastronomy'
];

export default function AnalyticsPage() {
  const items = useSelector((state) => state.interests.items);
  const quizScores = useSelector((state) => state.quiz.categoryScores);

  // Calculate metrics per category
  const categoryStats = REALMS.map((realm) => {
    const realmItems = items.filter(i => i.category === realm);
    const totalHours = realmItems.reduce((acc, curr) => acc + (Number(curr.hoursSpent) || 0), 0);
    const avgProgress = realmItems.length > 0 
      ? Math.round(realmItems.reduce((acc, curr) => acc + (Number(curr.progress) || 0), 0) / realmItems.length) 
      : 0;

    return {
      name: realm,
      count: realmItems.length,
      hours: totalHours,
      avgProgress,
      diagnosticScore: quizScores[realm] || 0
    };
  });

  // Calculate overall stages
  const stageCounts = {
    Exploring: items.filter(i => i.stage === 'Exploring').length,
    Learning: items.filter(i => i.stage === 'Learning').length,
    Practicing: items.filter(i => i.stage === 'Practicing').length,
    Mastered: items.filter(i => i.stage === 'Mastered').length,
  };

  const totalInterests = items.length || 1;
  const totalHoursLogged = items.reduce((acc, curr) => acc + (Number(curr.hoursSpent) || 0), 0);
  const maxHoursInAnyCat = Math.max(...categoryStats.map(c => c.hours), 10);

  // SVG Radar Chart Math for 6 vertices
  const center = 160;
  const radius = 110;
  const angleStep = (2 * Math.PI) / 6;

  // Generate web rings points
  const getRadarPolygon = (scale = 1) => {
    return REALMS.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = radius * scale;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  // Generate data polygon based on tracked progress/hours
  const dataPoints = REALMS.map((realm, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const cat = categoryStats.find(c => c.name === realm);
    // Combine quiz score and tracked progress for resonance
    const normalized = Math.min(1, Math.max(0.15, (cat.avgProgress / 100) * 0.7 + (cat.diagnosticScore / 16) * 0.3));
    const r = radius * normalized;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, labelX: center + (radius + 24) * Math.cos(angle), labelY: center + (radius + 18) * Math.sin(angle), name: realm };
  });

  const dataPolygonString = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="pb-2 border-b border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold mb-2">
          <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Multi-Axial Life Balance Insights</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Passion Resonance & Energy Distribution
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Measure where your creative and physical energy flows across the 6 passion realms.
        </p>
      </div>

      {/* Top Visual Cards Row: Radar Chart + Skill Stage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* SVG Multi-Axial Passion Radar (7 Cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>6-Realm Passion Radar</span>
              </h3>
              <p className="text-xs text-slate-400">
                Visual balance between logical, visual, physical, and sensory pursuits.
              </p>
            </div>
            <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-800/40">
              Live Synthesis
            </span>
          </div>

          {/* SVG Radar */}
          <div className="w-full flex items-center justify-center py-4">
            <svg viewBox="0 0 320 320" className="w-full max-w-[340px] overflow-visible">
              <defs>
                <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
                </radialGradient>
              </defs>

              {/* Web concentric polygon rings */}
              {[0.25, 0.5, 0.75, 1].map((scale, idx) => (
                <polygon
                  key={idx}
                  points={getRadarPolygon(scale)}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray={scale === 1 ? 'none' : '3,3'}
                />
              ))}

              {/* Axis Spoke lines */}
              {REALMS.map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="#1e293b"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Data Area Polygon */}
              <polygon
                points={dataPolygonString}
                fill="url(#radarFill)"
                stroke="#38bdf8"
                strokeWidth="2.5"
                className="transition-all duration-700"
              />

              {/* Data Points and Outer Labels */}
              {dataPoints.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill="#38bdf8"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text
                    x={pt.labelX}
                    y={pt.labelY}
                    fill="#94a3b8"
                    fontSize="9.5"
                    fontWeight="600"
                    textAnchor="middle"
                    className="select-none"
                  >
                    {pt.name.split(' ')[0]}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-center">
            Tip: Balance both cognitive deep work (Tech, Music) with restorative somatic realms (Outdoors, Wellness).
          </div>
        </div>

        {/* Skill Stage Pipeline & Momentum (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Stage Progression Breakdown */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Skill Stage Pipeline</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Status distribution across your {items.length} active interests.
            </p>

            <div className="space-y-3">
              {Object.entries(stageCounts).map(([stage, count]) => {
                const percent = Math.round((count / totalInterests) * 100);
                const colors = {
                  Exploring: 'from-cyan-500 to-blue-500',
                  Learning: 'from-indigo-500 to-purple-500',
                  Practicing: 'from-amber-500 to-orange-500',
                  Mastered: 'from-emerald-500 to-teal-500',
                };
                return (
                  <div key={stage} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-300">{stage}</span>
                      <span className="font-mono text-slate-400">{count} ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${colors[stage]} transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Momentum Highlights */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Practice Velocity</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Total Hours Logged</div>
                <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5">{totalHoursLogged} hrs</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Avg Mastery Score</div>
                <div className="text-xl font-bold font-mono text-emerald-300 mt-0.5">
                  {Math.round(items.reduce((a, c) => a + (Number(c.progress) || 0), 0) / totalInterests)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hours Invested per Category Realm (Full Width) */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <h3 className="text-base sm:text-lg font-bold text-white mb-1 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Practice Hours Invested by Realm</span>
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Quantified time commitment across each discipline in your tracker.
        </p>

        <div className="space-y-4">
          {categoryStats.map((stat) => {
            const barPercent = Math.min(100, Math.round((stat.hours / maxHoursInAnyCat) * 100));
            return (
              <div key={stat.name} className="space-y-1.5">
                <div className="flex justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{stat.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">({stat.count} interests)</span>
                  </div>
                  <div className="font-mono text-cyan-400 font-bold">
                    {stat.hours} hrs
                  </div>
                </div>

                <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${Math.max(4, barPercent)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
