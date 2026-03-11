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
        const isObj = cur[p] != null && typeof cur[p] === 'object' && !Array.isArray(cur[p]);
        cur[p] = isObj ? cur[p] : {};
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

  return (
    <>
      <div className="d-flex flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-3 mb-md-4">
        <h1 className="h4 h5-md fw-bold mb-0">Site settings</h1>
        <button
          type="button"
          className="btn btn-primary btn-sm"
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
        <div className="card-header fw-bold">Theme (colors)</div>
        <div className="card-body">
          <p className="small text-muted mb-3">Control the landing page colors. Primary = main brand (nav button, hero background). Accent = CTAs and highlights.</p>
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

      <section className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Landing page content (RRTCS / Business Clarity)</div>
        <div className="card-body">
          <p className="small text-muted mb-3">Edit all content for the landing page. Changes appear after you click &quot;Save all&quot;.</p>
          <div className="row g-3">
            <div className="col-12"><h6 className="border-bottom pb-1">Nav</h6></div>
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
            <div className="col-12"><h6 className="border-bottom pb-1 mt-2">Hero</h6></div>
            {['badge', 'headline', 'headlineHighlight', 'subtext', 'ctaText', 'slotNote'].map((k) => (
              <div className="col-12" key={k}>
                <label className="form-label small">Hero {k}</label>
                <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.hero?.[k] ?? ''} onChange={(e) => handleConfigChange(`strategyLayout.hero.${k}`, e.target.value)} />
              </div>
            ))}
            <div className="col-12"><h6 className="border-bottom pb-1 mt-2">Offer card (hero right)</h6></div>
            <div className="col-12">
              <label className="form-label small">Price badge</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.offerCard?.price ?? ''} onChange={(e) => handleConfigChange('strategyLayout.offerCard.price', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Offer items (one per line: title | desc)</label>
              <textarea className="form-control form-control-sm" rows={4} value={(editConfig.strategyLayout?.offerCard?.items || []).map((i) => `${i.title}|${i.desc || ''}`).join('\n')} onChange={(e) => handleConfigChange('strategyLayout.offerCard.items', e.target.value.split('\n').filter(Boolean).map((line) => { const [title, ...rest] = line.split('|'); return { title: (title || '').trim(), desc: rest.join('|').trim() }; }))} />
            </div>
            <div className="col-12"><h6 className="border-bottom pb-1 mt-2">Why scale (3 cards)</h6></div>
            <div className="col-12">
              <label className="form-label small">Section title</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.whyScale?.title ?? ''} onChange={(e) => handleConfigChange('strategyLayout.whyScale.title', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Cards (one per line: icon|title|desc)</label>
              <textarea className="form-control form-control-sm" rows={4} value={(editConfig.strategyLayout?.whyScale?.cards || []).map((c) => `${c.icon}|${c.title}|${c.desc || ''}`).join('\n')} onChange={(e) => handleConfigChange('strategyLayout.whyScale.cards', e.target.value.split('\n').filter(Boolean).map((line) => { const p = line.split('|'); return { icon: p[0] || 'help', title: p[1] || '', desc: p[2] || '' }; }))} />
            </div>
            <div className="col-12"><h6 className="border-bottom pb-1 mt-2">Founder trap</h6></div>
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
            <div className="col-12"><h6 className="border-bottom pb-1 mt-2">Coach (Meet Rahul)</h6></div>
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
            <div className="col-12"><h6 className="border-bottom pb-1 mt-2">What you will learn</h6></div>
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
            <div className="col-12"><h6 className="border-bottom pb-1 mt-2">Founder model</h6></div>
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
            <div className="col-12"><h6 className="border-bottom pb-1 mt-2">Why different</h6></div>
            <div className="col-12">
              <label className="form-label small">Title</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.whyDifferent?.title ?? ''} onChange={(e) => handleConfigChange('strategyLayout.whyDifferent.title', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Quote text</label>
              <textarea className="form-control form-control-sm" rows={3} value={editConfig.strategyLayout?.whyDifferent?.quote ?? ''} onChange={(e) => handleConfigChange('strategyLayout.whyDifferent.quote', e.target.value)} />
            </div>
            <div className="col-12"><h6 className="border-bottom pb-1 mt-2">For / Not for</h6></div>
            <div className="col-12">
              <label className="form-label small">For title</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.forNotFor?.forTitle ?? ''} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.forTitle', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">For items (one per line)</label>
              <textarea className="form-control form-control-sm" rows={3} value={(editConfig.strategyLayout?.forNotFor?.forItems || []).join('\n')} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.forItems', e.target.value.split('\n').filter(Boolean))} />
            </div>
            <div className="col-12">
              <label className="form-label small">Not for title</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.forNotFor?.notForTitle ?? ''} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.notForTitle', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Not for items (one per line)</label>
              <textarea className="form-control form-control-sm" rows={3} value={(editConfig.strategyLayout?.forNotFor?.notForItems || []).join('\n')} onChange={(e) => handleConfigChange('strategyLayout.forNotFor.notForItems', e.target.value.split('\n').filter(Boolean))} />
            </div>
            <div className="col-12"><h6 className="border-bottom pb-1 mt-2">FAQ</h6></div>
            <div className="col-12">
              <label className="form-label small">FAQ title</label>
              <input type="text" className="form-control form-control-sm" value={editConfig.strategyLayout?.faq?.title ?? ''} onChange={(e) => handleConfigChange('strategyLayout.faq.title', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">FAQ items (Q and A: one block per pair, separate with ---)</label>
              <textarea className="form-control form-control-sm" rows={8} value={(editConfig.strategyLayout?.faq?.items || []).map((i) => `${i.q}\n---\n${i.a}`).join('\n\n')} onChange={(e) => handleConfigChange('strategyLayout.faq.items', e.target.value.split('\n\n').filter(Boolean).map((block) => { const [q, a] = block.split('\n---\n'); return { q: (q || '').trim(), a: (a || '').trim() }; }))} />
            </div>
            <div className="col-12"><h6 className="border-bottom pb-1 mt-2">Pricing</h6></div>
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
            <div className="col-12"><h6 className="border-bottom pb-1 mt-2">Footer</h6></div>
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
    </>
  );
}
