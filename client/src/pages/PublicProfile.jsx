import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { User, MapPin, Calendar, Shirt, Star, ShieldCheck, ChevronLeft } from 'lucide-react';
import ItemCard from '../components/ItemCard';

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/users/${id}/profile`);
        setProfile(data);
      } catch (err) {
        setError(err.response?.data?.message || 'User not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-primary"></div>
    </div>
  );

  if (error || !profile) return (
    <div className="text-center mt-20 max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-border-subtle">
      <User className="w-12 h-12 text-text-muted mx-auto mb-4" />
      <h2 className="text-xl font-bold text-brand-dark mb-2">Profile Not Found</h2>
      <p className="text-text-muted mb-6">{error}</p>
      <button onClick={() => navigate('/marketplace')} className="bg-brand-dark text-white px-6 py-2 rounded-md hover:bg-brand-primary">
        Back to Marketplace
      </button>
    </div>
  );

  const { user, listings } = profile;

  return (
    <div className="bg-bg-main min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-text-muted hover:text-brand-dark mb-6 transition">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-border-subtle overflow-hidden mb-8">
          <div className="h-32 bg-brand-light"></div>
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between">
              <div className="flex flex-col sm:flex-row sm:items-end -mt-12 sm:-mt-16 mb-4 sm:mb-0">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=1A4731&color=fff&size=128`} 
                  alt={user.name} 
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md object-cover"
                />
                <div className="sm:ml-6 mt-4 sm:mt-0 pb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark flex items-center">
                    {user.name} 
                    {user.isVerified && <ShieldCheck className="w-6 h-6 text-brand-primary ml-2" />}
                  </h1>
                  <p className="text-text-muted">{user.role === 'admin' ? 'Administrator' : 'Community Member'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 pb-2">
                <div className="text-center">
                  <span className="block font-bold text-xl text-brand-dark">{listings.length}</span>
                  <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Listings</span>
                </div>
                <div className="text-center">
                  <span className="flex items-center justify-center font-bold text-xl text-brand-dark">
                    {user.rating?.toFixed(1) || 'N/A'} <Star className="w-4 h-4 text-warning-tag fill-warning-tag ml-1" />
                  </span>
                  <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">{user.numReviews || 0} Reviews</span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border-subtle pt-6">
              <div className="md:col-span-2">
                <h3 className="text-lg font-bold text-brand-dark mb-2">About</h3>
                <p className="text-text-main leading-relaxed">
                  {user.bio || 'This user has not provided a bio yet.'}
                </p>
              </div>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-border-subtle">
                {user.city && (
                  <div className="flex items-center text-sm text-text-main">
                    <MapPin className="w-4 h-4 mr-3 text-brand-primary" />
                    <span>{user.city}, {user.state}</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-text-main">
                  <Calendar className="w-4 h-4 mr-3 text-brand-primary" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center">
          <Shirt className="w-6 h-6 mr-2 text-brand-primary" /> Available Items
        </h2>

        {listings.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-border-subtle">
            <Shirt className="w-12 h-12 text-border-subtle mx-auto mb-4" />
            <h3 className="text-lg font-bold text-brand-dark mb-1">No active listings</h3>
            <p className="text-text-muted">This user doesn't have any items available for swap right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map(item => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
