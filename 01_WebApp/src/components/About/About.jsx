import React from 'react';

export default function About() {
  // Mock data for the team section
  const team = [
    { name: 'Sarah Jenkins', role: 'CEO & Founder', image: 'https://unsplash.com' },
    { name: 'Marcus Chen', role: 'Chief Technology Officer', image: 'https://unsplash.com' },
    { name: 'Elena Rostova', role: 'Head of Design', image: 'https://unsplash.com' },
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 px-6 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            We are on a mission to empower creators
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto">
            Building the next generation of digital workflows, helping teams collaborate seamlessly across borders.
          </p>
        </div>
      </section>

      {/* 2. OUR STORY / MISSION (Split Layout) */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Founded in 2021, we started as a small team of three working out of a garage. Today, we are proud to support thousands of active users globally with a distributed, remote-first team.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe in radical transparency, intentional design, and building software that addresses real workflows rather than adding digital noise.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://unsplash.com" 
              alt="Team collaboration" 
              className="rounded-xl shadow-lg object-cover w-full h-80"
            />
          </div>
        </div>
      </section>

      {/* 3. CORE STATS GRID */}
      <section className="bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-extrabold text-blue-600">2021</p>
            <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">Founded</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-blue-600">50+</p>
            <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">Global Team</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-blue-600">12M+</p>
            <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">Lines of Code</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-blue-600">99.9%</p>
            <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">Uptime</p>
          </div>
        </div>
      </section>

      {/* 4. TEAM SECTION */}
      <section className="py-16 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-2">Meet the Leadership</h2>
        <p className="text-gray-500 mb-12 max-w-lg mx-auto">The driving force behind our vision and product development execution.</p>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-24 h-24 rounded-full mx-auto object-cover mb-4 ring-4 ring-indigo-50"
              />
              <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
              <p className="text-sm text-indigo-600 font-medium mb-3">{member.role}</p>
              <p className="text-sm text-gray-500">Passionate builder focused on driving customer success and elegant experiences.</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
