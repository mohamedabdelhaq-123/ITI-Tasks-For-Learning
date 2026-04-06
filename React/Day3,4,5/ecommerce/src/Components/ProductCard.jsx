import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ id, image, title, description, price, discount, rating, category, tags }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      
      <div className="relative h-56 bg-gray-50 p-4 flex-shrink-0 flex items-center justify-center">
        <img 
          src={image} 
          alt={title} 
          className="max-h-full max-w-full object-contain mix-blend-multiply" 
        />
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            -{Math.round(discount)}%
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            {category}
          </span>
          <span className="flex items-center text-sm font-medium text-gray-700">
            <span className="text-yellow-400 mr-1">★</span> {rating.toFixed(1)}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate" title={title}>
          {title}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
          {description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <span className="text-2xl font-black text-gray-900">
            ${price.toFixed(2)}
          </span>
          
          <Link 
            to={`/products/${id}`} 
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Details
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ProductCard;

// 
// 
// 
