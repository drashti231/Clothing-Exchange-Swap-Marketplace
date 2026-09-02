import React from 'react';
import { Link } from 'react-router-dom';

export default function ItemCard({ item }) {
  // Map condition to a specific background color if needed, or just use brand-primary
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
    <Link to={`/items/${item._id}`} className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-border-subtle overflow-hidden h-full flex flex-col">
      <div className="relative aspect-[4/5] bg-bg-main overflow-hidden p-2 pb-0">
        <div className="relative w-full h-full rounded-t-lg overflow-hidden">
          {item.images && item.images.length > 0 ? (
            <img 
              src={item.images[0]} 
              alt={item.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-brand-light text-text-muted font-medium text-sm">
              No Image
            </div>
          )}
          
          {/* Condition Badge (Top Left) */}
          {item.condition && (
            <div className={`absolute top-2 left-2 ${getConditionColor(item.condition)} text-white px-2.5 py-1 rounded-md shadow-sm`}>
              <span className="font-semibold text-xs">{item.condition}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-[15px] text-text-main line-clamp-1 mb-1 group-hover:text-brand-primary transition-colors">{item.title}</h3>
        
        <div className="flex items-center text-[13px] text-text-muted mb-1.5">
          <span className="font-medium">{item.brand || 'Unknown'}</span>
          <span className="mx-1.5">-</span>
          <span>Size {item.size || 'N/A'}</span>
        </div>

        <div className="text-[13px] text-text-muted mt-auto pt-2 flex items-end justify-between">
          <span className="truncate pr-2">{item.city || 'Anywhere'}, {item.state || 'Any'}</span>
          <span className="font-bold text-danger-tag whitespace-nowrap text-[15px]">{item.estimatedSwapPoints || 0} pts</span>
        </div>
      </div>
    </Link>
  );
}
