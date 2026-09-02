import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  Star, 
  MapPin, 
  AtSign, 
  Phone,
  User as UserIcon,
  Shirt,
  ArrowRightLeft,
  Heart,
  MessageSquare,
  X,
  Save,
  Clock,
  CheckCircle2
} from 'lucide-react';
import ItemCard from '../components/ItemCard';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [myListings, setMyListings] = useState([]);
  const [swapHistory, setSwapHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    phone: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        bio: user.bio || '',
        phone: user.phone || '',
        city: user.city || '',
        state: user.state || ''
      });
      
      // Fetch user data
      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          const [listingsRes, swapsRes] = await Promise.all([
            api.get('/items/user/listings'),
            api.get('/swaps?type=all')
          ]);
          setMyListings(listingsRes.data || []);
          // Filter only completed swaps for Swap History
          const completed = (swapsRes.data || []).filter(s => s.status === 'completed');
          setSwapHistory(completed);
        } catch (error) {
          console.error('Error fetching user data', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUserData();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mb-6">
          <UserIcon className="w-10 h-10 text-danger-tag" />
        </div>
        <h2 className="text-2xl font-bold text-brand-dark mb-2">Sign in to view your profile</h2>
        <p className="text-text-muted mb-6">You need an account to view this page.</p>
        <button onClick={() => navigate('/auth')} className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-primary transition shadow-md">Sign In</button>
      </div>
    );
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Assuming AuthContext has an update method or we trigger a refetch, but here we just update via API and rely on reload or local state update.
      // Usually, AuthContext should expose a generic user updater, but let's just make the request.
      await api.put('/users/profile', editForm);
      toast.success('Profile updated successfully!');
      setTimeout(() => window.location.reload(), 1000); // Quick hack to refresh context
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Format date helper
  const memberSince = new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  // Dynamic stats
  const stats = {
    listings: myListings.length,
    successfulSwaps: swapHistory.length,
    itemsSwapped: swapHistory.length * 2,
    reviewsCount: 0,
    rating: user.rating || 0
  };

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'listings', label: 'My Listings' },
    { id: 'swaps', label: 'Swap History' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'saved', label: 'Saved Items' }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-border-subtle p-6 md:p-8 mb-8 relative">
        
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
              <h2 className="text-xl font-bold text-brand-dark">Edit Profile</h2>
              <button type="button" onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={editForm.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone Number</label>
                <input 
                  type="text" 
                  name="phone"
                  value={editForm.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">City</label>
                <input 
                  type="text" 
                  name="city"
                  value={editForm.city}
                  onChange={handleChange}
                  placeholder="Surat"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">State</label>
                <input 
                  type="text" 
                  name="state"
                  value={editForm.state}
                  onChange={handleChange}
                  placeholder="Gujarat"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Bio</label>
                <textarea 
                  name="bio"
                  value={editForm.bio}
                  onChange={handleChange}
                  placeholder="Write something about yourself..."
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                disabled={isSaving}
                className="flex items-center bg-[#1A4731] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#123322] transition-colors disabled:opacity-70"
              >
                {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start justify-between">
            {/* Left: User Info */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-sm bg-brand-light flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-brand-dark">{user.name.charAt(0)}</span>
                )}
              </div>
              
              <h1 className="text-xl font-extrabold text-brand-dark mb-1">{user.name}</h1>
              
              <p className="text-text-muted text-sm font-medium mb-1">
                {user.city && user.state ? `${user.city}, ${user.state}` : 'Surat, Gujarat'}
              </p>
              
              <p className="text-text-muted text-xs mb-3">Member since {memberSince}</p>
              
              <div className="flex items-center space-x-1 mb-5 text-sm font-semibold">
                <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span className="text-brand-dark">{stats.rating}</span>
                <span className="text-text-muted font-normal">({stats.reviewsCount} reviews)</span>
              </div>

              <button 
                onClick={() => setIsEditing(true)}
                className="bg-[#1A4731] text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-[#123322] transition-colors w-full md:w-auto"
              >
                Edit Profile
              </button>
            </div>

            {/* Right: Stats Grid */}
            <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-10 pt-2 md:pt-6 w-full md:w-auto">
              <div className="text-center flex flex-col items-center">
                <span className="text-2xl font-extrabold text-brand-dark mb-1">{stats.listings}</span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Listings</span>
              </div>
              <div className="text-center flex flex-col items-center">
                <span className="text-2xl font-extrabold text-brand-dark mb-1">{stats.successfulSwaps}</span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Successful Swaps</span>
              </div>
              <div className="text-center flex flex-col items-center">
                <span className="text-2xl font-extrabold text-brand-dark mb-1">{stats.itemsSwapped}</span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Items Swapped</span>
              </div>
              <div className="text-center flex flex-col items-center">
                <span className="text-2xl font-extrabold text-brand-dark mb-1">{stats.reviewsCount}</span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Reviews</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
        <nav className="flex space-x-8 min-w-max px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-3 px-1 border-b-2 font-bold text-sm transition-colors
                ${activeTab === tab.id 
                  ? 'border-[#1A4731] text-[#1A4731]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border-subtle min-h-[300px]">
        {activeTab === 'about' && (
          <div className="space-y-8 max-w-2xl">
            {/* Bio Section */}
            <div>
              <h3 className="text-sm font-extrabold text-brand-dark mb-2">Bio</h3>
              <p className="text-brand-dark text-sm leading-relaxed font-medium">
                {user.bio || "Fashion enthusiast and eco-conscious. Love to swap and give clothes a second life."}
              </p>
            </div>

            {/* Contact Section */}
            <div>
              <h3 className="text-sm font-extrabold text-brand-dark mb-3">Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-brand-dark font-medium">
                  <AtSign className="w-4 h-4 mr-3 text-gray-400" />
                  {user.email}
                </div>
                <div className="flex items-center text-sm text-brand-dark font-medium">
                  <Phone className="w-4 h-4 mr-3 text-gray-400" />
                  {user.phone || "+91 98765 43210"}
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div>
              <h3 className="text-sm font-extrabold text-brand-dark mb-2">Location</h3>
              <p className="text-brand-dark text-sm font-medium flex items-center">
                {user.city && user.state ? `${user.city}, ${user.state}, India` : 'Surat, Gujarat, India'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div>
            <h3 className="text-xl font-bold text-brand-dark mb-6">My Listings</h3>
            {isLoading ? (
              <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary"></div></div>
            ) : myListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {myListings.map(item => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-48 text-text-muted">
                <Shirt className="w-10 h-10 mb-3 text-gray-300" />
                <h3 className="text-base font-bold text-brand-dark mb-1">No Listings Yet</h3>
                <p className="text-sm">You haven't listed any items.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'swaps' && (
          <div>
             <h3 className="text-xl font-bold text-brand-dark mb-6">Swap History</h3>
             {isLoading ? (
               <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary"></div></div>
             ) : swapHistory.length > 0 ? (
               <div className="space-y-4">
                 {swapHistory.map(swap => (
                   <div key={swap._id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                     <div className="flex items-center space-x-4">
                       <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                         <CheckCircle2 className="w-6 h-6" />
                       </div>
                       <div>
                         <p className="font-bold text-brand-dark text-sm">
                           Swapped <span className="text-brand-primary">{swap.offeredItem?.title}</span> for <span className="text-brand-primary">{swap.requestedItem?.title}</span>
                         </p>
                         <p className="text-xs text-text-muted mt-1 flex items-center">
                           <Clock className="w-3 h-3 mr-1" /> {new Date(swap.updatedAt).toLocaleDateString()}
                         </p>
                       </div>
                     </div>
                     <button onClick={() => navigate(`/swaps/${swap._id}`)} className="text-xs font-bold text-brand-primary hover:underline">
                       View Details
                     </button>
                   </div>
                 ))}
               </div>
             ) : (
              <div className="flex flex-col items-center justify-center text-center h-48 text-text-muted">
                <ArrowRightLeft className="w-10 h-10 mb-3 text-gray-300" />
                <h3 className="text-base font-bold text-brand-dark mb-1">No Swap History</h3>
                <p className="text-sm">Your completed swaps will appear here.</p>
              </div>
             )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="flex flex-col items-center justify-center text-center h-48 text-text-muted">
            <MessageSquare className="w-10 h-10 mb-3 text-gray-300" />
            <h3 className="text-base font-bold text-brand-dark mb-1">Reviews</h3>
            <p className="text-sm">No reviews yet.</p>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="flex flex-col items-center justify-center text-center h-48 text-text-muted">
            <Heart className="w-10 h-10 mb-3 text-gray-300" />
            <h3 className="text-base font-bold text-brand-dark mb-1">Saved Items</h3>
            <p className="text-sm">Items you save will appear here.</p>
          </div>
        )}
      </div>
      
    </div>
  );
}
