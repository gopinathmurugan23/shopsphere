import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package, Edit, Trash2, X, Upload, Save } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001');

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchProducts();

    socket.on('product-created', (newProduct) => {
      setProducts((prev) => [newProduct, ...prev]);
    });

    return () => {
      socket.off('product-created');
    };
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/api/products');
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:5001/api/products', 
        { ...formData, price: Number(formData.price), stock: Number(formData.stock) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProducts();
      setShowModal(false);
      setFormData({ name: '', description: '', price: '', image: '', category: '', stock: '' });
    } catch (error) {
      alert('Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black mb-2">Admin Dashboard</h1>
          <p className="text-slate-500">Manage your products and inventory</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          Add Product
        </button>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Total Products', value: products.length, icon: <Package className="text-indigo-600" /> },
          { label: 'Low Stock Items', value: products.filter(p => p.stock < 5).length, icon: <Trash2 className="text-amber-500" /> },
          { label: 'Total Categories', value: new Set(products.map(p => p.category)).size, icon: <Edit className="text-emerald-500" /> }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-black">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-sm font-bold text-slate-400 uppercase tracking-wider">Product</th>
                <th className="px-8 py-6 text-sm font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-8 py-6 text-sm font-bold text-slate-400 uppercase tracking-wider">Price</th>
                <th className="px-8 py-6 text-sm font-bold text-slate-400 uppercase tracking-wider">Stock</th>
                <th className="px-8 py-6 text-sm font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                        <img src={product.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <span className="font-bold text-slate-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-4 font-black">₹{product.price}</td>
                  <td className="px-8 py-4 font-bold">
                    <span className={product.stock < 5 ? "text-red-500" : "text-slate-900"}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right space-x-2">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h2 className="text-2xl font-black">Add New Product</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Product Name</label>
                  <input 
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500/20 transition-all outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Price (₹)</label>
                  <input 
                    type="number"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500/20 transition-all outline-none"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Stock Quantity</label>
                  <input 
                    type="number"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500/20 transition-all outline-none"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
                  <input 
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500/20 transition-all outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Image URL</label>
                  <input 
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500/20 transition-all outline-none"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                  <textarea 
                    required
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500/20 transition-all outline-none resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="col-span-2 pt-4">
                  <button 
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
                  >
                    <Save size={20} />
                    {loading ? 'Creating...' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
