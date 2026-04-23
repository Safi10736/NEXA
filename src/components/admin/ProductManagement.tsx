import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { 
  X, 
  Upload, 
  Save, 
  Trash2, 
  Plus, 
  Info,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Smartphone,
  GripVertical
} from 'lucide-react';
import { formatPrice, cn } from '../../lib/utils';

interface ProductFormProps {
  initialData?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function ProductForm({ initialData, onClose, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    slug: '',
    price: 0,
    category: 'Lighting',
    stock: 0,
    isPreOrder: false,
    description: '',
    images: ['https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800'],
    badges: [],
    variants: [],
    upsellIds: []
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [error, setError] = useState<string | null>(null);
  const [mediaSource, setMediaSource] = useState<'url' | 'device'>('url');
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    
    setError(null);
    const filesArray = Array.from(files);
    
    filesArray.forEach(file => {
      // 2MB limit for base64 strings to maintain browser/db performance
      if (file.size > 2 * 1024 * 1024) { 
        setError("One or more images are too large (>2MB). Optimized images are recommended.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev: any) => ({
           ...prev,
           images: [...prev.images, base64String]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const addImageUrl = () => {
    const urlInput = document.getElementById('new-image-url') as HTMLInputElement;
    if (urlInput && urlInput.value) {
      setFormData({ ...formData, images: [...formData.images, urlInput.value] });
      urlInput.value = '';
    }
  };

  const setPrimaryImage = (index: number) => {
    const newImages = [...formData.images];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected);
    setFormData({ ...formData, images: newImages });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSave = () => {
    if (!formData.name || !formData.slug || !formData.description) {
      setError("Please fill in all required basic details.");
      setActiveTab('basic');
      return;
    }
    if (formData.images.length === 0 || !formData.images[0]) {
      setError("At least one product image is required.");
      setActiveTab('media');
      return;
    }
    setError(null);
    onSave(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-[#0a0a0a] border border-neutral-900 rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-neutral-900 flex justify-between items-center bg-gradient-to-r from-neutral-900/50 to-transparent">
          <div>
            <h2 className="text-2xl font-light tracking-tighter text-white">
              {initialData ? 'Edit' : 'Add'} <span className="serif italic text-brand-accent">Product</span>
            </h2>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Configure premium item details & inventory</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-8 border-b border-neutral-900 overflow-x-auto gap-8">
           {['basic', 'inventory', 'media', 'variants'].map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative
                  ${activeTab === tab ? 'text-brand-accent' : 'text-neutral-500 hover:text-white'}
                `}
             >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent" />
                )}
             </button>
           ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
           {error && (
             <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3"
             >
                <Info className="w-4 h-4 text-red-500" />
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{error}</p>
             </motion.div>
           )}
           <AnimatePresence mode="wait">
              {activeTab === 'basic' && (
                <motion.div 
                  key="basic"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid md:grid-cols-2 gap-8"
                >
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-4">Product Name</label>
                         <input 
                            type="text" 
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 px-6 text-sm focus:ring-1 focus:ring-brand-accent outline-none"
                            placeholder="e.g. Lunar Marble Lamp"
                            value={formData.name}
                            onChange={(e) => {
                              const name = e.target.value;
                              // Auto-generate slug
                              const generatedSlug = name.toLowerCase()
                                .trim()
                                .replace(/[^\w\s-]/g, '')
                                .replace(/[\s_-]+/g, '-')
                                .replace(/^-+|-+$/g, '');
                              setFormData({...formData, name, slug: generatedSlug});
                            }}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-4">Category</label>
                         <select 
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 px-6 text-sm focus:ring-1 focus:ring-brand-accent outline-none appearance-none"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                         >
                            <option>Lighting</option>
                            <option>Wall Decor</option>
                            <option>Kitchenware</option>
                            <option>Essentials</option>
                         </select>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-4">Price (USD)</label>
                         <input 
                            type="number" 
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 px-6 text-sm focus:ring-1 focus:ring-brand-accent outline-none"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-4">Slug (URL Name)</label>
                         <input 
                            type="text" 
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 px-6 text-sm focus:ring-1 focus:ring-brand-accent outline-none font-mono text-[10px]"
                            placeholder="lunar-marble-lamp"
                            value={formData.slug}
                            onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                         />
                      </div>
                   </div>
                   <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-4">Description</label>
                      <textarea 
                         rows={4}
                         className="w-full bg-neutral-900 border border-neutral-800 rounded-3xl py-4 px-6 text-sm focus:ring-1 focus:ring-brand-accent outline-none resize-none"
                         placeholder="Describe the handcrafted nature and eco-friendly materials..."
                         value={formData.description}
                         onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                   </div>
                   
                   {/* Toggles */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                       {/* Pre-order Toggle */}
                       <div className="flex items-center gap-4 bg-neutral-900/50 p-6 rounded-[2rem] border border-neutral-900">
                          <div className="flex-1">
                             <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Pre-order</h4>
                          </div>
                          <button 
                            onClick={() => setFormData({...formData, isPreOrder: !formData.isPreOrder})}
                            className={`w-10 h-5 rounded-full transition-all relative ${formData.isPreOrder ? 'bg-brand-accent' : 'bg-neutral-800'}`}
                          >
                             <motion.div 
                               animate={{ x: formData.isPreOrder ? 20 : 4 }}
                               className="absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm" 
                             />
                          </button>
                       </div>

                       {/* Eco Toggle */}
                       <div className="flex items-center gap-4 bg-neutral-900/50 p-6 rounded-[2rem] border border-neutral-900">
                          <div className="flex-1">
                             <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Eco-friendly</h4>
                          </div>
                          <button 
                            onClick={() => {
                              const badges = formData.badges.includes('Eco-friendly')
                                ? formData.badges.filter((b: string) => b !== 'Eco-friendly')
                                : [...formData.badges, 'Eco-friendly'];
                              setFormData({...formData, badges});
                            }}
                            className={`w-10 h-5 rounded-full transition-all relative ${formData.badges.includes('Eco-friendly') ? 'bg-green-500' : 'bg-neutral-800'}`}
                          >
                             <motion.div 
                               animate={{ x: formData.badges.includes('Eco-friendly') ? 20 : 4 }}
                               className="absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm" 
                             />
                          </button>
                       </div>

                       {/* New Arrival Toggle */}
                       <div className="flex items-center gap-4 bg-neutral-900/50 p-6 rounded-[2rem] border border-neutral-900">
                          <div className="flex-1">
                             <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">New Arrival</h4>
                          </div>
                          <button 
                            onClick={() => {
                              const badges = formData.badges.includes('New Arrival')
                                ? formData.badges.filter((b: string) => b !== 'New Arrival')
                                : [...formData.badges, 'New Arrival'];
                              setFormData({...formData, badges});
                            }}
                            className={`w-10 h-5 rounded-full transition-all relative ${formData.badges.includes('New Arrival') ? 'bg-cyan-500' : 'bg-neutral-800'}`}
                          >
                             <motion.div 
                               animate={{ x: formData.badges.includes('New Arrival') ? 20 : 4 }}
                               className="absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm" 
                             />
                          </button>
                       </div>
                   </div>
                </motion.div>
              )}

              {activeTab === 'inventory' && (
                <motion.div 
                  key="inventory"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-4">Stock Quantity</label>
                         <input 
                            type="number" 
                            min="0"
                            step="1"
                            className={cn(
                              "w-full bg-neutral-900 border rounded-2xl py-4 px-6 text-sm focus:ring-1 outline-none transition-all",
                              formData.stock < 0 ? "border-red-500 focus:ring-red-500" : "border-neutral-800 focus:ring-brand-accent"
                            )}
                            value={formData.stock}
                            onChange={(e) => {
                              const val = e.target.value;
                              const num = parseInt(val, 10);
                              
                              if (val === '') {
                                setFormData({...formData, stock: 0});
                                return;
                              }

                              if (!isNaN(num)) {
                                // Allow typing 0 or positive, but floor decimals to keep it an integer
                                setFormData({...formData, stock: Math.max(0, Math.floor(num))});
                              }
                            }}
                         />
                         {formData.stock < 0 && (
                            <p className="text-[8px] text-red-500 uppercase font-bold ml-4 mt-1 italic tracking-widest">Quantity cannot be negative</p>
                         )}
                      </div>
                      <div className="flex items-center gap-4 mt-8 px-4">
                         <div className={`p-2 rounded-lg ${formData.stock < 10 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                           {formData.stock < 10 ? <Info className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                         </div>
                         <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest">
                               {formData.stock < 10 ? 'Low Stock Alert' : 'Healthy Inventory'}
                            </p>
                            <p className="text-[8px] text-neutral-500 uppercase">Threshold: 10 units</p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">Product Badges</h4>
                      <div className="flex gap-4">
                         {['Eco-friendly', 'Handcrafted', 'New Arrival', 'Limited Edition'].map((badge) => (
                           <button
                              key={badge}
                              onClick={() => {
                                const badges = formData.badges.includes(badge) 
                                  ? formData.badges.filter((b: string) => b !== badge)
                                  : [...formData.badges, badge];
                                setFormData({...formData, badges});
                              }}
                              className={`
                                py-3 px-6 rounded-full text-[8px] font-bold uppercase tracking-widest border transition-all
                                ${formData.badges.includes(badge) 
                                  ? 'bg-brand-accent border-brand-accent text-white' 
                                  : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700'}
                              `}
                           >
                              {badge}
                           </button>
                         ))}
                      </div>
                   </div>
                </motion.div>
              )}

               {activeTab === 'media' && (
                <motion.div 
                  key="media"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex gap-4 p-1 bg-neutral-900 rounded-2xl w-fit">
                        <button 
                          onClick={() => setMediaSource('url')}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mediaSource === 'url' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}
                        >
                          <Globe className="w-4 h-4" />
                          Add via URL
                        </button>
                        <button 
                          onClick={() => setMediaSource('device')}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mediaSource === 'device' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}
                        >
                          <Smartphone className="w-4 h-4" />
                          Upload File
                        </button>
                      </div>
                      <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">
                        {formData.images.length} Imagery Assets Added
                      </p>
                   </div>

                   <div className="space-y-4">
                      {mediaSource === 'url' ? (
                        <div className="flex gap-4">
                          <input 
                            id="new-image-url"
                            type="text" 
                            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl py-4 px-6 text-sm focus:ring-1 focus:ring-brand-accent outline-none"
                            placeholder="Enter image URL (e.g. Unsplash link)..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addImageUrl();
                              }
                            }}
                          />
                          <button 
                            onClick={addImageUrl}
                            className="px-8 bg-neutral-900 border border-neutral-800 rounded-2xl hover:bg-neutral-800 transition-all"
                          >
                            <Plus className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <input 
                            type="file" 
                            id="file-upload" 
                            className="hidden" 
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                          />
                          <label 
                            htmlFor="file-upload"
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDragging(false);
                              handleFiles(e.dataTransfer.files);
                            }}
                            className={cn(
                              "flex flex-col items-center justify-center gap-4 w-full h-48 bg-neutral-900 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all group",
                              isDragging ? "border-brand-accent bg-brand-accent/5" : "border-neutral-800 hover:border-brand-accent"
                            )}
                          >
                             <div className={cn(
                               "p-4 rounded-2xl transition-colors",
                               isDragging ? "bg-brand-accent/20" : "bg-neutral-800 group-hover:bg-brand-accent/10"
                             )}>
                                <Upload className={cn(
                                  "w-6 h-6 transition-colors",
                                  isDragging ? "text-brand-accent" : "text-neutral-400 group-hover:text-brand-accent"
                                )} />
                             </div>
                             <div className="text-center">
                                <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">
                                  {isDragging ? 'Drop images now' : 'Click to browse or drop multiple images'}
                                </p>
                                <p className="text-[8px] text-neutral-500 uppercase tracking-tighter">PNG, JPG or WebP (Max 2MB per file)</p>
                             </div>
                          </label>
                        </div>
                      )}
                   </div>

                   {/* Image Library Grid with Reordering */}
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-4">Manage & Reorder Gallery</h4>
                      <Reorder.Group 
                        axis="y" 
                        values={formData.images} 
                        onReorder={(newImages) => setFormData({ ...formData, images: newImages })}
                        className="space-y-3"
                      >
                        {formData.images.map((img: string, idx: number) => (
                           <Reorder.Item 
                             key={img} 
                             value={img}
                             className="relative flex items-center gap-6 bg-neutral-900/50 p-4 rounded-3xl border border-neutral-900 group cursor-grab active:cursor-grabbing"
                           >
                              <div className="p-2 text-neutral-700 group-hover:text-neutral-500 transition-colors">
                                 <GripVertical className="w-5 h-5" />
                              </div>

                              <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-neutral-800 bg-black">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Asset #{idx + 1}</span>
                                    {idx === 0 && (
                                      <span className="px-2 py-0.5 bg-brand-accent text-white rounded text-[6px] font-bold uppercase tracking-widest">Primary</span>
                                    )}
                                 </div>
                                 <p className="text-[8px] text-neutral-600 truncate mt-1">
                                    {img.startsWith('data:') ? `Local Upload (Base64)` : img}
                                 </p>
                              </div>

                              <div className="flex items-center gap-2 pr-2">
                                 <button 
                                    onClick={() => removeImage(idx)}
                                    className="p-3 bg-red-600/10 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                    title="Remove Image"
                                 >
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           </Reorder.Item>
                        ))}
                      </Reorder.Group>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-neutral-900 flex justify-between items-center bg-neutral-900/20">
           <button className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 py-2 px-4 rounded-xl transition-all">
              <Trash2 className="w-4 h-4" />
              Discard changes
           </button>
           <button 
              onClick={handleSave}
              className="flex items-center gap-3 py-4 px-10 bg-brand-accent text-white rounded-full font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-transform shadow-xl shadow-brand-accent/20"
           >
              <Save className="w-4 h-4" />
              Save Product
           </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
