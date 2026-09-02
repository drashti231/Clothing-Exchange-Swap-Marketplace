import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  Users, Shirt, ArrowRightLeft, AlertTriangle, 
  Search, ShieldCheck, LayoutDashboard, FileText, 
  BarChart3, Settings, LogOut, ChevronDown, CheckCircle, XCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function Admin() {
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
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
                          <span className="text-yellow-600 font-medium">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
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