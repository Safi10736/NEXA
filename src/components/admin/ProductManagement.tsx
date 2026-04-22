import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Smartphone
} from 'lucide-react';
import { formatPrice } from '../../lib/utils';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for Base64 (browser performance)
        setError("Image is too large. Please use a link or an image under 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newImages = [...formData.images];
        newImages[0] = base64String;
        setFormData({ ...formData, images: newImages });
        setError(null);
      };
      reader.readAsDataURL(file);
    }
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
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 px-6 text-sm focus:ring-1 focus:ring-brand-accent outline-none"
                            value={formData.stock}
                            onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                         />
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
                   <div className="flex gap-4 p-1 bg-neutral-900 rounded-2xl w-fit">
                      <button 
                        onClick={() => setMediaSource('url')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mediaSource === 'url' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}
                      >
                         <Globe className="w-4 h-4" />
                         Image URL
                      </button>
                      <button 
                        onClick={() => setMediaSource('device')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mediaSource === 'device' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}
                      >
                         <Smartphone className="w-4 h-4" />
                         From Device
                      </button>
                   </div>

                   <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-4">
                        {mediaSource === 'url' ? 'Main Image URL' : 'Upload Image'}
                      </label>
                      
                      {mediaSource === 'url' ? (
                        <div className="flex gap-4">
                          <input 
                            type="text" 
                            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl py-4 px-6 text-sm focus:ring-1 focus:ring-brand-accent outline-none"
                            placeholder="https://images.unsplash.com/..."
                            value={formData.images[0] || ''}
                            onChange={(e) => {
                              const newImages = [...formData.images];
                              newImages[0] = e.target.value;
                              setFormData({...formData, images: newImages});
                            }}
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          <input 
                            type="file" 
                            id="file-upload" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          <label 
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center gap-4 w-full h-48 bg-neutral-900 border-2 border-dashed border-neutral-800 rounded-[2rem] cursor-pointer hover:border-brand-accent transition-all group"
                          >
                             <div className="p-4 bg-neutral-800 rounded-2xl group-hover:bg-brand-accent/10 transition-colors">
                                <Upload className="w-6 h-6 text-neutral-400 group-hover:text-brand-accent" />
                             </div>
                             <div className="text-center">
                                <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Click to browse</p>
                                <p className="text-[8px] text-neutral-500 uppercase tracking-tighter">PNG, JPG or WebP (Max 1MB)</p>
                             </div>
                          </label>
                        </div>
                      )}
                   </div>

                   {formData.images[0] && (
                     <div className="relative aspect-video rounded-3xl overflow-hidden border border-neutral-900 group">
                        <img src={formData.images[0]} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                           <div className="flex-1">
                             <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Main Visual Preview</p>
                             <p className="text-[8px] text-white/40 uppercase tracking-tighter truncate max-w-xs">{formData.images[0]}</p>
                           </div>
                           <button 
                            onClick={() => {
                              const newImages = [...formData.images];
                              newImages[0] = "";
                              setFormData({...formData, images: newImages});
                            }}
                            className="p-3 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                   )}
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
