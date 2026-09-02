import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ItemCard from '../components/ItemCard';
import { Search, Filter, SlidersHorizontal, X, MapPin, Navigation, Check, ChevronDown } from 'lucide-react';

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showFilters, setShowFilters] = useState(false);

  // Local state for filters
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    size: searchParams.get('size') || '',
    brand: searchParams.get('brand') || '',
    condition: searchParams.get('condition') || '',
    sort: searchParams.get('sort') || 'newest',
    city: searchParams.get('city') || '',
    maxDistance: searchParams.get('maxDistance') || '',
  });

  const [location, setLocation] = useState({ lat: searchParams.get('lat') || null, lng: searchParams.get('lng') || null });
  const [locating, setLocating] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/items', { params: searchParams });
      setItems(data?.items || []);
      setPagination({
        page: data.page || 1,
        pages: data.pages || 1,
        total: data.total || 0
      });
      setError('');
    } catch (err) {
      setError('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [searchParams]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    if (e) e.preventDefault();
    const newParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      }
    });

    if (location.lat && location.lng && filters.maxDistance) {
      newParams.set('lat', location.lat);
      newParams.set('lng', location.lng);
    }
    
    setSearchParams(newParams);
    setShowFilters(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      category: '',
      size: '',
      brand: '',
      condition: '',
      sort: 'newest',
      city: '',
      maxDistance: '',
    });
    setLocation({ lat: null, lng: null });
    setSearchParams(new URLSearchParams());
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocating(false);
      },
      (error) => {
        alert("Unable to retrieve your location");
        setLocating(false);
      }
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', newPage);
      setSearchParams(newParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-bg-main min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-border-subtle mb-4">
          <h2 className="font-bold text-brand-dark">Explore Items</h2>
          <button 
            onClick={() => setShowFilters(true)}
            className="flex items-center space-x-2 bg-brand-light text-brand-dark px-4 py-2 rounded-lg font-medium text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`fixed inset-0 z-50 bg-black/50 transition-opacity md:relative md:inset-auto md:bg-transparent md:z-0 md:w-64 lg:w-72 md:flex-shrink-0 ${showFilters ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'}`}>
            <div className={`absolute md:static bottom-0 w-full md:w-auto h-[90vh] md:h-auto bg-white md:bg-transparent rounded-t-3xl md:rounded-none p-6 md:p-0 overflow-y-auto md:overflow-visible transform transition-transform md:transform-none ${showFilters ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}`}>
              
              <div className="bg-white md:p-6 md:rounded-2xl md:border md:border-border-subtle md:shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b border-border-subtle pb-4 md:border-0 md:pb-0">
                  <h2 className="font-bold text-lg text-brand-dark">Filters</h2>
                  <button onClick={clearFilters} className="text-danger-tag text-sm font-medium hover:underline hidden md:block">Clear all</button>
                  <button onClick={() => setShowFilters(false)} className="md:hidden p-2 bg-brand-light rounded-full text-brand-dark"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={applyFilters} className="space-y-5">
                  {/* Search */}
                  <div>
                    <label className="block text-xs font-semibold text-text-main mb-2">Search</label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                      <input 
                        type="text" 
                        name="keyword" 
                        value={filters.keyword}
                        onChange={handleFilterChange}
                        placeholder="Search items..." 
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-border-subtle text-text-main rounded-md focus:border-brand-primary outline-none text-sm placeholder:text-text-muted"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-text-main mb-2">Category</label>
                    <div className="relative">
                      <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full p-2.5 bg-white border border-border-subtle text-text-main rounded-md focus:border-brand-primary outline-none appearance-none text-sm">
                        <option value="">All Categories</option>
                        <option value="Tops">Tops</option>
                        <option value="Dresses">Dresses</option>
                        <option value="Jeans">Jeans</option>
                        <option value="Jackets">Jackets</option>
                        <option value="Footwear">Footwear</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <label className="block text-xs font-semibold text-text-main mb-2">Size</label>
                    <div className="relative">
                      <select name="size" value={filters.size} onChange={handleFilterChange} className="w-full p-2.5 bg-white border border-border-subtle text-text-main rounded-md focus:border-brand-primary outline-none appearance-none text-sm">
                        <option value="">All Sizes</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="block text-xs font-semibold text-text-main mb-2">Condition</label>
                    <div className="relative">
                      <select name="condition" value={filters.condition} onChange={handleFilterChange} className="w-full p-2.5 bg-white border border-border-subtle text-text-main rounded-md focus:border-brand-primary outline-none appearance-none text-sm">
                        <option value="">All Conditions</option>
                        <option value="New with tags">New with tags</option>
                        <option value="Like new">Like new</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-semibold text-text-main mb-2">City</label>
                    <input 
                      type="text" 
                      name="city" 
                      value={filters.city}
                      onChange={handleFilterChange}
                      placeholder="e.g. Surat" 
                      className="w-full px-3 py-2.5 bg-white border border-border-subtle text-text-main rounded-md focus:border-brand-primary outline-none text-sm placeholder:text-text-muted"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-semibold text-text-main mb-2">Location</label>
                    <div className="relative">
                      <select name="maxDistance" value={filters.maxDistance} onChange={handleFilterChange} className="w-full p-2.5 bg-white border border-border-subtle text-text-main rounded-md focus:border-brand-primary outline-none appearance-none text-sm" disabled={!location.lat}>
                        <option value="">All Locations</option>
                        <option value="5">Within 5 miles</option>
                        <option value="15">Within 15 miles</option>
                        <option value="50">Within 50 miles</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                    {!location.lat && (
                      <button type="button" onClick={getUserLocation} className="mt-2 text-brand-primary text-xs font-medium hover:underline flex items-center">
                        <MapPin className="w-3 h-3 mr-1" /> Use My Location
                      </button>
                    )}
                  </div>

                  <div className="pt-4 flex flex-col space-y-3">
                    <button type="submit" className="w-full bg-brand-dark text-white py-2.5 rounded-md font-semibold hover:bg-brand-primary transition shadow-sm text-sm">
                      Apply Filters
                    </button>
                    <button type="button" onClick={clearFilters} className="w-full md:hidden bg-white text-text-muted border border-border-subtle py-2.5 rounded-md font-medium hover:bg-brand-light transition text-sm">
                      Clear All
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 hidden md:flex">
              <h1 className="text-2xl font-bold text-brand-dark">Explore Items</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-text-muted font-medium">{pagination.total} items found</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-text-main">Newest First</span>
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                </div>
              </div>
            </div>

            {error && <div className="bg-danger-tag/10 text-danger-tag p-4 rounded-md mb-6 font-medium text-sm">{error}</div>}

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-primary"></div>
              </div>
            ) : (!items || items.length === 0) ? (
              <div className="text-center py-16 px-6 bg-white rounded-xl border border-border-subtle shadow-sm">
                <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-text-muted" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-2">No items found</h3>
                <p className="text-text-muted mb-6">Try adjusting your search or filters.</p>
                <button onClick={clearFilters} className="bg-brand-dark text-white px-6 py-2 rounded-md font-semibold hover:bg-brand-primary transition">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map(item => (
                    <ItemCard key={item._id} item={item} />
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="flex justify-center mt-10 space-x-2">
                    <button 
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-border-subtle rounded-md bg-white font-medium text-sm text-text-main disabled:opacity-50 hover:bg-brand-light transition"
                    >
                      Previous
                    </button>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-md font-medium text-sm flex items-center justify-center transition ${
                          pagination.page === page 
                            ? 'bg-brand-dark text-white' 
                            : 'bg-white border border-border-subtle text-text-main hover:bg-brand-light'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button 
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="px-4 py-2 border border-border-subtle rounded-md bg-white font-medium text-sm text-text-main disabled:opacity-50 hover:bg-brand-light transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
