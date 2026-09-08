import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Shirt, Bell, User as UserIcon, Menu, X, LayoutDashboard, LogOut, Settings, List, Repeat, Search, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const { data } = await api.get('/users/notifications');
          setNotifications(data);
        } catch (error) {
          console.error("Failed to fetch notifications");
        }
      };
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await api.put(`/users/notifications/${notif._id}/read`);
        setNotifications(notifications.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
      } catch (err) {
        console.error(err);
      }
    }
    setIsNotificationOpen(false);
    if (notif.relatedSwap) {
      navigate('/swaps');
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const NavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className={`relative font-medium transition px-4 py-2 text-sm group ${isActive(to) ? 'text-brand-dark font-semibold' : 'text-text-muted hover:text-brand-dark'}`}
    >
      {children}
      <span className={`absolute left-0 bottom-0 w-full h-0.5 bg-brand-primary transition-transform origin-left duration-300 ${isActive(to) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
    </Link>
  );

  return (
    <nav className="bg-bg-card border-b border-border-subtle sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo - Left */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl tracking-tight hover:opacity-90 transition text-brand-dark">
            <Shirt className="h-6 w-6 text-brand-primary" fill="currentColor" />
            <span>ReWear</span>
          </Link>
          
          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex space-x-6 items-center">
            <NavLink to="/marketplace">Marketplace</NavLink>
            <NavLink to="/list-item">List an Item</NavLink>
            {user ? (
              <>
                <NavLink to="/how-it-works">How it Works</NavLink>
                <NavLink to="/about-us">About Us</NavLink>
                <NavLink to="/community">Community</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/how-it-works">How it Works</NavLink>
                <NavLink to="/about-us">About Us</NavLink>
                <NavLink to="/community">Community</NavLink>
              </>
            )}
            {/* The image shows Marketplace, List an Item, My Swaps, Messages for logged in */}
            {user && (
              <>
                <NavLink to="/swaps">My Swaps</NavLink>
                <NavLink to="/chat">Messages</NavLink>
              </>
            )}
          </div>
          
          {/* Desktop Actions - Right */}
          <div className="hidden lg:flex items-center space-x-5">
            {user ? (
              <>
                <button className="text-text-main hover:text-brand-primary transition">
                   <Search className="h-5 w-5" />
                </button>
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button 
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="p-1 text-text-main hover:text-brand-primary transition relative"
                  >
                    <Bell className="h-5 w-5" />
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-danger-tag rounded-full border-2 border-white"></span>
                    )}
                  </button>
                  
                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-bg-card rounded-xl shadow-lg py-2 text-text-main border border-border-subtle origin-top-right transform transition-all">
                      <div className="px-4 py-2 border-b border-border-subtle flex justify-between items-center">
                        <h3 className="font-semibold text-brand-dark">Notifications</h3>
                        {notifications.filter(n => !n.isRead).length > 0 && (
                          <span className="text-xs font-medium bg-brand-light text-brand-primary px-2 py-0.5 rounded-full">{notifications.filter(n => !n.isRead).length} New</span>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-text-muted">No notifications yet</div>
                        ) : (
                          notifications.map((notif) => (
                            <div 
                              key={notif._id} 
                              onClick={() => handleNotificationClick(notif)}
                              className={`px-4 py-3 cursor-pointer transition border-b border-border-subtle/50 ${notif.isRead ? 'hover:bg-bg-main opacity-70' : 'bg-brand-light/30 hover:bg-brand-light/50'}`}
                            >
                              <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-brand-dark">{notif.title}</p>
                                {!notif.isRead && <span className="h-2 w-2 bg-danger-tag rounded-full mt-1.5 flex-shrink-0"></span>}
                              </div>
                              <p className="text-xs text-text-muted mt-1">{notif.message}</p>
                              <p className="text-xs text-brand-accent mt-2 font-medium">
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-border-subtle text-center">
                        <button onClick={() => setIsNotificationOpen(false)} className="text-sm text-brand-primary font-medium hover:underline">Close</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center transition pl-2"
                  >
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=1A4731&color=fff`} 
                      alt="Profile" 
                      className="h-9 w-9 rounded-full object-cover border border-border-subtle"
                    />
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-bg-card rounded-xl shadow-lg py-2 text-text-main border border-border-subtle origin-top-right transform transition-all">
                      <div className="px-4 py-3 border-b border-border-subtle mb-1">
                        <p className="font-semibold text-brand-dark truncate">{user.name}</p>
                        <p className="text-xs text-text-muted truncate">{user.email}</p>
                      </div>
                      
                      {user.role === 'admin' && (
                        <Link to="/admin" className="flex items-center px-4 py-2 text-sm hover:bg-bg-main hover:text-brand-primary transition">
                          <ShieldCheck className="h-4 w-4 mr-3 text-text-muted" />
                          Admin Panel
                        </Link>
                      )}
                      
                      <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm hover:bg-bg-main hover:text-brand-primary transition">
                        <LayoutDashboard className="h-4 w-4 mr-3 text-text-muted" />
                        My Dashboard
                      </Link>
                      <Link to="/profile" className="flex items-center px-4 py-2 text-sm hover:bg-bg-main hover:text-brand-primary transition">
                        <UserIcon className="h-4 w-4 mr-3 text-text-muted" />
                        My Profile
                      </Link>
                      <Link to="/marketplace?user=me" className="flex items-center px-4 py-2 text-sm hover:bg-bg-main hover:text-brand-primary transition">
                        <List className="h-4 w-4 mr-3 text-text-muted" />
                        My Listings
                      </Link>
                      <Link to="/swaps" className="flex items-center px-4 py-2 text-sm hover:bg-bg-main hover:text-brand-primary transition">
                        <Repeat className="h-4 w-4 mr-3 text-text-muted" />
                        My Swaps
                      </Link>
                      <Link to="/settings" className="flex items-center px-4 py-2 text-sm hover:bg-bg-main hover:text-brand-primary transition">
                        <Settings className="h-4 w-4 mr-3 text-text-muted" />
                        Settings
                      </Link>
                      
                      <div className="border-t border-border-subtle mt-1 pt-1">
                        <button 
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-danger-tag hover:bg-red-50 transition"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button className="p-1 text-text-main hover:text-brand-primary transition relative">
                  <Bell className="h-5 w-5" />
                </button>
                <Link to="/auth" className="text-brand-dark font-medium hover:text-brand-primary transition text-sm">
                  Login
                </Link>
                <Link to="/auth?tab=signup" className="bg-brand-dark text-white hover:bg-brand-primary px-5 py-2 rounded-md transition font-medium text-sm shadow-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <button className="text-text-main relative">
              <Bell className="h-6 w-6" />
              {user && notifications.filter(n => !n.isRead).length > 0 && (
                <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-danger-tag rounded-full border-2 border-white"></span>
              )}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-main transition"
            >
              {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-bg-card border-t border-border-subtle absolute w-full left-0 shadow-lg pb-6">
          <div className="flex flex-col px-4 pt-2 space-y-1">
            <Link to="/marketplace" className={`block px-4 py-3 rounded-md text-sm font-medium ${isActive('/marketplace') ? 'bg-brand-light text-brand-dark' : 'text-text-muted'}`}>Marketplace</Link>
            <Link to="/list-item" className={`block px-4 py-3 rounded-md text-sm font-medium ${isActive('/list-item') ? 'bg-brand-light text-brand-dark' : 'text-text-muted'}`}>List an Item</Link>
            <Link to="/how-it-works" className={`block px-4 py-3 rounded-md text-sm font-medium ${isActive('/how-it-works') ? 'bg-brand-light text-brand-dark' : 'text-text-muted'}`}>How it Works</Link>
            <Link to="/about-us" className={`block px-4 py-3 rounded-md text-sm font-medium ${isActive('/about-us') ? 'bg-brand-light text-brand-dark' : 'text-text-muted'}`}>About Us</Link>
            <Link to="/community" className={`block px-4 py-3 rounded-md text-sm font-medium ${isActive('/community') ? 'bg-brand-light text-brand-dark' : 'text-text-muted'}`}>Community</Link>
            
            {user ? (
              <>
                <Link to="/swaps" className={`block px-4 py-3 rounded-md text-sm font-medium ${isActive('/swaps') ? 'bg-brand-light text-brand-dark' : 'text-text-muted'}`}>My Swaps</Link>
                <Link to="/chat" className={`block px-4 py-3 rounded-md text-sm font-medium ${isActive('/chat') ? 'bg-brand-light text-brand-dark' : 'text-text-muted'}`}>Messages</Link>
                
                <div className="pt-4 mt-2 border-t border-border-subtle">
                  <div className="flex items-center px-4 mb-4">
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=1A4731&color=fff`} 
                      alt="Profile" 
                      className="h-10 w-10 rounded-full object-cover border border-border-subtle mr-3"
                    />
                    <div>
                      <p className="font-semibold text-brand-dark">{user.name}</p>
                      <p className="text-xs text-text-muted">{user.email || 'Member'}</p>
                    </div>
                  </div>
                  <Link to="/dashboard" className="flex items-center px-4 py-3 text-sm font-medium text-text-main rounded-md">
                    <LayoutDashboard className="h-5 w-5 mr-3 text-text-muted" /> Dashboard
                  </Link>
                  <Link to="/profile" className="flex items-center px-4 py-3 text-sm font-medium text-text-main rounded-md">
                    <UserIcon className="h-5 w-5 mr-3 text-text-muted" /> Profile
                  </Link>
                  <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-sm font-medium text-danger-tag text-left rounded-md">
                    <LogOut className="h-5 w-5 mr-3" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-4 mt-2 border-t border-border-subtle px-4 flex flex-col space-y-3">
                <Link to="/auth" className="text-center py-2 text-brand-dark font-medium border border-border-subtle rounded-md">
                  Login
                </Link>
                <Link to="/auth?tab=signup" className="text-center py-2 bg-brand-dark text-white font-medium rounded-md">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}