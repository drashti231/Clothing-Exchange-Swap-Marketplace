import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  Users, Shirt, ArrowRightLeft, AlertTriangle, 
  Search, ShieldCheck, LayoutDashboard, FileText, 
  BarChart3, Settings, LogOut, ChevronDown, CheckCircle, XCircle, Eye, X, MapPin, Mail, Phone, Calendar
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const UserDetailsModal = ({ user, onClose, allListings, allSwaps }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [swapFilter, setSwapFilter] = useState('all'); // all, incoming, outgoing
  const [swapStatusFilter, setSwapStatusFilter] = useState('all'); // all, active, completed, cancelled

  if (!user) return null;

  const userListings = allListings.filter(l => l.owner?._id === user._id);
  
  let userSwaps = allSwaps.filter(s => s.requester?._id === user._id || s.receiver?._id === user._id);
  
  if (swapFilter === 'incoming') {
    userSwaps = userSwaps.filter(s => s.receiver?._id === user._id);
  } else if (swapFilter === 'outgoing') {
    userSwaps = userSwaps.filter(s => s.requester?._id === user._id);
  }

  if (swapStatusFilter === 'active') {
    userSwaps = userSwaps.filter(s => ['pending', 'accepted'].includes(s.status));
  } else if (swapStatusFilter === 'completed') {
    userSwaps = userSwaps.filter(s => s.status === 'completed');
  } else if (swapStatusFilter === 'cancelled') {
    userSwaps = userSwaps.filter(s => ['cancelled', 'rejected'].includes(s.status));
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand-dark font-bold text-xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-dark">{user.name}</h2>
              <p className="text-sm text-text-muted flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${user.isBlocked ? 'bg-red-500' : 'bg-green-500'}`}></span>
                {user.isBlocked ? 'Blocked Account' : 'Active Account'} • {user.role}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {['profile', 'listings', 'swaps'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-bold text-sm capitalize transition-colors relative ${
                activeTab === tab ? 'text-brand-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-brand-dark border-b border-gray-50 pb-2 mb-4">Basic Information</h3>
                <div className="flex items-center text-sm text-gray-600"><Mail className="w-4 h-4 mr-3 text-gray-400"/> {user.email}</div>
                <div className="flex items-center text-sm text-gray-600"><Phone className="w-4 h-4 mr-3 text-gray-400"/> {user.phone || 'No phone provided'}</div>
                <div className="flex items-center text-sm text-gray-600"><MapPin className="w-4 h-4 mr-3 text-gray-400"/> {user.city ? `${user.city}, ${user.state}` : 'No location provided'}</div>
                <div className="flex items-center text-sm text-gray-600"><Calendar className="w-4 h-4 mr-3 text-gray-400"/> Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                
                <div className="pt-4 mt-4 border-t border-gray-50">
                  <p className="text-sm font-medium text-gray-700 mb-2">Bio</p>
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">{user.bio || 'No bio provided.'}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-brand-dark border-b border-gray-50 pb-2 mb-4">Account Settings</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Language</span>
                    <span className="font-medium text-gray-800">{user.settings?.language || 'English (US)'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Timezone</span>
                    <span className="font-medium text-gray-800">{user.settings?.timezone?.split(')')[0] + ')' || 'Default'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Public Profile</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${user.settings?.privacy?.publicProfileVisibility !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.settings?.privacy?.publicProfileVisibility !== false ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-brand-dark mt-6 mb-3">Notification Preferences</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center"><CheckCircle className={`w-4 h-4 mr-2 ${user.settings?.notifications?.newSwapRequests !== false ? 'text-green-500' : 'text-gray-300'}`}/> New Swap Requests</div>
                  <div className="flex items-center"><CheckCircle className={`w-4 h-4 mr-2 ${user.settings?.notifications?.directMessages !== false ? 'text-green-500' : 'text-gray-300'}`}/> Direct Messages</div>
                  <div className="flex items-center"><CheckCircle className={`w-4 h-4 mr-2 ${user.settings?.notifications?.marketingNews ? 'text-green-500' : 'text-gray-300'}`}/> Marketing & News</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {userListings.length === 0 ? (
                <div className="p-8 text-center text-text-muted">This user has no listings.</div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 text-text-muted">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Title</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Condition</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {userListings.map(item => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-brand-dark truncate max-w-[200px]">{item.title}</td>
                        <td className="px-6 py-4 capitalize">{item.category}</td>
                        <td className="px-6 py-4 capitalize">{item.condition}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                            ${item.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
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
              <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex space-x-2">
                  {['all', 'incoming', 'outgoing'].map(f => (
                    <button 
                      key={f} onClick={() => setSwapFilter(f)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition ${swapFilter === f ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="flex space-x-2">
                  {['all', 'active', 'completed', 'cancelled'].map(s => (
                    <button 
                      key={s} onClick={() => setSwapStatusFilter(s)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition ${swapStatusFilter === s ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {userSwaps.length === 0 ? (
                  <div className="p-8 text-center text-text-muted">No swaps match these filters.</div>
                ) : (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 text-text-muted">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Type</th>
                        <th className="px-6 py-4 font-semibold">Other Party</th>
                        <th className="px-6 py-4 font-semibold">Item Involved</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {userSwaps.map(swap => {
                        const isIncoming = swap.receiver?._id === user._id;
                        const otherParty = isIncoming ? swap.requester : swap.receiver;
                        const itemInvolved = isIncoming ? swap.requestedItem : (swap.offeredItem || swap.requestedItem);
                        
                        return (
                          <tr key={swap._id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-md text-xs font-bold ${isIncoming ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                {isIncoming ? 'INCOMING' : 'OUTGOING'}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-800">{otherParty?.name || 'Unknown'}</td>
                            <td className="px-6 py-4 truncate max-w-[200px] text-gray-600">{itemInvolved?.title || 'Unknown Item'}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                ${swap.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                  swap.status === 'cancelled' || swap.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                  swap.status === 'accepted' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}
                              >
                                {swap.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right text-gray-500">{new Date(swap.createdAt).toLocaleDateString()}</td>
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
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  
  const [stats, setStats] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [listings, setListings] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stRes, usRes, lsRes, swRes, dsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/listings'),
          api.get('/admin/swaps'),
          api.get('/admin/disputes')
        ]);
        setStats(stRes.data);
        setUsersData(usRes.data);
        setListings(lsRes.data);
        setSwaps(swRes.data);
        setDisputes(dsRes.data);
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

  const sidebarLinks = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Users', icon: Users },
    { name: 'Listings', icon: Shirt },
    { name: 'Swaps', icon: ArrowRightLeft },
    { name: 'Disputes', icon: AlertTriangle },
  ];

  // Helper for pie chart
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

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
    <div className="fixed inset-0 z-[100] bg-[#F8F9FA] flex overflow-hidden font-sans text-text-main">
      
      <UserDetailsModal 
        user={selectedUserForDetails} 
        onClose={() => setSelectedUserForDetails(null)} 
        allListings={listings}
        allSwaps={swaps}
      />

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border-subtle flex flex-col h-full shadow-sm shrink-0">
        <div className="h-[72px] flex items-center px-6 border-b border-border-subtle shrink-0">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl tracking-tight hover:opacity-90 transition text-brand-dark">
            <Shirt className="h-6 w-6 text-brand-primary" fill="currentColor" />
            <span>ReWear <span className="text-brand-primary font-medium text-sm ml-1">Admin</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto hide-scrollbar">
          {sidebarLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => setActiveTab(link.name)}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === link.name 
                  ? 'bg-brand-light text-brand-dark shadow-sm' 
                  : 'text-text-muted hover:bg-gray-50 hover:text-brand-dark'
              }`}
            >
              <link.icon className={`w-5 h-5 mr-3 ${activeTab === link.name ? 'text-brand-primary' : 'text-text-muted'}`} />
              {link.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-[72px] bg-white border-b border-border-subtle flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-brand-dark">{activeTab}</h1>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none bg-gray-50 hover:bg-gray-100 rounded-full pr-3 py-1 pl-1 transition border border-border-subtle"
              >
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=1A4731&color=fff`} 
                  alt="Admin" 
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-sm font-semibold text-brand-dark hidden sm:block">Admin</span>
                <ChevronDown className="w-4 h-4 text-text-muted" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-border-subtle py-1 z-50">
                  <Link to="/" className="block px-4 py-2 text-sm text-text-muted hover:bg-gray-50 hover:text-brand-dark">Back to Site</Link>
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-danger-tag hover:bg-red-50">Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-primary"></div>
            </div>
          ) : activeTab === 'Dashboard' && stats ? (
            <div className="max-w-5xl space-y-6">
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-sm flex flex-col items-center justify-center text-center">
                  <h3 className="text-3xl font-bold text-brand-dark mb-1">{stats.totalUsers}</h3>
                  <p className="text-sm font-medium text-text-muted">Total Users</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-sm flex flex-col items-center justify-center text-center">
                  <h3 className="text-3xl font-bold text-brand-dark mb-1">{stats.totalItems}</h3>
                  <p className="text-sm font-medium text-text-muted">Total Listings</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-sm flex flex-col items-center justify-center text-center">
                  <h3 className="text-3xl font-bold text-brand-dark mb-1">{stats.totalSwaps}</h3>
                  <p className="text-sm font-medium text-text-muted">Total Swaps</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-sm flex flex-col items-center justify-center text-center">
                  <h3 className="text-3xl font-bold text-brand-dark mb-1">{stats.activeDisputes}</h3>
                  <p className="text-sm font-medium text-text-muted">Open Disputes</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Categories */}
                <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-sm h-80 flex flex-col">
                  <h3 className="text-[15px] font-bold text-brand-dark mb-6">Listings by Category</h3>
                  <div className="flex-1 w-full">
                    {stats.categoryData?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.categoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                          <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                          <RechartsTooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Bar dataKey="count" fill="#1A4731" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-text-muted text-sm">No category data available</div>
                    )}
                  </div>
                </div>

                {/* Swap Status */}
                <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-sm h-80 flex flex-col">
                  <h3 className="text-[15px] font-bold text-brand-dark mb-2">Swap Status Breakdown</h3>
                  <div className="flex-1 flex items-center justify-center relative w-full">
                    {stats.swapStatusData?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.swapStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={90}
                            paddingAngle={2}
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
                          <RechartsTooltip />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-text-muted text-sm">No swap data available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'Users' ? (
            <div className="bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-text-muted">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {usersData.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-brand-dark">{u.name}</td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {u.isBlocked ? (
                          <span className="flex items-center text-danger-tag"><XCircle className="w-4 h-4 mr-1"/> Blocked</span>
                        ) : u.isVerified ? (
                          <span className="flex items-center text-green-600"><CheckCircle className="w-4 h-4 mr-1"/> Verified</span>
                        ) : (
                          <span className="text-yellow-600 font-medium">Active</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => setSelectedUserForDetails(u)}
                          className="px-3 py-1.5 rounded-md text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
                        >
                          <Eye className="w-3 h-3 mr-1" /> View Details
                        </button>
                        
                        {u.role !== 'admin' && (
                          <button 
                            onClick={() => handleBlockUser(u._id, u.isBlocked)}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold ${u.isBlocked ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
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
          ) : activeTab === 'Listings' ? (
            <div className="bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-text-muted">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Title</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Condition</th>
                    <th className="px-6 py-4 font-semibold">Owner</th>
                    <th className="px-6 py-4 font-semibold text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {listings.map(item => (
                    <tr key={item._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-brand-dark truncate max-w-xs">{item.title}</td>
                      <td className="px-6 py-4 capitalize">{item.category}</td>
                      <td className="px-6 py-4 capitalize">{item.condition}</td>
                      <td className="px-6 py-4">{item.owner?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-right">{new Date(item.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'Swaps' ? (
            <div className="bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-text-muted">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Requester</th>
                    <th className="px-6 py-4 font-semibold">Requested Item</th>
                    <th className="px-6 py-4 font-semibold">Owner</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {swaps.map(swap => (
                    <tr key={swap._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-brand-dark">{swap.requester?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 truncate max-w-xs">{swap.requestedItem?.title || 'Unknown Item'}</td>
                      <td className="px-6 py-4">{swap.receiver?.name || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                          ${swap.status === 'completed' ? 'bg-green-100 text-green-700' : 
                            swap.status === 'cancelled' || swap.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                            swap.status === 'accepted' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}
                        >
                          {swap.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">{new Date(swap.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'Disputes' ? (
            <div className="bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
              {disputes.length === 0 ? (
                <div className="p-8 text-center text-text-muted">No disputes found.</div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 text-text-muted">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Raised By</th>
                      <th className="px-6 py-4 font-semibold">Reason</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {disputes.map(d => (
                      <tr key={d._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium text-brand-dark">{d.raisedBy?.name || 'Unknown'}</td>
                        <td className="px-6 py-4">{d.reason}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                            ${d.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                          >
                            {d.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {d.status === 'open' ? (
                            <button 
                              onClick={() => handleResolveDispute(d._id)}
                              className="px-3 py-1.5 bg-brand-primary text-white rounded-md text-xs font-bold hover:bg-brand-dark transition"
                            >
                              Resolve
                            </button>
                          ) : (
                            <span className="text-text-muted text-xs">Resolved</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full text-text-muted">
              <div className="text-center">
                <LayoutDashboard className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <h2 className="text-xl font-bold text-brand-dark mb-2">{activeTab}</h2>
                <p>This module is currently being built.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}