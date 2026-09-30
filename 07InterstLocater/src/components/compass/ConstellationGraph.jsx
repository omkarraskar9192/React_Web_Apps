import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  constellationNodes, 
  constellationLinks 
} from '../../data/constellationData';
import { 
  setActiveDetailNode, 
  setHoveredNodeId 
} from '../../features/constellation/constellationSlice';
import { 
  Terminal, 
  Palette, 
  Compass, 
  Heart, 
  Headphones, 
  Utensils, 
  Sparkles,
  Info
} from 'lucide-react';

const iconMap = {
  Terminal,
  Palette,
  Compass,
  Heart,
  Headphones,
  Utensils,
};

export default function ConstellationGraph() {
  const dispatch = useDispatch();
  const activeDetailNode = useSelector((state) => state.constellation.activeDetailNode);
  const hoveredNodeId = useSelector((state) => state.constellation.hoveredNodeId);
  const topQuizCategory = useSelector((state) => state.quiz.topCategory);

  const [activeFilter, setActiveFilter] = useState('All');

  // Map nodes lookup for lines
  const nodeMap = constellationNodes.reduce((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {});

  const handleNodeClick = (node) => {
    dispatch(setActiveDetailNode(node));
  };

  const handleSubNodeClick = (parentCategory, sub) => {
    const parentNode = constellationNodes.find(n => n.category === parentCategory);
    dispatch(setActiveDetailNode({
      ...parentNode,
      focusSubInterest: sub.name,
      subDetail: sub
    }));
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 relative flex flex-col h-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-slate-700/60 overflow-hidden select-none">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 z-10">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Constellation Galaxy of Passions
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Click any luminous core or satellite sphere to unlock beginner roadmaps & equipment.
          </p>
        </div>

        {/* Category Realm Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveFilter('All')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'All'
                ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Realms
          </button>
          {constellationNodes.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                setActiveFilter(n.category);
                dispatch(setActiveDetailNode(n));
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeFilter === n.category || activeDetailNode?.id === n.id
                  ? 'text-white border shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
              style={{
                borderColor: activeFilter === n.category || activeDetailNode?.id === n.id ? n.color : undefined,
                backgroundColor: activeFilter === n.category || activeDetailNode?.id === n.id ? `${n.color}22` : undefined,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: n.color }} />
              {n.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative flex-1 min-h-[360px] sm:min-h-[460px] w-full rounded-xl bg-slate-950/70 border border-slate-800/80 overflow-hidden flex items-center justify-center">
        {/* Ambient Cosmic Background Grid & Dust */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950/80 to-slate-950 pointer-events-none" />

        <svg
          viewBox="100 50 820 620"
          className="w-full h-full max-h-[580px] transition-transform duration-300"
        >
          <defs>
            {/* Gradients and Filters for Glowing Nodes */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="spaceGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Ambient Circle */}
          <circle cx="500" cy="360" r="320" fill="url(#spaceGradient)" />

          {/* Cross-realm Connecting Constellation Lines */}
          <g className="constellation-links">
            {constellationLinks.map((link, idx) => {
              const src = nodeMap[link.source];
              const tgt = nodeMap[link.target];
              if (!src || !tgt) return null;

              const isHighlighted =
                activeDetailNode?.id === src.id ||
                activeDetailNode?.id === tgt.id ||
                hoveredNodeId === src.id ||
                hoveredNodeId === tgt.id;

              return (
                <g key={idx}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={link.color}
                    strokeWidth={isHighlighted ? 2.5 : 1.5}
                    strokeDasharray={link.animated ? '4,4' : 'none'}
                    className={`transition-all duration-300 ${
                      link.animated ? 'animate-[dash_20s_linear_infinite]' : ''
                    } ${isHighlighted ? 'opacity-100' : 'opacity-40'}`}
                  />
                </g>
              );
            })}
          </g>

          {/* Sub-interest Connectors & Satellite Orbs */}
          {constellationNodes.map((node) => {
            const isFaded = activeFilter !== 'All' && activeFilter !== node.category;
            return (
              <g
                key={`subs-${node.id}`}
                className={`transition-opacity duration-300 ${isFaded ? 'opacity-25' : 'opacity-100'}`}
              >
                {node.subInterests?.map((sub) => (
                  <g key={sub.id} className="cursor-pointer group" onClick={() => handleSubNodeClick(node.category, sub)}>
                    {/* Connecting string to parent core */}
                    <line
                      x1={node.x}
                      y1={node.y}
                      x2={sub.x}
                      y2={sub.y}
                      stroke={node.color}
                      strokeWidth="1"
                      strokeOpacity="0.35"
                      strokeDasharray="2,3"
                    />

                    {/* Satellite circle */}
                    <circle
                      cx={sub.x}
                      cy={sub.y}
                      r={sub.r}
                      fill="#0f172a"
                      stroke={node.color}
                      strokeWidth="1.5"
                      strokeOpacity="0.8"
                      className="hover:stroke-white transition-all hover:scale-110"
                    />

                    {/* Satellite tiny label */}
                    <text
                      x={sub.x}
                      y={sub.y + 3}
                      fill="#e2e8f0"
                      fontSize="9"
                      fontWeight="500"
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                    >
                      {sub.name.split(' ')[0]}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}

          {/* Core Realm Super-Nodes */}
          {constellationNodes.map((node) => {
            const IconComponent = iconMap[node.icon] || Sparkles;
            const isSelected = activeDetailNode?.id === node.id;
            const isTopArchetype = topQuizCategory === node.category;
            const isFaded = activeFilter !== 'All' && activeFilter !== node.category;

            return (
              <g
                key={node.id}
                className={`cursor-pointer transition-all duration-300 ${
                  isFaded ? 'opacity-30' : 'opacity-100'
                }`}
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => dispatch(setHoveredNodeId(node.id))}
                onMouseLeave={() => dispatch(setHoveredNodeId(null))}
              >
                {/* Special Top Archetype Outer Glow */}
                {isTopArchetype && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius + 16}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="6,4"
                    className="animate-spin"
                    style={{ transformOrigin: `${node.x}px ${node.y}px`, animationDuration: '14s' }}
                  />
                )}

                {/* Outer halo aura ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius + (isSelected ? 10 : 6)}
                  fill={node.glowColor}
                  className="transition-all duration-300"
                />

                {/* Main realm node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius}
                  fill="#090d16"
                  stroke={isSelected ? '#ffffff' : node.color}
                  strokeWidth={isSelected ? '3' : '2'}
                  filter="url(#glow)"
                  className="transition-all duration-300 hover:scale-105"
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                />

                {/* Embedded Icon */}
                <foreignObject
                  x={node.x - 14}
                  y={node.y - 18}
                  width="28"
                  height="28"
                  className="pointer-events-none"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <IconComponent
                      className="w-5 h-5 transition-transform duration-300"
                      style={{ color: node.color }}
                    />
                  </div>
                </foreignObject>

                {/* Realm Title Label */}
                <text
                  x={node.x}
                  y={node.y + 14}
                  fill="#ffffff"
                  fontSize="10.5"
                  fontWeight="600"
                  textAnchor="middle"
                  className="pointer-events-none select-none tracking-tight"
                >
                  {node.title.split(' ')[0]}
                </text>

                {/* Subtitle tag */}
                <text
                  x={node.x}
                  y={node.y + 24}
                  fill="#94a3b8"
                  fontSize="8"
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                >
                  {node.subInterests?.length || 3} sparks
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Quick Hint */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-md">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click any sphere to open starter blueprint</span>
        </div>
      </div>
    </div>
  );
}
