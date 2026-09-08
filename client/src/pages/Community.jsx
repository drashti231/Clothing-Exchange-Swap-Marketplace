import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Plus, Search, MapPin, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Community() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    category: 'General',
    location: '',
    isPrivate: false
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await api.get('/groups');
      setGroups(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/groups', newGroup);
      toast.success('Group created successfully!');
      setGroups([res.data, ...groups]);
      setShowCreateModal(false);
      navigate(`/community/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create group');
    }
  };

  const handleJoinLeave = async (groupId) => {
    try {
      const res = await api.put(`/groups/${groupId}/membership`);
      toast.success(res.data.message);
      setGroups(groups.map(g => {
        if (g._id === groupId) {
          return { ...g, members: res.data.members };
        }
        return g;
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="bg-brand-dark rounded-2xl overflow-hidden shadow-md relative p-8 md:p-10 text-white flex flex-col md:flex-row justify-between items-center">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl font-bold mb-4">Fashion Community Groups</h1>
          <p className="text-brand-light opacity-90 mb-6">Join local swap groups, discuss sustainable fashion, and connect with like-minded people.</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-brand-primary hover:bg-brand-accent text-white px-6 py-3 rounded-xl font-semibold flex items-center transition"
          >
            <Plus className="w-5 h-5 mr-2" /> Create a Group
          </button>
        </div>
        <div className="hidden md:block">
          <Users className="w-48 h-48 text-brand-primary opacity-50" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => {
          const isMember = group.members.some(m => m === user?._id || m._id === user?._id);
          return (
            <div key={group._id} className="bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden hover:shadow-md transition flex flex-col">
              <div className="h-32 bg-gray-200 relative">
                <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
                {group.isPrivate && (
                  <div className="absolute top-3 right-3 bg-black/60 text-white p-1.5 rounded-md backdrop-blur-sm">
                    <Shield className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-brand-dark line-clamp-1"><Link to={`/community/${group._id}`} className="hover:text-brand-primary">{group.name}</Link></h3>
                  <span className="bg-brand-light text-brand-dark text-xs px-2 py-1 rounded font-medium">{group.category}</span>
                </div>
                <p className="text-text-muted text-sm line-clamp-2 mb-4 flex-1">{group.description}</p>
                
                <div className="flex items-center text-xs text-text-muted mb-4 space-x-4">
                  <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {group.members.length} members</span>
                  {group.location && <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {group.location}</span>}
                </div>
                
                <div className="flex space-x-3 mt-auto">
                  <Link to={`/community/${group._id}`} className="flex-1 bg-brand-light text-brand-dark text-center py-2 rounded-lg font-medium hover:bg-gray-200 transition">View Group</Link>
                  <button 
                    onClick={() => handleJoinLeave(group._id)}
                    className={`flex-1 py-2 rounded-lg font-medium transition ${isMember ? 'bg-gray-100 text-gray-600 border border-gray-300' : 'bg-brand-primary text-white hover:bg-brand-accent'}`}
                  >
                    {isMember ? 'Leave' : 'Join'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-scale-in">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Create New Group</h2>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Group Name</label>
                <input type="text" required value={newGroup.name} onChange={(e) => setNewGroup({...newGroup, name: e.target.value})} className="w-full px-4 py-2 border border-border-subtle rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Description</label>
                <textarea required rows="3" value={newGroup.description} onChange={(e) => setNewGroup({...newGroup, description: e.target.value})} className="w-full px-4 py-2 border border-border-subtle rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Category</label>
                  <select value={newGroup.category} onChange={(e) => setNewGroup({...newGroup, category: e.target.value})} className="w-full px-4 py-2 border border-border-subtle rounded-xl outline-none">
                    <option value="General">General</option>
                    <option value="Local Swaps">Local Swaps</option>
                    <option value="Vintage & Retro">Vintage & Retro</option>
                    <option value="Upcycling & DIY">Upcycling & DIY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Location (Optional)</label>
                  <input type="text" placeholder="e.g. London" value={newGroup.location} onChange={(e) => setNewGroup({...newGroup, location: e.target.value})} className="w-full px-4 py-2 border border-border-subtle rounded-xl outline-none" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <input type="checkbox" id="private" checked={newGroup.isPrivate} onChange={(e) => setNewGroup({...newGroup, isPrivate: e.target.checked})} className="mr-2" />
                <label htmlFor="private" className="text-sm text-brand-dark">Private Group (Only members can post)</label>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-text-muted hover:text-brand-dark">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-dark">Create Group</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
