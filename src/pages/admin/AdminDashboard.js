import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const SUBMISSIONS_TABLE = 'registrations';
const RECENT_LIMIT = 5;

export function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    const fetch = async () => {
      const { count } = await supabase
        .from(SUBMISSIONS_TABLE)
        .select('*', { count: 'exact', head: true });
      setTotal(count ?? 0);

      const { data: recent } = await supabase
        .from(SUBMISSIONS_TABLE)
        .select('id, name, email, phone, created_at')
        .order('created_at', { ascending: false })
        .limit(RECENT_LIMIT);
      setSubmissions(recent || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (!isSupabaseConfigured()) {
    return (
      <div className="alert alert-warning">
        Add <code>REACT_APP_SUPABASE_URL</code> and <code>REACT_APP_SUPABASE_ANON_KEY</code> in <code>.env</code>.
      </div>
    );
  }

  return (
    <>
      <h1 className="h4 fw-bold mb-4">Dashboard</h1>
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Total Registrations</p>
              {loading ? (
                <div className="placeholder-glow"><span className="placeholder col-4"></span></div>
              ) : (
                <p className="h3 mb-0 fw-bold">{total}</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Landing page</p>
              <Link to="/" className="btn btn-sm btn-outline-primary" target="_blank" rel="noopener noreferrer">
                View site →
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Manage content</p>
              <Link to="/admin/settings" className="btn btn-sm btn-outline-primary">
                Site Settings →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h2 className="h6 mb-0 fw-bold">Recent submissions</h2>
          <Link to="/admin/submissions" className="btn btn-sm btn-primary">View all</Link>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="p-4 text-center text-muted">Loading...</div>
          ) : submissions.length === 0 ? (
            <div className="p-4 text-muted">No submissions yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((row) => (
                    <tr key={row.id}>
                      <td>{row.name}</td>
                      <td>{row.email}</td>
                      <td>{row.phone}</td>
                      <td className="text-muted small">{row.created_at ? new Date(row.created_at).toLocaleString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
