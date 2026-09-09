import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  Users, Shirt, ArrowRightLeft, AlertTriangle, 
  Search, ShieldCheck, LayoutDashboard, FileText, 
  BarChart3, Settings, LogOut, ChevronDown, CheckCircle, XCircle, Eye, X, MapPin, Mail, Phone, Calendar, Menu, Trash2, Check, DollarSign, Activity, Flag, Bell
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const UserDetailsModal = ({ user, onClose, allListings, allSwaps }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [swapFilter, setSwapFilter] = useState('all'); 
  const [swapStatusFilter, setSwapStatusFilter] = useState('all'); 

  if (!user) return null;

  const userListings = allListings.filter(l => l.owner?._id === user._id);
  let userSwaps = allSwaps.filter(s => s.requester?._id === user._id || s.receiver?._id === user._id);
  
  if (swapFilter === 'incoming') userSwaps = userSwaps.filter(s => s.receiver?._id === user._id);
  else if (swapFilter === 'outgoing') userSwaps = userSwaps.filter(s => s.requester?._id === user._id);

  if (swapStatusFilter === 'active') userSwaps = userSwaps.filter(s => ['pending', 'accepted'].includes(s.status));
  else if (swapStatusFilter === 'completed') userSwaps = userSwaps.filter(s => s.status === 'completed');
  else if (swapStatusFilter === 'cancelled') userSwaps = userSwaps.filter(s => ['cancelled', 'rejected'].includes(s.status));

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-brand-dark/40 backdrop-blur-sm">
      <div className="bg-[#FAF9F6] w-full max-w-5xl h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-white/50">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between bg-white/50 backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xl shadow-sm">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-dark">{user.name}</h2>
              <p className="text-sm text-text-muted flex items-center font-medium">
                <span className={`w-2 h-2 rounded-full mr-2 ${user.isBlocked ? 'bg-danger-tag' : 'bg-success-tag'}`}></span>
                {user.isBlocked ? 'Blocked Account' : 'Active Account'} • {user.role}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white hover:bg-gray-100 rounded-full transition text-gray-500 shadow-sm border border-border-subtle">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-subtle px-6 bg-white/30 backdrop-blur-sm">
          {['profile', 'listings', 'swaps'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-bold text-sm capitalize transition-colors relative ${
                activeTab === tab ? 'text-brand-primary' : 'text-text-muted hover:text-brand-dark'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/70 backdrop-blur-md p-6 rounded-[1.5rem] border border-white shadow-sm space-y-4">
                <h3 className="font-bold text-brand-dark border-b border-border-subtle pb-2 mb-4">Basic Information</h3>
                <div className="flex items-center text-sm font-medium text-brand-dark"><Mail className="w-4 h-4 mr-3 text-brand-primary"/> {user.email}</div>
                <div className="flex items-center text-sm font-medium text-brand-dark"><Phone className="w-4 h-4 mr-3 text-brand-primary"/> {user.phone || 'No phone provided'}</div>
                <div className="flex items-center text-sm font-medium text-brand-dark"><MapPin className="w-4 h-4 mr-3 text-brand-primary"/> {user.city ? `${user.city}, ${user.state}` : 'No location provided'}</div>
                <div className="flex items-center text-sm font-medium text-brand-dark"><Calendar className="w-4 h-4 mr-3 text-brand-primary"/> Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                
                <div className="pt-4 mt-4 border-t border-border-subtle">
                  <p className="text-sm font-bold text-brand-dark mb-2">Bio</p>
                  <p className="text-sm text-text-muted bg-white border border-border-subtle p-3 rounded-xl">{user.bio || 'No bio provided.'}</p>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-md p-6 rounded-[1.5rem] border border-white shadow-sm space-y-4">
                <h3 className="font-bold text-brand-dark border-b border-border-subtle pb-2 mb-4">Account Settings</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted font-medium">Language</span>
                    <span className="font-bold text-brand-dark">{user.settings?.language || 'English (US)'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted font-medium">Timezone</span>
                    <span className="font-bold text-brand-dark">{user.settings?.timezone?.split(')')[0] + ')' || 'Default'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted font-medium">Public Profile</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${user.settings?.privacy?.publicProfileVisibility !== false ? 'bg-success-tag/10 text-success-tag' : 'bg-danger-tag/10 text-danger-tag'}`}>
                      {user.settings?.privacy?.publicProfileVisibility !== false ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="bg-white/70 backdrop-blur-md rounded-[1.5rem] border border-white shadow-sm overflow-hidden">
              {userListings.length === 0 ? (
                <div className="p-8 text-center text-text-muted font-medium">This user has no listings.</div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-brand-light/30 text-brand-dark">
                    <tr>
                      <th className="px-6 py-4 font-bold">Title</th>
                      <th className="px-6 py-4 font-bold">Category</th>
                      <th className="px-6 py-4 font-bold">Condition</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {userListings.map(item => (
                      <tr key={item._id} className="hover:bg-white transition">
                        <td className="px-6 py-4 font-bold text-brand-dark truncate max-w-[200px]">{item.title}</td>
                        <td className="px-6 py-4 capitalize font-medium text-text-muted">{item.category}</td>
                        <td className="px-6 py-4 capitalize font-medium text-text-muted">{item.condition}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                            ${item.status === 'available' ? 'bg-success-tag/10 text-success-tag' : 'bg-brand-light text-brand-dark'}`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'swaps' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white/70 backdrop-blur-md p-4 rounded-[1.5rem] border border-white shadow-sm">
                <div className="flex space-x-2">
                  {['all', 'incoming', 'outgoing'].map(f => (
                    <button 
                      key={f} onClick={() => setSwapFilter(f)}
                      className={`px-4 py-1.5 rounded-xl text-sm font-bold capitalize transition border ${swapFilter === f ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-text-muted border-border-subtle hover:text-brand-dark'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="flex space-x-2">
                  {['all', 'active', 'completed', 'cancelled'].map(s => (
                    <button 
                      key={s} onClick={() => setSwapStatusFilter(s)}
                      className={`px-4 py-1.5 rounded-xl text-sm font-bold capitalize transition border ${swapStatusFilter === s ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-text-muted border-border-subtle hover:text-brand-dark'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-md rounded-[1.5rem] border border-white shadow-sm overflow-hidden">
                {userSwaps.length === 0 ? (
                  <div className="p-8 text-center text-text-muted font-medium">No swaps match these filters.</div>
                ) : (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-brand-light/30 text-brand-dark">
                      <tr>
                        <th className="px-6 py-4 font-bold">Type</th>
                        <th className="px-6 py-4 font-bold">Other Party</th>
                        <th className="px-6 py-4 font-bold">Item Involved</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {userSwaps.map(swap => {
                        const isIncoming = swap.receiver?._id === user._id;
                        const otherParty = isIncoming ? swap.requester : swap.receiver;
                        const itemInvolved = isIncoming ? swap.requestedItem : (swap.offeredItem || swap.requestedItem);
                        
                        return (
                          <tr key={swap._id} className="hover:bg-white transition">
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-md text-xs font-bold ${isIncoming ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                {isIncoming ? 'INCOMING' : 'OUTGOING'}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-brand-dark">{otherParty?.name || 'Unknown'}</td>
                            <td className="px-6 py-4 truncate max-w-[200px] text-text-muted font-medium">{itemInvolved?.title || 'Unknown Item'}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                ${swap.status === 'completed' ? 'bg-success-tag/10 text-success-tag' : 
                                  swap.status === 'cancelled' || swap.status === 'rejected' ? 'bg-danger-tag/10 text-danger-tag' : 
                                  swap.status === 'accepted' ? 'bg-blue-100 text-blue-700' : 'bg-warning-tag/10 text-warning-tag'}`}
                              >
                                {swap.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Admin() {
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  
  const [stats, setStats] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [listings, setListings] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [reports, setReports] = useState([]);

  // Mock data for new features
  const mockRevenue = 1250.00;

  useEffect(() => {
    if (user?.role !== 'admin') return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stRes, usRes, lsRes, swRes, dsRes, rpRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/listings'),
          api.get('/admin/swaps'),
          api.get('/admin/disputes'),
          api.get('/admin/reports')
        ]);
        setStats(stRes.data);
        setUsersData(usRes.data);
        setListings(lsRes.data);
        setSwaps(swRes.data);
        setDisputes(dsRes.data);
        setReports(rpRes.data);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
        toast.error("Failed to load admin dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      await api.put(`/admin/users/${userId}/block`);
      toast.success(isBlocked ? "User unblocked" : "User blocked");
      setUsersData(usersData.map(u => u._id === userId ? { ...u, isBlocked: !isBlocked } : u));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleResolveDispute = async (disputeId) => {
    try {
      const res = await api.put(`/admin/disputes/${disputeId}/resolve`, { resolutionNotes: 'Resolved by admin' });
      toast.success("Dispute resolved");
      setDisputes(disputes.map(d => d._id === disputeId ? res.data : d));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resolve dispute");
    }
  };

  const handleVerifyListing = async (listingId, isVerified) => {
    try {
      await api.put(`/admin/listings/${listingId}/verify`);
      toast.success(isVerified ? "Listing unverified" : "Listing verified");
      setListings(listings.map(l => l._id === listingId ? { ...l, isVerified: !isVerified } : l));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update listing");
    }
  };

  const handleDismissReport = async (reportId) => {
    try {
      await api.put(`/admin/reports/${reportId}/dismiss`);
      toast.success("Report dismissed");
      setReports(reports.filter(r => r._id !== reportId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to dismiss report");
    }
  };

  const handleRemoveReportedItem = async (reportId) => {
    try {
      if (!window.confirm('Are you sure you want to remove this item? This action cannot be undone.')) return;
      await api.delete(`/admin/reports/${reportId}/remove-item`);
      toast.success("Item removed successfully");
      setReports(reports.filter(r => r._id !== reportId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
    }
  };

  const sidebarLinks = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Users', icon: Users },
    { name: 'Listings', icon: Shirt },
    { name: 'Swaps', icon: ArrowRightLeft },
    { name: 'Disputes', icon: AlertTriangle },
    { name: 'Moderation', icon: Flag }, // New tab
  ];

  const COLORS = ['#1A4731', '#2C7A54', '#D9825B', '#E5A991', '#8B5CF6'];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent === 0) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#FAF9F6] flex overflow-hidden font-sans text-text-main">
      
      {/* Decorative ambient blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px] -translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>

      <UserDetailsModal 
        user={selectedUserForDetails} 
        onClose={() => setSelectedUserForDetails(null)} 
        allListings={listings}
        allSwaps={swaps}
      />

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[150] w-64 bg-white/70 backdrop-blur-xl border-r border-white flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] shrink-0 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-[80px] flex items-center justify-between px-6 border-b border-white shrink-0">
          <Link to="/" className="flex items-center space-x-2 font-bold text-2xl tracking-tight hover:opacity-90 transition text-brand-dark">
            <div className="p-1.5 bg-brand-dark rounded-xl"><Shirt className="h-5 w-5 text-white" fill="currentColor" /></div>
            <span>ReWear</span>
          </Link>
          <button className="md:hidden text-text-muted" onClick={() => setIsMobileSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="px-6 py-4">
           <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto hide-scrollbar">
          {sidebarLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => { setActiveTab(link.name); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center px-4 py-3 rounded-[1rem] text-sm font-bold transition-all ${
                activeTab === link.name 
                  ? 'bg-brand-dark text-white shadow-md shadow-brand-dark/20' 
                  : 'text-text-muted hover:bg-white hover:text-brand-dark hover:shadow-sm'
              }`}
            >
              <link.icon className={`w-5 h-5 mr-3 ${activeTab === link.name ? 'text-brand-light' : 'text-text-muted'}`} />
              {link.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[140] md:hidden" 
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative z-10">
        {/* Header */}
        <header className="relative z-20 h-[80px] bg-white/50 backdrop-blur-md border-b border-white flex items-center justify-between px-6 sm:px-10 shrink-0">
          <div className="flex items-center space-x-4">
            <button 
              className="md:hidden text-text-muted hover:text-brand-dark focus:outline-none bg-white p-2 rounded-xl shadow-sm border border-border-subtle"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-brand-dark truncate">{activeTab}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-dark shadow-sm border border-white hover:shadow-md transition">
               <Bell className="w-5 h-5" />
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 focus:outline-none bg-white hover:bg-gray-50 rounded-full pr-4 py-1.5 pl-1.5 transition shadow-sm border border-white"
              >
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=1A4731&color=fff`} 
                  alt="Admin" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-bold text-brand-dark hidden sm:block">Admin</span>
                <ChevronDown className="w-4 h-4 text-text-muted" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-lg rounded-[1rem] shadow-xl border border-white py-2 z-50">
                  <Link to="/" className="block px-4 py-2 text-sm font-bold text-text-muted hover:bg-brand-light hover:text-brand-dark transition">View Live Site</Link>
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm font-bold text-danger-tag hover:bg-danger-tag/10 transition">Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-primary"></div>
            </div>
          ) : activeTab === 'Dashboard' && stats ? (
            <div className="max-w-7xl mx-auto space-y-8">
              
              {/* Top Metrics Row - Glassmorphic Bento Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-primary/10 rounded-full blur-xl group-hover:bg-brand-primary/20 transition"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                     <div className="p-3 bg-white rounded-[1rem] shadow-sm text-brand-dark"><Users className="w-6 h-6" /></div>
                     <span className="bg-success-tag/10 text-success-tag text-xs font-bold px-2 py-1 rounded-md">+12%</span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm font-bold text-text-muted uppercase tracking-wider mb-1">Total Users</p>
                    <h3 className="text-4xl font-black text-brand-dark">{stats.totalUsers}</h3>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                     <div className="p-3 bg-white rounded-[1rem] shadow-sm text-blue-600"><Shirt className="w-6 h-6" /></div>
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm font-bold text-text-muted uppercase tracking-wider mb-1">Active Listings</p>
                    <h3 className="text-4xl font-black text-brand-dark">{stats.totalItems}</h3>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                     <div className="p-3 bg-white rounded-[1rem] shadow-sm text-purple-600"><ArrowRightLeft className="w-6 h-6" /></div>
                     <span className="bg-success-tag/10 text-success-tag text-xs font-bold px-2 py-1 rounded-md">+5%</span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm font-bold text-text-muted uppercase tracking-wider mb-1">Total Swaps</p>
                    <h3 className="text-4xl font-black text-brand-dark">{stats.totalSwaps}</h3>
                  </div>
                </div>

                {/* Revenue Card (Mock) */}
                <div className="bg-gradient-to-br from-brand-dark to-[#0f2b1d] p-6 rounded-[2rem] border border-brand-primary shadow-md flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                     <div className="p-3 bg-white/10 backdrop-blur-md rounded-[1rem] text-white border border-white/20"><DollarSign className="w-6 h-6" /></div>
                     <span className="bg-white/20 text-white backdrop-blur-md text-xs font-bold px-2 py-1 rounded-md">+24%</span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm font-bold text-brand-light/80 uppercase tracking-wider mb-1">Shipping Revenue</p>
                    <h3 className="text-4xl font-black text-white">${mockRevenue.toFixed(2)}</h3>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Activity & Categories */}
                <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-sm h-96 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-brand-dark">Listings by Category</h3>
                    <div className="p-2 bg-brand-light/50 rounded-lg text-brand-dark"><Activity className="w-5 h-5"/></div>
                  </div>
                  <div className="flex-1 w-full">
                    {stats.categoryData?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.categoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                          <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }} />
                          <RechartsTooltip cursor={{ fill: 'rgba(26, 71, 49, 0.05)' }} contentStyle={{ borderRadius: '16px', border: '1px solid #fff', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)', padding: '12px' }} />
                          <Bar dataKey="count" fill="#1A4731" radius={[8, 8, 8, 8]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-text-muted font-medium">No category data available</div>
                    )}
                  </div>
                </div>

                {/* Swap Status */}
                <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-sm h-96 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-brand-dark">Swap Outcomes</h3>
                  </div>
                  <div className="flex-1 flex items-center justify-center relative w-full">
                    {stats.swapStatusData?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.swapStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={110}
                            paddingAngle={5}
                            dataKey="count"
                            nameKey="_id"
                            stroke="none"
                            labelLine={false}
                            label={renderCustomLabel}
                          >
                            {stats.swapStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontWeight: 600, fontSize: '13px' }}/>
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-text-muted font-medium">No swap data available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'Users' ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border-subtle bg-white/50">
                 <h2 className="text-xl font-bold text-brand-dark">Manage Users</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-brand-light/30 text-brand-dark">
                    <tr>
                      <th className="px-6 py-4 font-bold">Name</th>
                      <th className="px-6 py-4 font-bold">Email</th>
                      <th className="px-6 py-4 font-bold">Role</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {usersData.map(u => (
                      <tr key={u._id} className="hover:bg-white transition">
                        <td className="px-6 py-4 font-bold text-brand-dark">{u.name}</td>
                        <td className="px-6 py-4 font-medium text-text-muted">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${u.role === 'admin' ? 'bg-brand-dark text-white' : 'bg-brand-light text-brand-dark'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {u.isBlocked ? (
                            <span className="flex items-center text-danger-tag font-bold"><XCircle className="w-4 h-4 mr-1.5"/> Blocked</span>
                          ) : u.isVerified ? (
                            <span className="flex items-center text-success-tag font-bold"><CheckCircle className="w-4 h-4 mr-1.5"/> Verified</span>
                          ) : (
                            <span className="text-warning-tag font-bold flex items-center"><Activity className="w-4 h-4 mr-1.5"/> Active</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end space-x-3">
                          <button 
                            onClick={() => setSelectedUserForDetails(u)}
                            className="p-2 rounded-xl bg-white border border-border-subtle text-text-muted hover:text-brand-dark hover:shadow-sm transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {u.role !== 'admin' && (
                            <button 
                              onClick={() => handleBlockUser(u._id, u.isBlocked)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${u.isBlocked ? 'bg-success-tag/10 text-success-tag border-success-tag/20 hover:bg-success-tag hover:text-white' : 'bg-white text-danger-tag border-danger-tag/30 hover:bg-danger-tag hover:text-white'}`}
                            >
                              {u.isBlocked ? 'Unblock' : 'Block'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'Listings' ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-sm overflow-hidden">
               <div className="p-6 border-b border-border-subtle bg-white/50">
                 <h2 className="text-xl font-bold text-brand-dark">Review Listings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-brand-light/30 text-brand-dark">
                    <tr>
                      <th className="px-6 py-4 font-bold">Title</th>
                      <th className="px-6 py-4 font-bold">Category</th>
                      <th className="px-6 py-4 font-bold">Condition</th>
                      <th className="px-6 py-4 font-bold">Owner</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {listings.map(item => (
                      <tr key={item._id} className="hover:bg-white transition">
                        <td className="px-6 py-4 font-bold text-brand-dark truncate max-w-[200px]">{item.title}</td>
                        <td className="px-6 py-4 capitalize font-medium text-text-muted">{item.category}</td>
                        <td className="px-6 py-4 capitalize font-medium text-text-muted">{item.condition}</td>
                        <td className="px-6 py-4 font-bold text-brand-dark">{item.owner?.name || 'Unknown'}</td>
                        <td className="px-6 py-4">
                          {item.isVerified ? (
                            <span className="flex items-center text-success-tag font-bold text-xs"><CheckCircle className="w-4 h-4 mr-1.5"/> Verified</span>
                          ) : (
                            <span className="text-text-muted font-bold text-xs flex items-center"><AlertTriangle className="w-4 h-4 mr-1.5"/> Unverified</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleVerifyListing(item._id, item.isVerified)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${item.isVerified ? 'bg-white text-warning-tag border-warning-tag/30 hover:bg-warning-tag hover:text-white' : 'bg-brand-dark text-white border-brand-dark hover:bg-brand-primary'}`}
                          >
                            {item.isVerified ? 'Unverify' : 'Verify'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'Swaps' ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-sm overflow-hidden">
               <div className="p-6 border-b border-border-subtle bg-white/50">
                 <h2 className="text-xl font-bold text-brand-dark">Monitor Swaps</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-brand-light/30 text-brand-dark">
                    <tr>
                      <th className="px-6 py-4 font-bold">Requester</th>
                      <th className="px-6 py-4 font-bold">Requested Item</th>
                      <th className="px-6 py-4 font-bold">Owner</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {swaps.map(swap => (
                      <tr key={swap._id} className="hover:bg-white transition">
                        <td className="px-6 py-4 font-bold text-brand-dark">{swap.requester?.name || 'Unknown'}</td>
                        <td className="px-6 py-4 truncate max-w-[200px] font-medium text-text-muted">{swap.requestedItem?.title || 'Unknown Item'}</td>
                        <td className="px-6 py-4 font-bold text-brand-dark">{swap.receiver?.name || 'Unknown'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                            ${swap.status === 'completed' ? 'bg-success-tag/10 text-success-tag' : 
                              swap.status === 'cancelled' || swap.status === 'rejected' ? 'bg-danger-tag/10 text-danger-tag' : 
                              swap.status === 'accepted' ? 'bg-blue-100 text-blue-700' : 'bg-warning-tag/10 text-warning-tag'}`}
                          >
                            {swap.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-text-muted">{new Date(swap.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'Moderation' ? (
             <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-sm overflow-hidden">
               <div className="p-6 border-b border-border-subtle bg-white/50 flex justify-between items-center">
                 <h2 className="text-xl font-bold text-brand-dark">Reported Content</h2>
                 <span className="bg-danger-tag text-white px-3 py-1 rounded-full text-xs font-bold">{reports.length} Active</span>
              </div>
              <div className="overflow-x-auto">
                {reports.length === 0 ? (
                  <div className="p-12 text-center text-text-muted">
                    <CheckCircle className="w-12 h-12 text-success-tag mx-auto mb-4 opacity-50" />
                    <p className="font-bold text-lg">No pending reports.</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-brand-light/30 text-brand-dark">
                      <tr>
                        <th className="px-6 py-4 font-bold">Item</th>
                        <th className="px-6 py-4 font-bold">Reported By</th>
                        <th className="px-6 py-4 font-bold">Reason</th>
                        <th className="px-6 py-4 font-bold">Date</th>
                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {reports.map(report => (
                        <tr key={report._id} className="hover:bg-white transition">
                          <td className="px-6 py-4 font-bold text-brand-dark">{report.item?.title || 'Unknown Item'}</td>
                          <td className="px-6 py-4 font-medium text-text-muted">{report.reportedBy?.name || 'Unknown User'}</td>
                          <td className="px-6 py-4">
                            <span className="bg-danger-tag/10 text-danger-tag px-3 py-1.5 rounded-xl font-bold text-xs">{report.reason}</span>
                          </td>
                          <td className="px-6 py-4 font-medium text-text-muted">{new Date(report.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right flex items-center justify-end space-x-3">
                            <button 
                              onClick={() => handleDismissReport(report._id)}
                              className="px-4 py-2 rounded-xl bg-white border border-border-subtle text-text-main font-bold text-xs hover:bg-gray-50 transition"
                            >
                              Dismiss
                            </button>
                            <button 
                              onClick={() => handleRemoveReportedItem(report._id)}
                              className="px-4 py-2 rounded-xl bg-danger-tag text-white font-bold text-xs hover:bg-red-700 transition flex items-center"
                            >
                              <Trash2 className="w-3 h-3 mr-1.5" /> Remove Item
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ) : activeTab === 'Disputes' ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-sm overflow-hidden">
               <div className="p-6 border-b border-border-subtle bg-white/50">
                 <h2 className="text-xl font-bold text-brand-dark">Manage Disputes</h2>
              </div>
              <div className="overflow-x-auto">
                {disputes.length === 0 ? (
                  <div className="p-12 text-center text-text-muted">
                    <CheckCircle className="w-12 h-12 text-success-tag mx-auto mb-4 opacity-50" />
                    <p className="font-bold text-lg">No disputes found.</p>
                    <p className="text-sm mt-1">All swaps are going smoothly.</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-brand-light/30 text-brand-dark">
                      <tr>
                        <th className="px-6 py-4 font-bold">Raised By</th>
                        <th className="px-6 py-4 font-bold">Reason</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                        <th className="px-6 py-4 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {disputes.map(d => (
                        <tr key={d._id} className="hover:bg-white transition">
                          <td className="px-6 py-4 font-bold text-brand-dark">{d.raisedBy?.name || 'Unknown'}</td>
                          <td className="px-6 py-4 font-medium text-text-muted">{d.reason}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                              ${d.status === 'resolved' ? 'bg-success-tag/10 text-success-tag' : 'bg-warning-tag/10 text-warning-tag'}`}
                            >
                              {d.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {d.status === 'open' ? (
                              <button 
                                onClick={() => handleResolveDispute(d._id)}
                                className="px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-brand-primary transition shadow-sm"
                              >
                                Resolve
                              </button>
                            ) : (
                              <span className="text-text-muted font-bold text-xs flex items-center justify-end"><Check className="w-4 h-4 mr-1 text-success-tag"/> Resolved</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full text-text-muted">
              <div className="text-center bg-white/50 backdrop-blur-md p-10 rounded-[2rem] border border-white shadow-sm">
                <LayoutDashboard className="w-16 h-16 mx-auto mb-4 text-brand-light" />
                <h2 className="text-2xl font-bold text-brand-dark mb-2">{activeTab}</h2>
                <p className="font-medium">This module is currently being built.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}