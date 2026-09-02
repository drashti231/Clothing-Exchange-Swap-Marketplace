import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shirt, Search, User } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'About', path: '/#about' }
  ];

  const isActive = (path) => {
    return location.pathname === path ? 'text-[var(--color-secondary)] font-semibold' : 'text-[var(--color-text-main)] hover:text-[var(--color-secondary)]';
  };

  return (
    <nav className="bg-white border-b border-[var(--color-border-main)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-[var(--color-primary)] text-white p-2 rounded-lg">
                <Shirt size={24} />
              </div>
              <span className="font-extrabold text-2xl text-[var(--color-primary-dark)] tracking-tight">ReWear</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`transition-colors duration-200 ${isActive(link.path)}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4 border-l border-[var(--color-border-main)] pl-6">
              <Link to="/login" className="text-[var(--color-text-main)] font-medium hover:text-[var(--color-secondary)] transition-colors">
                Log in
              </Link>
              <Link to="/register" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-5 py-2.5 rounded-full font-medium transition-colors duration-200 shadow-sm">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[var(--color-text-main)] hover:text-[var(--color-secondary)] focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-[var(--color-border-main)]">
          <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-3 rounded-md text-base font-medium ${isActive(link.path)}`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-[var(--color-border-main)] flex flex-col gap-3 px-3">
              <Link
                to="/login"
                className="w-full text-center py-3 text-[var(--color-text-main)] font-medium border border-[var(--color-border-main)] rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="w-full text-center py-3 bg-[var(--color-primary)] text-white font-medium rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
