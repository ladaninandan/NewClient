import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import * as tus from 'tus-js-client';

const STORAGE_BUCKET = 'images';
const MAX_VIDEO_UPLOAD_MB = 500;
const RESUMABLE_THRESHOLD_MB = 50;

const defaultSectionOrder = [
  'topVideo', 'whyScale', 'problem', 'founderTrap', 'coach', 'learn', 'founderModel',
  'whyDifferent', 'testimonials', 'feedback', 'forNotFor', 'pricing', 'priceJustification',
  'form', 'moneyBackGuarantee', 'faq', 'footer',
];

const sectionOrderLabels = {
  topVideo: 'Top Video',
  whyScale: 'Why Scale',
  problem: 'Problem (Are you facing these…)',
  founderTrap: 'Founder Trap',
  coach: 'Coach (Meet Rahul)',
  learn: 'Learn',
  founderModel: 'Founder Model',
  whyDifferent: 'Why Different',
  testimonials: 'Testimonials (Video cards)',
  feedback: 'Feedback (Screenshots & cards)',
  forNotFor: 'For / Not For',
  pricing: 'Pricing',
  priceJustification: 'Price Justification (Why ₹199)',
  form: 'Registration Form',
  moneyBackGuarantee: 'Money Back Guarantee',
  faq: 'FAQ',
  footer: 'Footer',
};

function SectionOrderEditor({ order, onChange, labels }) {
  const list = Array.isArray(order) && order.length > 0 ? [...order] : [...defaultSectionOrder];
  const move = (index, dir) => {
    const next = [...list];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    onChange(next);
  };
  return (
    <div className="rounded-3 border border-secondary border-opacity-25 p-3 bg-white section-order-list">
      {list.map((id, i) => (
        <div key={id} className="d-flex align-items-center gap-3 py-2 px-2 border-bottom border-secondary border-opacity-25">
          <span className="text-muted fw-semibold" style={{ minWidth: '1.75rem', fontSize: '0.875rem' }}>{i + 1}</span>
          <span className="flex-grow-1" style={{ fontSize: '0.9375rem' }}>{labels[id] ?? id}</span>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label="Move down">↓</button>
        </div>
      ))}
      <style>{`.section-order-list > div:last-child { border-bottom: 0 !important; }`}</style>
    </div>
  );
}

