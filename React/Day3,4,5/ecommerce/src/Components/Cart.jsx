import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { increment, decrement, removeItem, clearCart } from '../store/cartSlice'; // Adjust path as needed

function Cart() {
  const { items, totalPrice } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  if (items.length === 0) {  // empty page ui
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="text-6xl text-gray-300">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800">No items yet</h2>
        <Link  
          to="/products" 
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  
  return ( // normal page ui
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Items count: <span className="text-blue-600">{items.length}</span>
        </h1>
        <button 
          onClick={() => dispatch(clearCart())}
          className="text-sm font-medium text-red-500 hover:text-red-700 underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row items-center gap-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="w-24 h-24 flex-shrink-0">
            <img 
            src={item.thumbnail} 
            alt={item.title} 
            className="w-full h-full object-contain" 
            />            
            </div>

            <div className="flex-1 text-center md:text-left">
              <p className="text-xs font-semibold uppercase text-blue-500 tracking-wider">{item.category}</p>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.title}</h3>
              <p className="text-gray-500 font-medium mt-1">${item.price}</p>
            </div>

            <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
              <button 
                onClick={() => dispatch(decrement(item))}
                className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all"
              >
                <Minus size={18} />
              </button>
              <span className="w-10 text-center font-bold text-gray-800">{item.quantity}</span>
              <button 
                onClick={() => dispatch(increment(item))}
                className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="text-center md:text-right min-w-[120px]">
              <p className="text-xs text-gray-400 uppercase font-bold">Subtotal</p>
              <p className="text-xl font-black text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>

            <button 
              onClick={() => dispatch(removeItem(item))}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={22} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-gray-50 rounded-2xl flex flex-col items-end gap-4">
        <div className="text-right">
          <p className="text-gray-500 font-medium">Total Price from store:</p>
          <p className="text-4xl font-black text-gray-900">${totalPrice.toFixed(2)}</p>
        </div>
        <button className="w-full md:w-64 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg">
          Checkout Now
        </button>
      </div>
    </div>
  );
}

export default Cart;