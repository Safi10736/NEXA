import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Upload, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';

interface GalleryItem {
  id: string;
  image_url: string;
  title?: string;
  created_at: string;
}

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!newUrl) return;
    setSaving(true);

    if (editingItem) {
      // Update
      const { error } = await supabase
        .from('gallery')
        .update({ image_url: newUrl })
        .eq('id', editingItem.id);
      
      if (!error) {
        setItems(items.map(item => item.id === editingItem.id ? { ...item, image_url: newUrl } : item));
      }
    } else {
      // Create
      const { data, error } = await supabase
        .from('gallery')
        .insert([{ image_url: newUrl }])
        .select();

      if (!error && data) {
        setItems([data[0], ...items]);
      }
    }

    setSaving(false);
    closeModal();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (!error) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const openModal = (item?: GalleryItem) => {
    if (item) {
      setEditingItem(item);
      setNewUrl(item.image_url);
    } else {
      setEditingItem(null);
      setNewUrl('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setNewUrl('');
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2">Gallery <span className="serif italic text-brand-accent">Management</span></h1>
          <p className="text-xs text-neutral-500 lowercase tracking-wide">Add, edit or remove images from your Inspiration & Gallery section.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-8 py-4 bg-brand-accent text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-brand-accent/20 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Image
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-12 h-12 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-square bg-[#0a0a0a] border border-neutral-900 rounded-[2rem] overflow-hidden"
              >
                <img 
                  src={item.image_url} 
                  alt="Gallery" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop';
                  }}
                />
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openModal(item)}
                      className="p-3 bg-white text-black rounded-full hover:bg-brand-accent hover:text-white transition-all shadow-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-3 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <a 
                    href={item.image_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[8px] font-bold text-white uppercase tracking-widest flex items-center gap-1 hover:text-brand-accent transition-colors"
                  >
                    View Original <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {items.length === 0 && (
            <div className="col-span-full py-24 text-center">
              <ImageIcon className="w-16 h-16 text-neutral-800 mx-auto mb-6" />
              <p className="text-neutral-500 font-light italic">No images in your gallery yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-24">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xl font-light">
                  {editingItem ? 'Edit' : 'Add'} Gallery <span className="serif italic text-brand-accent">Item</span>
                </h3>
                <button onClick={closeModal} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-6 h-6 text-neutral-500" />
                </button>
              </div>

              <div className="p-10 space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Image URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-700" />
                    <input 
                      type="text" 
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..." 
                      className="w-full bg-[#050505] border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-xs focus:ring-2 focus:ring-brand-accent outline-none font-mono"
                    />
                  </div>
                  <p className="text-[9px] text-neutral-600 italic">Provide a direct link to an image file (e.g. Unsplash, Imgur, etc.)</p>
                </div>

                {newUrl && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Preview</label>
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/5">
                      <img 
                        src={newUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&h=450&fit=crop';
                        }}
                      />
                    </div>
                  </div>
                )}

                <button 
                  onClick={handleSave}
                  disabled={saving || !newUrl}
                  className="w-full py-5 bg-white text-black rounded-full font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-brand-accent hover:text-white transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingItem ? 'Authorize Update' : 'Authorize Publication'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
