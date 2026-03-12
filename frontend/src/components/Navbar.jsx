import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 flex items-center px-6 justify-between">
      <Link to="/" className="text-2xl font-bold gradient-text">
        ShopSphere
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/products" className="hover:text-indigo-600 transition-colors font-medium">
          Shop
        </Link>
        
        <Link to="/cart" className="relative p-2 hover:bg-slate-100 rounded-full transition-all">
          <ShoppingCart size={20} />
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            {user.role === 'admin' && (
              <Link to="/admin" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-600" title="Admin Dashboard">
                <Package size={20} />
              </Link>
            )}
            <button onClick={logout} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-600" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-600" title="Login">
            <User size={20} />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
