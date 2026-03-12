import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const Cart = () => {
  const { cartItems, removeItem, updateQty, getTotalPrice } = useCartStore();
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  const total = getTotalPrice();

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { data } = await axios.post(
        'http://localhost:5001/api/orders/checkout',
        { cartItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to the URL provided by Stripe
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-40 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag size={40} className="text-slate-300" />
        </div>
        <h1 className="text-4xl font-black mb-4">Your cart is empty</h1>
        <p className="text-slate-500 mb-10 max-w-md">
          Looks like you haven't added anything to your cart yet.
          Discover our premium collection and find something you love.
        </p>
        <Link to="/products" className="bg-slate-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-slate-800 transition-all">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-black mb-12">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm"
              >
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold mb-1 truncate">{item.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{item.category}</p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-slate-100 rounded-xl bg-slate-50">
                      <button
                        onClick={() => updateQty(item._id, item.qty - 1)}
                        className="p-2 hover:bg-slate-100 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item._id, item.qty + 1)}
                        className="p-2 hover:bg-slate-100 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-black">₹{item.price * item.qty}</p>
                  <p className="text-slate-400 text-sm">₹{item.price} each</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl sticky top-24">
            <h2 className="text-2xl font-bold mb-8">Order Summary</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-emerald-500 font-medium">Free</span>
              </div>
              <div className="border-t border-slate-50 pt-4 flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-black text-indigo-600">₹{total}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all group"
            >
              Checkout <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-center text-slate-400 text-xs mt-6 px-4">
              Secure checkout powered by Stripe. All taxes included.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
