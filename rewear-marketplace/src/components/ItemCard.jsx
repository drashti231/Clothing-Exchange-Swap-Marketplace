import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';

const ItemCard = ({ item }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[var(--color-border-main)] hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-500 hover:text-[var(--color-error)] hover:bg-white transition-all shadow-sm">
            <Heart size={18} />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[var(--color-secondary)] shadow-sm">
          {item.swapPoints} pts
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="font-bold text-[var(--color-text-main)] truncate text-lg">
            {item.title}
          </h3>
        </div>
        <div className="text-sm text-[var(--color-muted)] mb-3 flex items-center justify-between">
          <span>{item.brand}</span>
          <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-xs">{item.size}</span>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center text-xs text-[var(--color-muted)] mb-4">
            <MapPin size={14} className="mr-1" />
            <span className="truncate">{item.location}</span>
            <span className="mx-2">•</span>
            <span>{item.condition}</span>
          </div>
          <Link 
            to={`/item/${item.id}`}
            className="block w-full text-center bg-[var(--color-lavender)] hover:bg-[var(--color-secondary)] hover:text-white text-[var(--color-secondary)] py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
