import React, { useEffect, useState, useCallback } from 'react';
import { Container, Table, Badge, Spinner, Alert, Card } from 'react-bootstrap';
import { 
  FaExclamationCircle, 
  FaClock, 
  FaCheckCircle, 
  FaTools, 
  FaArrowLeft,
  FaUser,
  FaHashtag,
  FaBuilding,
  FaRegFileAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────
   PREMIUM UI — INLINE STYLES
   ───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

  :root {
    --navy:       #0a0f1e;
    --navy-mid:   #111827;
    --navy-card:  rgba(15, 20, 40, 0.72);
    --gold:       #f0c060;
    --cream:      #f5f0ff;
    --text-primary: #eeeaf8;
    --text-muted:   #9b9ec8;
    --border:       rgba(160,130,255,0.18);
    --violet: #a78bfa;
    --pink:   #f472b6;
    --cyan:   #38bdf8;
    --red:    #f0606a;
    --green:  #34d9a0;
    --radius: 20px;
  }

  .cp-root {
    min-height: 100vh;
    background: 
      radial-gradient(ellipse 70% 55% at 0% 0%, #1a0533 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 100% 0%, #0c1e4a 0%, transparent 50%),
      radial-gradient(ellipse 75% 60% at 50% 60%, #0f2840 0%, transparent 60%),
      #080d1a;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    padding: 40px 20px;
  }

  .cp-header {
    max-width: 1400px;
    margin: 0 auto 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cp-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--cream);
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .cp-card {
    background: var(--navy-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(12px);
    overflow: hidden;
    max-width: 1400px;
    margin: 0 auto;
    box-shadow: 0 8px 40px rgba(0,0,0,0.4);
  }

  .cp-table {
    margin-bottom: 0;
    color: var(--text-primary);
    border-color: var(--border);
  }
  .cp-table thead th {
    background: rgba(139,92,246,0.1);
    color: var(--violet);
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 20px 15px;
    border-bottom: 2px solid var(--border);
  }
  .cp-table tbody td {
    padding: 18px 15px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
    font-size: 14px;
    color: var(--text-primary);
    background: transparent !important;
  }

  .cp-status {
    padding: 6px 14px;
    border-radius: 40px;
    font-size: 12px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .status-pending { background: rgba(245,166,35,0.1); color: var(--gold); border: 1px solid rgba(245,166,35,0.2); }
  .status-progress { background: rgba(56,189,248,0.1); color: var(--cyan); border: 1px solid rgba(56,189,248,0.2); }
  .status-resolved { background: rgba(52,217,160,0.1); color: var(--green); border: 1px solid rgba(52,217,160,0.2); }

  .cp-btn {
    padding: 8px 16px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    border: 1px solid transparent;
  }
  .cp-btn-progress { background: rgba(167,139,250,0.1); color: var(--violet); border-color: rgba(167,139,250,0.3); }
  .cp-btn-progress:hover { background: var(--violet); color: #fff; }
  
  .cp-btn-resolve { background: rgba(52,217,160,0.1); color: var(--green); border-color: rgba(52,217,160,0.3); }
  .cp-btn-resolve:hover { background: var(--green); color: #fff; }

  .back-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 8px 16px;
    border-radius: 10px;
    font-size: 14px;
    transition: 0.2s;
  }
  .back-btn:hover { background: rgba(255,255,255,0.1); color: var(--cream); }

  .empty-state {
    padding: 80px 20px;
    text-align: center;
    color: var(--text-muted);
  }

  @media (max-width: 992px) {
    .cp-header { flex-direction: column; gap: 20px; align-items: flex-start; }
    .cp-title { font-size: 26px; }
  }
`;

const Complaints = () => {
  const navigate = useNavigate();
  const API_BASE = 'https://hostel-management-backend-eo9s.onrender.com/api';
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/complaints/all`);
      if (!res.ok) throw new Error('Failed to fetch complaints');
      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.complaints)
          ? data.complaints
          : [];
      setComplaints(list);
    } catch (err) {
      console.error('Fetch complaints error:', err);
      setError(err.message || 'Error fetching complaints');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/complaints/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updated = await res.json();
      setComplaints(prev => prev.map(c => (c._id === updated._id ? updated : c)));
    } catch (err) {
      console.error('Update status error:', err);
      setError(err.message || 'Error updating status');
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || 'pending').toLowerCase();
    if (s === 'pending') return <span className="cp-status status-pending"><FaClock size={10} /> Pending</span>;
    if (s === 'in-progress') return <span className="cp-status status-progress"><FaTools size={10} /> In Progress</span>;
    if (s === 'resolved') return <span className="cp-status status-resolved"><FaCheckCircle size={10} /> Resolved</span>;
    return <span className="cp-status status-pending">{status}</span>;
  };

  return (
    <div className="cp-root">
      <style>{styles}</style>
      
      <div className="cp-header">
        <h1 className="cp-title">
          <FaExclamationCircle className="text-violet" /> Student Complaints
        </h1>
        <button className="back-btn" onClick={() => navigate('/warden/dashboard')}>
          <FaArrowLeft /> Dashboard
        </button>
      </div>

      <Container fluid>
        {error && <Alert variant="danger" className="mx-auto" style={{ maxWidth: 1400, background: 'rgba(240,96,106,0.1)', border: '1px solid var(--red)', color: 'var(--red)' }}>{error}</Alert>}
        
        <Card className="cp-card">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <div className="mt-3 text-muted">Fetching complaints...</div>
            </div>
          ) : complaints.length === 0 ? (
            <div className="empty-state">
              <FaRegFileAlt size={50} className="mb-3 opacity-20" />
              <h4>No complaints found</h4>
              <p>Everything seems to be running smoothly.</p>
            </div>
          ) : (
            <Table responsive className="cp-table">
              <thead>
                <tr>
                  <th><FaUser size={12} className="me-2" /> Student</th>
                  <th><FaHashtag size={12} className="me-2" /> Roll No</th>
                  <th><FaBuilding size={12} className="me-2" /> Room</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th style={{ minWidth: 200 }}>Description</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c._id}>
                    <td><div className="fw-bold">{c.name}</div></td>
                    <td><code style={{ color: 'var(--cyan)' }}>{c.rollno}</code></td>
                    <td>{c.roomNo}</td>
                    <td><Badge bg="dark" className="border border-secondary">{c.category}</Badge></td>
                    <td className="fw-medium text-cream">{c.subject}</td>
                    <td className="text-cream" style={{ fontSize: 14, minWidth: '300px', lineHeight: '1.5' }}>{c.description}</td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td>{getStatusBadge(c.status)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        {c.status.toLowerCase() === 'pending' && (
                          <>
                            <button className="cp-btn cp-btn-progress" onClick={() => updateStatus(c._id, 'in-progress')}>
                              <FaTools /> Start
                            </button>
                            <button className="cp-btn cp-btn-resolve" onClick={() => updateStatus(c._id, 'resolved')}>
                              <FaCheckCircle /> Resolve
                            </button>
                          </>
                        )}
                        {c.status.toLowerCase() === 'in-progress' && (
                          <button className="cp-btn cp-btn-resolve" onClick={() => updateStatus(c._id, 'resolved')}>
                            <FaCheckCircle /> Resolve
                          </button>
                        )}
                        {c.status.toLowerCase() === 'resolved' && (
                          <span className="text-green small fw-bold">COMPLETED</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default Complaints;
