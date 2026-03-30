import React, { useEffect, useState, useCallback } from 'react';
import { Container, Table, Badge, Spinner, Alert, Card } from 'react-bootstrap';
import { 
  FaFileAlt, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaArrowLeft,
  FaHashtag,
  FaCalendarAlt,
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

  .lr-root {
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

  .lr-header {
    max-width: 1400px;
    margin: 0 auto 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .lr-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--cream);
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .lr-card {
    background: var(--navy-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(12px);
    overflow: hidden;
    max-width: 1400px;
    margin: 0 auto;
    box-shadow: 0 8px 40px rgba(0,0,0,0.4);
  }

  .lr-table {
    margin-bottom: 0;
    color: var(--text-primary);
    border-color: var(--border);
  }
  .lr-table thead th {
    background: rgba(139,92,246,0.1);
    color: var(--violet);
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 20px 15px;
    border-bottom: 2px solid var(--border);
  }
  .lr-table tbody td {
    padding: 18px 15px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
    font-size: 14px;
    color: var(--text-primary);
    background: transparent !important;
  }

  .lr-status {
    padding: 6px 14px;
    border-radius: 40px;
    font-size: 12px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .status-pending { background: rgba(245,166,35,0.1); color: var(--gold); border: 1px solid rgba(245,166,35,0.2); }
  .status-approved { background: rgba(52,217,160,0.1); color: var(--green); border: 1px solid rgba(52,217,160,0.2); }
  .status-rejected { background: rgba(240,96,106,0.1); color: var(--red); border: 1px solid rgba(240,96,106,0.2); }

  .lr-btn {
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
  .lr-btn-approve { background: rgba(52,217,160,0.1); color: var(--green); border-color: rgba(52,217,160,0.3); }
  .lr-btn-approve:hover { background: var(--green); color: #fff; }
  
  .lr-btn-reject { background: rgba(240,96,106,0.1); color: var(--red); border-color: rgba(240,96,106,0.3); }
  .lr-btn-reject:hover { background: var(--red); color: #fff; }

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
    .lr-header { flex-direction: column; gap: 20px; align-items: flex-start; }
    .lr-title { font-size: 26px; }
  }
`;

const WardenLeave = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = 'https://hostel-management-backend-eo9s.onrender.com/api';

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/leaves`);
      if (!res.ok) throw new Error('Failed to fetch leave requests');
      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.leaves)
          ? data.leaves
          : [];
      setLeaves(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error('Fetch leaves error:', err);
      setError(err.message || 'Error fetching leave requests');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/leaves/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update leave status');
      const updatedLeave = await res.json();
      setLeaves(prev => prev.map(l => l._id === updatedLeave._id ? updatedLeave : l));
    } catch (err) {
      console.error('Update status error:', err);
      alert(err.message || 'Failed to update leave status');
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'pending') return <span className="lr-status status-pending"><FaClock size={10} /> Pending</span>;
    if (s === 'approved') return <span className="lr-status status-approved"><FaCheckCircle size={10} /> Approved</span>;
    if (s === 'rejected') return <span className="lr-status status-rejected"><FaTimesCircle size={10} /> Rejected</span>;
    return <span className="lr-status status-pending">{status || 'Unknown'}</span>;
  };

  return (
    <div className="lr-root">
      <style>{styles}</style>
      
      <div className="lr-header">
        <h1 className="lr-title">
          <FaFileAlt className="text-violet" /> Leave Requests
        </h1>
        <button className="back-btn" onClick={() => navigate('/warden/dashboard')}>
          <FaArrowLeft /> Dashboard
        </button>
      </div>

      <Container fluid>
        {error && <Alert variant="danger" className="mx-auto" style={{ maxWidth: 1400, background: 'rgba(240,96,106,0.1)', border: '1px solid var(--red)', color: 'var(--red)' }}>{error}</Alert>}
        
        <Card className="lr-card">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <div className="mt-3 text-muted">Fetching leave requests...</div>
            </div>
          ) : leaves.length === 0 ? (
            <div className="empty-state">
              <FaRegFileAlt size={50} className="mb-3 opacity-20" />
              <h4>No leave requests found</h4>
              <p>Looks like everyone is on campus.</p>
            </div>
          ) : (
            <Table responsive className="lr-table">
              <thead>
                <tr>
                  <th><FaHashtag size={12} className="me-2" /> Student Roll</th>
                  <th>Type</th>
                  <th style={{ minWidth: 200 }}>Reason</th>
                  <th><FaCalendarAlt size={12} className="me-2" /> From</th>
                  <th><FaCalendarAlt size={12} className="me-2" /> To</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map(leave => (
                  <tr key={leave._id}>
                    <td><code style={{ color: 'var(--cyan)' }}>{leave.rollno}</code></td>
                    <td><Badge bg="dark" className="border border-secondary">{leave.leaveType}</Badge></td>
                    <td className="text-cream" style={{ fontSize: 14, minWidth: '300px', lineHeight: '1.5' }}>{leave.reason}</td>
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{getStatusBadge(leave.status)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        {leave.status.toLowerCase() === 'pending' ? (
                          <>
                            <button className="lr-btn lr-btn-approve" onClick={() => updateStatus(leave._id, 'approved')}>
                              <FaCheckCircle /> Approve
                            </button>
                            <button className="lr-btn lr-btn-reject" onClick={() => updateStatus(leave._id, 'rejected')}>
                              <FaTimesCircle /> Reject
                            </button>
                          </>
                        ) : (
                          <span className={`small fw-bold ${leave.status.toLowerCase() === 'approved' ? 'text-green' : 'text-red'}`}>
                            {leave.status.toUpperCase()}
                          </span>
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

export default WardenLeave;
