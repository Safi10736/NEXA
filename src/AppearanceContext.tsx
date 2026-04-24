import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

interface AppearanceSettings {
  heroBannerUrl: string;
  loginSidebarUrl: string;
}

interface AppearanceContextType {
  settings: AppearanceSettings;
  updateSettings: (newSettings: Partial<AppearanceSettings>) => Promise<void>;
  loading: boolean;
}

const DEFAULT_SETTINGS: AppearanceSettings = {
  heroBannerUrl: 'https://images.unsplash.com/photo-1620808461872-9cc911043900?auto=format&fit=crop&q=85&w=2400',
  loginSidebarUrl: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=800'
};

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppearanceSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Try to fetch from Supabase 'site_settings' table
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('key', 'appearance')
          .single();

        if (data && data.value) {
          setSettings({ ...DEFAULT_SETTINGS, ...data.value });
        } else {
          // If not in DB, check localStorage for preview effect
          const local = localStorage.getItem('appearance_settings');
          if (local) {
            setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(local) });
          }
        }
      } catch (err) {
        console.error('Error fetching appearance settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();

    // Subscribe to changes
    const channel = supabase
      .channel('public:site_settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
        fetchSettings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateSettings = async (newSettings: Partial<AppearanceSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    // Save to localStorage for immediate visual preview in development
    localStorage.setItem('appearance_settings', JSON.stringify(updated));

    try {
      // Upsert to Supabase
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          key: 'appearance', 
          value: updated,
          updated_at: new Date().toISOString()
        });

      if (error && error.code !== 'PGRST116') {
        process.env.NODE_ENV === 'development' && console.warn('Supabase site_settings upsert error:', error);
      }
    } catch (err) {
      console.error('Error updating appearance settings:', err);
    }
  };

  return (
    <AppearanceContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (context === undefined) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }
  return context;
}
