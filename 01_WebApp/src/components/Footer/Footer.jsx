import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Code2, Heart } from 'lucide-react';
import { GithubIcon, TwitterIcon, DiscordIcon } from '../common/Icons';

export default function Footer() {
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);

  return (
    <footer className={`w-full mt-auto border-t py-12 transition-colors duration-500 ${
      isDarkMode
        ? 'border-white/10 bg-slate-950 text-slate-400'
        : 'border-slate-200 bg-slate-50 text-slate-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Code2 className="w-4 h-4" />
              </div>
              <span className={`font-extrabold text-base tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                CYBER TECH
              </span>
            </div>
            <p className={`text-xs max-w-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              An open collegiate developer society dedicated to building high-impact open-source systems, competitive hacking, and technical leadership.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className={`text-xs font-mono font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-cyan-500 transition-colors">Home Portal</Link></li>
              <li><Link to="/content" className="hover:text-cyan-500 transition-colors">Projects & Repos</Link></li>
              <li><Link to="/team" className="hover:text-cyan-500 transition-colors">Core Team & Mentors</Link></li>
              <li><Link to="/about" className="hover:text-cyan-500 transition-colors">About Our Vision</Link></li>
            </ul>
          </div>

          {/* Community & Socials */}
          <div>
            <h4 className={`text-xs font-mono font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
              Connect
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                  isDarkMode
                    ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
                    : 'bg-white hover:bg-slate-200 text-slate-700 hover:text-slate-950 border-slate-200 shadow-sm'
                }`}
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                  isDarkMode
                    ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
                    : 'bg-white hover:bg-slate-200 text-slate-700 hover:text-slate-950 border-slate-200 shadow-sm'
                }`}
              >
                <DiscordIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                  isDarkMode
                    ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
                    : 'bg-white hover:bg-slate-200 text-slate-700 hover:text-slate-950 border-slate-200 shadow-sm'
                }`}
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono ${
          isDarkMode ? 'border-white/5 text-slate-400' : 'border-slate-200 text-slate-600'
        }`}>
          <p>&copy; {new Date().getFullYear()} Cyber Tech Developer Collective. Open Source under MIT License.</p>
          <p className="flex items-center gap-1 text-slate-500">
            Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> by Club Engineers
          </p>
        </div>
      </div>
    </footer>
  );
}