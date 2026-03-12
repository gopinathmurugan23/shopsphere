import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const socket = io(API_URL);

const MOCK_PRODUCTS = [
  {
    _id: '1',
    name: 'Stealth Audio X1',
    description: 'Premium noise-cancelling headphones with obsidian finish and 40h battery life.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    category: 'Audio',
    rating: 4.8,
    numReviews: 124,
    stock: 15
  },
  {
    _id: '2',
    name: 'Vortex Smart Watch',
    description: 'Next-gen health tracking with sapphire glass and titanium casing.',
    price: 199,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    category: 'Wearables',
    rating: 4.5,
    numReviews: 89,
    stock: 20
  },
  {
    _id: '3',
    name: 'Lumina Desk Lamp',
    description: 'Minimalist lighting with touch controls and adjustable color temperature.',
    price: 89,
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=1000&auto=format&fit=crop',
    category: 'Home',
    rating: 4.9,
    numReviews: 56,
    stock: 5
  },
  {
    _id: '4',
    name: 'Neo Mechanical Keyboard',
    description: 'Compact 65% design with hot-swappable switches and RGB lighting.',
    price: 159,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1000&auto=format&fit=crop',
    category: 'Computing',
    rating: 4.7,
    numReviews: 210,
    stock: 12
  }
];

const Products = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/api/products`);
        if (data.length > 0) setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products, using mock data');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    socket.on('product-created', (newProduct) => {
      setProducts((prev) => [newProduct, ...prev]);
    });

    return () => {
      socket.off('product-created');
    };
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black mb-4">Discover Products</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or category..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 rounded-2xl font-semibold hover:bg-slate-50 transition-all shadow-sm">
            <SlidersHorizontal size={20} />
            Filters
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">No products found for "{search}"</p>
        </div>
      )}
    </div>
  );
};

export default Products;
