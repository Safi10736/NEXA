import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Upload, 
  Star,
  ExternalLink,
  AlertCircle,
  Check
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

interface GalleryItem {
  id: string;
  image_url: string;
  is_highlighted: boolean;
  created_at: string;
}

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('is_highlighted', { ascending: false })
      .order('created_at', { ascending: false });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, file);

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);

    setNewUrl(publicUrl);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!newUrl) return;

    // Check highlight limit
    const currentHighlights = items.filter(i => i.is_highlighted).length;
    if (isHighlighted && !editingItem?.is_highlighted && currentHighlights >= 6) {
      alert('You can only highlight a maximum of 6 images. Please unhighlight another image first.');
      return;
    }

    setSaving(true);

    if (editingItem) {
      const { error } = await supabase
        .from('gallery')
        .update({ 
          image_url: newUrl,
          is_highlighted: isHighlighted 
        })
        .eq('id', editingItem.id);
      
      if (!error) {
        setItems(items.map(item => item.id === editingItem.id ? { ...item, image_url: newUrl, is_highlighted: isHighlighted } : item));
      }
    } else {
      const { data, error } = await supabase
        .from('gallery')
        .insert([{ 
          image_url: newUrl,
          is_highlighted: isHighlighted 
        }])
        .select();

      if (!error && data) {
        setItems([data[0], ...items]);
      }
    }

    setSaving(false);
    closeModal();
  };

  const toggleHighlight = async (item: GalleryItem) => {
    const currentHighlights = items.filter(i => i.is_highlighted).length;
    
    if (!item.is_highlighted && currentHighlights >= 6) {
      alert('Highlight limit (6) reached. Remove one to highlight this.');
      return;
    }

    const nextState = !item.is_highlighted;
    const { error } = await supabase
      .from('gallery')
      .update({ is_highlighted: nextState })
      .eq('id', item.id);

    if (!error) {
      setItems(items.map(i => i.id === item.id ? { ...i, is_highlighted: nextState } : i));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will remove the image from the website.')) return;
    
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
      setIsHighlighted(item.is_highlighted);
    } else {
      setEditingItem(null);
      setNewUrl('');
      setIsHighlighted(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setNewUrl('');
  };

  const highlightedCount = items.filter(i => i.is_highlighted).length;

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2">Studio <span className="serif italic text-brand-accent">Gallery</span></h1>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest leading-relaxed">
            Manage your visual assets. <span className="text-brand-accent">{highlightedCount}/6 Highlighting</span> slots occupied.
          </p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-4 px-10 py-5 bg-brand-accent text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-brand-accent/20 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add To Library
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest animate-pulse">Accessing Archive...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "group relative aspect-square bg-neutral-950 border rounded-[2rem] overflow-hidden transition-all duration-500",
                  item.is_highlighted ? "border-brand-accent shadow-2xl shadow-brand-accent/10" : "border-neutral-900"
                )}
              >
                <img 
                  src={item.image_url} 
                  alt="Gallery" 
                  className={cn(
                    "w-full h-full object-cover transition-all duration-700 group-hover:scale-110",
                    item.is_highlighted ? "opacity-100" : "opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100"
                  )}
                />
                
                {item.is_highlighted && (
                  <div className="absolute top-6 left-6 px-4 py-2 bg-brand-accent text-white rounded-full flex items-center gap-2 shadow-lg backdrop-blur-md">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Highlighted</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => openModal(item)}
                      className="p-4 bg-white text-black rounded-full hover:bg-brand-accent hover:text-white transition-all shadow-xl"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toggleHighlight(item)}
                      className={cn(
                        "p-4 rounded-full transition-all shadow-xl",
                        item.is_highlighted 
                          ? "bg-brand-accent text-white hover:bg-white hover:text-black" 
                          : "bg-white text-neutral-400 hover:text-brand-accent"
                      )}
                      title={item.is_highlighted ? "Remove from Highlight" : "Highlight to Front"}
                    >
                      <Star className={cn("w-4 h-4", item.is_highlighted && "fill-current")} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-4 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-xl"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Simple Initial Add Card */}
          <button 
            onClick={() => openModal()}
            className="aspect-square border-2 border-dashed border-neutral-900 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-neutral-700 hover:border-brand-accent/50 hover:text-brand-accent transition-all duration-500 group"
          >
            <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center group-hover:bg-brand-accent/10 transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest">Insert Asset</span>
          </button>
        </div>
      )}

      {/* Upload/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-24">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-2xl bg-neutral-950 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <div className="p-10 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-light tracking-tighter">
                    {editingItem ? 'Refine' : 'Add'} <span className="serif italic text-brand-accent">Perspective</span>
                  </h3>
                  <p className="text-[8px] text-neutral-500 uppercase tracking-widest mt-1">Configure your visual asset parameters.</p>
                </div>
                <button onClick={closeModal} className="p-4 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-6 h-6 text-neutral-500" />
                </button>
              </div>

              <div className="p-12 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                        <Upload className="w-3 h-3" /> Source Selection
                      </label>
                      <div className="space-y-4">
                        <input 
                          type="file" 
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="w-full py-6 px-8 bg-neutral-900 border border-white/10 rounded-2xl flex items-center justify-center gap-3 hover:border-brand-accent/50 transition-all group"
                        >
                          {uploading ? (
                             <div className="w-4 h-4 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
                          ) : (
                             <Upload className="w-4 h-4 text-neutral-500 group-hover:text-brand-accent" />
                          )}
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            {uploading ? 'Processing File...' : 'Upload from Device'}
                          </span>
                        </button>
                        
                        <div className="flex items-center gap-4">
                          <div className="h-px bg-white/5 flex-1" />
                          <span className="text-[8px] text-neutral-700 font-bold uppercase">OR</span>
                          <div className="h-px bg-white/5 flex-1" />
                        </div>

                        <input 
                          type="text" 
                          value={newUrl}
                          onChange={(e) => setNewUrl(e.target.value)}
                          placeholder="Paste direct URL link here..." 
                          className="w-full bg-neutral-900 border border-white/10 rounded-2xl py-5 px-6 text-xs focus:border-brand-accent outline-none font-mono placeholder:text-neutral-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                        <Star className="w-3 h-3" /> Visibility Protocol
                      </label>
                      <button 
                        onClick={() => setIsHighlighted(!isHighlighted)}
                        className={cn(
                          "w-full p-6 rounded-2xl border transition-all flex items-center justify-between group",
                          isHighlighted ? "bg-brand-accent/10 border-brand-accent/30" : "bg-neutral-900 border-white/5"
                        )}
                      >
                         <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                              isHighlighted ? "bg-brand-accent text-white" : "bg-neutral-800 text-neutral-600"
                            )}>
                               <Star className={cn("w-4 h-4", isHighlighted && "fill-current")} />
                            </div>
                            <div className="text-left">
                               <h4 className={cn("text-[10px] font-bold uppercase tracking-widest", isHighlighted ? "text-brand-accent" : "text-white")}>
                                 Highlight Frontpage
                               </h4>
                               <p className="text-[8px] text-neutral-500 uppercase tracking-tighter">Feature this in the main gallery reef.</p>
                            </div>
                         </div>
                         <div className={cn(
                           "w-10 h-6 rounded-full relative transition-all",
                           isHighlighted ? "bg-brand-accent" : "bg-neutral-700"
                         )}>
                            <motion.div 
                              animate={{ x: isHighlighted ? 20 : 4 }}
                              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
                            />
                         </div>
                      </button>
                      {isHighlighted && highlightedCount >= 6 && !editingItem?.is_highlighted && (
                        <p className="text-[8px] text-red-500 flex items-center gap-1 uppercase tracking-tighter font-bold">
                          <AlertCircle className="w-3 h-3" /> Slot full. Highlight limit (6) exceeded.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Asset Visualization</label>
                    <div className="aspect-square bg-black rounded-3xl overflow-hidden border border-white/5 relative group/prev">
                      {newUrl ? (
                        <img 
                          src={newUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover/prev:scale-110" 
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-neutral-800">
                          <ImageIcon className="w-12 h-12" />
                          <p className="text-[7px] font-bold uppercase tracking-[0.3em]">Waiting for data...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                   <button 
                     onClick={closeModal}
                     className="flex-1 py-5 border border-white/10 rounded-full text-[10px] font-bold text-neutral-500 uppercase tracking-widest hover:border-white/20 transition-all"
                   >
                     Cancel
                   </button>
                   <button 
                    onClick={handleSave}
                    disabled={saving || uploading || !newUrl}
                    className="flex-[2] py-5 bg-white text-black rounded-full font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-brand-accent hover:text-white transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {editingItem ? 'Sync Asset' : 'Commit to Library'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
