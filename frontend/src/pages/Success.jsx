import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

const Success = () => {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="pt-40 pb-20 px-6 flex flex-col items-center justify-center text-center">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8"
      >
        <CheckCircle size={48} className="text-emerald-500" />
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-black mb-4"
      >
        Payment Successful!
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-slate-500 mb-10 max-w-md"
      >
        Thank you for your purchase. We've sent a confirmation email with your order details. 
        Your items will be shipped shortly.
      </motion.p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/products" className="bg-slate-900 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-slate-800 transition-all">
          Continue Shopping
        </Link>
        <Link to="/" className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all">
          <Package size={20} />
          View Orders
        </Link>
      </div>
    </div>
  );
};

export default Success;
