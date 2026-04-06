import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard';

function StateUI({ isLoading, isError }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg border border-red-200 text-center">
          <p className="font-semibold text-lg">Oops! Something went wrong.</p>
          <p className="text-sm mt-1">Please try again later.</p>
        </div>
      </div>
    );
  }

  return null; 

}

function Products() {

    const [products,setProducts]= useState([]);
    // const loading= false,error=false;
    const [loading,setLoading] = useState(true);
    const [error,setError]= useState(false);
    
    async function fetchAPIData()
    {
        try {
            setLoading(true);
            setError(false);
            let data = await fetch("https://dummyjson.com/products");
            if(!data.ok) throw new Error("NO DATA FROM API");
            setProducts((await data.json()).products);
            setLoading(false)
                
        } catch (e) {
            setLoading(false);
            setError(true);
        }

    }

    useEffect(() => {
        fetchAPIData();
    }, []);

  return (
    <div>
        <StateUI isError={error} isLoading={loading} />
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
            <ProductCard 
                key={product.id} 
                id={product.id} 
                image={product.thumbnail}
                title={product.title} 
                description={product.description} 
                price={product.price}
                discount={product.discountPercentage} 
                rating={product.rating} 
                category={product.category} 
                tags={product.tags} 
            />
            ))}
        </div>
      )} 
    </div>
  )
}

export default Products


// useEffect => used to sync. a  side effect job
// if statui is html element, but if Stateui => componoet