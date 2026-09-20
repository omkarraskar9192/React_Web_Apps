import { createSlice } from '@reduxjs/toolkit';

const initialProjects = [
  {
    id: '1',
    title: 'Aether OS Simulator',
    description: 'Web-based Unix kernel simulator with real-time process scheduling and virtual memory visualizer.',
    category: 'systems',
    stars: 342,
    forks: 89,
    tags: ['Rust', 'WebAssembly', 'React', 'C++'],
    author: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    demoUrl: '#',
    repoUrl: 'https://github.com',
  },
  {
    id: '2',
    title: 'Synapse Neural Vision',
    description: 'Client-side edge AI engine performing real-time hand gesture recognition and spatial UI manipulation in 3D.',
    category: 'ai',
    stars: 521,
    forks: 134,
    tags: ['PyTorch', 'TensorFlow.js', 'Three.js', 'WebGL'],
    author: 'Sarah Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    demoUrl: '#',
    repoUrl: 'https://github.com',
  },
  {
    id: '3',
    title: 'KubePulse Cloud Monitor',
    description: 'Zero-overhead distributed microservice latency analyzer and Kubernetes traffic visualization dashboard.',
    category: 'cloud',
    stars: 284,
    forks: 67,
    tags: ['Go', 'Docker', 'Kubernetes', 'GraphQL'],
    author: 'Marcus Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    demoUrl: '#',
    repoUrl: 'https://github.com',
  },
  {
    id: '4',
    title: 'HyperLink Web3 Protocol',
    description: 'Decentralized peer-to-peer developer artifact sharing network with cryptographic integrity proofs.',
    category: 'web',
    stars: 412,
    forks: 98,
    tags: ['Solidity', 'Ethereum', 'TypeScript', 'Tailwind'],
    author: 'Priya Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    demoUrl: '#',
    repoUrl: 'https://github.com',
  },
];

const initialEvents = [
  {
    id: 'hack-2026',
    title: 'HackMatrix 2026: Global Collegiate Hackathon',
    targetDate: '2026-10-15T18:00:00Z',
    prizePool: '$15,000',
    registrations: 428,
    track: 'AI & Systems',
    status: 'open',
  },
  {
    id: 'workshop-webgl',
    title: 'Mastering Shaders & 3D WebGL in React',
    targetDate: '2026-09-28T14:00:00Z',
    instructor: 'Alex Rivera (Lead Engineer)',
    track: 'Creative Tech',
    status: 'upcoming',
  }
];

const initialState = {
  projects: initialProjects,
  selectedCategory: 'all',
  events: initialEvents,
  stats: {
    activeBuilders: 320,
    githubCommitsThisMonth: 1842,
    projectsShipped: 38,
    hackathonWins: 14,
  },
  upcomingHackathon: {
    name: 'HackMatrix 2026',
    date: '2026-10-15T18:00:00Z',
    prize: '$15,000',
    slotsLeft: 42,
  }
};

export const clubSlice = createSlice({
  name: 'club',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    upvoteProject: (state, action) => {
      const project = state.projects.find((p) => p.id === action.payload);
      if (project) {
        project.stars += 1;
      }
    },
  },
});

export const { setSelectedCategory, upvoteProject } = clubSlice.actions;
export default clubSlice.reducer;

