import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { Shirt, ArrowRightLeft, CheckCircle, Bell, Plus, Search, Star, Clock, Inbox, ChevronRight } from 'lucide-react';
import ItemCard from '../components/ItemCard';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [recentItems, setRecentItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashRes, notifRes] = await Promise.all([
          api.get('/users/dashboard'),
          api.get('/users/notifications')
        ]);
        setStats(dashRes.data.stats);
        setRecentItems(dashRes.data.recentItems);
        setNotifications(notifRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/users/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12">
      
      {/* Welcome Hero Card */}
      <div className="bg-brand-dark rounded-2xl overflow-hidden shadow-md relative">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <div className="w-20 h-20 bg-warm-cream rounded-full flex items-center justify-center text-brand-dark font-bold text-3xl shadow-inner border-4 border-brand-light">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-brand-light text-base max-w-md leading-relaxed">
                Manage your wardrobe, track swaps, and continue your sustainable fashion journey with ReWear.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link to="/list-item" className="bg-danger-tag text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center hover:bg-orange-700 transition shadow-sm">
              <Plus className="w-5 h-5 mr-2" /> List New Item
            </Link>
            <Link to="/marketplace" className="bg-white/10 text-white border border-white/20 px-6 py-3 rounded-xl font-semibold flex items-center justify-center hover:bg-white/20 transition backdrop-blur-sm">
              <Search className="w-5 h-5 mr-2" /> Browse Marketplace
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-brand-light text-brand-primary rounded-xl group-hover:scale-110 transition-transform"><Shirt className="w-6 h-6" /></div>
          </div>
          <div>
            <p className="text-text-muted text-sm font-medium mb-1">Active Listings</p>
            <p className="text-3xl font-bold text-brand-dark">{stats?.activeListings || 0}</p>
            <p className="text-xs text-text-muted mt-2 flex items-center">Your available wardrobe</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-warning rounded-xl group-hover:scale-110 transition-transform"><Clock className="w-6 h-6" /></div>
          </div>
          <div>
            <p className="text-text-muted text-sm font-medium mb-1">Pending Requests</p>
            <p className="text-3xl font-bold text-brand-dark">{stats?.pendingSwaps || 0}</p>
            <p className="text-xs text-text-muted mt-2 flex items-center">Awaiting your response</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-success rounded-xl group-hover:scale-110 transition-transform"><CheckCircle className="w-6 h-6" /></div>
          </div>
          <div>
            <p className="text-text-muted text-sm font-medium mb-1">Completed Swaps</p>
            <p className="text-3xl font-bold text-brand-dark">{stats?.completedSwaps || 0}</p>
            <p className="text-xs text-text-muted mt-2 flex items-center">Successful exchanges</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-brand-light text-danger-tag rounded-xl group-hover:scale-110 transition-transform"><Star className="w-6 h-6" /></div>
          </div>
          <div>
            <p className="text-text-muted text-sm font-medium mb-1">Estimated Value</p>
            <p className="text-3xl font-bold text-brand-dark">{stats?.totalPointsValue || 0} <span className="text-lg text-text-muted font-normal">pts</span></p>
            <p className="text-xs text-text-muted mt-2 flex items-center">Total closet points</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Swap Activity Timeline (Mocked for design, to be connected if data exists) */}
          <div className="bg-white rounded-2xl border border-border-subtle shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-brand-dark mb-6">Your Swap Activity</h2>
            {stats?.completedSwaps > 0 || stats?.pendingSwaps > 0 ? (
              <div className="relative flex justify-between items-center px-4 md:px-10">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-brand-light -z-10 transform -translate-y-1/2"></div>
                
                {/* Steps */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold shadow-md z-10"><Shirt className="w-5 h-5" /></div>
                  <p className="text-xs font-semibold mt-2 text-brand-dark">Listed</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-danger-tag text-white flex items-center justify-center font-bold shadow-md z-10"><Inbox className="w-5 h-5" /></div>
                  <p className="text-xs font-semibold mt-2 text-brand-dark">Requested</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-warning text-white flex items-center justify-center font-bold shadow-md z-10"><ArrowRightLeft className="w-5 h-5" /></div>
                  <p className="text-xs font-semibold mt-2 text-brand-dark">Swapping</p>
                </div>
                <div className="flex flex-col items-center opacity-50">
                  <div className="w-10 h-10 rounded-full bg-brand-light text-text-muted border-2 border-border-subtle flex items-center justify-center font-bold shadow-sm z-10"><CheckCircle className="w-5 h-5" /></div>
                  <p className="text-xs font-medium mt-2 text-text-muted">Completed</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 px-4 bg-brand-light/30 rounded-xl border border-dashed border-border-subtle">
                <p className="text-text-muted text-sm">You haven't initiated any swaps yet.</p>
                <Link to="/marketplace" className="text-brand-primary font-medium text-sm hover:underline mt-2 inline-block">Find items to swap</Link>
              </div>
            )}
          </div>

          {/* Recent Listings */}
          <div>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-xl font-bold text-brand-dark">My Recent Listings</h2>
                <p className="text-sm text-text-muted mt-1">Items you've added to the community</p>
              </div>
              <Link to="/profile" className="text-sm font-semibold text-danger-tag hover:text-orange-700 transition flex items-center">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            {recentItems.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-border-subtle shadow-sm text-center">
                <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shirt className="w-10 h-10 text-brand-primary" />
                </div>
                <h3 className="font-bold text-xl text-brand-dark mb-2">No listings yet</h3>
                <p className="text-text-muted mb-6 max-w-md mx-auto">Start your sustainable wardrobe journey by uploading your first pre-loved item to the marketplace!</p>
                <Link to="/list-item" className="bg-brand-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-dark transition inline-flex items-center shadow-sm">
                  <Plus className="w-5 h-5 mr-2" /> List Your First Item
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recentItems.slice(0, 4).map(item => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Notifications Panel */}
          <div className="bg-white rounded-2xl border border-border-subtle shadow-sm flex flex-col h-[500px]">
            <div className="p-5 border-b border-border-subtle flex justify-between items-center bg-brand-light/30 rounded-t-2xl">
              <h2 className="text-lg font-bold text-brand-dark flex items-center">
                <Bell className="w-5 h-5 mr-2 text-brand-primary" /> Notifications
              </h2>
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="bg-danger-tag text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {notifications.filter(n => !n.isRead).length} New
                </span>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="text-center text-text-muted flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-3">
                    <Bell className="w-8 h-8 text-brand-primary/50" />
                  </div>
                  <h3 className="font-semibold text-brand-dark mb-1">All caught up!</h3>
                  <p className="text-sm">You have no new notifications.</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif._id} 
                    onClick={() => !notif.isRead && markAsRead(notif._id)}
                    className={`p-4 rounded-xl border text-sm cursor-pointer transition flex items-start ${notif.isRead ? 'bg-white border-border-subtle/60 text-text-muted' : 'bg-brand-light/30 border-brand-primary/30 text-text-main shadow-sm hover:shadow-md'}`}
                  >
                    <div className={`mt-1 mr-3 w-2 h-2 rounded-full flex-shrink-0 ${notif.isRead ? 'bg-transparent' : 'bg-danger-tag'}`}></div>
                    <div>
                      <p className={`mb-1.5 ${notif.isRead ? 'font-normal' : 'font-semibold text-brand-dark'}`}>{notif.message}</p>
                      <span className="text-xs text-text-muted font-medium flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-4 border-t border-border-subtle text-center bg-gray-50/50 rounded-b-2xl">
                <button className="text-sm font-semibold text-brand-primary hover:text-brand-dark transition">Mark all as read</button>
              </div>
            )}
          </div>

          {/* Active Swap Requests Placeholder */}
          <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-sm">
            <h2 className="text-lg font-bold text-brand-dark mb-4">Active Requests</h2>
            <div className="p-4 bg-brand-light/50 rounded-xl border border-dashed border-danger-tag/40 text-center">
              <ArrowRightLeft className="w-8 h-8 mx-auto text-danger-tag mb-2 opacity-80" />
              <p className="text-sm font-medium text-brand-dark mb-1">No active requests</p>
              <p className="text-xs text-text-muted">When someone requests your item, it will appear here.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}