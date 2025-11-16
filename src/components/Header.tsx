import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  hideDock?: boolean;
}

const Header = ({ hideDock = false }: HeaderProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timeInterval);
    };
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (hideDock) return null;

  return (
    <header className={`fixed left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out ${scrolled ? 'top-2' : 'top-4'}`}>
      <nav className="flex items-center space-x-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 shadow-2xl transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-3xl">
        {/* Left - Date and Time */}
        <div className="flex items-center">
          <div className="text-white/90 font-medium">
            <div className="text-sm">{formatTime(currentTime)}</div>
            <div className="text-xs text-white/70">{formatDate(currentTime)}</div>
          </div>
        </div>

        {/* Separator */}
        <div className="w-px h-8 bg-white/20"></div>

        {/* Navigation Icons - Only Home, About, Contact */}
        <div className="flex items-center space-x-3">
          {/* Home */}
          <button onClick={() => navigate('/')} className="nav-dock-item group relative" title="Home">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="nav-tooltip">Home</span>
          </button>

          {/* About */}
          <button onClick={() => navigate('/about')} className="nav-dock-item group relative" title="About">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="nav-tooltip">About</span>
          </button>

          {/* Contact */}
          <button onClick={() => navigate('/contact')} className="nav-dock-item group relative" title="Contact">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="nav-tooltip">Contact</span>
          </button>
        </div>

        {/* Separator */}
        <div className="w-px h-8 bg-white/20"></div>

        {/* Right - Brand */}
        <div className="flex items-center">
          <div className="text-white/90 font-bold text-sm">CodeCrafts Infotech</div>
        </div>
      </nav>
    </header>
  );
};

export default Header;