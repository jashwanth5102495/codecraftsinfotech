import { Link } from 'react-router-dom';
import { brandName } from '@/brand';
import { useCart } from '@/contexts/CartContext';

const Header = () => {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
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
            <Link to="/internship" className="hover:text-white">INTERNSHIP</Link>
            <Link to="/projects" className="hover:text-white">PROJECTS</Link>
            <Link to="/contact" className="hover:text-white">CONTACT</Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link to="/checkout" className="relative flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-3 py-2">
              <span role="img" aria-label="cart">🛒</span>
              <span className="text-xs">Cart</span>
              <span className="absolute -top-1 -right-1 text-[10px] bg-blue-600 rounded-full px-2 py-0.5">{count}</span>
            </Link>
            <a href="#require-call" className="softpro-btn softpro-btn--secondary">REQUIRE A CALL</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;