import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Camera, MessageCircle, Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-warm-cream pt-16 pb-8 border-t-[6px] border-danger-tag mt-auto">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Brand & Intro */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-white mb-6 hover:opacity-90 transition">
              <Shirt className="w-8 h-8 text-danger-tag" />
              <span>ReWear</span>
            </Link>
            <p className="text-brand-light text-sm mb-6 leading-relaxed">
              The sustainable clothing exchange and swap marketplace. Refresh your wardrobe without hurting the planet or your wallet.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 bg-brand-primary flex items-center justify-center rounded-full text-warm-cream hover:bg-danger-tag hover:text-white transition shadow-sm"><Camera className="w-4 h-4" /></a>
              <a href="#" className="h-10 w-10 bg-brand-primary flex items-center justify-center rounded-full text-warm-cream hover:bg-danger-tag hover:text-white transition shadow-sm"><MessageCircle className="w-4 h-4" /></a>
              <a href="#" className="h-10 w-10 bg-brand-primary flex items-center justify-center rounded-full text-warm-cream hover:bg-danger-tag hover:text-white transition shadow-sm"><Globe className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Explore</h4>
            <ul className="space-y-3 text-sm text-brand-light">
              <li><Link to="/marketplace" className="hover:text-danger-tag transition inline-block">Marketplace</Link></li>
              <li><Link to="/list-item" className="hover:text-danger-tag transition inline-block">List an Item</Link></li>
              <li><Link to="/dashboard" className="hover:text-danger-tag transition inline-block">My Dashboard</Link></li>
              <li><Link to="/swaps" className="hover:text-danger-tag transition inline-block">Swap History</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Support</h4>
            <ul className="space-y-3 text-sm text-brand-light">
              <li><Link to="/how-it-works" className="hover:text-danger-tag transition inline-block">How it Works</Link></li>
              <li><Link to="/swap-guidelines" className="hover:text-danger-tag transition inline-block">Swap Guidelines</Link></li>
              <li><Link to="/trust-safety" className="hover:text-danger-tag transition inline-block">Trust & Safety</Link></li>
              <li><Link to="/faq" className="hover:text-danger-tag transition inline-block">FAQ</Link></li>
              <li><Link to="/contact-us" className="hover:text-danger-tag transition inline-block">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Stay Sustainable</h4>
            <p className="text-brand-light text-sm mb-4">Join our newsletter for sustainable fashion tips and local swap events.</p>
            <form className="flex flex-col space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-white text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-danger-tag shadow-inner"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-danger-tag text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-orange-700 transition shadow-sm"
              >
                Join the Community
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-primary pt-8 pb-4 flex flex-col md:flex-row justify-between items-center text-xs text-brand-light">
          <p>&copy; {new Date().getFullYear()} ReWear Marketplace. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/admin-login" className="hover:text-white transition font-medium text-danger-tag">Admin Portal</Link>
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}