function FeedbackSectionPreview({ feedback, theme }) {
  const f = feedback || {};
  const label = f.label ?? 'Feedbacks';
  const title = f.title ?? 'Here are some Real Screenshots & Feedbacks';
  const items = (f.items || []).filter((it) => it != null && typeof it === 'object');
  const primary = theme?.primary || '#f77c18';

  if (!items.length) {
    return (
      <div className="p-3 rounded border bg-light text-muted small">
        Add at least one feedback card above (name | role | quote) to see preview.
      </div>
    );
  }

  return (
    <div className="p-4 rounded border bg-light">
      <p className="text-center small text-muted text-uppercase fw-semibold mb-1">{label}</p>
      <h6 className="text-center fw-bold mb-3">{title}</h6>
      <div className="row g-3">
        {items.slice(0, 4).map((item, i) => {
          const it = item || {};
          return (
            <div key={i} className="col-6">
              <div className="border rounded p-3 shadow-sm bg-white">
                <div className="d-flex justify-content-center mb-2" style={{ marginTop: '-2rem' }}>
                  <div
                    className="rounded-circle overflow-hidden border border-2 border-white shadow"
                    style={{ width: 48, height: 48, backgroundColor: '#e2e8f0' }}
                  >
                    {it.image || it.avatar ? (
                      <img src={it.image || it.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span className="d-flex align-items-center justify-content-center w-100 h-100 text-white fw-bold small" style={{ backgroundColor: primary }}>
                        {(it.name || '?').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <p className="small text-dark mb-2 text-center" style={{ fontSize: '0.75rem', lineHeight: 1.35 }}>
                  {(it.text || '').slice(0, 80)}{(it.text || '').length > 80 ? '…' : ''}
                </p>
                <p className="small fw-bold text-center mb-0" style={{ color: primary }}>{it.name || '—'}</p>
                <p className="small text-muted text-center mb-0">{it.role || '—'}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const HIGHLIGHT_CLASS = 'admin-search-highlight';

export function AdminSettings() {
  const { config, updateConfig } = useConfig();
  const [editConfig, setEditConfig] = useState(() => JSON.parse(JSON.stringify(config)));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const prevConfigRef = useRef(config);
  const settingsContentRef = useRef(null);
  const highlightedRef = useRef(null);

  useEffect(() => {
    if (prevConfigRef.current !== config) {
      prevConfigRef.current = config;
      setEditConfig(JSON.parse(JSON.stringify(config)));
    }
  }, [config]);

  useEffect(() => {
    if (highlightedRef.current) {
      highlightedRef.current.classList.remove(HIGHLIGHT_CLASS);
      highlightedRef.current = null;
    }
    const term = (searchTerm || '').trim().toLowerCase();
    if (!term || !settingsContentRef.current) return;
    const candidates = settingsContentRef.current.querySelectorAll('h6, .form-label, .card-header');
    const first = Array.from(candidates).find((el) => el.textContent && el.textContent.toLowerCase().includes(term));
    if (first) {
      first.classList.add(HIGHLIGHT_CLASS);
      highlightedRef.current = first;
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return () => {
      if (highlightedRef.current) highlightedRef.current.classList.remove(HIGHLIGHT_CLASS);
    };
  }, [searchTerm]);

  const handleConfigChange = (path, value) => {
    setEditConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        const isObjOrArr = cur[p] != null && (typeof cur[p] === 'object' || Array.isArray(cur[p]));
        cur[p] = isObjOrArr ? cur[p] : {};
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

  const [uploadProgress, setUploadProgress] = useState(null);

  const uploadImage = async (file, pathPrefix) => {
    if (!supabase) return null;
    setUploading(pathPrefix);
    setUploadProgress(null);
    const ext = file.name.split('.').pop() || 'jpg';
    const name = `${pathPrefix}_${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(name, file, {
      cacheControl: '3600',
      upsert: false,
    });
    setUploading(null);
    setUploadProgress(null);
    if (error) {
      setMessage({ type: 'danger', text: `Upload failed: ${error.message}` });
      return null;
    }
    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const uploadVideoResumable = (file, pathPrefix) => {
    return new Promise((resolve, reject) => {
      const ext = file.name.split('.').pop() || 'mp4';
      const objectName = `${pathPrefix}_${Date.now()}.${ext}`;
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
      const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';
      const projectRef = supabaseUrl ? new URL(supabaseUrl).hostname.replace('.supabase.co', '') : '';
      if (!projectRef || !anonKey) {
        reject(new Error('Supabase URL or key missing'));
        return;
      }
      const endpoint = `https://${projectRef}.storage.supabase.co/storage/v1/upload/resumable`;
      setUploading(pathPrefix);
      setUploadProgress(0);
      supabase.auth.getSession().then(({ data: { session } }) => {
        const token = session?.access_token || anonKey;
        const upload = new tus.Upload(file, {
          endpoint,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          headers: {
            authorization: `Bearer ${token}`,
            apikey: anonKey,
            'x-upsert': 'true',
          },
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true,
          chunkSize: 6 * 1024 * 1024,
          metadata: {
            bucketName: STORAGE_BUCKET,
            objectName,
            contentType: file.type || 'video/mp4',
            cacheControl: 3600,
          },
          onError: (err) => {
            setUploading(null);
            setUploadProgress(null);
            const msg = err.message || String(err);
            const is413 = msg.includes('413') || msg.toLowerCase().includes('maximum size exceeded');
            if (is413) {
              setMessage({
                type: 'danger',
                text: 'File too large for your Supabase plan. Free tier allows ~50MB per file. Use YouTube: upload your video there (can be Unlisted), then paste the video link in the URL field below.',
              });
            } else {
              setMessage({ type: 'danger', text: `Upload failed: ${msg}` });
            }
            reject(err);
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const pct = bytesTotal ? Math.round((bytesUploaded / bytesTotal) * 100) : 0;
            setUploadProgress(pct);
          },
          onSuccess: () => {
            setUploading(null);
            setUploadProgress(null);
            const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectName);
            resolve(urlData.publicUrl);
          },
        });
        upload.findPreviousUploads().then((previousUploads) => {
          if (previousUploads.length) upload.resumeFromPreviousUpload(previousUploads[0]);
          upload.start();
        }).catch((err) => {
          setUploading(null);
          setUploadProgress(null);
          reject(err);
        });
      }).catch((err) => {
        setUploading(null);
        setUploadProgress(null);
        reject(err);
      });
    });
  };

  const buildPartialFromPath = (path, value) => {
    const parts = path.split('.');
    if (parts.length === 1) return { [path]: value };
    const key = parts[0];
    const current = config[key] && typeof config[key] === 'object' ? { ...config[key] } : {};
    let cur = current;
    for (let i = 1; i < parts.length - 1; i++) {
      const p = parts[i];
      if (Array.isArray(cur[p])) {
        cur[p] = [...cur[p]];
        cur = cur[p];
      } else if (cur[p] != null && typeof cur[p] === 'object') {
        cur[p] = { ...cur[p] };
        cur = cur[p];
      } else {
        cur[p] = /^\d+$/.test(parts[i + 1]) ? [] : {};
        cur = cur[p];
      }
    }
    cur[parts[parts.length - 1]] = value;
    return { [key]: current };
  };

  const handleImageUpload = async (e, path) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const pathPrefix = path.replace(/\./g, '_');
    const isVideo = file.type.startsWith('video/');
    const maxBytes = MAX_VIDEO_UPLOAD_MB * 1024 * 1024;
    const resumableThresholdBytes = RESUMABLE_THRESHOLD_MB * 1024 * 1024;
    if (isVideo && file.size > maxBytes) {
      setMessage({
        type: 'danger',
        text: `Video is too large (${(file.size / 1024 / 1024).toFixed(0)}MB). Max ${MAX_VIDEO_UPLOAD_MB}MB. Use YouTube or another host and paste the link.`,
      });
      e.target.value = '';
      return;
    }
    let url;
    if (isVideo && file.size > resumableThresholdBytes) {
      try {
        url = await uploadVideoResumable(file, pathPrefix);
      } catch (err) {
        e.target.value = '';
        return;
      }
    } else {
      url = await uploadImage(file, pathPrefix);
    }
    if (!url) return;
    handleConfigChange(path, url);
    const partial = buildPartialFromPath(path, url);
    const { error } = await updateConfig(partial);
    if (error) setMessage({ type: 'danger', text: `Upload saved but config update failed: ${error.message}` });
    else setMessage({ type: 'success', text: 'Uploaded and saved. It will show on the landing page.' });
    e.target.value = '';
  };

  return (
    <>
      <style>{`
        .admin-settings-page { max-width: full; }
        .admin-card { border-radius: 12px; border: 1px solid rgba(0,0,0,0.08); overflow: hidden; }
        .admin-card .card-header {
          font-size: 1rem;
          font-weight: 600;
          padding: 0.875rem 1.25rem;
          background: linear-gradient(to bottom, #f8f9fa, #f1f3f5);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          color: #212529;
        }
        .admin-card .card-body { padding: 1.25rem 1.5rem; }
        .admin-settings-page .form-label { font-weight: 500; color: #374151; }
        .admin-settings-page .form-label.small { font-size: 0.875rem; }
        .admin-settings-page .form-control-sm { border-radius: 8px; min-height: 2rem; }
        .admin-settings-page .form-control { border-radius: 8px; }
        .admin-settings-page .form-control:focus { border-color: #0d6efd; box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15); }
        .admin-search-wrap { background: #f8f9fa; border-radius: 10px; padding: 1rem 1.25rem; border: 1px solid #e9ecef; }
        .admin-settings-page .row.g-3 > [class*="col-"] { margin-bottom: 0.25rem; }
        .admin-settings-page .form-label { margin-bottom: 0.35rem; }
      `}</style>
      <div className="admin-settings-page">
      <div className="d-flex flex-sm-row justify-content-between align-items-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h1 className="h5 fw-bold mb-1 text-dark">Site settings</h1>
          <p className="text-muted small mb-0">Edit landing page content and options. Click Save all to apply.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary px-4"
          onClick={handleSaveConfig}
          disabled={saving || !isSupabaseConfigured()}
        >
          {saving ? 'Saving…' : 'Save all'}
        </button>
      </div>
      <div className="admin-search-wrap mb-4">
        <label htmlFor="admin-settings-search" className="form-label small fw-semibold text-dark mb-2">Search settings</label>
        <input
          id="admin-settings-search"
          type="search"
          className="form-control"
          placeholder="e.g. video, pricing, nav, FAQ…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
        />
      </div>
      {(uploading || uploadProgress != null) && (
        <div className="alert alert-info d-flex align-items-center gap-3 mb-3">
          <div className="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true" />
          {uploadProgress != null ? (
            <>
              <div className="progress flex-grow-1" style={{ height: '10px' }}>
                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: `${uploadProgress}%` }} aria-valuenow={uploadProgress} aria-valuemin={0} aria-valuemax={100} />
              </div>
              <span className="small fw-medium">Uploading video… {uploadProgress}%</span>
            </>
          ) : (
            <span className="small fw-medium">Uploading… Please wait.</span>
          )}
        </div>
      )}
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

      <div ref={settingsContentRef}>
      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Theme (colors)</div>
        <div className="card-body">
          <p className="text-muted mb-4" style={{ fontSize: '0.9375rem' }}>Control the landing page colors. Primary = main brand; Accent = CTAs and highlights.</p>
          <div className="row g-3">
            {[
              { key: 'primary', label: 'Primary (nav, hero &amp; section backgrounds)' },
              { key: 'accent', label: 'Accent (buttons, badges, icons)' },
              { key: 'accentHover', label: 'Accent hover (optional)' },
              { key: 'backgroundLight', label: 'Background light' },
              { key: 'backgroundDark', label: 'Background dark (page &amp; nav)' },
              { key: 'cardDark', label: 'Card dark (offer card, coach card, etc.)' },
            ].map(({ key, label }) => (
              <div className="col-12 col-md-6 col-lg-4" key={key}>
                <label className="form-label small">{label}</label>
                <div className="d-flex gap-2 align-items-center">
                  <input
                    type="color"
                    className="form-control form-control-color p-1"
                    style={{ width: '2.5rem', height: '2rem' }}
                    value={editConfig.strategyLayout?.theme?.[key]?.replace(/[^#a-fA-F0-9]/g, '')?.slice(0, 7) || '#000000'}
                    onChange={(e) => handleConfigChange(`strategyLayout.theme.${key}`, e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="#hex"
                    value={editConfig.strategyLayout?.theme?.[key] ?? ''}
                    onChange={(e) => handleConfigChange(`strategyLayout.theme.${key}`, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Section order</div>
        <div className="card-body">
          <p className="text-muted mb-3" style={{ fontSize: '0.9375rem' }}>Scrolling banner is always first; sticky bar is always last. Use arrows to change order.</p>
          <SectionOrderEditor
            order={editConfig.strategyLayout?.sectionOrder || defaultSectionOrder}
            onChange={(newOrder) => handleConfigChange('strategyLayout.sectionOrder', newOrder)}
            labels={sectionOrderLabels}
          />
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Section visibility (hide / show on page)</div>
        <div className="card-body">
          <p className="text-muted mb-3" style={{ fontSize: '0.9375rem' }}>Uncheck to hide a section from the landing page. Order still applies when shown.</p>
          <div className="row g-3">
            {defaultSectionOrder.map((id) => {
              const visible = editConfig.strategyLayout?.sectionVisibility?.[id] !== false;
              return (
                <div className="col-12 col-md-6 col-lg-4" key={id}>
                  <label className="d-flex align-items-center gap-2 py-2 px-3 rounded-2 border border-opacity-25 cursor-pointer mb-0 border-secondary bg-white" style={{ fontSize: '0.9375rem' }}>
                    <input
                      type="checkbox"
                      className="form-check-input mt-0"
                      checked={visible}
                      onChange={(e) => {
                        const next = { ...(editConfig.strategyLayout?.sectionVisibility || {}) };
                        if (e.target.checked) delete next[id];
                        else next[id] = false;
                        handleConfigChange('strategyLayout.sectionVisibility', next);
                      }}
                    />
                    <span>{sectionOrderLabels[id] ?? id}</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Nav</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small">Nav logo (shows on navbar left)</label>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <input type="file" accept="image/*" className="form-control form-control-sm" style={{ maxWidth: '200px' }} onChange={(e) => handleImageUpload(e, 'strategyLayout.nav.logo')} disabled={!isSupabaseConfigured() || uploading} />
                <input type="url" className="form-control form-control-sm flex-grow-1" placeholder="Or paste logo URL" value={editConfig.strategyLayout?.nav?.logo ?? ''} onChange={(e) => handleConfigChange('strategyLayout.nav.logo', e.target.value)} />
              </div>
              {editConfig.strategyLayout?.nav?.logo && (
                <img src={editConfig.strategyLayout.nav.logo} alt="Nav logo preview" className="mt-2 rounded border" style={{ maxHeight: '40px', width: 'auto' }} />
              )}
            </div>
            {['brandShort', 'brandName', 'ctaText'].map((k) => (
              <div className="col-12 col-md-6" key={k}>
                <label className="form-label small">Nav {k}</label>
                <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.nav?.[k] ?? ''} onChange={(e) => handleConfigChange(`strategyLayout.nav.${k}`, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Top Video</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small">Badge (e.g. Limited Time Strategy Session)</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.topVideo?.badge ?? ''} onChange={(e) => handleConfigChange('strategyLayout.topVideo.badge', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Headline (e.g. Is Your Business Running Because Of You… Or Despite You?)</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.topVideo?.headline ?? ''} onChange={(e) => handleConfigChange('strategyLayout.topVideo.headline', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Video (YouTube link or direct video URL; autoplay on page)</label>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <input type="file" accept="video/*" className="form-control form-control-sm" style={{ maxWidth: '220px' }} onChange={(e) => handleImageUpload(e, 'strategyLayout.topVideo.video')} disabled={!isSupabaseConfigured() || uploading} />
                <input type="url" className="form-control form-control-sm flex-grow-1" placeholder="Or paste YouTube / video URL" value={editConfig.strategyLayout?.topVideo?.video ?? ''} onChange={(e) => handleConfigChange('strategyLayout.topVideo.video', e.target.value)} />
              </div>
              <p className="form-text small text-muted mb-0 mt-1">Supabase Free tier allows ~50MB per file. For larger videos, upload to YouTube and paste the link. Pro plan allows bigger uploads.</p>
            </div>
            <div className="col-12">
              <label className="form-label small">Subtext below video (e.g. Transform your business from founder-dependent...)</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.topVideo?.subtext ?? ''} onChange={(e) => handleConfigChange('strategyLayout.topVideo.subtext', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">CTA button text below video</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.topVideo?.ctaText ?? ''} onChange={(e) => handleConfigChange('strategyLayout.topVideo.ctaText', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Slot note below CTA (e.g. Limited slots available for this month)</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.topVideo?.slotNote ?? ''} onChange={(e) => handleConfigChange('strategyLayout.topVideo.slotNote', e.target.value)} />
            </div>
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Hero</div>
        <div className="card-body">
          <div className="row g-3">
            {['badge', 'headline', 'headlineHighlight', 'subtext', 'ctaText', 'slotNote'].map((k) => (
              <div className="col-12" key={k}>
                <label className="form-label small">Hero {k}</label>
                <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.hero?.[k] ?? ''} onChange={(e) => handleConfigChange(`strategyLayout.hero.${k}`, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Offer card</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small">Price badge</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.offerCard?.price ?? ''} onChange={(e) => handleConfigChange('strategyLayout.offerCard.price', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Offer items (one per line: title | desc)</label>
              <textarea className="form-control form-control-sm" rows={4} value={(editConfig.strategyLayout?.offerCard?.items || []).map((i) => `${i.title}|${i.desc || ''}`).join('\n')} onChange={(e) => handleConfigChange('strategyLayout.offerCard.items', e.target.value.split('\n').filter(Boolean).map((line) => { const [title, ...rest] = line.split('|'); return { title: (title || '').trim(), desc: rest.join('|').trim() }; }))} />
            </div>
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Why Scale</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small">Section title</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.whyScale?.title ?? ''} onChange={(e) => handleConfigChange('strategyLayout.whyScale.title', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Cards (one per line: icon|title|desc)</label>
              <textarea className="form-control form-control-sm" rows={4} value={(editConfig.strategyLayout?.whyScale?.cards || []).map((c) => `${c.icon}|${c.title}|${c.desc || ''}`).join('\n')} onChange={(e) => handleConfigChange('strategyLayout.whyScale.cards', e.target.value.split('\n').filter(Boolean).map((line) => { const p = line.split('|'); return { icon: p[0] || 'help', title: p[1] || '', desc: p[2] || '' }; }))} />
            </div>
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Founder Trap</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small">Founder trap image URL</label>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <input type="file" accept="image/*" className="form-control form-control-sm" style={{ maxWidth: '200px' }} onChange={(e) => handleImageUpload(e, 'strategyLayout.founderTrap.image')} disabled={!isSupabaseConfigured() || uploading} />
                <input type="url" className="form-control form-control-sm flex-grow-1" placeholder="Or URL" value={editConfig.strategyLayout?.founderTrap?.image ?? ''} onChange={(e) => handleConfigChange('strategyLayout.founderTrap.image', e.target.value)} />
              </div>
            </div>
            <div className="col-12">
              <label className="form-label small">Title</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.founderTrap?.title ?? ''} onChange={(e) => handleConfigChange('strategyLayout.founderTrap.title', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Paragraph text</label>
              <textarea className="form-control form-control-sm" rows={3} value={editConfig.strategyLayout?.founderTrap?.text ?? ''} onChange={(e) => handleConfigChange('strategyLayout.founderTrap.text', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Warning items (one per line)</label>
              <textarea className="form-control form-control-sm" rows={2} value={(editConfig.strategyLayout?.founderTrap?.warningItems || []).join('\n')} onChange={(e) => handleConfigChange('strategyLayout.founderTrap.warningItems', e.target.value.split('\n').filter(Boolean))} />
            </div>
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Coach (Meet Rahul)</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small">Coach image</label>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <input type="file" accept="image/*" className="form-control form-control-sm" style={{ maxWidth: '200px' }} onChange={(e) => handleImageUpload(e, 'strategyLayout.coach.image')} disabled={!isSupabaseConfigured() || uploading} />
                <input type="url" className="form-control form-control-sm flex-grow-1" placeholder="Or URL" value={editConfig.strategyLayout?.coach?.image ?? ''} onChange={(e) => handleConfigChange('strategyLayout.coach.image', e.target.value)} />
              </div>
            </div>
            {['label', 'name', 'heading', 'ctaText'].map((k) => (
              <div className="col-12" key={k}>
                <label className="form-label small">Coach {k}</label>
                <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.coach?.[k] ?? ''} onChange={(e) => handleConfigChange(`strategyLayout.coach.${k}`, e.target.value)} />
              </div>
            ))}
            <div className="col-12">
              <label className="form-label small">Bio (paragraphs separated by blank line)</label>
              <textarea className="form-control form-control-sm" rows={4} value={editConfig.strategyLayout?.coach?.bio ?? ''} onChange={(e) => handleConfigChange('strategyLayout.coach.bio', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Coach stats (value | label one per line)</label>
              <textarea className="form-control form-control-sm" rows={2} value={(editConfig.strategyLayout?.coach?.stats || []).map((s) => `${s.value}|${s.label}`).join('\n')} onChange={(e) => handleConfigChange('strategyLayout.coach.stats', e.target.value.split('\n').filter(Boolean).map((line) => { const [value, label] = line.split('|'); return { value: (value || '').trim(), label: (label || '').trim() }; }))} />
            </div>
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">What you will learn</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small">Title</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.learn?.title ?? ''} onChange={(e) => handleConfigChange('strategyLayout.learn.title', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Subtitle</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.learn?.subtitle ?? ''} onChange={(e) => handleConfigChange('strategyLayout.learn.subtitle', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Items (one per line: icon|text)</label>
              <textarea className="form-control form-control-sm" rows={6} value={(editConfig.strategyLayout?.learn?.items || []).map((i) => `${i.icon}|${i.text || ''}`).join('\n')} onChange={(e) => handleConfigChange('strategyLayout.learn.items', e.target.value.split('\n').filter(Boolean).map((line) => { const [icon, ...rest] = line.split('|'); return { icon: icon || 'check_circle', text: rest.join('|').trim() }; }))} />
            </div>
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Founder Model</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small">Title</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.founderModel?.title ?? ''} onChange={(e) => handleConfigChange('strategyLayout.founderModel.title', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Subtitle</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.founderModel?.subtitle ?? ''} onChange={(e) => handleConfigChange('strategyLayout.founderModel.subtitle', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Steps (one per line: num|title|desc|highlight optional)</label>
              <textarea className="form-control form-control-sm" rows={4} value={(editConfig.strategyLayout?.founderModel?.steps || []).map((s) => `${s.num}|${s.title}|${s.desc}${s.highlight ? '|1' : ''}`).join('\n')} onChange={(e) => handleConfigChange('strategyLayout.founderModel.steps', e.target.value.split('\n').filter(Boolean).map((line) => { const p = line.split('|'); return { num: parseInt(p[0], 10) || 0, title: p[1] || '', desc: p[2] || '', highlight: p[3] === '1' }; }))} />
            </div>
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Why Different</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small">Title</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.whyDifferent?.title ?? ''} onChange={(e) => handleConfigChange('strategyLayout.whyDifferent.title', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Quote text</label>
              <textarea className="form-control form-control-sm" rows={3} value={editConfig.strategyLayout?.whyDifferent?.quote ?? ''} onChange={(e) => handleConfigChange('strategyLayout.whyDifferent.quote', e.target.value)} />
            </div>
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Testimonials (What Founders Say)</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 mb-2">
              <label className="form-label small">Section title</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.testimonials?.title ?? ''} onChange={(e) => handleConfigChange('strategyLayout.testimonials.title', e.target.value)} placeholder="What Founders Say" />
            </div>
            {[0, 1, 2, 3].map((idx) => {
              const items = editConfig.strategyLayout?.testimonials?.items || [];
              const item = (items[idx] != null && typeof items[idx] === 'object') ? items[idx] : {};
              return (
                <div className="col-12 col-lg-6" key={idx}>
                  <div className="border rounded p-3 bg-white">
                    <h6 className="border-bottom pb-2 mb-3">Video card {idx + 1}</h6>
                    <div className="mb-2">
                      <label className="form-label small mb-0">Name</label>
                      <input type="text" className="form-control form-control-sm" placeholder="e.g. Shanmuganathan C" value={item.name ?? ''} onChange={(e) => handleConfigChange(`strategyLayout.testimonials.items.${idx}.name`, e.target.value)} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small mb-0">Role / Company</label>
                      <input type="text" className="form-control form-control-sm" placeholder="e.g. Spider India" value={item.role ?? ''} onChange={(e) => handleConfigChange(`strategyLayout.testimonials.items.${idx}.role`, e.target.value)} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small mb-0">Details (short quote or description — shown on website below video)</label>
                      <textarea className="form-control form-control-sm" rows={2} placeholder="e.g. The session gave me a clear roadmap. I implemented one process and saved 10 hours a week." value={item.details ?? item.text ?? ''} onChange={(e) => handleConfigChange(`strategyLayout.testimonials.items.${idx}.details`, e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label small mb-0">Video (upload or paste YouTube / video URL)</label>
                      <div className="d-flex flex-wrap gap-2 align-items-center">
                        <input type="file" accept="video/*" className="form-control form-control-sm" style={{ maxWidth: '160px' }} onChange={(e) => handleImageUpload(e, `strategyLayout.testimonials.items.${idx}.video`)} disabled={!isSupabaseConfigured() || uploading} />
                        <input type="url" className="form-control form-control-sm flex-grow-1" placeholder="YouTube or video URL" value={item.video ?? ''} onChange={(e) => handleConfigChange(`strategyLayout.testimonials.items.${idx}.video`, e.target.value)} />
                      </div>
                      <p className="form-text small text-muted mb-0 mt-1">Supabase Free: ~50MB max. For larger videos use YouTube and paste the link.</p>
                      {item.video && (
                        <div className="mt-2 small text-muted">
                          {/youtube\.com|youtu\.be/i.test(item.video) ? 'YouTube link' : 'Video URL'} saved
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Feedback (Screenshots & cards)</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label small">Label above title (e.g. Feedbacks)</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.feedback?.label ?? ''} onChange={(e) => handleConfigChange('strategyLayout.feedback.label', e.target.value)} placeholder="Feedbacks" />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small">Section title</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.feedback?.title ?? ''} onChange={(e) => handleConfigChange('strategyLayout.feedback.title', e.target.value)} placeholder="Here are some Real Screenshots & Feedbacks" />
            </div>
            {[0, 1, 2, 3].map((idx) => {
              const items = editConfig.strategyLayout?.feedback?.items || [];
              const item = (items[idx] != null && typeof items[idx] === 'object') ? items[idx] : {};
              const theme = editConfig.strategyLayout?.theme || {};
              const primary = theme.primary || '#f77c18';
              return (
                <div className="col-12 col-lg-6" key={idx}>
                  <div className="border rounded p-3 bg-white">
                    <h6 className="border-bottom pb-2 mb-3">Feedback card {idx + 1}</h6>
                    {/* Card preview — same UI as website */}
                    <div className="rounded border bg-light p-3 mb-3" style={{ minHeight: '140px' }}>
                      <p className="small text-muted mb-2">Preview (how it looks on site)</p>
                      <div className="rounded shadow-sm bg-white border p-3 pt-12 position-relative">
                        <div className="position-absolute top-0 start-50 translate-middle" style={{ marginTop: '-1.5rem' }}>
                          <div className="rounded-circle overflow-hidden border border-3 border-white shadow" style={{ width: 56, height: 56, backgroundColor: '#e2e8f0' }}>
                            {item.image || item.avatar ? (
                              <img src={item.image || item.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white fw-bold small" style={{ backgroundColor: primary }}>
                                {(item.name || '?').charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="small text-dark mb-2 text-center" style={{ fontSize: '0.75rem', lineHeight: 1.3, minHeight: '2.5em' }}>
                          {(item.text || 'Quote will appear here').slice(0, 60)}{(item.text || '').length > 60 ? '…' : ''}
                        </p>
                        <p className="small fw-bold text-center mb-0" style={{ color: primary }}>{item.name || 'Name'}</p>
                        <p className="small text-muted text-center mb-0">{item.role || 'Role / Company'}</p>
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="form-label small mb-0">Name</label>
                      <input type="text" className="form-control form-control-sm" placeholder="e.g. Shanmuganathan C" value={item.name ?? ''} onChange={(e) => handleConfigChange(`strategyLayout.feedback.items.${idx}.name`, e.target.value)} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small mb-0">Role / Company</label>
                      <input type="text" className="form-control form-control-sm" placeholder="e.g. Spider India" value={item.role ?? ''} onChange={(e) => handleConfigChange(`strategyLayout.feedback.items.${idx}.role`, e.target.value)} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small mb-0">Quote / Feedback text</label>
                      <textarea className="form-control form-control-sm" rows={3} placeholder="Their testimonial or feedback..." value={item.text ?? ''} onChange={(e) => handleConfigChange(`strategyLayout.feedback.items.${idx}.text`, e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label small mb-0">Avatar (upload or paste URL)</label>
                      <div className="d-flex flex-wrap gap-2 align-items-center">
                        <input type="file" accept="image/*" className="form-control form-control-sm" style={{ maxWidth: '160px' }} onChange={(e) => handleImageUpload(e, `strategyLayout.feedback.items.${idx}.image`)} disabled={!isSupabaseConfigured() || uploading} />
                        <input type="url" className="form-control form-control-sm flex-grow-1" placeholder="Image URL" value={item.image || item.avatar || ''} onChange={(e) => handleConfigChange(`strategyLayout.feedback.items.${idx}.image`, e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="col-12 mt-3">
              <p className="small text-muted mb-2">Preview — how feedback section will look</p>
              <FeedbackSectionPreview feedback={editConfig.strategyLayout?.feedback} theme={editConfig.strategyLayout?.theme} />
            </div>
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Problem Identification</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small">Title</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={editConfig.strategyLayout?.problem?.title ?? ''}
                onChange={(e) => handleConfigChange('strategyLayout.problem.title', e.target.value)}
                placeholder="Are You Facing These Problems In Your Business?"
              />
            </div>
            <div className="col-12">
              <label className="form-label small">Problem bullets (one per line)</label>
              <textarea
                className="form-control form-control-sm"
                rows={4}
                value={(editConfig.strategyLayout?.problem?.items || []).join('\n')}
                onChange={(e) =>
                  handleConfigChange(
                    'strategyLayout.problem.items',
                    e.target.value.split('\n').map((v) => v.trim()).filter(Boolean),
                  )
                }
                placeholder={`Business cannot run without you\nTeam lacks ownership\nProcesses are unclear\nRevenue leaks happening silently\nFounder stuck in daily operations\nNo clear systems for scaling`}
              />
            </div>
            <div className="col-12 mb-2">
              <label className="form-label small">Ending line</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={editConfig.strategyLayout?.problem?.endLine ?? ''}
                onChange={(e) => handleConfigChange('strategyLayout.problem.endLine', e.target.value)}
                placeholder="If this sounds familiar, you are not alone."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">For / Not for</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small">For title</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.forNotFor?.forTitle ?? ''} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.forTitle', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">For items (one field per line — use &quot;Add new&quot; to add a line)</label>
              {(editConfig.strategyLayout?.forNotFor?.forItems || []).map((item, idx) => (
                <div key={idx} className="d-flex gap-2 align-items-center mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm flex-grow-1"
                    value={item ?? ''}
                    onChange={(e) => {
                      const items = [...(editConfig.strategyLayout?.forNotFor?.forItems || [])];
                      items[idx] = e.target.value;
                      handleConfigChange('strategyLayout.forNotFor.forItems', items);
                    }}
                    placeholder={`For item ${idx + 1}`}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm flex-shrink-0"
                    onClick={() => {
                      const items = (editConfig.strategyLayout?.forNotFor?.forItems || []).filter((_, i) => i !== idx);
                      handleConfigChange('strategyLayout.forNotFor.forItems', items);
                    }}
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-primary btn-sm mt-1"
                onClick={() => handleConfigChange('strategyLayout.forNotFor.forItems', [...(editConfig.strategyLayout?.forNotFor?.forItems || []), ''])}
              >
                + Add new
              </button>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small">For — background</label>
              <div className="d-flex gap-2 align-items-center">
                <input type="color" className="form-control form-control-color p-1" style={{ width: 40, height: 32 }} value={editConfig.strategyLayout?.forNotFor?.forBg ?? '#ecfdf5'} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.forBg', e.target.value)} />
                <input type="text" className="form-control form-control-sm" placeholder="#ecfdf5" value={editConfig.strategyLayout?.forNotFor?.forBg ?? ''} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.forBg', e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small">For — border</label>
              <div className="d-flex gap-2 align-items-center">
                <input type="color" className="form-control form-control-color p-1" style={{ width: 40, height: 32 }} value={editConfig.strategyLayout?.forNotFor?.forBorder ?? '#a7f3d0'} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.forBorder', e.target.value)} />
                <input type="text" className="form-control form-control-sm" placeholder="#a7f3d0" value={editConfig.strategyLayout?.forNotFor?.forBorder ?? ''} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.forBorder', e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small">For — title color</label>
              <div className="d-flex gap-2 align-items-center">
                <input type="color" className="form-control form-control-color p-1" style={{ width: 40, height: 32 }} value={editConfig.strategyLayout?.forNotFor?.forTitleColor ?? '#065f46'} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.forTitleColor', e.target.value)} />
                <input type="text" className="form-control form-control-sm" placeholder="#065f46" value={editConfig.strategyLayout?.forNotFor?.forTitleColor ?? ''} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.forTitleColor', e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small">For — text & icon color</label>
              <div className="d-flex gap-2 align-items-center">
                <input type="color" className="form-control form-control-color p-1" style={{ width: 40, height: 32 }} value={editConfig.strategyLayout?.forNotFor?.forTextColor ?? '#334155'} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.forTextColor', e.target.value)} />
                <input type="text" className="form-control form-control-sm" placeholder="Text" value={editConfig.strategyLayout?.forNotFor?.forTextColor ?? ''} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.forTextColor', e.target.value)} />
              </div>
              <div className="d-flex gap-2 align-items-center mt-1">
                <input type="color" className="form-control form-control-color p-1" style={{ width: 40, height: 32 }} value={editConfig.strategyLayout?.forNotFor?.forIconColor ?? '#059669'} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.forIconColor', e.target.value)} />
                <input type="text" className="form-control form-control-sm" placeholder="Icon #059669" value={editConfig.strategyLayout?.forNotFor?.forIconColor ?? ''} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.forIconColor', e.target.value)} />
              </div>
            </div>
            <div className="col-12">
              <label className="form-label small">Not for title</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.forNotFor?.notForTitle ?? ''} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.notForTitle', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Not for items (one field per line — use &quot;Add new&quot; to add a line)</label>
              {(editConfig.strategyLayout?.forNotFor?.notForItems || []).map((item, idx) => (
                <div key={idx} className="d-flex gap-2 align-items-center mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm flex-grow-1"
                    value={item ?? ''}
                    onChange={(e) => {
                      const items = [...(editConfig.strategyLayout?.forNotFor?.notForItems || [])];
                      items[idx] = e.target.value;
                      handleConfigChange('strategyLayout.forNotFor.notForItems', items);
                    }}
                    placeholder={`Not for item ${idx + 1}`}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm flex-shrink-0"
                    onClick={() => {
                      const items = (editConfig.strategyLayout?.forNotFor?.notForItems || []).filter((_, i) => i !== idx);
                      handleConfigChange('strategyLayout.forNotFor.notForItems', items);
                    }}
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-primary btn-sm mt-1"
                onClick={() => handleConfigChange('strategyLayout.forNotFor.notForItems', [...(editConfig.strategyLayout?.forNotFor?.notForItems || []), ''])}
              >
                + Add new
              </button>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small">Not for — background</label>
              <div className="d-flex gap-2 align-items-center">
                <input type="color" className="form-control form-control-color p-1" style={{ width: 40, height: 32 }} value={editConfig.strategyLayout?.forNotFor?.notForBg ?? '#fef2f2'} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.notForBg', e.target.value)} />
                <input type="text" className="form-control form-control-sm" placeholder="#fef2f2" value={editConfig.strategyLayout?.forNotFor?.notForBg ?? ''} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.notForBg', e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small">Not for — border</label>
              <div className="d-flex gap-2 align-items-center">
                <input type="color" className="form-control form-control-color p-1" style={{ width: 40, height: 32 }} value={editConfig.strategyLayout?.forNotFor?.notForBorder ?? '#fecaca'} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.notForBorder', e.target.value)} />
                <input type="text" className="form-control form-control-sm" placeholder="#fecaca" value={editConfig.strategyLayout?.forNotFor?.notForBorder ?? ''} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.notForBorder', e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small">Not for — title color</label>
              <div className="d-flex gap-2 align-items-center">
                <input type="color" className="form-control form-control-color p-1" style={{ width: 40, height: 32 }} value={editConfig.strategyLayout?.forNotFor?.notForTitleColor ?? '#991b1b'} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.notForTitleColor', e.target.value)} />
                <input type="text" className="form-control form-control-sm" placeholder="#991b1b" value={editConfig.strategyLayout?.forNotFor?.notForTitleColor ?? ''} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.notForTitleColor', e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small">Not for — text & icon color</label>
              <div className="d-flex gap-2 align-items-center">
                <input type="color" className="form-control form-control-color p-1" style={{ width: 40, height: 32 }} value={editConfig.strategyLayout?.forNotFor?.notForTextColor ?? '#334155'} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.notForTextColor', e.target.value)} />
                <input type="text" className="form-control form-control-sm" placeholder="Text" value={editConfig.strategyLayout?.forNotFor?.notForTextColor ?? ''} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.notForTextColor', e.target.value)} />
              </div>
              <div className="d-flex gap-2 align-items-center mt-1">
                <input type="color" className="form-control form-control-color p-1" style={{ width: 40, height: 32 }} value={editConfig.strategyLayout?.forNotFor?.notForIconColor ?? '#dc2626'} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.notForIconColor', e.target.value)} />
                <input type="text" className="form-control form-control-sm" placeholder="Icon #dc2626" value={editConfig.strategyLayout?.forNotFor?.notForIconColor ?? ''} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.notForIconColor', e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Money Back Guarantee</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small">Section title (e.g. Still Not Sure? We got your Back!)</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.moneyBackGuarantee?.title ?? ''} onChange={(e) => handleConfigChange('strategyLayout.moneyBackGuarantee.title', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Subheading (e.g. Our Guarantee)</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.moneyBackGuarantee?.subheading ?? ''} onChange={(e) => handleConfigChange('strategyLayout.moneyBackGuarantee.subheading', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Description (guarantee text)</label>
              <textarea className="form-control form-control-sm" rows={4} value={editConfig.strategyLayout?.moneyBackGuarantee?.description ?? ''} onChange={(e) => handleConfigChange('strategyLayout.moneyBackGuarantee.description', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">CTA button text (e.g. REGISTER NOW AT ₹99/- ONLY)</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.moneyBackGuarantee?.ctaText ?? ''} onChange={(e) => handleConfigChange('strategyLayout.moneyBackGuarantee.ctaText', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Badge image (100% Money Back Guaranteed)</label>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <input type="file" accept="image/*" className="form-control form-control-sm" style={{ maxWidth: '200px' }} onChange={(e) => handleImageUpload(e, 'strategyLayout.moneyBackGuarantee.image')} disabled={!isSupabaseConfigured() || uploading} />
                <input type="url" className="form-control form-control-sm flex-grow-1" placeholder="Or paste image URL" value={editConfig.strategyLayout?.moneyBackGuarantee?.image ?? ''} onChange={(e) => handleConfigChange('strategyLayout.moneyBackGuarantee.image', e.target.value)} />
              </div>
              {editConfig.strategyLayout?.moneyBackGuarantee?.image && (
                <img src={editConfig.strategyLayout.moneyBackGuarantee.image} alt="Badge preview" className="mt-2 rounded border" style={{ maxHeight: '120px', width: 'auto' }} />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">FAQ</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small">FAQ title</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.faq?.title ?? ''} onChange={(e) => handleConfigChange('strategyLayout.faq.title', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">FAQ items (Q and A: one block per pair, separate with ---)</label>
              <textarea className="form-control form-control-sm" rows={8} value={(editConfig.strategyLayout?.faq?.items || []).map((i) => `${i.q}\n---\n${i.a}`).join('\n\n')} onChange={(e) => handleConfigChange('strategyLayout.faq.items', e.target.value.split('\n\n').filter(Boolean).map((block) => { const [q, a] = block.split('\n---\n'); return { q: (q || '').trim(), a: (a || '').trim() }; }))} />
            </div>
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Price Justification (Why ₹199)</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small">Title</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.priceJustification?.title ?? ''} onChange={(e) => handleConfigChange('strategyLayout.priceJustification.title', e.target.value)} placeholder="Why This Session Is Only ₹199" />
            </div>
            <div className="col-12">
              <label className="form-label small">Explain (paragraphs — separate with blank line)</label>
              <textarea className="form-control form-control-sm" rows={4} value={editConfig.strategyLayout?.priceJustification?.explain ?? ''} onChange={(e) => handleConfigChange('strategyLayout.priceJustification.explain', e.target.value)} placeholder={'Normally consulting sessions cost thousands.\n\nBut this session is offered at ₹199 so business owners can experience the process.'} />
            </div>
            <div className="col-12">
              <label className="form-label small">CTA button text (scrolls to form on click)</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.priceJustification?.ctaText ?? ''} onChange={(e) => handleConfigChange('strategyLayout.priceJustification.ctaText', e.target.value)} placeholder="Reserve My ₹199 Strategy Session" />
            </div>
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Pricing</div>
        <div className="card-body">
          <div className="row g-3">
            {['title', 'originalPrice', 'price', 'note', 'ctaText', 'ribbonText', 'secureText'].map((k) => (
              <div className="col-12" key={k}>
                <label className="form-label small">Pricing {k}</label>
                {k === 'note' ? (
                  <textarea className="form-control form-control-sm" rows={2} value={editConfig.strategyLayout?.pricing?.[k] ?? ''} onChange={(e) => handleConfigChange(`strategyLayout.pricing.${k}`, e.target.value)} />
                ) : (
                  <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.pricing?.[k] ?? ''} onChange={(e) => handleConfigChange(`strategyLayout.pricing.${k}`, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Sticky bottom bar</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small">
                <input type="checkbox" className="form-check-input me-2" checked={editConfig.strategyLayout?.stickyBar?.enabled !== false} onChange={(e) => handleConfigChange('strategyLayout.stickyBar.enabled', e.target.checked)} />
                Show sticky bar
              </label>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label small">Sticky bar price</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.stickyBar?.price ?? ''} onChange={(e) => handleConfigChange('strategyLayout.stickyBar.price', e.target.value)} />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label small">Original price (strikethrough)</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.stickyBar?.originalPrice ?? ''} onChange={(e) => handleConfigChange('strategyLayout.stickyBar.originalPrice', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Button text</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.stickyBar?.buttonText ?? ''} onChange={(e) => handleConfigChange('strategyLayout.stickyBar.buttonText', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Countdown label (e.g. Offer Ends in 14:40 Mins)</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.stickyBar?.countdownLabel ?? ''} onChange={(e) => handleConfigChange('strategyLayout.stickyBar.countdownLabel', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Countdown end (optional ISO date for live countdown, e.g. 2025-03-15T23:59:59)</label>
              <input type="text" className="form-control form-control-sm" placeholder="Leave empty to use label only" value={editConfig.strategyLayout?.stickyBar?.countdownEnd ?? ''} onChange={(e) => handleConfigChange('strategyLayout.stickyBar.countdownEnd', e.target.value)} />
            </div>
          </div>
        </div>
      </section>

      <section className="card shadow-sm mb-4 admin-card">
        <div className="card-header fw-bold">Footer</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small">Headline</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.footer?.headline ?? ''} onChange={(e) => handleConfigChange('strategyLayout.footer.headline', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">CTA button text</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.footer?.ctaText ?? ''} onChange={(e) => handleConfigChange('strategyLayout.footer.ctaText', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Copyright</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.footer?.copyright ?? ''} onChange={(e) => handleConfigChange('strategyLayout.footer.copyright', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Footer links (label | url one per line)</label>
              <textarea className="form-control form-control-sm" rows={2} value={(editConfig.strategyLayout?.footer?.links || []).map((l) => `${l.label}|${l.url || '#'}`).join('\n')} onChange={(e) => handleConfigChange('strategyLayout.footer.links', e.target.value.split('\n').filter(Boolean).map((line) => { const [label, url] = line.split('|'); return { label: (label || '').trim(), url: (url || '#').trim() }; }))} />
            </div>
          </div>
        </div>
      </section>
      </div>

      <style>{`
        .${HIGHLIGHT_CLASS} {
          background-color: rgba(255, 193, 7, 0.45) !important;
          border-radius: 0.25rem;
        }
      `}</style>
      </div>
    </>
  );
}
