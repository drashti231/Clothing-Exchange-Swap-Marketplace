import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { MapPin, RefreshCw, X, AlertTriangle, ShieldCheck, User, Star, ArrowRightLeft, Check, Heart, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { isFairMatch, calculateSwapPoints } from '../utils/calculator';

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Image Gallery State
  const [activeImage, setActiveImage] = useState(0);

  // Swap Modal State
  const [showModal, setShowModal] = useState(false);
  const [myItems, setMyItems] = useState([]);
  const [selectedMyItem, setSelectedMyItem] = useState(null);
  const [swapMessage, setSwapMessage] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Local meetup');
  const [swapError, setSwapError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate content');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await api.get(`/items/${id}`);
        setItem(data);
      } catch (err) {
        setError('Item not found');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const openSwapModal = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setShowModal(true);
    try {
      const { data } = await api.get('/items/user/listings');
      // data is an array of items
      const availableItems = data.filter(i => i.status === 'available');
      setMyItems(availableItems);
    } catch (err) {
      setSwapError('Failed to load your items');
    }
  };

  const handleSwapSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMyItem) {
      setSwapError('Please select an item to offer');
      return;
    }

    setSubmitting(true);
    setSwapError('');

    try {
      await api.post('/swaps', {
        requestedItemId: item._id,
        offeredItemId: selectedMyItem._id,
        initialMessage: swapMessage,
        deliveryMethod: deliveryMethod
      });
      setShowModal(false);
      navigate('/swaps');
    } catch (err) {
      setSwapError(err.response?.data?.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setReportSubmitting(true);
    try {
      await api.post(`/items/${item._id}/report`, { reason: reportReason, details: reportDetails });
      toast.success('Report submitted successfully');
      setShowReportModal(false);
      setReportDetails('');
      setReportReason('Inappropriate content');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setReportSubmitting(false);
    }
  };


  if (loading) return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-primary"></div>
    </div>
  );
  if (error) return (
    <div className="text-center mt-20 max-w-md mx-auto bg-white p-8 rounded-xl border border-border-subtle shadow-sm">
      <AlertTriangle className="w-12 h-12 text-danger-tag mx-auto mb-4" />
      <h2 className="text-xl font-bold text-brand-dark mb-2">Oops!</h2>
      <div className="text-text-muted mb-6">{error}</div>
      <button onClick={() => navigate('/marketplace')} className="bg-brand-dark text-white px-6 py-2.5 rounded-md font-medium hover:bg-brand-primary transition">Back to Marketplace</button>
    </div>
  );
  if (!item) return null;

  const isOwner = user && item.owner && user._id === item.owner._id;
  const itemImages = item.images && item.images.length > 0 ? item.images : ['https://via.placeholder.com/600x800?text=No+Image'];

  // Calculate Breakdown
  const categoryBaseValues = {
    'T-Shirt': 500, 'Shirt': 700, 'Jeans': 900, 'Dress': 1200, 
    'Jacket': 1600, 'Ethnic Wear': 1400, 'Footwear': 1300, 'Accessories': 600
  };
  const brandMultipliers = { 'Premium': 1.50, 'Popular': 1.20, 'Standard': 1.00, 'Budget': 0.75, 'Unknown': 0.65 };
  const conditionMultipliers = { 'New with tags': 1.00, 'Like new': 0.85, 'Good': 0.65, 'Fair': 0.40 };

  const baseVal = categoryBaseValues[item.category] || 800;
  const brandMult = brandMultipliers[item.brand] || 1.0;
  const condMult = conditionMultipliers[item.condition] || 0.65;
  const rawBrandBonus = Math.round(baseVal * brandMult) - baseVal;
  const currentBase = baseVal + rawBrandBonus;
  const rawCondBonus = Math.round(currentBase * condMult) - currentBase;

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'new with tags': return 'bg-success-tag';
      case 'like new': return 'bg-brand-primary';
      case 'good': return 'bg-brand-accent';
      case 'fair': return 'bg-warning-tag';
      default: return 'bg-brand-primary';
    }
  };

  return (
    <div className="bg-bg-main min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-text-muted mb-6 font-medium">
          <button onClick={() => navigate('/marketplace')} className="hover:text-brand-primary transition">Marketplace</button>
          <ChevronRight className="w-4 h-4 mx-2 text-border-subtle" />
          <button onClick={() => navigate(`/marketplace?category=${item.category}`)} className="hover:text-brand-primary transition">{item.category}</button>
          <ChevronRight className="w-4 h-4 mx-2 text-border-subtle" />
          <span className="text-text-main">{item.title}</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border-subtle overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left Column: Image Gallery */}
            <div className="lg:w-[45%] p-6 flex flex-col border-b lg:border-b-0 lg:border-r border-border-subtle">
              <div className="w-full aspect-[3/4] bg-bg-main rounded-lg overflow-hidden relative group mb-4">
                <img 
                  src={itemImages[activeImage]} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700"
                />
                
                {/* Condition Badge */}
                {item.condition && (
                  <div className={`absolute top-4 left-4 ${getConditionColor(item.condition)} text-white px-3 py-1.5 rounded-md shadow-sm`}>
                    <span className="font-semibold text-sm">{item.condition}</span>
                  </div>
                )}
                
                {itemImages.length > 1 && (
                  <>
                    <button 
                      onClick={() => setActiveImage(prev => (prev === 0 ? itemImages.length - 1 : prev - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 rounded-full shadow-md hover:bg-white text-text-main transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setActiveImage(prev => (prev === itemImages.length - 1 ? 0 : prev + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 rounded-full shadow-md hover:bg-white text-text-main transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              
              {itemImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto w-full pb-2 hide-scrollbar">
                  {itemImages.map((img, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-brand-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Item Details */}
            <div className="lg:w-[55%] p-8 flex flex-col">
              
              {/* Header Info */}
              <div className="mb-6 border-b border-border-subtle pb-6">
                <h1 className="text-3xl font-bold text-brand-dark mb-2">{item.title}</h1>
                <div className="text-text-muted text-sm font-medium flex items-center mb-4">
                  <span>{item.brand || 'Unbranded'}</span>
                  <span className="mx-2">·</span>
                  <span>Size {item.size || 'N/A'}</span>
                  <span className="mx-2">·</span>
                  <span>{item.gender || 'Unisex'}</span>
                </div>
                
                <div className="flex items-center text-sm text-text-muted mb-6">
                  <MapPin className="w-4 h-4 mr-1.5 text-brand-primary" />
                  <span>{item.city}, {item.state}</span>
                </div>
                
                <div className="flex items-end font-bold text-danger-tag">
                  <span className="text-4xl">{item.estimatedSwapPoints || 0}</span>
                  <span className="text-xl ml-1.5 mb-1">pts</span>
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div>
                  <span className="text-xs text-text-muted font-medium block mb-1">Condition</span>
                  <span className="font-semibold text-text-main">{item.condition || '-'}</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted font-medium block mb-1">Brand</span>
                  <span className="font-semibold text-text-main">{item.brand || '-'}</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted font-medium block mb-1">Category</span>
                  <span className="font-semibold text-text-main">{item.category || '-'}</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted font-medium block mb-1">Color</span>
                  <span className="font-semibold text-text-main">{item.color || 'Blue'}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-bold text-lg text-brand-dark mb-2">Description</h3>
                <div className="text-text-main text-sm leading-relaxed whitespace-pre-wrap">
                  {item.description || 'No description provided.'}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                {isOwner ? (
                  <button disabled className="flex-1 bg-brand-light text-text-muted py-3 rounded-md font-semibold cursor-not-allowed">
                    Your Item
                  </button>
                ) : item.status !== 'available' ? (
                  <button disabled className="flex-1 bg-brand-light text-text-muted py-3 rounded-md font-semibold cursor-not-allowed">
                    Item {item.status}
                  </button>
                ) : (
                  <button 
                    onClick={openSwapModal}
                    className="flex-1 bg-brand-dark text-white py-3 rounded-md font-semibold hover:bg-brand-primary transition flex items-center justify-center shadow-sm"
                  >
                    <ArrowRightLeft className="w-4 h-4 mr-2" /> Request Swap
                  </button>
                )}
                <button className="flex items-center justify-center px-6 border border-border-subtle rounded-md text-text-main font-semibold hover:bg-bg-main transition">
                  <Heart className="w-5 h-5 mr-2" /> Save Item
                </button>
                {user && !isOwner && (
                  <button 
                    onClick={() => setShowReportModal(true)}
                    className="flex items-center justify-center px-4 border border-border-subtle rounded-md text-text-muted hover:text-danger-tag hover:border-danger-tag transition"
                    title="Report Listing"
                  >
                    <Flag className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-6 border-t border-border-subtle pt-8">
                {/* Listed By */}
                <div className="flex-1 border border-border-subtle p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={item.owner?.avatar || `https://ui-avatars.com/api/?name=${item.owner?.name}&background=1A4731&color=fff`} 
                      alt={item.owner?.name} 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <p className="text-xs text-text-muted mb-0.5">Listed by</p>
                      <p className="font-semibold text-brand-dark leading-tight">{item.owner?.name || 'User'}</p>
                      <div className="flex items-center text-xs mt-1">
                        <Star className="w-3 h-3 text-warning-tag fill-warning-tag mr-1" />
                        <span className="font-medium mr-2">{item.owner?.rating?.toFixed(1) || '4.8'} (26 reviews)</span>
                      </div>
                      <p className="text-xs text-text-muted mt-1 flex items-center">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Member since Jan 2024
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/users/${item.owner._id}`)}
                    className="border border-border-subtle text-text-main text-xs font-semibold px-4 py-2 rounded-md hover:bg-bg-main transition"
                  >
                    View Profile
                  </button>
                </div>

                {/* Swap Value Breakdown */}
                <div className="flex-1">
                  <h4 className="font-bold text-brand-dark mb-3">Swap Value Breakdown</h4>
                  <div className="text-sm border-t border-border-subtle">
                    <div className="flex justify-between py-2 border-b border-border-subtle">
                      <span className="text-text-muted">Category Base Value</span>
                      <span className="font-medium">{baseVal} pts</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border-subtle">
                      <span className="text-text-muted">Brand Bonus ({item.brand || 'Standard'})</span>
                      <span className="font-medium">{rawBrandBonus > 0 ? '+' : ''}{rawBrandBonus} pts</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border-subtle">
                      <span className="text-text-muted">Condition Factor ({item.condition})</span>
                      <span className="font-medium">{rawCondBonus > 0 ? '+' : ''}{rawCondBonus} pts</span>
                    </div>
                    <div className="flex justify-between py-2 pt-3">
                      <span className="font-bold text-text-main">Total Estimated Value</span>
                      <span className="font-bold text-danger-tag">{item.estimatedSwapPoints} pts</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Swap Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-border-subtle flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-brand-dark">Propose a Swap</h2>
                <p className="text-sm text-text-muted mt-1">Select an item to offer for {item.title}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-brand-dark transition"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSwapSubmit} className="flex flex-col h-full overflow-hidden">
              <div className="p-6 overflow-y-auto hide-scrollbar flex-grow space-y-6">
                {swapError && <div className="bg-danger-tag/10 text-danger-tag p-4 rounded-md font-medium text-sm flex items-center"><AlertTriangle className="w-4 h-4 mr-2"/>{swapError}</div>}
                
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-3">Your Available Closet</label>
                  {myItems.length === 0 ? (
                    <div className="p-8 bg-brand-light border border-dashed border-border-subtle rounded-xl text-center">
                      <h3 className="text-lg font-bold text-brand-dark mb-2">Closet is empty</h3>
                      <p className="text-text-muted text-sm mb-4">You don't have any available items to swap right now.</p>
                      <button type="button" onClick={() => navigate('/list-item')} className="bg-brand-dark text-white px-6 py-2.5 rounded-md font-medium hover:bg-brand-primary transition">
                        Add an Item
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {myItems.map(myItem => {
                        const fair = isFairMatch(item.estimatedSwapPoints, myItem.estimatedSwapPoints);
                        const isSelected = selectedMyItem?._id === myItem._id;
                        return (
                          <div 
                            key={myItem._id}
                            onClick={() => setSelectedMyItem(myItem)}
                            className={`flex flex-col p-3 border rounded-lg cursor-pointer transition-all ${isSelected ? 'border-brand-primary bg-brand-light ring-1 ring-brand-primary' : 'border-border-subtle bg-white hover:border-brand-primary'}`}
                          >
                            <div className="flex items-start">
                              <img src={myItem.images?.[0] || 'https://via.placeholder.com/150'} alt="thumbnail" className="w-14 h-14 object-cover rounded-md mr-3 border border-border-subtle" />
                              <div className="flex-1 min-w-0">
                                <h4 className={`font-semibold text-sm line-clamp-1 mb-1 ${isSelected ? 'text-brand-primary' : 'text-text-main'}`}>{myItem.title}</h4>
                                <div className="font-bold text-danger-tag flex items-center text-xs">
                                  {myItem.estimatedSwapPoints} pts
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-border-subtle flex justify-between items-center">
                               {fair ? (
                                  <span className="bg-success-tag/10 text-success-tag px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center">
                                    Fair Match
                                  </span>
                                ) : (
                                  <span className="bg-warning-tag/10 text-warning-tag px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center">
                                    Value Mismatch
                                  </span>
                                )}
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-brand-primary bg-brand-primary' : 'border-border-subtle bg-white'}`}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">Message (Optional)</label>
                  <textarea 
                    value={swapMessage}
                    onChange={(e) => setSwapMessage(e.target.value)}
                    className="w-full p-3 bg-white border border-border-subtle rounded-md focus:border-brand-primary outline-none text-sm transition-all resize-none"
                    rows="3"
                    placeholder="Hi! I'd love to trade my item for yours..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">Delivery Method</label>
                  <div className="flex gap-4">
                    <label className={`flex-1 flex items-center justify-center p-3 rounded-md border cursor-pointer transition ${deliveryMethod === 'Local meetup' ? 'border-brand-primary bg-brand-light ring-1 ring-brand-primary text-brand-primary font-semibold' : 'border-border-subtle bg-white text-text-main font-medium'}`}>
                      <input type="radio" name="deliveryMethod" value="Local meetup" checked={deliveryMethod === 'Local meetup'} onChange={() => setDeliveryMethod('Local meetup')} className="sr-only" />
                      Local Meetup
                    </label>
                    <label className={`flex-1 flex items-center justify-center p-3 rounded-md border cursor-pointer transition ${deliveryMethod === 'Shipping' ? 'border-brand-primary bg-brand-light ring-1 ring-brand-primary text-brand-primary font-semibold' : 'border-border-subtle bg-white text-text-main font-medium'}`}>
                      <input type="radio" name="deliveryMethod" value="Shipping" checked={deliveryMethod === 'Shipping'} onChange={() => setDeliveryMethod('Shipping')} className="sr-only" />
                      Shipping
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border-subtle bg-bg-main flex justify-end gap-3 rounded-b-xl">
                 <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 rounded-md font-semibold text-text-main bg-white border border-border-subtle hover:bg-brand-light transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting || !selectedMyItem}
                  className="px-6 py-2.5 rounded-md font-semibold text-white bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-primary transition shadow-sm flex items-center"
                >
                  {submitting ? (
                    <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                  ) : (
                    'Send Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-border-subtle flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-brand-dark flex items-center">
                  <Flag className="w-5 h-5 mr-2 text-danger-tag" /> Report Listing
                </h2>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-text-muted hover:text-brand-dark transition"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleReportSubmit}>
              <div className="p-6 space-y-4">
                <p className="text-sm text-text-muted">If you think this listing violates our community guidelines, please let us know.</p>
                
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">Reason</label>
                  <select 
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-3 bg-white border border-border-subtle rounded-md focus:border-brand-primary outline-none text-sm"
                  >
                    <option value="Inappropriate content">Inappropriate content</option>
                    <option value="Counterfeit item">Counterfeit item</option>
                    <option value="Spam or misleading">Spam or misleading</option>
                    <option value="Offensive language">Offensive language</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">Additional Details (Optional)</label>
                  <textarea 
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    className="w-full p-3 bg-white border border-border-subtle rounded-md focus:border-brand-primary outline-none text-sm transition-all resize-none"
                    rows="4"
                    maxLength={500}
                    placeholder="Please provide any additional context to help us understand the issue..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-border-subtle bg-bg-main flex justify-end gap-3 rounded-b-xl">
                 <button 
                  type="button" 
                  onClick={() => setShowReportModal(false)}
                  className="px-6 py-2.5 rounded-md font-semibold text-text-main bg-white border border-border-subtle hover:bg-brand-light transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={reportSubmitting}
                  className="px-6 py-2.5 rounded-md font-semibold text-white bg-danger-tag disabled:opacity-50 hover:bg-red-700 transition shadow-sm flex items-center"
                >
                  {reportSubmitting ? (
                    <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                  ) : (
                    'Submit Report'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
