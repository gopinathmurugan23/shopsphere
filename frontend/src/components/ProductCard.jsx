import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const ProductCard = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all group"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-800">
          {product.category}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
            />
          ))}
          <span className="text-xs text-slate-400 ml-1">({product.numReviews})</span>
        </div>
        
        <h3 className="text-xl font-bold mb-1 truncate group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-slate-500 text-sm mb-6 line-clamp-2 h-10">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-slate-900">
            ₹{product.price}
          </span>
          <button 
            onClick={() => addItem(product)}
            className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-indigo-600 transition-all active:scale-90"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
