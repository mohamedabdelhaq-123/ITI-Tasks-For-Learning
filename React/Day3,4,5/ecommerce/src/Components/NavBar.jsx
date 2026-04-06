import { NavLink } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react'; // Import the icon
import { useSelector } from 'react-redux';
import { useContext } from 'react';
import { langContext } from '../context/LangContext';
function NavBar() {
  const counter = useSelector((state)=> state.cart.items)  //state is the whole store
  const totalQuantity = counter.reduce((total, item) => total + item.quantity, 0);

    const { lang, toggleLang} = useContext(langContext);



  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        <div className="text-xl font-bold text-gray-900 tracking-tight">
          ON<span className="text-blue-600">NO</span>
        </div>

        <div className="flex items-center space-x-8">
          
          <NavLink 
            to="/products" 
            end 
            className={({ isActive }) => isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-500 transition-colors"}
          >
            Products
          </NavLink>

            <NavLink 
            to="/register" 
            end 
            className={({ isActive }) => isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-500 transition-colors"}
          >
            Register
          </NavLink>

          <NavLink 
            to="/cart" 
            className={({ isActive }) => 
              `relative p-2 rounded-full transition-colors ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            <ShoppingCart size={25} strokeWidth={2} />
            
            {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {totalQuantity}
                  </span>
            )}            
          </NavLink>

          <NavLink 
            to="/contact" 
            end 
            className={({ isActive }) => isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-500 transition-colors"}
          >
            Contact
          </NavLink>

          <select
            onClick={toggleLang}
          >
            <option>
              ar
            </option>
            <option>
              en
            </option>
          </select>

        </div>
      </div>
    </nav>
  );
}

export default NavBar;


// end tells NavLink: only be active when the URL matches exactly /products, not any URL that starts with it. => i'll use it bec the is products/:id


