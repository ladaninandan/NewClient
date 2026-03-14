import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const SUBMISSIONS_TABLE = 'registrations';

// Email: standard format (local@domain.tld)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Indian mobile: 10 digits, optional +91 or 0 prefix
function validateIndianPhone(value) {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) return { valid: true, normalized: digits };
  if (digits.length === 11 && (digits.startsWith('0') || digits.startsWith('91'))) {
    const ten = digits.slice(-10);
    if (/^[6-9]/.test(ten)) return { valid: true, normalized: ten };
  }
  if (digits.length === 12 && digits.startsWith('91') && /^91[6-9]/.test(digits)) {
    return { valid: true, normalized: digits.slice(2) };
  }
  return { valid: false, normalized: '' };
}

function validateEmail(email) {
  const trimmed = (email || '').trim().toLowerCase();
  if (!trimmed) return { valid: false, msg: 'Email is required.' };
  if (!EMAIL_REGEX.test(trimmed)) return { valid: false, msg: 'Please enter a valid email address.' };
  return { valid: true, normalized: trimmed };
}

export function StrategyForm({ embedded = false }) {
  const idSuffix = embedded ? '-popup' : '';
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState('idle');
  const [modal, setModal] = useState(null); // { type: 'success' | 'error', title, message }

  const [fieldErrors, setFieldErrors] = useState({ email: '', phone: '' });
  const [showTitleBlack, setShowTitleBlack] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowTitleBlack(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') setFieldErrors((prev) => ({ ...prev, email: '' }));
    if (name === 'phone') setFieldErrors((prev) => ({ ...prev, phone: '' }));
  };

  const closeModal = () => setModal(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({ email: '', phone: '' });

    const name = form.name.trim();
    const emailInput = form.email.trim();
    const phoneInput = form.phone.trim();

    if (!name) {
      setModal({ type: 'error', title: 'Invalid input', message: 'Please enter your full name.' });
      return;
    }

    const emailResult = validateEmail(emailInput);
    if (!emailResult.valid) {
      setFieldErrors((prev) => ({ ...prev, email: emailResult.msg }));
      setModal({ type: 'error', title: 'Invalid email', message: emailResult.msg });
      return;
    }

    const phoneResult = validateIndianPhone(phoneInput);
    if (!phoneResult.valid) {
      const phoneMsg = 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
      setFieldErrors((prev) => ({ ...prev, phone: phoneMsg }));
      setModal({ type: 'error', title: 'Invalid phone', message: phoneMsg });
      return;
    }

    if (!isSupabaseConfigured()) {
      setModal({ type: 'error', title: 'Not configured', message: 'Registration is not configured.' });
      return;
    }

    setStatus('loading');

    try {
      const { data: existing } = await supabase
        .from(SUBMISSIONS_TABLE)
        .select('id')
        .ilike('email', emailResult.normalized)
        .limit(1)
        .maybeSingle();

      if (existing) {
        setStatus('idle');
        setModal({
          type: 'error',
          title: 'Already registered',
          message: 'This email is already registered. Use a different email or contact us if you need to update your booking.',
        });
        return;
      }

      const { error } = await supabase.from(SUBMISSIONS_TABLE).insert([
        {
          name,
          email: emailResult.normalized,
          phone: phoneResult.normalized,
        },
      ]);

      if (error) throw error;

      setStatus('success');
      setForm({ name: '', email: '', phone: '' });
      setModal({
        type: 'success',
        title: 'Spot reserved',
        message: 'Thank you! Your spot is reserved. We’ll confirm your session details via email.',
      });
    } catch (err) {
      setStatus('idle');
      const isDuplicate = err.code === '23505' || (err.message && /unique|duplicate|already exists/i.test(err.message));
      setModal({
        type: 'error',
        title: isDuplicate ? 'Already registered' : 'Something went wrong',
        message: isDuplicate
          ? 'This email is already registered. Use a different email or contact us if you need to update your booking.'
          : (err.message || 'Could not submit. Please try again.'),
      });
    }
  };

  const Wrapper = embedded ? 'div' : 'section';
  const wrapperProps = embedded
    ? { className: 'max-w-md' }
    : { id: 'register-form', className: 'py-12 sm:py-16 px-4 sm:px-6 bg-slate-100 dark:bg-slate-900' };

  return (
    <Wrapper {...wrapperProps}>
      <div className={embedded ? '' : 'max-w-md mx-auto'}>
        <div className={`${!embedded ? 'scroll-reveal ' : ''}bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden`}>
          <div className="p-4 sm:p-5 lg:p-10">
            {!embedded && ( 
            <div className="text-center mb-6 sm:mb-8">
              <h2 className={`text-xl sm:text-2xl font-black mb-2 transition-colors duration-500 text-black ${showTitleBlack ? 'text-black' : 'text-slate-900 dark:text-white'}`}>
               Book your 1:1 business consultation
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
                Fill in your details and we’ll confirm your session.
              </p>
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label htmlFor={`form-name${idSuffix}`} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full name
                </label>
                <div className="form-input-wrap bg-white">
                  <span className="form-icon material-symbols-outlined text-xl">person</span>
                  <input
                    id={`form-name${idSuffix}`}
                    type="text"
                    name="name"
                    placeholder="e.g. Rajesh Kumar"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="text-slate-900 dark:text-white text-black"
                    autoComplete="name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`form-email${idSuffix}`} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email
                </label>
                <div className={`form-input-wrap bg-white ${fieldErrors.email ? 'border-red-500 dark:border-red-500' : ''}`}>
                  <span className="form-icon material-symbols-outlined text-xl">mail</span>
                  <input
                    id={`form-email${idSuffix}`}
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="text-slate-900 dark:text-white text-black"
                    autoComplete="email"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor={`form-phone${idSuffix}`} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Phone
                </label>
                <div className={`form-input-wrap bg-white ${fieldErrors.phone ? 'border-red-500 dark:border-red-500' : ''}`}>
                  <span className="form-icon material-symbols-outlined text-xl">phone</span>
                  <input
                    id={`form-phone${idSuffix}`}
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="text-slate-900 dark:text-white text-black"
                    autoComplete="tel"
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.phone}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-xl h-12 sm:h-14 text-white text-base sm:text-lg font-black disabled:opacity-70 btn-hover flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--theme-primary)' }}
              >
                {status === 'loading' ? (
                  <>
                    <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">event_available</span>
                    Reserve My Spot
                  </>
                )}
              </button>
            </form>

            <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
              Your information is secure and will not be shared.
            </p>
          </div>
        </div>
      </div>

      {/* Submit result modal - higher z when embedded so it appears above popup */}
      {modal && (
        <div
          className={`fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm ${embedded ? 'z-[110]' : 'z-[100]'}`}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div
                className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
                  modal.type === 'success'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                }`}
              >
                <span className="material-symbols-outlined text-3xl">
                  {modal.type === 'success' ? 'check_circle' : 'error'}
                </span>
              </div>
              <h3 id="modal-title" className="text-xl font-black text-slate-900 dark:text-white mb-2">
                {modal.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-6">
                {modal.message}
              </p>
              <button
                type="button"
                onClick={closeModal}
                className="w-full py-3 px-4 rounded-xl font-bold text-white btn-hover btn-blink"
                style={{ backgroundColor: 'var(--theme-primary)' }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
}
