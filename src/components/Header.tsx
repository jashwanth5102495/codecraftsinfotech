import { Link } from 'react-router-dom';
import { brandName } from '@/brand';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between rounded-full bg-white/8 backdrop-blur-md ring-1 ring-white/20 px-6 py-3 text-white">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-white/10 ring-1 ring-white/20 flex items-center justify-center text-sm">◎</div>
            <span className="font-semibold tracking-wide">{brandName}</span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6 text-xs">
            <Link to="/" className="hover:text-white">HOME</Link>
            <Link to="/about" className="hover:text-white">ABOUT US</Link>
            <Link to="/career" className="hover:text-white">CAREER</Link>
            <Link to="/contact" className="hover:text-white">CONTACT</Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a href="#require-call" className="softpro-btn softpro-btn--secondary">REQUIRE A CALL</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;