import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { defaultConfig } from '../config/defaultConfig';

const ConfigContext = createContext(null);

const CONFIG_KEY = 'site_config';
const CONFIG_ROW_ID = 1;

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
        setConfig(deepMerge(defaultConfig, data.config));
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
    if (!err) setConfig(merged);
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
