import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const STORAGE_BUCKET = 'images';

export function AdminSettings() {
  const { config, updateConfig } = useConfig();
  const [editConfig, setEditConfig] = useState(() => JSON.parse(JSON.stringify(config)));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const prevConfigRef = useRef(config);

  useEffect(() => {
    if (prevConfigRef.current !== config) {
      prevConfigRef.current = config;
      setEditConfig(JSON.parse(JSON.stringify(config)));
    }
  }, [config]);

  const handleConfigChange = (path, value) => {
    setEditConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        if (!(p in cur)) cur[p] = {};
        cur = cur[p];
      }
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    const { error } = await updateConfig(editConfig);
    setSaving(false);
    if (error) {
      setMessage({ type: 'danger', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Config saved successfully.' });
    }
  };

  const uploadImage = async (file, pathPrefix) => {
    if (!supabase) return null;
    setUploading(pathPrefix);
    const ext = file.name.split('.').pop() || 'jpg';
    const name = `${pathPrefix}_${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(name, file, {
      cacheControl: '3600',
      upsert: false,
    });
    setUploading(null);
    if (error) {
      setMessage({ type: 'danger', text: `Upload failed: ${error.message}` });
      return null;
    }
    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const buildPartialFromPath = (path, value) => {
    const parts = path.split('.');
    if (parts.length === 1) return { [path]: value };
    const key = parts[0];
    const current = config[key] && typeof config[key] === 'object' ? { ...config[key] } : {};
    let cur = current;
    for (let i = 1; i < parts.length - 1; i++) {
      const p = parts[i];
      cur[p] = cur[p] && typeof cur[p] === 'object' ? { ...cur[p] } : {};
      cur = cur[p];
    }
    cur[parts[parts.length - 1]] = value;
    return { [key]: current };
  };

  const handleImageUpload = async (e, path) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, path.replace(/\./g, '_'));
    if (!url) return;
    handleConfigChange(path, url);
    const partial = buildPartialFromPath(path, url);
    const { error } = await updateConfig(partial);
    if (error) setMessage({ type: 'danger', text: `Image saved but config update failed: ${error.message}` });
    else setMessage({ type: 'success', text: 'Image uploaded and saved. It will show on the landing page.' });
  };

  const getNested = (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj);
  const addArrayItem = (path, defaultValue) => {
    const current = getNested(editConfig, path);
    const arr = [...(Array.isArray(current) ? current : []), defaultValue];
    handleConfigChange(path, arr);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 fw-bold mb-0">Site settings</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSaveConfig}
          disabled={saving || !isSupabaseConfigured()}
        >
          {saving ? 'Saving...' : 'Save all'}
        </button>
      </div>
      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })} aria-label="Close" />
        </div>
      )}
      {!isSupabaseConfigured() && (
        <div className="alert alert-warning">
          Add <code>REACT_APP_SUPABASE_URL</code> and <code>REACT_APP_SUPABASE_ANON_KEY</code> in <code>.env</code> to save.
        </div>
      )}

      <section className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Theme &amp; colors</div>
        <div className="card-body">
          <div className="row g-3">
            {['primaryColor', 'primaryHover', 'secondaryColor', 'backgroundColor', 'textColor', 'textMuted'].map((key) => (
              <div className="col-md-4" key={key}>
                <label className="form-label">{key}</label>
                <input type="color" className="form-control form-control-color w-100" value={editConfig.theme?.[key] || '#000000'} onChange={(e) => handleConfigChange(`theme.${key}`, e.target.value)} />
                <input type="text" className="form-control form-control-sm mt-1" value={editConfig.theme?.[key] || ''} onChange={(e) => handleConfigChange(`theme.${key}`, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Logo &amp; title</div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Logo</label>
            <p className="small text-muted mb-1">Upload saves to site automatically. For URL only, click &quot;Save all&quot; below.</p>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <input type="file" accept="image/*" className="form-control" style={{ maxWidth: '220px' }} onChange={(e) => handleImageUpload(e, 'logo')} disabled={!isSupabaseConfigured() || uploading === 'logo'} />
              {editConfig.logo && <img src={editConfig.logo} alt="Logo" style={{ height: '40px' }} />}
              <input type="url" className="form-control" placeholder="Or paste URL" value={editConfig.logo || ''} onChange={(e) => handleConfigChange('logo', e.target.value)} />
            </div>
          </div>
          {['title', 'subtitle', 'ctaButtonText'].map((key) => (
            <div className="mb-3" key={key}>
              <label className="form-label">{key}</label>
              <input type="text" className="form-control" value={editConfig[key] || ''} onChange={(e) => handleConfigChange(key, e.target.value)} />
            </div>
          ))}
        </div>
      </section>

      {/* <section className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Hero card &amp; banner</div>
        <div className="card-body">
          {['workshopTitle', 'bannerText', 'bannerFullText', 'subHeadline', 'coachIntro', 'offerEndsLabel', 'registerPrice', 'originalPrice', 'bonusesWorth', 'registerInNextLabel', 'toUnlockBonusesLabel'].map((key) => (
            <div className="mb-3" key={key}>
              <label className="form-label">{key}</label>
              <input type="text" className="form-control" value={editConfig[key] || ''} onChange={(e) => handleConfigChange(key, e.target.value)} placeholder={key === 'bannerFullText' ? 'e.g. 4 HOUR ONLINE WORKSHOP ON 11TH MARCH 2026 (9:00 AM - 1:00 PM IST)' : ''} />
            </div>
          ))}
        </div>
      </section> */}

      <section className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Instructor</div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Image</label>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <input type="file" accept="image/*" className="form-control" style={{ maxWidth: '220px' }} onChange={(e) => handleImageUpload(e, 'instructor.image')} disabled={!isSupabaseConfigured() || uploading === 'instructor_image'} />
              {editConfig.instructor?.image && <img src={editConfig.instructor.image} alt="" className="rounded-circle" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />}
              <input type="url" className="form-control" placeholder="Or URL" value={editConfig.instructor?.image || ''} onChange={(e) => handleConfigChange('instructor.image', e.target.value)} />
            </div>
          </div>
          {['name', 'title', 'tagline', 'stats', 'rating', 'reviewText'].map((key) => (
            <div className="mb-3" key={key}>
              <label className="form-label">{key}</label>
              <input type="text" className="form-control" value={editConfig.instructor?.[key] || ''} onChange={(e) => handleConfigChange(`instructor.${key}`, e.target.value)} />
            </div>
          ))}
        </div>
      </section>

      <section className="card shadow-sm mb-4">
        <div className="card-header fw-bold">What Will Change (diagram)</div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Diagram image (optional)</label>
            <p className="small text-muted mb-1">Upload an image to replace the built diagram. Leave empty to show the default diagram.</p>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <input type="file" accept="image/*" className="form-control" style={{ maxWidth: '220px' }} onChange={(e) => handleImageUpload(e, 'whatWillChange.diagramImage')} disabled={!isSupabaseConfigured() || uploading === 'whatWillChange_diagramImage'} />
              {editConfig.whatWillChange?.diagramImage && <img src={editConfig.whatWillChange.diagramImage} alt="Diagram" className="rounded" style={{ maxHeight: '80px' }} />}
              <input type="url" className="form-control" placeholder="Or paste image URL" value={editConfig.whatWillChange?.diagramImage || ''} onChange={(e) => handleConfigChange('whatWillChange.diagramImage', e.target.value)} />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Center label</label>
            <input type="text" className="form-control" value={editConfig.whatWillChange?.centerLabel || ''} onChange={(e) => handleConfigChange('whatWillChange.centerLabel', e.target.value)} placeholder="Business Breakthrough" />
          </div>
          <div className="mb-3">
            <label className="form-label">CTA button text</label>
            <input type="text" className="form-control" value={editConfig.whatWillChange?.ctaText || ''} onChange={(e) => handleConfigChange('whatWillChange.ctaText', e.target.value)} placeholder="REGISTER NOW AT ₹99/- ONLY" />
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Featured logos</div>
        <div className="card-body">
          {(editConfig.featuredLogos || []).map((url, i) => (
            <div key={i} className="d-flex gap-2 align-items-center mb-2">
              <input type="file" accept="image/*" className="form-control" style={{ maxWidth: '200px' }} onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; uploadImage(file, `featured_${i}`).then((u) => u && handleConfigChange('featuredLogos', [...(editConfig.featuredLogos || [])].map((v, j) => (j === i ? u : v)))); }} disabled={!isSupabaseConfigured()} />
              <input type="url" className="form-control" value={url} onChange={(e) => { const arr = [...(editConfig.featuredLogos || [])]; arr[i] = e.target.value; handleConfigChange('featuredLogos', arr); }} />
              <img src={url} alt="" style={{ height: '32px' }} />
            </div>
          ))}
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => addArrayItem('featuredLogos', '')}>+ Add logo</button>
        </div>
      </section>

      <section className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Bonus product images</div>
        <div className="card-body">
          <div className="mb-2">
            <label className="form-label">Bonuses title</label>
            <input type="text" className="form-control" value={editConfig.bonuses?.title || ''} onChange={(e) => handleConfigChange('bonuses.title', e.target.value)} />
          </div>
          {(editConfig.bonuses?.productImages || []).map((url, i) => (
            <div key={i} className="d-flex gap-2 align-items-center mb-2">
              <input type="file" accept="image/*" className="form-control" style={{ maxWidth: '200px' }} onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; uploadImage(file, `bonus_${i}`).then((u) => { if (!u) return; const arr = [...(editConfig.bonuses?.productImages || [])]; arr[i] = u; handleConfigChange('bonuses.productImages', arr); }); }} disabled={!isSupabaseConfigured()} />
              <input type="url" className="form-control" value={url} onChange={(e) => { const arr = [...(editConfig.bonuses?.productImages || [])]; arr[i] = e.target.value; handleConfigChange('bonuses.productImages', arr); }} />
              <img src={url} alt="" style={{ height: '40px', objectFit: 'cover' }} />
            </div>
          ))}
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => addArrayItem('bonuses.productImages', '')}>+ Add image</button>
        </div>
      </section>
    </>
  );
}
