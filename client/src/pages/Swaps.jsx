import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { ArrowRightLeft, MessageCircle, AlertTriangle, RefreshCw, X, Check, ShieldCheck, MapPin, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Swaps() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedSwap, setSelectedSwap] = useState(null);

  // Check URL for payment success/cancel
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const paymentSwapId = urlParams.get('swapId');
    
    if (paymentStatus === 'success' && paymentSwapId) {
      toast.success('Payment completed successfully!');
      // Confirm payment in backend
      api.put('/payments/confirm', { swapId: paymentSwapId })
        .then(() => fetchSwaps())
        .catch(err => console.error(err));
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'cancelled') {
      toast.error('Payment was cancelled.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchSwaps();
    }
  }, [filter, user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mb-6">
          <ArrowRightLeft className="w-10 h-10 text-brand-primary" />
        </div>
        <h2 className="text-2xl font-bold text-brand-dark mb-2">Sign in to view your swaps</h2>
        <p className="text-text-muted mb-6">You need an account to manage your swap requests.</p>
        <button onClick={() => navigate('/auth')} className="bg-brand-dark text-white px-8 py-3 rounded-md font-bold hover:bg-brand-primary transition">Sign In</button>
      </div>
    );
  }

  const fetchSwaps = async () => {
    setLoading(true);
    try {
      let params = { type: filter };
      if (['active', 'completed', 'cancelled'].includes(filter)) {
        params = { type: 'all', status: filter };
      }
      const { data } = await api.get('/swaps', { params });
      setSwaps(data);
    } catch (err) {
      console.error('Fetch swaps error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch swaps');
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'pending':
        return <span className="text-warning-tag font-semibold">Pending</span>;
      case 'accepted':
        return <span className="text-success-tag font-semibold">Accepted</span>;
      case 'rejected':
      case 'cancelled':
        return <span className="text-danger-tag font-semibold capitalize">{status}</span>;
      case 'completed':
        return <span className="text-brand-primary font-semibold">Completed</span>;
      default:
        return <span className="text-text-muted font-semibold capitalize">{status}</span>;
    }
  };

  const handleUpdateStatus = async (swapId, newStatus) => {
    try {
      setActionLoading(swapId);
      await api.put(`/swaps/${swapId}/status`, { status: newStatus });
      fetchSwaps(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${newStatus} swap`);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePayment = async (swapId) => {
    try {
      setActionLoading(swapId);
      const res = await api.post('/payments/create-checkout-session', { swapId });
      if (res.data.url) {
        window.location.href = res.data.url; // Redirect to Stripe
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment initiation failed');
    } finally {
      setActionLoading(null);
    }
  };


  const renderSwapCard = (swap) => {
    const isReceived = swap.receiver._id === user._id;
    const partner = isReceived ? swap.requester : swap.receiver;
    const myItem = isReceived ? swap.requestedItem : swap.offeredItem;
    const theirItem = isReceived ? swap.offeredItem : swap.requestedItem;
    const hasPaidShipping = isReceived ? swap.receiverShippingPaid : swap.requesterShippingPaid;

    if (!myItem || !theirItem) return null;

    return (
      <div key={swap._id} className="bg-white rounded-xl border border-border-subtle shadow-sm overflow-hidden mb-6">
        <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-6 w-full">
            
            {/* Your Item */}
            <div className="flex-1 flex flex-col items-center sm:items-start">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Your Item</span>
              <div className="flex items-center gap-4">
                <Link to={`/items/${myItem._id}`} className="flex-shrink-0">
                  <img src={myItem.images?.[0] || 'https://via.placeholder.com/100'} alt="my item" className="w-14 h-14 object-cover rounded-md border border-border-subtle shadow-sm" />
                </Link>
                <div>
                  <Link to={`/items/${myItem._id}`} className="font-semibold text-sm text-brand-dark hover:text-brand-primary transition line-clamp-1">{myItem.title}</Link>
                  <p className="font-semibold text-text-muted text-[13px] mt-0.5">{myItem.estimatedSwapPoints} pts</p>
                </div>
              </div>
            </div>

            {/* Arrows */}
            <div className="hidden sm:flex px-4">
              <ArrowRightLeft className="w-5 h-5 text-text-muted" />
            </div>

            {/* Their Item */}
            <div className="flex-1 flex flex-col items-center sm:items-start">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Their Item</span>
              <div className="flex items-center gap-4">
                <Link to={`/items/${theirItem._id}`} className="flex-shrink-0">
                  <img src={theirItem.images?.[0] || 'https://via.placeholder.com/100'} alt="their item" className="w-14 h-14 object-cover rounded-md border border-border-subtle shadow-sm" />
                </Link>
                <div>
                  <Link to={`/items/${theirItem._id}`} className="font-semibold text-sm text-brand-dark hover:text-brand-primary transition line-clamp-1">{theirItem.title}</Link>
                  <p className="font-semibold text-text-muted text-[13px] mt-0.5">{theirItem.estimatedSwapPoints} pts</p>
                </div>
              </div>
            </div>
            
          </div>

          <div className="flex flex-col items-center md:items-end w-full md:w-auto mt-4 md:mt-0">
             <span className="text-xs text-text-muted font-medium mb-1">Status</span>
             {getStatusDisplay(swap.status)}
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-bg-main px-5 py-3 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-text-muted uppercase tracking-wide font-medium">
            {isReceived ? 'Requested by' : 'Sent to'} <span className="font-bold text-brand-dark">{partner.name}</span> • {new Date(swap.createdAt).toLocaleDateString()}
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
            {swap.status === 'pending' && isReceived ? (
              <>
                <button 
                  onClick={() => handleUpdateStatus(swap._id, 'rejected')}
                  disabled={actionLoading === swap._id}
                  className="flex-1 sm:flex-none px-5 py-1.5 border border-danger-tag text-danger-tag rounded-md text-xs font-semibold hover:bg-red-50 transition-all disabled:opacity-50"
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleUpdateStatus(swap._id, 'accepted')}
                  disabled={actionLoading === swap._id}
                  className="flex-1 sm:flex-none px-5 py-1.5 bg-success-tag text-white rounded-md text-xs font-semibold hover:bg-green-600 shadow-sm transition-all disabled:opacity-50"
                >
                  {actionLoading === swap._id ? 'Updating...' : 'Accept'}
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setSelectedSwap(swap)}
                  className="flex-1 sm:flex-none px-5 py-1.5 border border-border-subtle rounded-md text-xs font-semibold text-text-main hover:bg-white hover:shadow-sm transition-all"
                >
                  View
                </button>
                {swap.status === 'pending' && !isReceived && (
                  <button 
                    onClick={() => handleUpdateStatus(swap._id, 'cancelled')}
                    disabled={actionLoading === swap._id}
                    className="flex-1 sm:flex-none px-5 py-1.5 border border-danger-tag text-danger-tag rounded-md text-xs font-semibold hover:bg-red-50 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
                {(swap.status === 'accepted' || swap.status === 'pending') && (
                  <button 
                    onClick={async () => {
                      try {
                        await api.post('/chat', { swapRequestId: swap._id });
                        navigate('/chat');
                      } catch (err) {
                        navigate('/chat');
                      }
                    }}
                    className="flex-1 sm:flex-none px-5 py-1.5 bg-brand-dark text-white rounded-md text-xs font-semibold hover:bg-brand-primary hover:shadow-sm transition-all"
                  >
                    Chat
                  </button>
                )}
                {swap.status === 'accepted' && swap.deliveryMethod?.toLowerCase() === 'shipping' && !hasPaidShipping && (
                  <button 
                    onClick={() => handlePayment(swap._id)}
                    disabled={actionLoading === swap._id}
                    className="flex-1 sm:flex-none px-5 py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 hover:shadow-sm transition-all disabled:opacity-50"
                  >
                    Pay Shipping
                  </button>
                )}
                {swap.status === 'accepted' && swap.deliveryMethod?.toLowerCase() === 'shipping' && hasPaidShipping && (
                  <span className="flex items-center justify-center flex-1 sm:flex-none px-5 py-1.5 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
                    Shipping Paid <Check className="w-4 h-4 ml-1" />
                  </span>
                )}
                {swap.status === 'accepted' && (
                  <button 
                    onClick={() => handleUpdateStatus(swap._id, 'completed')}
                    disabled={actionLoading === swap._id}
                    className="flex-1 sm:flex-none px-5 py-1.5 bg-brand-primary text-white rounded-md text-xs font-semibold hover:bg-green-700 hover:shadow-sm transition-all disabled:opacity-50"
                  >
                    Complete
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSwapDetailsModal = () => {
    if (!selectedSwap) return null;
    const isReceived = selectedSwap.receiver._id === user._id;
    const partner = isReceived ? selectedSwap.requester : selectedSwap.receiver;

    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <h2 className="text-xl font-bold text-brand-dark">Swap Details</h2>
            <button onClick={() => setSelectedSwap(null)} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Status</span>
              <div className="mt-1">{getStatusDisplay(selectedSwap.status)}</div>
            </div>
            <div>
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Partner</span>
              <p className="font-medium text-brand-dark mt-1">{partner.name}</p>
            </div>
            <div>
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Delivery Method</span>
              <p className="font-medium text-gray-800 mt-1 capitalize">{selectedSwap.deliveryMethod || 'Not specified'}</p>
            </div>
            {selectedSwap.deliveryMethod?.toLowerCase() === 'shipping' && (
                <div>
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Shipping Payment</span>
                  <p className="font-medium text-gray-800 mt-1">
                    {(isReceived ? selectedSwap.receiverShippingPaid : selectedSwap.requesterShippingPaid) ? (
                      <span className="text-success-tag flex items-center"><Check className="w-4 h-4 mr-1" /> Paid</span>
                    ) : (
                      <span className="text-warning-tag">Pending</span>
                    )}
                  </p>
                </div>
            )}
            <div>
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Initial Message</span>
              <p className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 mt-1 italic">
                {selectedSwap.initialMessage || 'No initial message attached.'}
              </p>
            </div>
            <div>
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Requested On</span>
              <p className="text-sm text-gray-800 mt-1">{new Date(selectedSwap.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
             <button onClick={() => setSelectedSwap(null)} className="px-6 py-2 bg-brand-dark text-white rounded-md font-bold text-sm hover:bg-brand-primary transition">
               Close
             </button>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'received', label: 'Incoming' },
    { id: 'sent', label: 'Outgoing' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="bg-bg-main min-h-screen py-8">
      {renderSwapDetailsModal()}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <h1 className="text-2xl font-bold text-brand-dark mb-6">My Swaps</h1>
        
        <div className="flex space-x-2 mb-6 border-b border-border-subtle pb-1 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 text-sm font-semibold whitespace-nowrap rounded-md transition-colors ${
                filter === tab.id 
                  ? 'bg-brand-dark text-white' 
                  : 'text-text-muted hover:text-brand-dark hover:bg-brand-light'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-danger-tag/10 text-danger-tag p-4 rounded-md mb-6 flex items-center font-medium text-sm">
            <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-primary"></div>
          </div>
        ) : swaps.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-xl border border-border-subtle shadow-sm mt-8">
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRightLeft className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-2">No swaps found</h3>
            <p className="text-text-muted mb-6 text-sm">You don't have any swap requests in this category yet.</p>
            <button onClick={() => navigate('/marketplace')} className="bg-brand-dark text-white px-6 py-2.5 rounded-md font-semibold hover:bg-brand-primary transition">Browse Marketplace</button>
          </div>
        ) : (
          <div className="space-y-2">
            {swaps.map(renderSwapCard)}
          </div>
        )}
      </div>
    </div>
  );
}