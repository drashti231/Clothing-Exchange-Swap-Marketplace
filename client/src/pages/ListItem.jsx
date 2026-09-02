import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { calculateSwapPoints } from '../utils/calculator';
import { Camera, X, Upload, Info, Star, ChevronRight, Check } from 'lucide-react';

export default function ListItem() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Tops',
    clothingType: 'T-Shirt',
    gender: 'Unisex',
    brand: 'Standard',
    size: 'M',
    color: '',
    condition: 'Good',
    city: user?.city || '',
    state: user?.state || '',
    postalCode: user?.postalCode || '',
    deliveryOptions: ['Local meetup']
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mb-6">
          <Upload className="w-10 h-10 text-brand-primary" />
        </div>
        <h2 className="text-2xl font-bold text-brand-dark mb-2">Sign in to list an item</h2>
        <p className="text-text-muted mb-6">You need an account to add items to the ReWear marketplace.</p>
        <button onClick={() => navigate('/auth')} className="bg-brand-dark text-white px-8 py-3 rounded-md font-bold hover:bg-brand-primary transition shadow-sm">Sign In</button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      let options = [...formData.deliveryOptions];
      if (checked) {
        options.push(value);
      } else {
        options = options.filter(opt => opt !== value);
      }
      setFormData({ ...formData, [name]: options });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    const newImages = [...images, ...files].slice(0, 5);
    setImages(newImages);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews].slice(0, 5));
    setError('');
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const calculatePoints = () => {
    return calculateSwapPoints(formData.category, formData.brand, formData.condition);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      setError('Please upload at least one image');
      setStep(3); // Go to photos step
      return;
    }
    
    setLoading(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key])) {
        data.append(key, formData[key].join(','));
      } else {
        data.append(key, formData[key]);
      }
    });

    data.append('estimatedSwapPoints', calculatePoints());

    images.forEach(image => {
      data.append('images', image);
    });

    try {
      await api.post('/items', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.title || !formData.description)) {
      setError('Please fill in title and description');
      return;
    }
    if (step === 3 && images.length === 0) {
      setError('Please upload at least one image');
      return;
    }
    setError('');
    setStep(s => Math.min(s + 1, 5));
  };
  
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const steps = [
    { id: 1, name: 'Basic Info' },
    { id: 2, name: 'Details' },
    { id: 3, name: 'Photos' },
    { id: 4, name: 'Location' },
    { id: 5, name: 'Review' }
  ];

  const inputClasses = "w-full p-3 bg-white border border-border-subtle text-text-main rounded-md focus:border-brand-primary outline-none text-sm";
  const labelClasses = "block text-sm font-semibold text-brand-dark mb-2";

  return (
    <div className="bg-bg-main min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        <h1 className="text-3xl font-bold text-brand-dark mb-8">List an Item for Swap</h1>
        
        {/* Stepper */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-0.5 bg-border-subtle z-0"></div>
          {steps.map((s, i) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-colors ${
                step > s.id ? 'bg-success-tag text-white' : 
                step === s.id ? 'bg-brand-dark text-white' : 
                'bg-bg-main border-2 border-border-subtle text-text-muted'
              }`}>
                {step > s.id ? <Check className="w-4 h-4" /> : s.id}
              </div>
              <span className={`text-xs font-semibold ${step >= s.id ? 'text-brand-dark' : 'text-text-muted'}`}>
                {s.name}
              </span>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-danger-tag/10 text-danger-tag p-4 rounded-md mb-6 flex items-center text-sm font-medium">
            <Info className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        <div className="bg-white p-8 rounded-xl shadow-sm border border-border-subtle">
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-brand-dark mb-4">Basic Information</h2>
              <div>
                <label className={labelClasses}>Title</label>
                <input required name="title" value={formData.title} onChange={handleChange} className={inputClasses} placeholder="e.g. Vintage Denim Jacket" />
              </div>
              <div>
                <label className={labelClasses}>Description</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows="5" className={`${inputClasses} resize-none`} placeholder="Describe your item, its condition, fit, style..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div>
                  <label className={labelClasses}>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className={inputClasses}>
                    <option value="Tops">Tops</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Jackets">Jackets</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Clothing Type</label>
                  <select name="clothingType" value={formData.clothingType} onChange={handleChange} className={inputClasses}>
                    <option value="T-Shirt">T-Shirt</option>
                    <option value="Shirt">Shirt</option>
                    <option value="Sweater">Sweater</option>
                    <option value="Outerwear">Outerwear</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className={inputClasses}>
                    <option value="Unisex">Select Gender</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-brand-dark mb-4">Item Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>Brand Tier</label>
                  <select name="brand" value={formData.brand} onChange={handleChange} className={inputClasses}>
                    <option value="Premium">Premium (Designer, Luxury)</option>
                    <option value="Popular">Popular (Nike, Zara, etc.)</option>
                    <option value="Standard">Standard (H&M, Target)</option>
                    <option value="Unknown">Unknown / Unbranded</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Condition</label>
                  <select name="condition" value={formData.condition} onChange={handleChange} className={inputClasses}>
                    <option value="New with tags">New with tags</option>
                    <option value="Like new">Like new</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Size</label>
                  <input required name="size" value={formData.size} onChange={handleChange} className={inputClasses} placeholder="e.g. S, M, L, XL, 32" />
                </div>
                <div>
                  <label className={labelClasses}>Color</label>
                  <input required name="color" value={formData.color} onChange={handleChange} className={inputClasses} placeholder="e.g. Black, Navy, White" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-brand-dark mb-4">Photos</h2>
              <div className="flex items-center justify-center w-full mb-6">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-border-subtle border-dashed rounded-lg cursor-pointer bg-bg-main hover:bg-brand-light transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="w-10 h-10 text-brand-primary mb-3" />
                    <p className="mb-2 text-sm font-medium text-text-main"><span className="text-brand-primary">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-text-muted">PNG, JPG (Max 5 photos)</p>
                  </div>
                  <input type="file" className="hidden" multiple accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
                </label>
              </div>
              
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group rounded-md overflow-hidden border border-border-subtle aspect-square">
                      <img src={preview} alt="preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={() => removeImage(index)} className="bg-white text-danger-tag rounded-full p-2">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-brand-dark mb-4">Location & Delivery</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className={labelClasses}>City</label>
                  <input required name="city" value={formData.city} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>State</label>
                  <input required name="state" value={formData.state} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Postal Code</label>
                  <input required name="postalCode" value={formData.postalCode} onChange={handleChange} className={inputClasses} />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-brand-dark mb-4">Review Listing</h2>
              
              <div className="bg-brand-light p-6 rounded-lg border border-border-subtle flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-lg text-brand-dark">Estimated Swap Value</h3>
                  <p className="text-sm text-text-muted">Calculated based on your item's condition and brand tier.</p>
                </div>
                <div className="flex items-center text-danger-tag">
                  <Star className="w-6 h-6 mr-1 fill-danger-tag" />
                  <span className="text-3xl font-bold">{calculatePoints()}</span>
                  <span className="text-sm font-medium ml-1 mt-1">pts</span>
                </div>
              </div>

              <div className="border border-border-subtle rounded-lg p-6">
                <h4 className="font-semibold text-brand-dark mb-4">{formData.title}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><span className="text-text-muted block">Category</span> <span className="font-medium">{formData.category}</span></div>
                  <div><span className="text-text-muted block">Condition</span> <span className="font-medium">{formData.condition}</span></div>
                  <div><span className="text-text-muted block">Size</span> <span className="font-medium">{formData.size}</span></div>
                  <div><span className="text-text-muted block">Photos</span> <span className="font-medium">{images.length} added</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 pt-6 border-t border-border-subtle flex justify-end gap-4">
            {step === 1 ? (
              <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2.5 rounded-md font-semibold text-text-main bg-white border border-border-subtle hover:bg-bg-main transition">
                Cancel
              </button>
            ) : (
              <button type="button" onClick={prevStep} className="px-6 py-2.5 rounded-md font-semibold text-text-main bg-white border border-border-subtle hover:bg-bg-main transition">
                Back
              </button>
            )}
            
            {step < 5 ? (
              <button type="button" onClick={nextStep} className="px-6 py-2.5 rounded-md font-semibold text-white bg-brand-dark hover:bg-brand-primary transition flex items-center">
                Next: {steps[step].name} <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading} className="px-8 py-2.5 rounded-md font-bold text-white bg-brand-dark hover:bg-brand-primary transition shadow-sm flex items-center disabled:opacity-70">
                {loading ? 'Submitting...' : 'List Item'}
              </button>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}