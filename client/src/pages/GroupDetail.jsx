import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { useParams, Link } from 'react-router-dom';
import { Users, Send, Heart, MessageCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function GroupDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    fetchGroupData();
  }, [id]);

  const fetchGroupData = async () => {
    try {
      const [groupRes, postsRes] = await Promise.all([
        api.get(`/groups/${id}`),
        api.get(`/groups/${id}/posts`)
      ]);
      setGroup(groupRes.data);
      setPosts(postsRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load group details');
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      const res = await api.post(`/groups/${id}/posts`, { content: newPost });
      setPosts([res.data, ...posts]);
      setNewPost('');
      toast.success('Posted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post');
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await api.put(`/groups/posts/${postId}/like`);
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: res.data } : p));
    } catch (err) {
      toast.error('Action failed');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div></div>;
  if (!group) return <div>Group not found</div>;

  const isMember = group.members.some(m => m._id === user?._id || m === user?._id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Link to="/community" className="inline-flex items-center text-text-muted hover:text-brand-dark mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Groups
      </Link>
      
      <div className="bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
        <div className="h-48 bg-brand-primary relative">
          <img src={group.image} alt={group.name} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
            <div className="flex items-center space-x-4 text-sm opacity-90">
              <span className="bg-white/20 px-2 py-1 rounded">{group.category}</span>
              <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {group.members.length} members</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-lg font-bold text-brand-dark mb-2">About this group</h2>
          <p className="text-text-muted">{group.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {isMember ? (
            <div className="bg-white rounded-2xl border border-border-subtle shadow-sm p-4">
              <form onSubmit={handlePostSubmit} className="flex space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center font-bold text-brand-dark shrink-0">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Share something with the group..." 
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="w-full bg-gray-50 border border-border-subtle rounded-full px-5 py-2.5 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary pr-12"
                  />
                  <button type="submit" disabled={!newPost.trim()} className="absolute right-2 top-1.5 p-1.5 bg-brand-primary text-white rounded-full hover:bg-brand-dark disabled:opacity-50 transition">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-orange-50 text-warning-tag p-4 rounded-xl text-center border border-orange-100">
              Join this group to participate in discussions.
            </div>
          )}

          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-2xl border border-border-subtle">
                <p className="text-text-muted">No posts yet. Be the first to start a discussion!</p>
              </div>
            ) : (
              posts.map(post => (
                <div key={post._id} className="bg-white rounded-2xl border border-border-subtle shadow-sm p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center font-bold text-brand-dark mr-3">
                      {post.author.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-dark">{post.author.name}</h4>
                      <p className="text-xs text-text-muted">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-brand-dark mb-4">{post.content}</p>
                  <div className="flex items-center space-x-6 border-t border-border-subtle pt-3">
                    <button onClick={() => handleLike(post._id)} className={`flex items-center text-sm font-medium ${post.likes.includes(user?._id) ? 'text-danger-tag' : 'text-text-muted hover:text-danger-tag'}`}>
                      <Heart className={`w-5 h-5 mr-1.5 ${post.likes.includes(user?._id) ? 'fill-current' : ''}`} /> {post.likes.length}
                    </button>
                    <button className="flex items-center text-sm font-medium text-text-muted hover:text-brand-primary">
                      <MessageCircle className="w-5 h-5 mr-1.5" /> {post.comments?.length || 0}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-border-subtle shadow-sm p-5 sticky top-24">
            <h3 className="font-bold text-brand-dark mb-4 pb-2 border-b border-border-subtle">Group Info</h3>
            <ul className="space-y-3 text-sm text-brand-dark">
              <li className="flex items-center"><span className="text-text-muted w-24">Admin:</span> <span className="font-medium">{group.admin.name}</span></li>
              <li className="flex items-center"><span className="text-text-muted w-24">Created:</span> <span>{new Date(group.createdAt).toLocaleDateString()}</span></li>
              <li className="flex items-center"><span className="text-text-muted w-24">Privacy:</span> <span>{group.isPrivate ? 'Private Group' : 'Public Group'}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
