export const constellationNodes = [
  {
    id: 'tech-coding',
    title: 'Tech & Coding',
    category: 'Tech & Coding',
    x: 290,
    y: 190,
    radius: 46,
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    icon: 'Terminal',
    tagline: 'Logic, Creativity & Digital Systems',
    description: 'Turn ideas into software, explore algorithmic thinking, AI systems, and interactive digital experiences.',
    subInterests: [
      { id: 'web-dev', name: 'Web Dev & Frontend', x: 190, y: 140, r: 24, level: 'High Demand' },
      { id: 'ai-ml', name: 'AI & Data Science', x: 230, y: 270, r: 24, level: 'Emerging' },
      { id: 'game-dev', name: 'Creative Coding & Games', x: 330, y: 100, r: 22, level: 'Fun' }
    ],
    starterGuide: 'Start with modern HTML/CSS & JavaScript or Python. Build small projects that solve your personal daily problems.'
  },
  {
    id: 'art-design',
    title: 'Art & Design',
    category: 'Art & Design',
    x: 620,
    y: 170,
    radius: 52,
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.45)',
    icon: 'Palette',
    tagline: 'Visual Expression & Aesthetics',
    description: 'Express emotions, solve spatial problems, and craft memorable experiences through colors, shapes, and layouts.',
    subInterests: [
      { id: 'ui-ux', name: 'UI/UX Design', x: 740, y: 130, r: 26, level: 'Popular' },
      { id: 'illustration', name: 'Digital Illustration', x: 720, y: 240, r: 24, level: 'Creative' },
      { id: 'photography', name: 'Street Photography', x: 670, y: 80, r: 22, level: 'Visual' }
    ],
    starterGuide: 'Pick up Figma or Procreate. Practice copying designs you love, then remix them with your own distinct voice.'
  },
  {
    id: 'outdoor-adventure',
    title: 'Outdoor & Adventure',
    category: 'Outdoor & Adventure',
    x: 320,
    y: 380,
    radius: 46,
    color: '#fb923c',
    glowColor: 'rgba(251, 146, 60, 0.45)',
    icon: 'Compass',
    tagline: 'Endurance, Wilderness & Adrenaline',
    description: 'Disconnect from screens, connect with nature, build physical resilience, and explore hidden territories.',
    subInterests: [
      { id: 'hiking', name: 'Hiking & Camping', x: 210, y: 350, r: 24, level: 'Accessible' },
      { id: 'climbing', name: 'Bouldering & Climbing', x: 230, y: 440, r: 22, level: 'Athletic' },
      { id: 'cycling', name: 'Gravel & Road Cycling', x: 330, y: 470, r: 22, level: 'Endurance' }
    ],
    starterGuide: 'Find local trails on AllTrails. Invest in comfortable footwear and safety essentials before venturing out.'
  },
  {
    id: 'wellness-mind',
    title: 'Wellness & Mind',
    category: 'Wellness & Mind',
    x: 440,
    y: 530,
    radius: 44,
    color: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.45)',
    icon: 'Heart',
    tagline: 'Clarity, Vitality & Inner Peace',
    description: 'Cultivate mental presence, emotional equilibrium, physical mobility, and restorative daily habits.',
    subInterests: [
      { id: 'yoga', name: 'Yoga & Flow', x: 340, y: 560, r: 22, level: 'Mind-Body' },
      { id: 'meditation', name: 'Breathwork & Meditation', x: 410, y: 620, r: 22, level: 'Peace' }
    ],
    starterGuide: 'Commit to 10 minutes of intentional morning breathwork or gentle stretching. Consistency matters more than intensity.'
  },
  {
    id: 'music-audio',
    title: 'Music & Audio',
    category: 'Music & Audio',
    x: 580,
    y: 490,
    radius: 44,
    color: '#f472b6',
    glowColor: 'rgba(244, 114, 182, 0.45)',
    icon: 'Headphones',
    tagline: 'Rhythm, Harmony & Sonic Landscapes',
    description: 'Immerse in auditory storytelling, master instruments, sculpt audio frequencies, and create emotional soundscapes.',
    subInterests: [
      { id: 'production', name: 'Music Production & DAW', x: 590, y: 590, r: 24, level: 'Electronic' },
      { id: 'guitar', name: 'Acoustic / Electric Guitar', x: 670, y: 560, r: 22, level: 'Expressive' }
    ],
    starterGuide: 'Download a beginner DAW like Reaper or Ableton Lite, or pick up a ukulele/guitar to learn 4 basic chords.'
  },
  {
    id: 'gastronomy',
    title: 'Gastronomy & Culinary',
    category: 'Gastronomy',
    x: 750,
    y: 350,
    radius: 48,
    color: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.45)',
    icon: 'Utensils',
    tagline: 'Flavor, Chemistry & Sensual Craft',
    description: 'Discover sensory nuance through artisan cooking, specialty coffee, sourdough fermentation, and mixology.',
    subInterests: [
      { id: 'coffee', name: 'Specialty Coffee Brewing', x: 840, y: 280, r: 22, level: 'Artisan' },
      { id: 'cooking', name: 'Culinary Knife Skills', x: 800, y: 460, r: 24, level: 'Daily Essential' }
    ],
    starterGuide: 'Master salt, fat, acid, and heat. Learn how heat control transforms everyday ingredients into gourmet dishes.'
  }
];

export const constellationLinks = [
  { source: 'tech-coding', target: 'art-design', color: 'rgba(99, 102, 241, 0.45)', animated: true },
  { source: 'tech-coding', target: 'outdoor-adventure', color: 'rgba(56, 189, 248, 0.35)' },
  { source: 'art-design', target: 'gastronomy', color: 'rgba(52, 211, 153, 0.4)', animated: true },
  { source: 'outdoor-adventure', target: 'wellness-mind', color: 'rgba(251, 146, 60, 0.35)', animated: true },
  { source: 'wellness-mind', target: 'music-audio', color: 'rgba(192, 132, 252, 0.35)' },
  { source: 'gastronomy', target: 'music-audio', color: 'rgba(34, 211, 238, 0.3)' }
];
