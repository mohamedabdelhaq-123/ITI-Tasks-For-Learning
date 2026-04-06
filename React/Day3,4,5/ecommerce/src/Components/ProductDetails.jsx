import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addItem } from '../store/cartSlice';
import { useDispatch } from 'react-redux'; 

function StateUI({ isLoading, isError }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg border border-red-200 text-center">
          <p className="font-semibold text-lg">Oops! Something went wrong.</p>
          <p className="text-sm mt-1">Please try again later.</p>
        </div>
      </div>
    );
  }

  return null; 
}

function ProductDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
 const dispatch = useDispatch();


  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProductData() {
      try {
        setLoading(true);
        setError(false);
        let data = await fetch(`https://dummyjson.com/products/${id}`);
        if (!data.ok) throw new Error("NO DATA FROM API");
        
        setProduct(await data.json()); 
            
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProductData();
  }, [id]); 

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      
      <button 
        onClick={() => navigate('/products')}
        className="mb-6 flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
      >
        &larr; Back to Products
      </button>

      <StateUI isError={error} isLoading={loading} />

      {!loading && !error && product && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
          
          <div className="flex justify-center items-center bg-gray-50 rounded-xl p-8 h-96">
            <img 
              src={product.thumbnail} 
              alt={product.title} 
              className="max-h-full max-w-full object-contain mix-blend-multiply"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              {product.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="flex items-center text-lg font-medium text-gray-700">
                <span className="text-yellow-400 mr-1 text-xl">★</span> {product.rating}
              </span>
              <span className="text-gray-300">|</span>
              <span className={product.stock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            <p className="text-base text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-8 flex items-end space-x-3">
              <span className="text-4xl font-black text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-lg text-gray-400 line-through mb-1">
                  ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                </span>
              )}
            </div>

            <button onClick={()=>dispatch(addItem(product))} className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-sm hover:bg-blue-500 transition-colors focus:ring-4 focus:ring-blue-100">
              Add to Cart
            </button>
            
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetails;