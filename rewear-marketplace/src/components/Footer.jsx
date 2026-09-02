import { Link } from 'react-router-dom';
import { Shirt, Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[var(--color-primary-dark)] text-[var(--color-lavender)] pt-16 pb-8 border-t border-[#3c2a47]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          {/* Brand & Intro */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 text-white">
              <Shirt size={24} className="text-[var(--color-accent)]" />
              <span className="font-extrabold text-2xl tracking-tight">ReWear</span>
            </Link>
            <p className="text-sm text-[#c7bcd4] mb-6 leading-relaxed">
              Swap Your Style. Give Clothes a Second Life. Join our community and refresh your wardrobe sustainably.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#c7bcd4] hover:text-[var(--color-accent)] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-[#c7bcd4] hover:text-[var(--color-accent)] transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-[#c7bcd4] hover:text-[var(--color-accent)] transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/marketplace" className="text-[#c7bcd4] hover:text-white transition-colors text-sm">Marketplace</Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="text-[#c7bcd4] hover:text-white transition-colors text-sm">How it Works</Link>
              </li>
              <li>
                <Link to="/#about" className="text-[#c7bcd4] hover:text-white transition-colors text-sm">About Us</Link>
              </li>
              <li>
                <Link to="/#sustainability" className="text-[#c7bcd4] hover:text-white transition-colors text-sm">Sustainability</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-[#c7bcd4] hover:text-white transition-colors text-sm">FAQ</Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-[#c7bcd4] hover:text-white transition-colors text-sm">Swap Guidelines</Link>
              </li>
              <li>
                <Link to="/safety" className="text-[#c7bcd4] hover:text-white transition-colors text-sm">Trust & Safety</Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#c7bcd4] hover:text-white transition-colors text-sm">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Stay Updated</h3>
            <p className="text-sm text-[#c7bcd4] mb-4">
              Get the latest arrivals and community news.
            </p>
            <form className="flex flex-col gap-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-[#3c2a47] border border-[#523d5e] rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)]"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-[var(--color-secondary)] hover:bg-[#6c4be0] text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-[#3c2a47] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#c7bcd4] text-xs">
            &copy; {new Date().getFullYear()} ReWear Marketplace. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-[#c7bcd4]">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
