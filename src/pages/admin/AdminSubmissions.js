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
      .select('id, name, email, phone, created_at, payment_id')
      .order('created_at', { ascending: false });
    if (!error) setSubmissions(data || []);
    setLoading(false);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      // .select() ensures we get the deleted row back. If RLS blocks it, data will be empty []
      const { data, error } = await supabase
        .from(SUBMISSIONS_TABLE)
        .delete()
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('Supabase Security Rules (RLS) blocked the delete. You must enable "Delete" permissions in your Supabase dashboard for the registrations table.');
      }
      
      setSubmissions(submissions.filter(s => s.id !== id));
    } catch (err) {
      alert('Error deleting submission: ' + err.message);
    }
  };

  const handleExportCsv = () => {
    if (!submissions || submissions.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Date'];
    const csvRows = [headers.join(',')];

    submissions.forEach((row, index) => {
      const id = index + 1;
      const name = `"${(row.name || '').replace(/"/g, '""')}"`;
      const email = `"${(row.email || '').replace(/"/g, '""')}"`;
      const phone = `"${(row.phone || '').replace(/"/g, '""')}"`;
      const status = row.payment_id ? '"Paid"' : '"Pending"';
      const date = `"${row.created_at ? new Date(row.created_at).toLocaleString() : '-'}"`;

      csvRows.push([id, name, email, phone, status, date].join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `submissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        <div>
          <button type="button" className="btn btn-outline-success btn-sm me-2" onClick={handleExportCsv}>
            <span className="material-symbols-outlined text-sm align-middle me-1" style={{ fontSize: '16px' }}>download</span>
            Export CSV
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={fetchSubmissions}>
            <span className="material-symbols-outlined text-sm align-middle me-1" style={{ fontSize: '16px' }}>refresh</span>
            Refresh
          </button>
        </div>
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
                      <th>Status</th>
                      <th className="text-end">Actions</th>
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
                        <td>
                          {row.payment_id ? (
                            <span className="badge bg-success">Paid</span>
                          ) : (
                            <span className="badge bg-warning text-dark">Pending</span>
                          )}
                        </td>
                        <td className="text-end">
                          <button 
                            className="btn btn-sm btn-outline-danger py-0 px-2" 
                            onClick={() => handleDelete(row.id)}
                            title="Delete User"
                          >
                            <span className="material-symbols-outlined text-sm" style={{ fontSize: '16px', verticalAlign: 'middle' }}>delete</span>
                          </button>
                        </td>
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
                        <div>
                          <span className="text-muted me-2">{row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'}</span>
                          <button 
                            className="btn btn-sm btn-outline-danger py-0 px-1" 
                            onClick={() => handleDelete(row.id)}
                            title="Delete User"
                          >
                            <span className="material-symbols-outlined text-sm" style={{ fontSize: '14px', verticalAlign: 'middle' }}>delete</span>
                          </button>
                        </div>
                      </div>
                      <div className="mb-1">
                        <span className="text-muted">Status:</span>{' '}
                        {row.payment_id ? (
                          <span className="badge bg-success">Paid</span>
                        ) : (
                          <span className="badge bg-warning text-dark">Pending</span>
                        )}
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
