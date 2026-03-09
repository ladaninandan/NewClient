import React, { useState } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const SUBMISSIONS_TABLE = 'registrations';

export function RegistrationForm() {
  const { config } = useConfig();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setStatus('error');
      setMessage('Please fill in all fields.');
      return;
    }

    if (!isSupabaseConfigured()) {
      setStatus('error');
      setMessage('Registration is not configured. Please add Supabase credentials.');
      return;
    }

    try {
      const { error } = await supabase.from(SUBMISSIONS_TABLE).insert([
        {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        },
      ]);
      if (error) throw error;
      setStatus('success');
      setMessage('Thank you! Your registration was successful.');
      setForm({ name: '', email: '', phone: '' });
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="register-form" className="py-5">
      <div className="container">
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: '480px' }}>
          <h2 className="h4 fw-bold text-center mb-4">Register Now</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control form-control-lg rounded-3"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control form-control-lg rounded-3"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="form-control form-control-lg rounded-3"
                placeholder="Your phone number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-lg w-100 text-white border-0 rounded-3"
              style={{ backgroundColor: 'var(--bs-primary)' }}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Submitting...' : config.ctaButtonText}
            </button>
            {message && (
              <div
                className={`mt-3 small ${status === 'success' ? 'text-success' : 'text-danger'}`}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
