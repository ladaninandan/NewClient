import React, { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const SUBMISSIONS_TABLE = 'registrations';

export function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from(SUBMISSIONS_TABLE)
      .select('id, name, email, phone, created_at')
      .order('created_at', { ascending: false });
    if (!error) setSubmissions(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  if (!isSupabaseConfigured()) {
    return (
      <div className="alert alert-warning">
        Add <code>REACT_APP_SUPABASE_URL</code> and <code>REACT_APP_SUPABASE_ANON_KEY</code> in <code>.env</code>.
      </div>
    );
  }

  return (
    <>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-3 mb-md-4">
        <h1 className="h4 h5-md fw-bold mb-0">Form submissions</h1>
        <button type="button" className="btn btn-primary btn-sm" onClick={fetchSubmissions}>
          Refresh
        </button>
      </div>
      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="card-body p-0">
          {loading ? (
            <div className="p-4 text-center text-muted small">Loading...</div>
          ) : submissions.length === 0 ? (
            <div className="p-4 text-muted small">No submissions yet.</div>
          ) : (
            <>
              <div className="table-responsive d-none d-md-block">
                <table className="table table-striped table-hover mb-0 table-sm">
                  <thead className="table-dark">
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
                        <td className="text-break">{row.name}</td>
                        <td className="text-break small">{row.email}</td>
                        <td className="small">{row.phone}</td>
                        <td className="text-muted small">{row.created_at ? new Date(row.created_at).toLocaleString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-md-none p-2">
                {submissions.map((row, i) => (
                  <div key={row.id} className="card mb-2 border shadow-sm">
                    <div className="card-body py-2 px-3 small">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="fw-bold text-muted">#{i + 1}</span>
                        <span className="text-muted">{row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'}</span>
                      </div>
                      <div className="mb-1"><span className="text-muted">Name:</span> {row.name}</div>
                      <div className="mb-1 text-break"><span className="text-muted">Email:</span> {row.email}</div>
                      <div><span className="text-muted">Phone:</span> {row.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
