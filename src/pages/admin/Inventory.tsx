import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  MoreVertical,
  Check,
  X,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useProducts } from '../../ProductContext';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductForm from '../../components/admin/ProductManagement';
import { formatPrice } from '../../lib/utils';
import { logAdminAction } from '../../lib/adminUtils';

export default function AdminInventory() {
  const { products, loading } = useProducts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Search logic
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveProduct = async (data: any) => {
    try {
      const payload = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      // In Supabase, we check if the ID is a UUID
      const isNew = !editingProduct || editingProduct.id.length < 5;

      if (!isNew) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingProduct.id);
        
        if (error) throw error;
        
        await logAdminAction('EDIT_PRODUCT', editingProduct.id, { 
          name: data.name, 
          changes: 'Updated via form' 
        });
      } else {
        const { data: newDoc, error } = await supabase
          .from('products')
          .insert({
            ...payload,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();
        
        if (error) throw error;
        await logAdminAction('ADD_PRODUCT', newDoc.id, { name: data.name });
      }
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save product. Please check your network or permissions.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      await logAdminAction('DELETE_PRODUCT', id, { name });
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete product. It might be a system product that isn't in your main database yet.");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2">Product <span className="serif italic text-brand-accent">Inventory</span></h1>
          <p className="text-xs text-neutral-500 lowercase tracking-wide">Manage your premium product catalog and stock levels.</p>
        </div>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-3 py-4 px-8 bg-brand-accent text-white rounded-full font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-transform shadow-xl shadow-brand-accent/20"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search by name or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-neutral-900 rounded-2xl py-4 pl-12 pr-4 text-xs focus:ring-1 focus:ring-brand-accent outline-none transition-all placeholder:text-neutral-700"
          />
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-6 py-4 bg-[#0a0a0a] border border-neutral-900 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">
              <Filter className="w-4 h-4" />
              Category
           </button>
           <button className="flex items-center gap-2 px-6 py-4 bg-[#0a0a0a] border border-neutral-900 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">
              Sort By
           </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-900">
                <th className="px-8 py-6 text-left serif italic text-[11px] text-neutral-500 font-normal uppercase tracking-widest">Product</th>
                <th className="px-8 py-6 text-left serif italic text-[11px] text-neutral-500 font-normal uppercase tracking-widest">Category</th>
                <th className="px-8 py-6 text-left serif italic text-[11px] text-neutral-500 font-normal uppercase tracking-widest">Price</th>
                <th className="px-8 py-6 text-left serif italic text-[11px] text-neutral-500 font-normal uppercase tracking-widest">Stock</th>
                <th className="px-8 py-6 text-left serif italic text-[11px] text-neutral-500 font-normal uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-right serif italic text-[11px] text-neutral-500 font-normal uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900/50">
              {filteredProducts.map((product) => {
                const isLowStock = product.stock < 10;
                return (
                  <tr key={product.id} className="group hover:bg-neutral-900/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-neutral-900 overflow-hidden border border-neutral-800">
                          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-white uppercase mb-0.5">{product.name}</p>
                          <p className="text-[8px] text-neutral-500 uppercase tracking-tighter">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-widest">{product.category}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-bold text-white">{formatPrice(product.price)}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold ${isLowStock ? 'text-red-500' : 'text-neutral-400'}`}>
                          {product.stock || 45} units
                        </span>
                        {isLowStock && <AlertTriangle className="w-3 h-3 text-red-500" />}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`
                        inline-block px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest
                        ${isLowStock ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}
                      `}>
                        {isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex justify-end gap-3 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingProduct(product);
                              setIsFormOpen(true);
                            }}
                            className="p-3 bg-brand-accent/10 border border-brand-accent/20 rounded-xl transition-all text-brand-accent hover:bg-brand-accent hover:text-white flex items-center justify-center"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          
                          <button 
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl transition-all text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <AnimatePresence>
          {isFormOpen && (
            <ProductForm 
              initialData={editingProduct} 
              onClose={() => setIsFormOpen(false)}
              onSave={handleSaveProduct}
            />
          )}
        </AnimatePresence>
        
        {/* Pagination placeholder */}
        <div className="px-8 py-6 border-t border-neutral-900 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-neutral-500">
           <p>Showing 1-10 of 124 products</p>
           <div className="flex gap-4">
              <button className="hover:text-white transition-colors">Previous</button>
              <button className="text-white">1</button>
              <button className="hover:text-white transition-colors">2</button>
              <button className="hover:text-white transition-colors">3</button>
              <button className="hover:text-white transition-colors">Next</button>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
