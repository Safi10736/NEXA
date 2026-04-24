import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  Mail, 
  ShieldCheck, 
  Smartphone, 
  Globe, 
  Database,
  ArrowRight,
  Info,
  Image as ImageIcon,
  Palette,
  Upload,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../AuthContext';
import { useAppearance } from '../../AppearanceContext';
import { cn } from '../../lib/utils';

export default function AdminSettings() {
  const { user } = useAuth();
  const { settings, updateSettings } = useAppearance();
  const [activeCategory, setActiveCategory] = useState('notifications');
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState({
    emailOrderAlerts: true,
    marketingEmails: false,
    dataPrivacyVisible: true
  });
  
  // Local state for image URLs to avoid immediate context update lag
  const [tempSettings, setTempSettings] = useState(settings);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    setSuccess(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: 'heroBannerUrl' | 'loginSidebarUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setUploading(key);
    setUploadError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `site-assets/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      setTempSettings(prev => ({ ...prev, [key]: publicUrl }));
      setSuccess(false);
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Error uploading image');
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    if (activeCategory === 'appearance') {
       await updateSettings(tempSettings);
    }
    
    // Simulate API call for other settings
    await new Promise(resolve => setTimeout(resolve, 800));
    setSaving(false);
    setSuccess(true);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2">Terminal <span className="serif italic text-brand-accent">Settings</span></h1>
          <p className="text-xs text-neutral-500 lowercase tracking-wide">Configure Nexa administrative protocols and visual identity nodes.</p>
        </div>
        <button 
           onClick={handleSave}
           disabled={saving}
           className="px-10 py-4 bg-brand-accent text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-brand-accent/20 hover:scale-105 transition-all disabled:opacity-50"
        >
          {saving ? 'Syncing...' : 'Authorize Changes'}
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Categories */}
        <div className="lg:col-span-4 space-y-4">
           {[
             { id: 'notifications', label: 'Notification Stream', icon: Bell },
             { id: 'appearance', label: 'Visual Identity', icon: Palette },
             { id: 'privacy', label: 'Data & Privacy', icon: ShieldCheck },
             { id: 'connectivity', label: 'External Nodes', icon: Globe },
             { id: 'system', label: 'System Core', icon: Database },
           ].map(item => (
             <button 
               key={item.id}
               onClick={() => {
                 setActiveCategory(item.id);
                 setSuccess(false);
               }}
               className={cn(
                 "w-full p-6 rounded-3xl border flex items-center gap-6 transition-all group",
                 activeCategory === item.id
                   ? "bg-neutral-900 border-brand-accent/30 text-white shadow-xl" 
                   : "bg-[#0a0a0a] border-neutral-900 text-neutral-500 hover:border-neutral-800 hover:text-neutral-300"
               )}
             >
                <item.icon className={cn("w-5 h-5", activeCategory === item.id ? "text-brand-accent" : "text-neutral-700 group-hover:text-neutral-500")} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                {activeCategory === item.id && <ArrowRight className="w-4 h-4 ml-auto text-brand-accent/50" />}
             </button>
           ))}
        </div>

        {/* Right Column: Preferences */}
        <div className="lg:col-span-8 space-y-6">
           {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/20 p-6 rounded-3xl flex items-center gap-4 mb-4"
              >
                 <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <ShieldCheck className="w-4 h-4" />
                 </div>
                 <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-green-500">Protocol Updated</h5>
                    <p className="text-[8px] text-green-500/60 uppercase tracking-tighter">Your administrative preferences have been synced successfully.</p>
                 </div>
              </motion.div>
           )}

           <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[2.5rem] p-10 space-y-10">
              {activeCategory === 'notifications' && (
                <section className="space-y-8">
                   <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-brand-accent" />
                      <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-300">Notification Preferences</h2>
                   </div>

                   <div className="space-y-6">
                      <div className="flex items-center justify-between p-6 bg-neutral-900/50 rounded-2xl border border-neutral-900 group hover:border-brand-accent/30 transition-all">
                         <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-400 group-hover:text-brand-accent transition-colors">
                               <Mail className="w-5 h-5" />
                            </div>
                            <div>
                               <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-1">New Order Email Alerts</h4>
                               <p className="text-[8px] text-neutral-500 uppercase tracking-tighter leading-relaxed">Receive instantaneous notifications when a new acquisition is finalized.</p>
                            </div>
                         </div>
                         <button 
                           onClick={() => togglePreference('emailOrderAlerts')}
                           className={cn(
                             "w-12 h-6 rounded-full relative transition-all",
                             preferences.emailOrderAlerts ? "bg-brand-accent" : "bg-neutral-800"
                           )}
                         >
                            <motion.div 
                              animate={{ x: preferences.emailOrderAlerts ? 26 : 4 }}
                              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" 
                            />
                         </button>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-neutral-900/50 rounded-2xl border border-neutral-900 group hover:border-brand-accent/30 transition-all">
                         <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-400 group-hover:text-brand-accent transition-colors">
                               <Smartphone className="w-5 h-5" />
                            </div>
                            <div>
                               <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-1">Marketing Correspondence</h4>
                               <p className="text-[8px] text-neutral-500 uppercase tracking-tighter leading-relaxed">Receive periodic updates on seasonal collections and researcher insights.</p>
                            </div>
                         </div>
                         <button 
                           onClick={() => togglePreference('marketingEmails')}
                           className={cn(
                             "w-12 h-6 rounded-full relative transition-all",
                             preferences.marketingEmails ? "bg-brand-accent" : "bg-neutral-800"
                           )}
                         >
                            <motion.div 
                              animate={{ x: preferences.marketingEmails ? 26 : 4 }}
                              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" 
                            />
                         </button>
                      </div>
                   </div>
                </section>
              )}

              {activeCategory === 'appearance' && (
                <section className="space-y-8">
                   <div className="flex items-center gap-3">
                      <Palette className="w-4 h-4 text-brand-accent" />
                      <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-300">Visual Identity Configuration</h2>
                   </div>

                   <div className="space-y-8">
                      {/* Hero Banner Setting */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center px-4">
                           <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Hero Home Banner</h4>
                           <span className="text-[8px] text-neutral-500 uppercase font-mono tracking-tighter">Primary Node Background</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="relative group flex-1">
                            <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-700 group-focus-within:text-brand-accent transition-colors" />
                            <input 
                              type="text"
                              value={tempSettings.heroBannerUrl}
                              onChange={(e) => setTempSettings(prev => ({ ...prev, heroBannerUrl: e.target.value }))}
                              placeholder="IMAGE URL (.JPG / .PNG)"
                              className="w-full pl-16 pr-6 py-5 bg-neutral-900 border border-neutral-800 rounded-2xl text-[10px] font-bold tracking-widest uppercase text-white placeholder:text-neutral-700 focus:outline-none focus:border-brand-accent transition-all"
                            />
                          </div>
                          <label className="flex items-center justify-center w-16 bg-neutral-900 border border-neutral-800 rounded-2xl cursor-pointer hover:border-brand-accent hover:text-brand-accent transition-all group">
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'heroBannerUrl')} disabled={!!uploading} />
                            {uploading === 'heroBannerUrl' ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Upload className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                            )}
                          </label>
                        </div>
                        {tempSettings.heroBannerUrl && (
                          <div className="px-4">
                            <div className="h-32 w-full rounded-2xl overflow-hidden border border-neutral-800 relative">
                               <img src={tempSettings.heroBannerUrl} className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
                               <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                                     <CheckCircle2 className="w-3 h-3 text-green-500" />
                                     <span className="text-[7px] text-white font-bold uppercase tracking-widest leading-none">PREVIEW LOADED</span>
                                  </div>
                               </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Login Sidebar Setting */}
                      <div className="space-y-4 pt-4 border-t border-neutral-900">
                        <div className="flex justify-between items-center px-4">
                           <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Login Branding Sidebar</h4>
                           <span className="text-[8px] text-neutral-500 uppercase font-mono tracking-tighter">Authentication Portal Visual</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="relative group flex-1">
                            <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-700 group-focus-within:text-brand-accent transition-colors" />
                            <input 
                              type="text"
                              value={tempSettings.loginSidebarUrl}
                              onChange={(e) => setTempSettings(prev => ({ ...prev, loginSidebarUrl: e.target.value }))}
                              placeholder="IMAGE URL (.JPG / .PNG)"
                              className="w-full pl-16 pr-6 py-5 bg-neutral-900 border border-neutral-800 rounded-2xl text-[10px] font-bold tracking-widest uppercase text-white placeholder:text-neutral-700 focus:outline-none focus:border-brand-accent transition-all"
                            />
                          </div>
                          <label className="flex items-center justify-center w-16 bg-neutral-900 border border-neutral-800 rounded-2xl cursor-pointer hover:border-brand-accent hover:text-brand-accent transition-all group">
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'loginSidebarUrl')} disabled={!!uploading} />
                            {uploading === 'loginSidebarUrl' ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Upload className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                            )}
                          </label>
                        </div>
                        {tempSettings.loginSidebarUrl && (
                          <div className="px-4">
                            <div className="h-32 w-full rounded-2xl overflow-hidden border border-neutral-800 relative">
                               <img src={tempSettings.loginSidebarUrl} className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
                               <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                                     <CheckCircle2 className="w-3 h-3 text-green-500" />
                                     <span className="text-[7px] text-white font-bold uppercase tracking-widest leading-none">PREVIEW LOADED</span>
                                  </div>
                               </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {uploadError && (
                        <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                           <span className="text-[8px] text-red-400 font-bold uppercase tracking-widest">{uploadError}</span>
                        </div>
                      )}
                   </div>
                </section>
              )}

              {activeCategory === 'privacy' && (
                <section className="space-y-8">
                   <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-brand-accent" />
                      <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-300">Data & Privacy Protocols</h2>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-8 bg-neutral-900/30 border border-neutral-900 rounded-3xl">
                         <div className="flex items-center gap-3 mb-4">
                            <Database className="w-4 h-4 text-brand-accent" />
                            <h4 className="text-[9px] font-bold uppercase tracking-widest text-white">Researcher Identity Visibility</h4>
                         </div>
                         <p className="text-[8px] text-neutral-500 uppercase tracking-tighter leading-relaxed mb-6">Determine if your administrative designation is visible to secondary nodes.</p>
                         <button 
                           onClick={() => togglePreference('dataPrivacyVisible')}
                           className={cn(
                             "px-6 py-2 rounded-full text-[8px] font-bold uppercase tracking-widest border transition-all",
                             preferences.dataPrivacyVisible ? "bg-brand-accent border-brand-accent text-white" : "text-neutral-500 border-neutral-800 hover:border-neutral-700"
                           )}
                         >
                            {preferences.dataPrivacyVisible ? 'Active' : 'Restricted'}
                         </button>
                      </div>

                      <div className="p-8 bg-neutral-900/30 border border-neutral-900 rounded-3xl flex flex-col justify-center items-center text-center">
                         <Info className="w-5 h-5 text-neutral-700 mb-2" />
                         <p className="text-[8px] text-neutral-600 uppercase tracking-widest font-medium">Export Protocol Logs</p>
                         <button className="mt-4 text-[7px] text-brand-accent underline underline-offset-4 uppercase tracking-widest font-bold hover:text-white transition-colors">Download .JSON archive</button>
                      </div>
                   </div>
                </section>
              )}
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
