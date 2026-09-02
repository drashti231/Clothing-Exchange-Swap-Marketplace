import { useParams, Link } from 'react-router-dom';
import { MapPin, Heart, MessageSquare, Repeat, Star, ShieldCheck, ChevronRight, Info } from 'lucide-react';
import ItemCard from '../components/ItemCard';

const ItemDetails = () => {
  const { id } = useParams();

  // Mock item data
  const item = {
    id: id,
    title: 'Vintage Denim Jacket',
    brand: "Levi's",
    category: 'Outerwear',
    size: 'M',
    condition: 'Good',
    swapPoints: 450,
    location: 'Surat, Gujarat',
    description: 'Authentic 90s Levi\'s denim jacket. Well broken in with perfect natural fading. No tears or major stains. Perfect for layering in any season.',
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1495105787522-5334e3ffa0efa?auto=format&fit=crop&q=80&w=800'
    ],
    seller: {
      name: 'Drashti Vaghela',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      rating: 4.8,
      swaps: 12,
      joined: 'Mar 2024'
    }
  };

  const similarItems = [
    { id: '10', title: 'Black Denim Jacket', brand: 'Zara', size: 'M', condition: 'Excellent', swapPoints: 400, location: 'Surat, Gujarat', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600' },
    { id: '11', title: 'Oversized Hoodie', brand: 'H&M', size: 'L', condition: 'Like New', swapPoints: 300, location: 'Vadodara, Gujarat', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600' }
  ];

  return (
    <div className="bg-[var(--color-background)] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-[var(--color-muted)] mb-6">
          <Link to="/" className="hover:text-[var(--color-secondary)]">Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link to="/marketplace" className="hover:text-[var(--color-secondary)]">Marketplace</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-[var(--color-text-main)] font-medium truncate">{item.title}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border-main)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Image Gallery */}
            <div className="p-4 sm:p-6 lg:border-r border-[var(--color-border-main)] bg-gray-50 flex flex-col items-center">
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden mb-4 shadow-sm relative">
                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full text-gray-500 hover:text-[var(--color-error)] transition-colors shadow-sm">
                  <Heart size={20} />
                </button>
              </div>
              <div className="flex gap-4 w-full overflow-x-auto pb-2">
                {item.images.map((img, i) => (
                  <button key={i} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${i === 0 ? 'border-[var(--color-primary)]' : 'border-transparent'}`}>
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6 lg:p-10 flex flex-col">
              <div className="mb-2">
                <span className="text-[var(--color-secondary)] font-bold tracking-wide uppercase text-sm">{item.brand}</span>
              </div>
              <h1 className="text-3xl font-extrabold text-[var(--color-text-main)] mb-4">{item.title}</h1>
              
              <div className="flex items-center gap-4 text-sm text-[var(--color-muted)] mb-6 pb-6 border-b border-[var(--color-border-main)]">
                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg text-[var(--color-text-main)] font-medium">
                  {item.size}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> {item.condition}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={16} /> {item.location}
                </div>
              </div>

              {/* Swap Value */}
              <div className="bg-[var(--color-lavender)] p-5 rounded-xl mb-8 flex items-center justify-between border border-[#e0d6ff]">
                <div>
                  <p className="text-[var(--color-secondary)] text-sm font-semibold mb-1 flex items-center gap-1">
                    Estimated Swap Value <Info size={14} />
                  </p>
                  <p className="text-3xl font-extrabold text-[var(--color-primary-dark)]">{item.swapPoints} <span className="text-lg font-medium text-[var(--color-muted)]">pts</span></p>
                </div>
                <div className="hidden sm:block text-right text-xs text-[var(--color-muted)]">
                  <p>Base Value: 300</p>
                  <p>Brand Bonus: +100</p>
                  <p>Condition: +50</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <button className="flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md">
                  <Repeat size={20} /> Request Swap
                </button>
                <button className="flex items-center justify-center gap-2 bg-white border-2 border-[var(--color-border-main)] hover:border-[var(--color-primary)] text-[var(--color-text-main)] py-4 rounded-xl font-bold text-lg transition-all">
                  <MessageSquare size={20} /> Message Seller
                </button>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-3">Description</h3>
                <p className="text-[var(--color-muted)] leading-relaxed">{item.description}</p>
              </div>

              {/* Seller Info */}
              <div className="mt-auto pt-6 border-t border-[var(--color-border-main)]">
                <h3 className="font-bold text-sm text-[var(--color-muted)] uppercase tracking-wider mb-4">Listed By</h3>
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-[var(--color-border-main)]">
                  <div className="flex items-center gap-4">
                    <img src={item.seller.avatar} alt={item.seller.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                    <div>
                      <p className="font-bold text-[var(--color-text-main)]">{item.seller.name}</p>
                      <div className="flex items-center text-xs text-[var(--color-muted)] gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[var(--color-warning)] font-medium">
                          <Star size={12} fill="currentColor" /> {item.seller.rating}
                        </span>
                        <span>{item.seller.swaps} swaps</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <ShieldCheck size={24} className="text-[var(--color-success)]" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Similar Items */}
        <div className="mt-16">
          <h2 className="text-2xl font-extrabold text-[var(--color-text-main)] mb-6">Similar Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarItems.map(simItem => (
              <ItemCard key={simItem.id} item={simItem} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ItemDetails;
