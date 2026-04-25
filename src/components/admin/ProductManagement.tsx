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
  GripVertical,
  Package,
  Image as ImageIcon,
  Layers,
  Settings
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
        <div className="flex px-8 border-b border-neutral-900 overflow-x-auto gap-8 no-scrollbar">
           {[
             { id: 'basic', label: 'Basic Info', icon: Settings },
             { id: 'inventory', label: 'Inventory', icon: Package },
             { id: 'media', label: 'Media', icon: ImageIcon },
             { id: 'variants', label: 'Variants', icon: Layers },
           ].map((tab) => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap
                  ${activeTab === tab.id ? 'text-brand-accent' : 'text-neutral-500 hover:text-white'}
                `}
             >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
                {activeTab === tab.id && (
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
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 px-6 text-sm focus:ring-1 focus:ring-brand-accent outline-none font-medium text-white shadow-inner"
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
                         <div className="relative group">
                            <select 
                               className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 px-6 text-sm focus:ring-1 focus:ring-brand-accent outline-none appearance-none font-medium text-white cursor-pointer"
                               value={formData.category}
                               onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                               <option>Lighting</option>
                               <option>Wall Decor</option>
                               <option>Kitchenware</option>
                               <option>Essentials</option>
                            </select>
                            <GripVertical className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none rotate-90" />
                         </div>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-4">Price (USD)</label>
                         <div className="relative group">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">$</span>
                            <input 
                               type="number" 
                               className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 pl-10 pr-6 text-sm focus:ring-1 focus:ring-brand-accent outline-none font-medium text-white shadow-inner"
                               placeholder="0.00"
                               value={formData.price}
                               onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-4">Slug (URL Name)</label>
                         <input 
                            type="text" 
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 px-6 text-sm focus:ring-1 focus:ring-brand-accent outline-none font-mono text-[10px] text-neutral-400 italic shadow-inner"
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
                         className="w-full bg-neutral-900 border border-neutral-800 rounded-3xl py-4 px-6 text-sm focus:ring-1 focus:ring-brand-accent outline-none resize-none font-medium text-white shadow-inner leading-relaxed"
                         placeholder="Describe the handcrafted nature and eco-friendly materials..."
                         value={formData.description}
                         onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                   </div>
                   
                   {/* Toggles */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-2">
                       {/* Pre-order Toggle */}
                       <div className="flex items-center gap-4 bg-neutral-900/50 p-6 rounded-[2rem] border border-neutral-900/50 group hover:border-brand-accent/30 transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center border border-neutral-800 group-hover:bg-brand-accent/10 group-hover:border-brand-accent/20 transition-all">
                             <CheckCircle2 className="w-5 h-5 text-neutral-500 group-hover:text-brand-accent transition-colors" />
                          </div>
                          <div className="flex-1">
                             <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Pre-order</h4>
                             <p className="text-[8px] text-neutral-500 uppercase mt-0.5">Allow early reserve</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, isPreOrder: !formData.isPreOrder})}
                            className={`w-10 h-5 rounded-full transition-all relative ${formData.isPreOrder ? 'bg-brand-accent' : 'bg-neutral-800'}`}
                          >
                             <motion.div 
                                animate={{ x: formData.isPreOrder ? 24 : 4 }}
                                className="absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm" 
                             />
                          </button>
                       </div>

                       {/* Eco Toggle */}
                       <div className="flex items-center gap-4 bg-neutral-900/50 p-6 rounded-[2rem] border border-neutral-900/50 group hover:border-brand-accent/30 transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center border border-neutral-800 group-hover:bg-brand-accent/10 group-hover:border-brand-accent/20 transition-all">
                             <ShieldCheck className="w-5 h-5 text-neutral-500 group-hover:text-brand-accent transition-colors" />
                          </div>
                          <div className="flex-1">
                             <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Eco-friendly</h4>
                             <p className="text-[8px] text-neutral-500 uppercase mt-0.5">Sustainable build</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              const badges = formData.badges.includes('Eco-friendly')
                                ? formData.badges.filter((b: string) => b !== 'Eco-friendly')
                                : [...formData.badges, 'Eco-friendly'];
                              setFormData({...formData, badges});
                            }}
                            className={`w-10 h-5 rounded-full transition-all relative ${formData.badges.includes('Eco-friendly') ? 'bg-green-500' : 'bg-neutral-800'}`}
                          >
                             <motion.div 
                                animate={{ x: formData.badges.includes('Eco-friendly') ? 24 : 4 }}
                                className="absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm" 
                             />
                          </button>
                       </div>

                       {/* New Arrival Toggle */}
                       <div className="flex items-center gap-4 bg-neutral-900/50 p-6 rounded-[2rem] border border-neutral-900/50 group hover:border-brand-accent/30 transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center border border-neutral-800 group-hover:bg-brand-accent/10 group-hover:border-brand-accent/20 transition-all">
                             <Info className="w-5 h-5 text-neutral-500 group-hover:text-brand-accent transition-colors" />
                          </div>
                          <div className="flex-1">
                             <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">New Arrival</h4>
                             <p className="text-[8px] text-neutral-500 uppercase mt-0.5">Market Fresh</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              const badges = formData.badges.includes('New Arrival')
                                ? formData.badges.filter((b: string) => b !== 'New Arrival')
                                : [...formData.badges, 'New Arrival'];
                              setFormData({...formData, badges});
                            }}
                            className={`w-10 h-5 rounded-full transition-all relative ${formData.badges.includes('New Arrival') ? 'bg-cyan-500' : 'bg-neutral-800'}`}
                          >
                             <motion.div 
                                animate={{ x: formData.badges.includes('New Arrival') ? 24 : 4 }}
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
                              "w-full bg-neutral-900 border rounded-2xl py-4 px-6 text-sm focus:ring-1 outline-none transition-all font-medium text-white shadow-inner",
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
                                setFormData({...formData, stock: Math.max(0, Math.floor(num))});
                              }
                            }}
                         />
                      </div>
                      <div className="flex items-center gap-4 mt-8 px-6 py-4 bg-neutral-900/30 rounded-[1.5rem] border border-neutral-900/50">
                         <div className={`p-2 rounded-lg ${formData.stock < 10 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                           {formData.stock < 10 ? <Info className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                         </div>
                         <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-200">
                               {formData.stock < 10 ? 'Low Stock Alert' : 'Healthy Inventory'}
                            </p>
                            <p className="text-[8px] text-neutral-500 uppercase font-medium">Auto-refill threshold: 10 units</p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-4">Collection Badges</h4>
                      <div className="flex flex-wrap gap-3">
                         {['Eco-friendly', 'Handcrafted', 'New Arrival', 'Limited Edition', 'Bestseller'].map((badge) => (
                           <button
                              key={badge}
                              type="button"
                              onClick={() => {
                                const badges = formData.badges.includes(badge) 
                                  ? formData.badges.filter((b: string) => b !== badge)
                                  : [...formData.badges, badge];
                                setFormData({...formData, badges});
                              }}
                              className={`
                                py-3 px-6 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border transition-all duration-300
                                ${formData.badges.includes(badge) 
                                  ? 'bg-brand-accent border-brand-accent text-white shadow-lg shadow-brand-accent/20' 
                                  : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-white'}
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
                      <div className="flex gap-4 p-1.5 bg-neutral-900 rounded-[1.5rem] w-fit border border-neutral-800">
                        <button 
                          type="button"
                          onClick={() => setMediaSource('url')}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${mediaSource === 'url' ? 'bg-neutral-800 text-brand-accent' : 'text-neutral-500 hover:text-white'}`}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          Remote URL
                        </button>
                        <button 
                          type="button"
                          onClick={() => setMediaSource('device')}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${mediaSource === 'device' ? 'bg-neutral-800 text-brand-accent' : 'text-neutral-500 hover:text-white'}`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          Device Upload
                        </button>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900/50 rounded-full border border-neutral-900">
                         <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                         <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">
                           {formData.images.length} Assets Synchronized
                         </p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      {mediaSource === 'url' ? (
                        <div className="flex gap-3">
                          <input 
                            id="new-image-url"
                            type="text" 
                            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl py-4 px-6 text-sm focus:ring-1 focus:ring-brand-accent outline-none font-medium text-white shadow-inner"
                            placeholder="Enter image URL (e.g. Unsplash, Cloudinary)..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addImageUrl();
                              }
                            }}
                          />
                          <button 
                            type="button"
                            onClick={addImageUrl}
                            className="px-8 bg-brand-accent rounded-2xl hover:scale-105 transition-all text-white shadow-xl shadow-brand-accent/20"
                          >
                            <Plus className="w-5 h-5" />
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
                              "flex flex-col items-center justify-center gap-4 w-full h-56 bg-neutral-900 border-2 border-dashed rounded-[2.5rem] cursor-pointer transition-all group overflow-hidden",
                              isDragging ? "border-brand-accent bg-brand-accent/5" : "border-neutral-800 hover:border-brand-accent"
                            )}
                          >
                             <div className={cn(
                               "p-5 rounded-2xl transition-all duration-500",
                               isDragging ? "bg-brand-accent font-bold scale-110 shadow-2xl" : "bg-neutral-800 group-hover:bg-brand-accent/20"
                             )}>
                                <Upload className={cn(
                                  "w-6 h-6 transition-colors",
                                  isDragging ? "text-white" : "text-neutral-400 group-hover:text-brand-accent"
                                )} />
                             </div>
                             <div className="text-center px-8">
                                <p className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-1">
                                  {isDragging ? 'Release to upload' : 'Click to Browse Files / Drop Assets'}
                                </p>
                                <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-medium">JPEG, PNG, WEBP (Maximum 2MB per asset)</p>
                             </div>
                          </label>
                        </div>
                      )}
                   </div>

                   {/* Image Library Grid with Reordering */}
                   <div className="space-y-4">
                      <div className="flex items-center gap-4 ml-4">
                         <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Library Hierarchy</h4>
                         <div className="h-px flex-1 bg-neutral-900" />
                      </div>
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
                             className="relative flex items-center gap-6 bg-neutral-900/50 p-5 rounded-[2rem] border border-neutral-900/50 group cursor-grab active:cursor-grabbing hover:bg-neutral-900 transition-colors"
                           >
                              <div className="p-2 text-neutral-700 group-hover:text-brand-accent transition-colors">
                                 <GripVertical className="w-5 h-5" />
                              </div>

                              <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-neutral-800 bg-black shadow-inner">
                                <img src={img} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest opacity-80">Asset #{idx + 1}</span>
                                    {idx === 0 && (
                                      <span className="px-3 py-0.5 bg-brand-accent text-white rounded-full text-[7px] font-bold uppercase tracking-[0.2em] shadow-lg">Hero Display</span>
                                    )}
                                 </div>
                                 <p className="text-[9px] text-neutral-500 truncate mt-1.5 font-mono">
                                    {img.startsWith('data:') ? `Binary Stream (Buffer)` : img}
                                 </p>
                              </div>

                              <div className="flex items-center gap-3 pr-2">
                                 <button 
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="p-3 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300"
                                    title="Delete Asset"
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

               {activeTab === 'variants' && (
                 <motion.div 
                   key="variants"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-8"
                 >
                    <div className="flex justify-between items-center">
                       <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-1">Variant Matrix</h4>
                          <p className="text-[8px] text-neutral-500 uppercase tracking-widest font-medium">Customizable options for bespoke collections</p>
                       </div>
                       <button 
                          type="button"
                          onClick={() => {
                             const newVariants = [...(formData.variants || [])];
                             newVariants.push({ type: 'Property', options: [] });
                             setFormData({ ...formData, variants: newVariants });
                          }}
                          className="flex items-center gap-3 py-4 px-8 bg-neutral-900 border border-neutral-800 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest text-white hover:border-brand-accent hover:bg-brand-accent/5 transition-all shadow-xl"
                       >
                          <Plus className="w-4 h-4 text-brand-accent" />
                          Add Category
                       </button>
                    </div>

                    <div className="space-y-6">
                       {(formData.variants || []).map((v: any, vIdx: number) => (
                         <motion.div 
                           key={vIdx} 
                           initial={{ y: 20, opacity: 0 }}
                           animate={{ y: 0, opacity: 1 }}
                           className="bg-neutral-900/30 border border-neutral-900/50 p-10 rounded-[3rem] space-y-8"
                         >
                            <div className="flex justify-between items-start">
                               <div className="space-y-3 flex-1 max-w-sm">
                                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-4">Variant Category Name</label>
                                  <input 
                                     type="text"
                                     value={v.type}
                                     onChange={(e) => {
                                        const newVariants = [...formData.variants];
                                        newVariants[vIdx].type = e.target.value;
                                        setFormData({ ...formData, variants: newVariants });
                                     }}
                                     className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 px-8 text-sm focus:ring-1 focus:ring-brand-accent outline-none font-bold text-white shadow-inner uppercase tracking-widest"
                                     placeholder="e.g. Size, Color, Materia..."
                                  />
                               </div>
                               <button 
                                  type="button"
                                  onClick={() => {
                                     const newVariants = formData.variants.filter((_: any, i: number) => i !== vIdx);
                                     setFormData({ ...formData, variants: newVariants });
                                  }}
                                  className="p-4 text-red-500 hover:bg-red-500/10 rounded-full transition-all border border-transparent hover:border-red-500/20"
                               >
                                  <Trash2 className="w-5 h-5" />
                               </button>
                            </div>

                            <div className="space-y-6">
                               <div className="flex items-center gap-4 ml-4">
                                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500">Available Options</label>
                                  <div className="h-px flex-1 bg-neutral-900/50" />
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {(v.options || []).map((opt: any, oIdx: number) => (
                                    <div key={oIdx} className="bg-neutral-900/40 p-6 rounded-[2rem] border border-neutral-900 group relative hover:border-neutral-800 transition-all shadow-inner">
                                       <div className="space-y-5">
                                          <div className="flex justify-between items-center">
                                            <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest">Descriptor</span>
                                            <button 
                                              type="button"
                                              onClick={() => {
                                                const newVariants = [...formData.variants];
                                                newVariants[vIdx].options = newVariants[vIdx].options.filter((_: any, i: number) => i !== oIdx);
                                                setFormData({ ...formData, variants: newVariants });
                                              }}
                                              className="p-1.5 text-neutral-700 hover:text-red-500 transition-colors bg-black/20 rounded-full"
                                            >
                                              <X className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                          <input 
                                             type="text"
                                             value={opt.value}
                                             onChange={(e) => {
                                                const newVariants = [...formData.variants];
                                                newVariants[vIdx].options[oIdx].value = e.target.value;
                                                setFormData({ ...formData, variants: newVariants });
                                             }}
                                             className="w-full bg-transparent border-b border-neutral-800 py-1.5 text-[11px] focus:border-brand-accent outline-none font-bold text-white tracking-widest"
                                             placeholder="e.g. Midnight Onyx"
                                          />
                                          <div className="space-y-2">
                                             <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest">Price Impact</span>
                                             <div className="relative group/price">
                                               <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-brand-accent font-bold">$</span>
                                               <input 
                                                  type="number"
                                                  value={opt.priceModifier}
                                                  onChange={(e) => {
                                                     const newVariants = [...formData.variants];
                                                     newVariants[vIdx].options[oIdx].priceModifier = Number(e.target.value);
                                                     setFormData({ ...formData, variants: newVariants });
                                                  }}
                                                  className="w-full bg-transparent border-b border-neutral-800 py-1.5 pl-4 text-xs focus:border-brand-accent outline-none font-mono text-white text-right"
                                                  placeholder="0.00"
                                               />
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                  ))}
                                  <button 
                                     type="button"
                                     onClick={() => {
                                        const newVariants = [...formData.variants];
                                        if (!newVariants[vIdx].options) newVariants[vIdx].options = [];
                                        newVariants[vIdx].options.push({ 
                                          id: Math.random().toString(36).substr(2, 9), 
                                          name: '', 
                                          value: '', 
                                          priceModifier: 0 
                                        });
                                        setFormData({ ...formData, variants: newVariants });
                                     }}
                                     className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-neutral-900 rounded-[2rem] p-6 hover:border-brand-accent/50 hover:bg-brand-accent/5 transition-all group min-h-[160px]"
                                  >
                                     <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center group-hover:bg-brand-accent/20 transition-all duration-500">
                                       <Plus className="w-5 h-5 text-neutral-700 group-hover:text-brand-accent scale-75 group-hover:scale-100 transition-transform" />
                                     </div>
                                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-700 group-hover:text-brand-accent mt-2 transition-colors">Add Sub-Option</span>
                                  </button>
                               </div>
                            </div>
                         </motion.div>
                       ))}

                       {(formData.variants || []).length === 0 && (
                         <div className="text-center py-24 bg-neutral-900/10 border border-dashed border-neutral-900 rounded-[4rem]">
                            <motion.div 
                              animate={{ 
                                scale: [1, 1.05, 1],
                                opacity: [0.3, 0.6, 0.3]
                              }}
                              transition={{ duration: 4, repeat: Infinity }}
                              className="w-24 h-24 bg-neutral-900/50 rounded-full flex items-center justify-center mx-auto mb-8 border border-neutral-800"
                            >
                              <Layers className="w-10 h-10 text-neutral-800" />
                            </motion.div>
                            <h5 className="text-[13px] font-light text-white tracking-widest mb-3 serif italic opacity-60">No Variants Synchronized</h5>
                            <p className="text-[9px] text-neutral-600 uppercase tracking-[0.3em] font-medium max-w-xs mx-auto leading-relaxed">Defining variations allows customers to choose from bespoke attributes</p>
                         </div>
                       )}
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>

        {/* Footer */}
        <div className="p-10 border-t border-neutral-900 flex justify-between items-center bg-gradient-to-t from-neutral-950 to-neutral-900/10">
           <button className="flex items-center gap-3 text-red-500/60 text-[10px] font-bold uppercase tracking-widest hover:text-red-500 hover:bg-red-500/10 py-3 px-6 rounded-2xl transition-all group">
              <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
              Discard Configuration
           </button>
           <div className="flex items-center gap-6">
              <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest hidden md:block">Verification: SHA-256 Validated</span>
              <button 
                 onClick={handleSave}
                 className="flex items-center gap-3 py-5 px-14 bg-brand-accent text-white rounded-full font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-white hover:text-neutral-950 transition-all shadow-2xl shadow-brand-accent/30 hover:-translate-y-1 active:translate-y-0"
              >
                 <Save className="w-4 h-4" />
                 Save Asset
              </button>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
