import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { defaultConfig } from '../config/defaultConfig';

const ConfigContext = createContext(null);

const CONFIG_KEY = 'site_config';
const CONFIG_ROW_ID = 1;
const CACHE_LOGO_KEY = 'site_config_logo';

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deepMerge = useCallback((target, source) => {
    const out = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] != null && typeof source[key] === 'object' && !Array.isArray(source[key]) && typeof target[key] === 'object' && target[key] != null && !Array.isArray(target[key])) {
        out[key] = deepMerge(target[key], source[key]);
      } else {
        out[key] = source[key];
      }
    }
    return out;
  }, []);

  const fetchConfig = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setConfig(defaultConfig);
      setLoading(false);
      return;
    }
    try {
      const { data, error: err } = await supabase
        .from(CONFIG_KEY)
        .select('config')
        .eq('id', CONFIG_ROW_ID)
        .single();
      if (err) {
        if (err.code === 'PGRST116') {
          setConfig(defaultConfig);
        } else {
          setError(err.message);
          setConfig(defaultConfig);
        }
      } else if (data?.config) {
        const merged = deepMerge(defaultConfig, data.config);
        setConfig(merged);
        try {
          const logo = merged?.strategyLayout?.nav?.logo;
          if (logo && typeof logo === 'string' && logo.trim()) {
            localStorage.setItem(CACHE_LOGO_KEY, logo.trim());
          }
        } catch (_) {}
      }
    } catch (e) {
      setError(e.message);
      setConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  }, [deepMerge]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    try {
      const logoUrl = config?.strategyLayout?.nav?.logo;
      if (logoUrl && typeof logoUrl === 'string' && logoUrl.trim()) {
        const updateFavicon = (href) => {
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = href;
        };

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const size = 64;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            // Fill white background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, size, size);
            
            // Draw original logo scaled and centered
            const scale = Math.min((size - 8) / img.width, (size - 8) / img.height);
            const dw = img.width * scale;
            const dh = img.height * scale;
            const dx = (size - dw) / 2;
            const dy = (size - dh) / 2;
            
            ctx.drawImage(img, dx, dy, dw, dh);
            
            const dataUrl = canvas.toDataURL('image/png');
            updateFavicon(dataUrl);
          } catch (canvasErr) {
            // CORS error fallback to direct URL
            updateFavicon(logoUrl.trim());
          }
        };
        img.onerror = () => {
          updateFavicon(logoUrl.trim());
        };
        img.src = logoUrl.trim();

        // Update og:image
        const ogImage = document.getElementById('og-image');
        if (ogImage) ogImage.content = logoUrl.trim();
      }
      
      const brandName = config?.strategyLayout?.nav?.brandName;
      if (brandName) {
        document.title = brandName;
        const ogTitle = document.getElementById('og-title');
        if (ogTitle) ogTitle.content = brandName;
      }
    } catch (err) {
      console.error('Failed to update favicon:', err);
    }
  }, [config]);

  const updateConfig = useCallback(async (newConfig) => {
    if (!isSupabaseConfigured()) {
      setConfig((prev) => deepMerge(prev, newConfig));
      return { error: null };
    }
    const merged = deepMerge(config, newConfig);
    const { error: err } = await supabase
      .from(CONFIG_KEY)
      .upsert(
        { id: CONFIG_ROW_ID, config: merged, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );
    if (!err) {
      setConfig(merged);
      try {
        const logo = merged?.strategyLayout?.nav?.logo;
        if (logo && typeof logo === 'string' && logo.trim()) {
          localStorage.setItem(CACHE_LOGO_KEY, logo.trim());
        }
      } catch (_) {}
    }
    return { error: err };
  }, [config, deepMerge]);

  const value = useMemo(
    () => ({ config, loading, error, updateConfig, fetchConfig }),
    [config, loading, error, updateConfig, fetchConfig]
  );

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider');
  return ctx;
}
