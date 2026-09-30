import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addInterest } from '../features/interests/interestsSlice';
import { 
  Sparkles, 
  Search, 
  Check, 
  Plus, 
  Clock, 
  DollarSign, 
  Zap 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATALOG_ITEMS = [
  // Tech & Coding
  {
    id: 'exp-1',
    title: 'Creative Coding & Three.js',
    category: 'Tech & Coding',
    difficulty: 'Intermediate',
    timeWeekly: '3-5 hrs/wk',
    cost: 'Free ($0)',
    desc: 'Generate interactive 3D particle systems, shaders, and web graphics in the browser.',
    starterTip: 'Start with threejs.org official tutorials and explore codepen WebGL demos.'
  },
  {
    id: 'exp-2',
    title: 'Autonomous AI Agents & Python',
    category: 'Tech & Coding',
    difficulty: 'Intermediate',
    timeWeekly: '4-6 hrs/wk',
    cost: '$ (API credits)',
    desc: 'Harness LLM models with tool use, memory architectures, and automated research workflows.',
    starterTip: 'Pick up Python basics and play with the Gemini API or LangChain documentation.'
  },
  {
    id: 'exp-3',
    title: 'Retro Pixel Indie Game Dev',
    category: 'Tech & Coding',
    difficulty: 'Beginner',
    timeWeekly: '3-4 hrs/wk',
    cost: 'Free ($0)',
    desc: 'Design 2D platformers and turn-based games using Godot Engine or PICO-8.',
    starterTip: 'Download Godot 4.3; follow a 20-minute 2D platformer tutorial to make your first sprite jump.'
  },

  // Art & Design
  {
    id: 'exp-4',
    title: 'UI/UX Design Systems in Figma',
    category: 'Art & Design',
    difficulty: 'Beginner',
    timeWeekly: '2-4 hrs/wk',
    cost: 'Free ($0)',
    desc: 'Learn typography hierarchies, color harmonies, auto-layout, and interactive prototyping.',
    starterTip: 'Replicate 3 screens from your favorite mobile app inside Figma to understand layout rules.'
  },
  {
    id: 'exp-5',
    title: 'Digital Concept Art & Painting',
    category: 'Art & Design',
    difficulty: 'Intermediate',
    timeWeekly: '4-6 hrs/wk',
    cost: '$$ (Tablet)',
    desc: 'Master light values, composition, color temperature, and storytelling brushstrokes.',
    starterTip: 'Focus 80% of your initial study on greyscale values before worrying about saturated color.'
  },
  {
    id: 'exp-6',
    title: 'Street & Documentary Photography',
    category: 'Art & Design',
    difficulty: 'Beginner',
    timeWeekly: '2-3 hrs/wk',
    cost: 'Free - $$ (Phone/Camera)',
    desc: 'Train your eyes to spot fleeting candid human emotions, shadows, and architectural frames.',
    starterTip: 'Use whatever smartphone camera you currently own. Limit yourself to 35mm focal length.'
  },

  // Outdoor & Adventure
  {
    id: 'exp-7',
    title: 'Bouldering & Indoor Climbing',
    category: 'Outdoor & Adventure',
    difficulty: 'Beginner',
    timeWeekly: '2-3 sessions/wk',
    cost: '$$ (Gym Pass)',
    desc: 'Physical puzzle solving on vertical walls. Combines core power, grip strength, and community.',
    starterTip: 'Rent climbing shoes at your local gym and focus on foot placement rather than pulling with arms.'
  },
  {
    id: 'exp-8',
    title: 'Ultralight Hiking & Wilderness Camping',
    category: 'Outdoor & Adventure',
    difficulty: 'Intermediate',
    timeWeekly: 'Weekend trips',
    cost: '$$$ (Gear)',
    desc: 'Disconnect completely, navigate forest trails, and sleep under millions of open stars.',
    starterTip: 'Test all gear on an overnight camping trip close to home before planning multi-day hikes.'
  },
  {
    id: 'exp-9',
    title: 'Gravel & Bikepacking Cycling',
    category: 'Outdoor & Adventure',
    difficulty: 'Beginner',
    timeWeekly: '3-5 hrs/wk',
    cost: '$$$ (Bicycle)',
    desc: 'Explore scenic backcountry trails and rural gravel roads powered solely by your legs.',
    starterTip: 'Start with 15-mile local greenway loops before loading up panniers for overnight trips.'
  },

  // Wellness & Mind
  {
    id: 'exp-10',
    title: 'Pranayama Breathwork & Meditation',
    category: 'Wellness & Mind',
    difficulty: 'Beginner',
    timeWeekly: '15 min/day',
    cost: 'Free ($0)',
    desc: 'Modulate your nervous system, cultivate mental clarity, and release chronic stress.',
    starterTip: 'Practice Box Breathing (4 sec in, 4 hold, 4 out, 4 hold) for 5 minutes every morning.'
  },
  {
    id: 'exp-11',
    title: 'Vinyasa Flow & Somatic Mobility',
    category: 'Wellness & Mind',
    difficulty: 'Beginner',
    timeWeekly: '2-3 hrs/wk',
    cost: '$ (Yoga Mat)',
    desc: 'Synchronize physical breath with dynamic movements to unblock posture and stiffness.',
    starterTip: 'Follow introductory 20-minute morning flows on YouTube to build steady daily momentum.'
  },

  // Music & Audio
  {
    id: 'exp-12',
    title: 'Lo-Fi Hip-Hop Beat Production',
    category: 'Music & Audio',
    difficulty: 'Beginner',
    timeWeekly: '3-4 hrs/wk',
    cost: 'Free - $ (DAW/Headphones)',
    desc: 'Chop vintage jazz samples, create warm vinyl crackles, and program hypnotic drum grooves.',
    starterTip: 'Grab a free DAW like GarageBand or Reaper, find royalty-free vinyl samples, and loop a 4-bar chord.'
  },
  {
    id: 'exp-13',
    title: 'Acoustic Guitar Fingerpicking',
    category: 'Music & Audio',
    difficulty: 'Beginner',
    timeWeekly: '20 min/day',
    cost: '$$ (Guitar)',
    desc: 'Feel the vibrations of wooden strings and learn timeless folk, indie, and melodic fingerstyle.',
    starterTip: 'Practice the Travis picking pattern on chords G, C, and Em until fingers move on muscle memory.'
  },

  // Gastronomy
  {
    id: 'exp-14',
    title: 'Specialty Pour-Over Coffee Brewing',
    category: 'Gastronomy',
    difficulty: 'Beginner',
    timeWeekly: '1 hr/wk',
    cost: '$ (Dripper/Beans)',
    desc: 'Explore terroir notes of jasmine, bergamot, and stone fruit through precision water extraction.',
    starterTip: 'Invest in a simple digital gram scale and freshly roasted single-origin beans.'
  },
  {
    id: 'exp-15',
    title: 'Artisan Sourdough & Fermentation',
    category: 'Gastronomy',
    difficulty: 'Intermediate',
    timeWeekly: 'Weekend bake',
    cost: '$ (Flour & Dutch Oven)',
    desc: 'Nurture living wild yeast cultures, master hydration ratios, and bake blistered crusts.',
    starterTip: 'Feed your sourdough starter daily at equal parts water and whole-wheat flour at room temp.'
  }
];

const CATEGORIES = ['All', 'Tech & Coding', 'Art & Design', 'Outdoor & Adventure', 'Wellness & Mind', 'Music & Audio', 'Gastronomy'];

export default function ExplorePage() {
  const dispatch = useDispatch();
  const trackedInterests = useSelector((state) => state.interests.items);

  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [trackedSparks, setTrackedSparks] = useState({});

  const filteredItems = CATALOG_ITEMS.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesQuery = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleTrack = (item) => {
    const isAlready = trackedInterests.some(i => i.title.toLowerCase() === item.title.toLowerCase());
    if (isAlready) {
      setTrackedSparks(prev => ({ ...prev, [item.id]: true }));
      return;
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }

    dispatch(addInterest({
      title: item.title,
      category: item.category,
      stage: 'Exploring',
      progress: 10,
      notes: `${item.desc} Starter advice: ${item.starterTip}`
    }));

    setTrackedSparks(prev => ({ ...prev, [item.id]: true }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Curated Spark Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Explore 15+ Verified Hobbies & Creative Disciplines
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Compare time investment, gear budget, and difficulty before jumping into a new pursuit.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search hobby catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-xs sm:text-sm rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.35)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Catalog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const isTracked = trackedSparks[item.id] || trackedInterests.some(i => i.title.toLowerCase() === item.title.toLowerCase());
          return (
            <div
              key={item.id}
              className="glass-panel rounded-2xl p-5 border border-slate-700/60 hover:border-slate-600/80 transition-all duration-300 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] group"
            >
              <div>
                {/* Header Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {item.category}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
                    {item.difficulty}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>

                {/* Practical Attributes */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{item.timeWeekly}</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item.cost}</span>
                  </div>
                </div>

                {/* Starter Tip Box */}
                <div className="mt-3.5 p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-200/90 flex items-start gap-2">
                  <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{item.starterTip}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => handleTrack(item)}
                  disabled={isTracked}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isTracked
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] active:scale-95'
                  }`}
                >
                  {isTracked ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Tracking on Radar</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Track This Passion</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
