import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Bell, 
  Lock, 
  Shield, 
  Trash2, 
  Save, 
  CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-brand-dark mb-2">Sign in to view settings</h2>
        <button onClick={() => navigate('/auth')} className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold">Sign In</button>
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call for settings update
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings updated successfully!');
    }, 1000);
  };

  const tabs = [
    { id: 'account', label: 'Account Preferences', icon: <User className="w-5 h-5 mb-1" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5 mb-1" /> },
    { id: 'security', label: 'Security & Login', icon: <Lock className="w-5 h-5 mb-1" /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield className="w-5 h-5 mb-1" /> }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-brand-dark mb-2">Settings</h1>
        <p className="text-text-muted font-medium">Manage your account preferences, notifications, and privacy.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
            <div className="p-4 border-b border-border-subtle bg-gray-50 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-dark font-bold text-lg">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-sm text-brand-dark">{user.name}</p>
                <p className="text-xs text-text-muted">{user.email}</p>
              </div>
            </div>
            <nav className="flex flex-col p-2 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 w-full px-4 py-3 text-left rounded-xl font-semibold text-sm transition-all ${
                    activeTab === tab.id 
                      ? 'bg-danger-tag/10 text-danger-tag' 
                      : 'text-text-muted hover:bg-gray-50 hover:text-brand-dark'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-danger-tag' : 'text-gray-400'}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-border-subtle p-6 md:p-8 min-h-[400px]">
            
            {activeTab === 'account' && (
              <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
                <h2 className="text-xl font-bold text-brand-dark border-b border-gray-100 pb-4 mb-6">Account Preferences</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" defaultValue={user.email} disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" />
                    <p className="text-xs text-text-muted mt-2">Email address cannot be changed currently.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Language</label>
                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-danger-tag outline-none font-medium">
                      <option>English (US)</option>
                      <option>Hindi</option>
                      <option>Gujarati</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Timezone</label>
                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-danger-tag outline-none font-medium">
                      <option>(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                      <option>(GMT+00:00) London</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={isSaving} className="bg-danger-tag text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-700 transition flex items-center">
                    {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Preferences</>}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'notifications' && (
              <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
                <h2 className="text-xl font-bold text-brand-dark border-b border-gray-100 pb-4 mb-6">Notification Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded text-danger-tag focus:ring-danger-tag" />
                    <div>
                      <p className="font-bold text-sm text-brand-dark">New Swap Requests</p>
                      <p className="text-xs text-text-muted mt-1">Get notified when someone wants to swap with you.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded text-danger-tag focus:ring-danger-tag" />
                    <div>
                      <p className="font-bold text-sm text-brand-dark">Direct Messages</p>
                      <p className="text-xs text-text-muted mt-1">Receive an email when you get a new message in chat.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <input type="checkbox" className="mt-1 w-5 h-5 rounded text-danger-tag focus:ring-danger-tag" />
                    <div>
                      <p className="font-bold text-sm text-brand-dark">Marketing & News</p>
                      <p className="text-xs text-text-muted mt-1">Receive weekly newsletters and sustainability tips.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={isSaving} className="bg-danger-tag text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-700 transition flex items-center">
                    {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Notifications</>}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
                <h2 className="text-xl font-bold text-brand-dark border-b border-gray-100 pb-4 mb-6">Security & Login</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-danger-tag outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-danger-tag outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-danger-tag outline-none" />
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={isSaving} className="bg-danger-tag text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-700 transition flex items-center">
                    {isSaving ? 'Updating...' : <><Lock className="w-4 h-4 mr-2" /> Update Password</>}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-8 max-w-2xl">
                <h2 className="text-xl font-bold text-brand-dark border-b border-gray-100 pb-4">Privacy & Data</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                    <div>
                      <p className="font-bold text-sm text-brand-dark">Public Profile Visibility</p>
                      <p className="text-xs text-text-muted mt-1">Allow other users to see your swap history and reviews.</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id="toggle1" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out checked:border-danger-tag checked:translate-x-6 checked:bg-danger-tag"/>
                        <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-red-100">
                  <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-sm text-text-muted mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                  <button className="flex items-center space-x-2 text-red-600 font-bold text-sm px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .toggle-checkbox:checked {
          right: 0;
          border-color: #E25E3E;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #E25E3E;
        }
      `}} />
    </div>
  );
}
