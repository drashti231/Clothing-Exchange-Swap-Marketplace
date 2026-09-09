import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { Shirt, ArrowRightLeft, CheckCircle, Bell, Plus, Search, Star, Clock, Inbox, ChevronRight, Droplets, Cloud, Recycle } from 'lucide-react';
import ItemCard from '../components/ItemCard';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentItems, setRecentItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashRes, notifRes, recRes] = await Promise.all([
          api.get('/users/dashboard'),
          api.get('/users/notifications'),
          api.get('/items/user/recommendations')
        ]);
        setStats(dashRes.data.stats);
        setRecentItems(dashRes.data.recentItems);
        setNotifications(notifRes.data);
        setRecommendations(recRes.data);
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

  // Derived metrics for UI
  const waterSaved = (stats?.completedSwaps || 0) * 2700;
  const carbonReduced = ((stats?.completedSwaps || 0) * 2.1).toFixed(1);
  const wasteDiverted = ((stats?.completedSwaps || 0) * 0.3).toFixed(1);

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-8 pb-16 relative overflow-hidden">
      {/* Decorative ambient blobs behind the UI */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-[20%] right-0 w-[400px] h-[400px] bg-[#E8F0EA] rounded-full blur-[80px] translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        
        {/* TOP ROW: Profile & Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Block 1: Profile Summary */}
          <div className="md:col-span-4 bg-brand-primary/5 rounded-[2rem] p-6 sm:p-8 flex flex-col items-center justify-center border border-white/40 shadow-sm backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-4 right-6 cursor-pointer opacity-50 hover:opacity-100 transition">
               <div className="flex space-x-1">
                 <div className="w-1.5 h-1.5 bg-brand-dark rounded-full"></div>
                 <div className="w-1.5 h-1.5 bg-brand-dark rounded-full"></div>
                 <div className="w-1.5 h-1.5 bg-brand-dark rounded-full"></div>
               </div>
            </div>

            <img 
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=1A4731&color=fff&size=128`} 
              alt={user?.name} 
              className="w-24 h-24 rounded-full shadow-md object-cover border-4 border-white mb-4"
            />
            <h1 className="text-2xl font-bold text-brand-dark">{user?.name}</h1>
            <p className="text-text-muted text-sm font-medium mb-6 flex items-center">
              <span className="w-2 h-2 rounded-full bg-success-tag mr-2"></span> Member
            </p>

            <div className="grid grid-cols-3 gap-8 w-full text-center border-t border-brand-dark/10 pt-6">
               <div>
                  <p className="text-2xl font-bold text-brand-dark">{stats?.completedSwaps || 0}</p>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Swaps</p>
               </div>
               <div>
                  <p className="text-2xl font-bold text-brand-dark">{stats?.activeListings || 0}</p>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Items</p>
               </div>
               <div>
                  <p className="text-2xl font-bold text-brand-dark flex justify-center items-center">
                    {user?.rating?.toFixed(1) || 'N/A'}
                  </p>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Rating</p>
               </div>
            </div>

            <button 
              onClick={() => navigate('/profile')} 
              className="mt-6 w-full py-3 rounded-full bg-white text-brand-dark border border-brand-dark/10 font-bold shadow-sm hover:bg-brand-primary hover:text-white transition-all"
            >
              View Profile
            </button>
          </div>

          {/* Bento Block 2: Impact & Notifications */}
          <div className="md:col-span-8 grid grid-rows-1 md:grid-rows-2 gap-6">
             
             {/* Impact Banner */}
             <div className="bg-gradient-to-br from-[#E2EBE5] to-[#D4E0D8] rounded-[2rem] p-6 md:p-8 flex flex-col justify-center relative overflow-hidden shadow-sm border border-white/50">
                <div className="absolute right-4 top-4 opacity-10">
                   <Recycle className="w-32 h-32" />
                </div>
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <h2 className="text-xl font-bold text-brand-dark">Sustainability Impact</h2>
                  <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-full cursor-pointer hover:bg-white transition text-brand-dark">
                    <Star className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-sm text-brand-dark/70 font-medium mb-6 relative z-10">Glassmorphism effect with blur</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                   <div className="bg-white/40 backdrop-blur-md rounded-2xl p-4 flex items-center shadow-sm border border-white/30">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 flex-shrink-0">
                         <Droplets className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-lg font-bold text-brand-dark leading-tight">{waterSaved.toLocaleString()}L</p>
                         <p className="text-[11px] font-semibold text-brand-dark/70 uppercase">Water Saved</p>
                      </div>
                   </div>
                   
                   <div className="bg-white/40 backdrop-blur-md rounded-2xl p-4 flex items-center shadow-sm border border-white/30">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 flex-shrink-0">
                         <Cloud className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-lg font-bold text-brand-dark leading-tight">{carbonReduced}kg</p>
                         <p className="text-[11px] font-semibold text-brand-dark/70 uppercase">CO2 Reduced</p>
                      </div>
                   </div>

                   <div className="bg-white/40 backdrop-blur-md rounded-2xl p-4 flex items-center shadow-sm border border-white/30">
                      <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3 flex-shrink-0">
                         <Shirt className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-lg font-bold text-brand-dark leading-tight">{wasteDiverted}kg</p>
                         <p className="text-[11px] font-semibold text-brand-dark/70 uppercase">Waste Avoided</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Notifications & Quick Actions */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Active Requests Mini Card */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-border-subtle flex flex-col justify-between">
                   <div>
                     <h3 className="font-bold text-brand-dark text-lg mb-1">Active Requests</h3>
                     <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-4">Pending & Incoming</p>
                   </div>
                   
                   {stats?.pendingSwaps > 0 ? (
                     <div className="bg-warning-tag/10 text-warning-tag rounded-xl p-4 flex items-center border border-warning-tag/20">
                       <ArrowRightLeft className="w-6 h-6 mr-3" />
                       <div>
                         <p className="font-bold text-lg leading-none">{stats?.pendingSwaps}</p>
                         <p className="text-sm font-medium">Pending action</p>
                       </div>
                     </div>
                   ) : (
                     <div className="bg-brand-light/50 rounded-xl p-4 border border-dashed border-border-subtle text-center">
                       <p className="text-sm text-text-muted font-medium">No active requests</p>
                     </div>
                   )}

                   <Link to="/swaps" className="text-sm text-brand-primary font-bold mt-4 inline-block hover:underline">Manage Swaps &rarr;</Link>
                </div>

                {/* Notifications Mini Card */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-border-subtle flex flex-col">
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-brand-dark text-lg">Alerts</h3>
                     {notifications.filter(n => !n.isRead).length > 0 && (
                       <span className="bg-danger-tag text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                         {notifications.filter(n => !n.isRead).length} New
                       </span>
                     )}
                   </div>
                   
                   <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2 max-h-[120px]">
                     {notifications.length === 0 ? (
                       <p className="text-sm text-text-muted font-medium text-center mt-4">All caught up!</p>
                     ) : (
                       notifications.map(notif => (
                         <div 
                           key={notif._id} 
                           onClick={() => !notif.isRead && markAsRead(notif._id)}
                           className={`p-2.5 rounded-lg text-xs cursor-pointer flex items-start transition ${notif.isRead ? 'bg-transparent text-text-muted' : 'bg-brand-light/40 text-brand-dark font-medium'}`}
                         >
                           <div className={`mt-1 mr-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${notif.isRead ? 'bg-transparent' : 'bg-brand-primary'}`}></div>
                           <p className="line-clamp-2 leading-relaxed">{notif.message}</p>
                         </div>
                       ))
                     )}
                   </div>
                </div>

             </div>

          </div>
        </div>

        {/* MIDDLE SECTION: Actions & Market */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white rounded-[2rem] p-6 sm:p-8 border border-border-subtle shadow-sm">
           <div className="md:col-span-8 flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:max-w-md">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                 <input 
                   type="text" 
                   placeholder="Search the marketplace..." 
                   className="w-full bg-brand-light/30 border border-border-subtle rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition"
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' && e.target.value) {
                       navigate(`/marketplace?search=${e.target.value}`);
                     }
                   }}
                 />
              </div>
           </div>
           <div className="md:col-span-4 flex justify-end gap-3 w-full">
             <Link to="/marketplace" className="flex-1 sm:flex-none py-3 px-6 rounded-full bg-white text-brand-dark border border-border-subtle font-bold text-sm hover:bg-brand-light transition-colors text-center">
               Browse All
             </Link>
             <Link to="/list-item" className="flex-1 sm:flex-none py-3 px-6 rounded-full bg-brand-dark text-white font-bold text-sm shadow-md hover:bg-brand-primary transition-colors text-center shadow-brand-dark/20 flex items-center justify-center">
               <Plus className="w-4 h-4 mr-1" /> List New
             </Link>
           </div>
        </div>

        {/* BOTTOM SECTION: Recommended & Recent */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Listings */}
          <div>
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-xl font-bold text-brand-dark">Your Wardrobe</h2>
              <Link to="/profile" className="text-sm font-bold text-brand-primary hover:underline">View All</Link>
            </div>
            
            {recentItems.length === 0 ? (
              <div className="bg-white p-10 rounded-[2rem] border border-dashed border-border-subtle shadow-sm text-center">
                <Shirt className="w-12 h-12 text-border-subtle mx-auto mb-3" />
                <h3 className="font-bold text-lg text-brand-dark mb-1">Closet is empty</h3>
                <p className="text-text-muted text-sm mb-6">Upload clothes to start swapping with others.</p>
                <Link to="/list-item" className="text-brand-primary font-bold text-sm">Upload first item &rarr;</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {recentItems.slice(0, 4).map(item => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Community Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-6 px-2">
                <h2 className="text-xl font-bold text-brand-dark">Community Swaps</h2>
                <Link to="/marketplace" className="text-sm font-bold text-brand-primary hover:underline">Explore</Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {recommendations.slice(0, 4).map(item => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}