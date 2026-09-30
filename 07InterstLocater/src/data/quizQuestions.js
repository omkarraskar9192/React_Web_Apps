export const quizQuestions = [
  {
    id: 1,
    part: 'SPARK YOUR CURIOSITY',
    question: 'How do you instinctively prefer to recharge after an intense week?',
    options: [
      { id: '1a', text: 'Designing, sketching, or styling visual ideas', weights: { 'Art & Design': 4, 'Tech & Coding': 1 } },
      { id: '1b', text: 'Building, tinkering, or solving code & logic puzzles', weights: { 'Tech & Coding': 4, 'Art & Design': 1 } },
      { id: '1c', text: 'Heading outdoors into fresh air, hiking or trails', weights: { 'Outdoor & Adventure': 4, 'Wellness & Mind': 2 } },
      { id: '1d', text: 'Quiet breathing, yoga flow, or contemplative journaling', weights: { 'Wellness & Mind': 4, 'Gastronomy': 1 } },
      { id: '1e', text: 'Listening to music, tweaking synths, or playing chords', weights: { 'Music & Audio': 4, 'Art & Design': 1 } },
      { id: '1f', text: 'Cooking an elaborate meal or brewing specialty coffee', weights: { 'Gastronomy': 4, 'Wellness & Mind': 2 } }
    ]
  },
  {
    id: 2,
    part: 'FLOW STATE & FOCUS',
    question: 'What kind of challenge gives you that timeless "flow state" feeling?',
    options: [
      { id: '2a', text: 'Creating something tangible and beautiful with colors & typography', weights: { 'Art & Design': 4 } },
      { id: '2b', text: 'Debugging a tricky problem or automating a tedious workflow', weights: { 'Tech & Coding': 4 } },
      { id: '2c', text: 'Pushing physical limits, climbing peaks, or feeling physical adrenaline', weights: { 'Outdoor & Adventure': 4 } },
      { id: '2d', text: 'Attuning to bodily sensations, breath, and inner clarity', weights: { 'Wellness & Mind': 4 } },
      { id: '2e', text: 'Experimenting with rhythms, melodies, and sound textures', weights: { 'Music & Audio': 4 } },
      { id: '2f', text: 'Balancing savory and sweet flavors, spices, and fermentation chemistry', weights: { 'Gastronomy': 4 } }
    ]
  },
  {
    id: 3,
    part: 'IDEAL PLAYGROUND',
    question: 'Where would your ideal creative or learning workshop be located?',
    options: [
      { id: '3a', text: 'A clean, multi-monitor digital studio with high-res tablets', weights: { 'Tech & Coding': 3, 'Art & Design': 3 } },
      { id: '3b', text: 'A sunlit art loft with easels, color palettes, and mood boards', weights: { 'Art & Design': 4 } },
      { id: '3c', text: 'Under open skies, mountain ranges, or winding forest trails', weights: { 'Outdoor & Adventure': 4 } },
      { id: '3d', text: 'A serene Japanese-inspired garden or zen meditation room', weights: { 'Wellness & Mind': 4 } },
      { id: '3e', text: 'An acoustic-treated audio booth with keyboards & studio monitors', weights: { 'Music & Audio': 4 } },
      { id: '3f', text: 'A rustic kitchen with high-end knives, espresso machines, and herbs', weights: { 'Gastronomy': 4 } }
    ]
  }
];

export const categoryRecommendations = {
  'Tech & Coding': {
    title: 'Digital Architect & Builder',
    tagline: 'You thrive where logic, curiosity, and high-impact problem solving converge.',
    suggestedInterests: [
      { title: 'Interactive Web & React Apps', desc: 'Craft sleek, modern web applications that solve real-world problems.' },
      { title: 'AI Prompt & Agent Engineering', desc: 'Harness LLMs to build agent workflows and smart assistants.' },
      { title: 'Creative Game Development', desc: 'Combine mathematics, storytelling, and mechanics into playable worlds.' }
    ],
    starterPack: 'Visual Studio Code, GitHub, Vite + React documentation.'
  },
  'Art & Design': {
    title: 'Visual Visionary & Stylist',
    tagline: 'You have a natural eye for aesthetic balance, storytelling, and emotional resonance.',
    suggestedInterests: [
      { title: 'UI/UX Design Systems', desc: 'Shape how millions of users interact with digital products elegantly.' },
      { title: 'Digital Illustration & Concept Art', desc: 'Master brush dynamics, lighting values, and visual storytelling.' },
      { title: 'Street & Editorial Photography', desc: 'Capture authentic fleeting human moments through light and shadow.' }
    ],
    starterPack: 'Figma free account, iPad with Procreate, or pen & dot-grid sketchpad.'
  },
  'Outdoor & Adventure': {
    title: 'Wilderness Explorer & Seeker',
    tagline: 'You find your truest vitality when immersed in raw nature and physical challenges.',
    suggestedInterests: [
      { title: 'Trail Running & Mountain Trekking', desc: 'Build iron stamina across rugged elevations and winding forest paths.' },
      { title: 'Bouldering & Rock Climbing', desc: 'Solve physical geometry problems suspended on vertical walls.' },
      { title: 'Gravel Bikepacking & Touring', desc: 'Combine cycling independence with backcountry wilderness camping.' }
    ],
    starterPack: 'AllTrails app, quality trail running shoes, 2L hydration pack.'
  },
  'Wellness & Mind': {
    title: 'Zen Cultivator & Mindful Sage',
    tagline: 'You prioritize sustainable energy, emotional resilience, and deep grounding.',
    suggestedInterests: [
      { title: 'Vinyasa Flow & Dynamic Yoga', desc: 'Harmonize continuous movement with conscious breathing cycles.' },
      { title: 'Mindfulness Breathwork & Meditation', desc: 'Train attention control, clarity, and nervous system regulation.' },
      { title: 'Morning Stoic Journaling', desc: 'Reflect deeply on daily decisions, gratitude, and purposeful goals.' }
    ],
    starterPack: 'Eco yoga mat, meditation timer or Waking Up app, hardcover dot journal.'
  },
  'Music & Audio': {
    title: 'Sonic Sculptor & Harmonic Explorer',
    tagline: 'Your soul responds deeply to vibration, rhythm, and auditory world-building.',
    suggestedInterests: [
      { title: 'Electronic Music Production', desc: 'Build immersive atmospheric beats and synth sequences in a DAW.' },
      { title: 'Acoustic Fingerstyle Guitar', desc: 'Express pure acoustic warmth with percussive and melodic fingerpicking.' },
      { title: 'Ambient Soundscapes & Foley', desc: 'Record nature sounds, rain, and train stations to create soothing audio.' }
    ],
    starterPack: 'Reaper or Ableton Lite, closed-back studio headphones, USB MIDI controller.'
  },
  'Gastronomy': {
    title: 'Flavor Alchemist & Epicurean',
    tagline: 'You celebrate life through aroma, sensory nuance, and the ancient art of hospitality.',
    suggestedInterests: [
      { title: 'Artisanal Pour-Over Coffee (V60)', desc: 'Dial in grind micron sizes, water temperatures, and floral notes.' },
      { title: 'Wild Sourdough Baking', desc: 'Nurture living wild yeast cultures to bake crackling, airy loaves.' },
      { title: 'Farm-to-Table Cookery & Knife Skills', desc: 'Master heat control, emulsions, and balancing acid with umami.' }
    ],
    starterPack: 'Hario V60 dripper, digital gram scale with timer, 8-inch chef knife.'
  }
};
