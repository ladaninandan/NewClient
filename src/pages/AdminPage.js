import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const SUBMISSIONS_TABLE = 'registrations';
const STORAGE_BUCKET = 'images';

export function AdminPage() {
  const { config, updateConfig, fetchConfig } = useConfig();
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
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

  const fetchSubmissions = React.useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoadingSubs(false);
      return;
    }
    setLoadingSubs(true);
    const { data, error } = await supabase
      .from(SUBMISSIONS_TABLE)
      .select('id, name, email, phone, created_at')
      .order('created_at', { ascending: false });
    if (!error) setSubmissions(data || []);
    setLoadingSubs(false);
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

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

  const handleImageUpload = async (e, path) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, path.replace(/\./g, '_'));
    if (url) handleConfigChange(path, url);
  };

  const handleArrayImageUpload = async (e, arrayPath, index) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const path = `${arrayPath}_${index}_${Date.now()}`;
    const url = await uploadImage(file, path);
    if (!url) return;
    const arr = [...(editConfig[arrayPath.split('.')[0]]?.[arrayPath.split('.')[1]] || [])];
    if (index >= arr.length) arr.length = index + 1;
    arr[index] = url;
    handleConfigChange(arrayPath, arr);
  };

  const getNested = (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj);
  const addArrayItem = (path, defaultValue) => {
    const current = getNested(editConfig, path);
    const arr = [...(Array.isArray(current) ? current : []), defaultValue];
    handleConfigChange(path, arr);
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">← Back to Landing</Link>
          <span className="text-white">Admin Panel</span>
        </div>
      </nav>
      <div className="container py-4">
        {message.text && (
          <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })} aria-label="Close" />
          </div>
        )}

        {!isSupabaseConfigured() && (
          <div className="alert alert-warning">
            Add <code>REACT_APP_SUPABASE_URL</code> and <code>REACT_APP_SUPABASE_ANON_KEY</code> in <code>.env</code> to save config and view submissions.
          </div>
        )}

        {/* Theme / Colors */}
        <section className="card shadow-sm mb-4">
          <div className="card-header fw-bold">Theme &amp; Colors</div>
          <div className="card-body">
            <div className="row g-3">
              {['primaryColor', 'primaryHover', 'secondaryColor', 'backgroundColor', 'textColor', 'textMuted'].map((key) => (
                <div className="col-md-4" key={key}>
                  <label className="form-label">{key}</label>
                  <input
                    type="color"
                    className="form-control form-control-color w-100"
                    value={editConfig.theme?.[key] || '#000000'}
                    onChange={(e) => handleConfigChange(`theme.${key}`, e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control form-control-sm mt-1"
                    value={editConfig.theme?.[key] || ''}
                    onChange={(e) => handleConfigChange(`theme.${key}`, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logo & Title */}
        <section className="card shadow-sm mb-4">
          <div className="card-header fw-bold">Logo &amp; Title</div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Logo (upload or URL)</label>
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  style={{ maxWidth: '220px' }}
                  onChange={(e) => handleImageUpload(e, 'logo')}
                  disabled={!isSupabaseConfigured() || uploading === 'logo'}
                />
                {editConfig.logo && (
                  <img src={editConfig.logo} alt="Logo" style={{ height: '40px' }} />
                )}
                <input
                  type="url"
                  className="form-control"
                  placeholder="Or paste logo URL"
                  value={editConfig.logo || ''}
                  onChange={(e) => handleConfigChange('logo', e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Main Title</label>
              <input
                type="text"
                className="form-control"
                value={editConfig.title || ''}
                onChange={(e) => handleConfigChange('title', e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Subtitle</label>
              <input
                type="text"
                className="form-control"
                value={editConfig.subtitle || ''}
                onChange={(e) => handleConfigChange('subtitle', e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">CTA Button Text</label>
              <input
                type="text"
                className="form-control"
                value={editConfig.ctaButtonText || ''}
                onChange={(e) => handleConfigChange('ctaButtonText', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Instructor */}
        <section className="card shadow-sm mb-4">
          <div className="card-header fw-bold">Instructor</div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Instructor Image</label>
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  style={{ maxWidth: '220px' }}
                  onChange={(e) => handleImageUpload(e, 'instructor_image')}
                  disabled={!isSupabaseConfigured() || uploading === 'instructor_image'}
                />
                {editConfig.instructor?.image && (
                  <img
                    src={editConfig.instructor.image}
                    alt="Instructor"
                    className="rounded-circle"
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                )}
                <input
                  type="url"
                  className="form-control"
                  placeholder="Or image URL"
                  value={editConfig.instructor?.image || ''}
                  onChange={(e) => handleConfigChange('instructor.image', e.target.value)}
                />
              </div>
            </div>
            {['name', 'title', 'tagline', 'stats', 'rating', 'reviewText'].map((key) => (
              <div className="mb-3" key={key}>
                <label className="form-label">{key}</label>
                <input
                  type="text"
                  className="form-control"
                  value={editConfig.instructor?.[key] || ''}
                  onChange={(e) => handleConfigChange(`instructor.${key}`, e.target.value)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Featured logos */}
        <section className="card shadow-sm mb-4">
          <div className="card-header fw-bold">Featured Logos</div>
          <div className="card-body">
            {(editConfig.featuredLogos || []).map((url, i) => (
              <div key={i} className="d-flex gap-2 align-items-center mb-2">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  style={{ maxWidth: '200px' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    uploadImage(file, `featured_${i}`).then((u) => u && handleConfigChange('featuredLogos', [...(editConfig.featuredLogos || [])].map((v, j) => (j === i ? u : v))));
                  }}
                  disabled={!isSupabaseConfigured()}
                />
                <input
                  type="url"
                  className="form-control"
                  value={url}
                  onChange={(e) => {
                    const arr = [...(editConfig.featuredLogos || [])];
                    arr[i] = e.target.value;
                    handleConfigChange('featuredLogos', arr);
                  }}
                />
                <img src={url} alt="" style={{ height: '32px' }} />
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => addArrayItem('featuredLogos', '')}
            >
              + Add logo
            </button>
          </div>
        </section>

        {/* Bonuses product images */}
        <section className="card shadow-sm mb-4">
          <div className="card-header fw-bold">Bonus Product Images</div>
          <div className="card-body">
            <div className="mb-2">
              <label className="form-label">Bonuses title</label>
              <input
                type="text"
                className="form-control"
                value={editConfig.bonuses?.title || ''}
                onChange={(e) => handleConfigChange('bonuses.title', e.target.value)}
              />
            </div>
            {(editConfig.bonuses?.productImages || []).map((url, i) => (
              <div key={i} className="d-flex gap-2 align-items-center mb-2">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  style={{ maxWidth: '200px' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    uploadImage(file, `bonus_${i}`).then((u) => {
                      if (!u) return;
                      const arr = [...(editConfig.bonuses?.productImages || [])];
                      arr[i] = u;
                      handleConfigChange('bonuses.productImages', arr);
                    });
                  }}
                  disabled={!isSupabaseConfigured()}
                />
                <input
                  type="url"
                  className="form-control"
                  value={url}
                  onChange={(e) => {
                    const arr = [...(editConfig.bonuses?.productImages || [])];
                    arr[i] = e.target.value;
                    handleConfigChange('bonuses.productImages', arr);
                  }}
                />
                <img src={url} alt="" style={{ height: '40px', objectFit: 'cover' }} />
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => addArrayItem('bonuses.productImages', '')}
            >
              + Add bonus image
            </button>
          </div>
        </section>

        <div className="mb-4">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleSaveConfig}
            disabled={saving || !isSupabaseConfigured()}
          >
            {saving ? 'Saving...' : 'Save all config'}
          </button>
        </div>

        {/* Submissions */}
        <section className="card shadow-sm">
          <div className="card-header fw-bold d-flex justify-content-between align-items-center">
            <span>Form submissions</span>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-sm btn-outline-light" onClick={fetchSubmissions}>
                Refresh list
              </button>
              <button type="button" className="btn btn-sm btn-outline-light" onClick={fetchConfig}>
                Refresh config
              </button>
            </div>
          </div>
          <div className="card-body overflow-auto">
            {loadingSubs ? (
              <div className="text-center py-4">Loading...</div>
            ) : !isSupabaseConfigured() ? (
              <p className="text-muted mb-0">Configure Supabase to view submissions.</p>
            ) : submissions.length === 0 ? (
              <p className="text-muted mb-0">No submissions yet.</p>
            ) : (
              <table className="table table-striped table-hover mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((row, i) => (
                    <tr key={row.id}>
                      <td>{i + 1}</td>
                      <td>{row.name}</td>
                      <td>{row.email}</td>
                      <td>{row.phone}</td>
                      <td>{row.created_at ? new Date(row.created_at).toLocaleString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
