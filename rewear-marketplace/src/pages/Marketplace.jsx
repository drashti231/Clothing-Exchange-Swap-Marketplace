import { useState } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ItemCard from '../components/ItemCard';

const Marketplace = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock data for marketplace
  const items = [
    {
      id: '1', title: 'Vintage Denim Jacket', brand: "Levi's", size: 'M', condition: 'Good', swapPoints: 450, location: 'Surat, Gujarat', image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '2', title: 'Floral Summer Dress', brand: 'Zara', size: 'S', condition: 'Like New', swapPoints: 420, location: 'Ahmedabad, Gujarat', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '3', title: 'Oversized Knit Hoodie', brand: 'H&M', size: 'L', condition: 'Excellent', swapPoints: 300, location: 'Mumbai, MH', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '4', title: 'Linen Button-up Shirt', brand: 'Uniqlo', size: 'M', condition: 'New with tags', swapPoints: 350, location: 'Pune, MH', image: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '5', title: 'Leather Crossbody Bag', brand: 'Coach', size: 'OS', condition: 'Good', swapPoints: 800, location: 'Surat, Gujarat', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '6', title: 'High-waist Mom Jeans', brand: 'Mango', size: '28', condition: 'Excellent', swapPoints: 380, location: 'Vadodara, Gujarat', image: 'https://images.unsplash.com/photo-1542272604-780c8d5215fa?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '7', title: 'Classic White Sneakers', brand: 'Nike', size: 'UK 8', condition: 'Fair', swapPoints: 250, location: 'Surat, Gujarat', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '8', title: 'Silk Slip Skirt', brand: 'Reformation', size: 'S', condition: 'Like New', swapPoints: 500, location: 'Mumbai, MH', image: 'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const filterSections = [
    { title: 'Category', options: ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'] },
    { title: 'Size', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'OS'] },
    { title: 'Condition', options: ['New with tags', 'Like New', 'Excellent', 'Good', 'Fair'] },
    { title: 'Distance', options: ['Within 5 km', 'Within 10 km', 'Within 25 km', 'Any Location'] },
  ];

  return (
    <div className="bg-[var(--color-background)] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--color-text-main)]">Marketplace</h1>
            <p className="text-[var(--color-muted)] mt-1">Find your next favorite piece</p>
          </div>
          
          <div className="flex-grow max-w-xl flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search for clothes, brands..." 
                className="w-full bg-white border border-[var(--color-border-main)] rounded-lg py-2.5 pl-10 pr-4 text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] shadow-sm"
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden flex items-center justify-center bg-white border border-[var(--color-border-main)] p-2.5 rounded-lg text-[var(--color-text-main)] hover:bg-gray-50"
            >
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`md:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden'} md:block`}>
            <div className="bg-white rounded-xl border border-[var(--color-border-main)] p-5 sticky top-24 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--color-border-main)]">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <SlidersHorizontal size={18} /> Filters
                </h2>
                <button className="text-sm text-[var(--color-secondary)] font-medium hover:underline">Clear all</button>
              </div>

              <div className="space-y-6">
                {filterSections.map((section, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-[var(--color-text-main)] mb-3">{section.title}</h3>
                    <div className="space-y-2">
                      {section.options.map((opt, i) => (
                        <label key={i} className="flex items-center cursor-pointer group">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[var(--color-secondary)] focus:ring-[var(--color-secondary)]" />
                          <span className="ml-2 text-sm text-[var(--color-muted)] group-hover:text-[var(--color-text-main)] transition-colors">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div>
                  <h3 className="font-semibold text-[var(--color-text-main)] mb-3">Swap Points</h3>
                  <div className="px-2">
                    <input type="range" min="0" max="2000" className="w-full accent-[var(--color-secondary)]" />
                    <div className="flex justify-between text-xs text-[var(--color-muted)] mt-2">
                      <span>0 pts</span>
                      <span>2000+ pts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            <div className="bg-white rounded-xl border border-[var(--color-border-main)] p-4 mb-6 flex items-center justify-between shadow-sm">
              <p className="text-sm text-[var(--color-muted)] font-medium">Showing <span className="text-[var(--color-text-main)] font-bold">{items.length}</span> items</p>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--color-muted)] hidden sm:inline">Sort by:</span>
                <div className="relative">
                  <select className="appearance-none bg-gray-50 border border-[var(--color-border-main)] rounded-lg py-1.5 pl-3 pr-8 text-sm font-medium text-[var(--color-text-main)] focus:outline-none cursor-pointer">
                    <option>Recommended</option>
                    <option>Newest Arrivals</option>
                    <option>Lowest Points</option>
                    <option>Highest Points</option>
                    <option>Distance: Nearest</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="px-3 py-2 rounded-lg border border-[var(--color-border-main)] text-[var(--color-muted)] hover:bg-gray-50 disabled:opacity-50">Previous</button>
                <button className="w-10 h-10 rounded-lg bg-[var(--color-primary)] text-white font-medium flex items-center justify-center">1</button>
                <button className="w-10 h-10 rounded-lg border border-[var(--color-border-main)] text-[var(--color-muted)] hover:bg-gray-50 flex items-center justify-center">2</button>
                <button className="w-10 h-10 rounded-lg border border-[var(--color-border-main)] text-[var(--color-muted)] hover:bg-gray-50 flex items-center justify-center">3</button>
                <span className="text-gray-400">...</span>
                <button className="px-3 py-2 rounded-lg border border-[var(--color-border-main)] text-[var(--color-text-main)] font-medium hover:bg-gray-50">Next</button>
              </nav>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
