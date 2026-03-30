import React, { useEffect, useState, useCallback } from 'react';
import { Container, Table, Spinner, Alert, Card } from 'react-bootstrap';
import { 
  FaRunning, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaArrowLeft,
  FaUser,
  FaHashtag,
  FaMapMarkerAlt,
  FaRegFileAlt,
  FaCalendarAlt
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

  .op-root {
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

  .op-header {
    max-width: 1400px;
    margin: 0 auto 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .op-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--cream);
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .op-card {
    background: var(--navy-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(12px);
    overflow: hidden;
    max-width: 1400px;
    margin: 0 auto;
    box-shadow: 0 8px 40px rgba(0,0,0,0.4);
  }

  .op-table {
    margin-bottom: 0;
    color: var(--text-primary);
    border-color: var(--border);
  }
  .op-table thead th {
    background: rgba(139,92,246,0.1);
    color: var(--violet);
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 20px 15px;
    border-bottom: 2px solid var(--border);
  }
  .op-table tbody td {
    padding: 18px 15px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
    font-size: 14px;
    color: var(--text-primary);
    background: transparent !important;
  }

  .op-status {
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

  .op-btn {
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
  .op-btn-approve { background: rgba(52,217,160,0.1); color: var(--green); border-color: rgba(52,217,160,0.3); }
  .op-btn-approve:hover { background: var(--green); color: #fff; }
  
  .op-btn-reject { background: rgba(240,96,106,0.1); color: var(--red); border-color: rgba(240,96,106,0.3); }
  .op-btn-reject:hover { background: var(--red); color: #fff; }

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
    .op-header { flex-direction: column; gap: 20px; align-items: flex-start; }
    .op-title { font-size: 26px; }
  }
`;

const WardenOutpass = () => {
  const navigate = useNavigate();
  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = 'https://hostel-management-backend-eo9s.onrender.com/api';

  const fetchOutpasses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/outpasses`);
      if (!res.ok) throw new Error('Failed to fetch outpasses');
      const data = await res.json();
      setOutpasses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error fetching outpasses');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => { fetchOutpasses(); }, [fetchOutpasses]);

  const handleStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/outpasses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updated = await res.json();
      setOutpasses(prev => prev.map(o => o._id === updated._id ? updated : o));
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || 'Pending').toLowerCase();
    if (s === 'pending') return <span className="op-status status-pending"><FaClock size={10} /> Pending</span>;
    if (s === 'approved') return <span className="op-status status-approved"><FaCheckCircle size={10} /> Approved</span>;
    if (s === 'rejected') return <span className="op-status status-rejected"><FaTimesCircle size={10} /> Rejected</span>;
    return <span className="op-status status-pending">{status}</span>;
  };

  return (
    <div className="op-root">
      <style>{styles}</style>
      
      <div className="op-header">
        <h1 className="op-title">
          <FaRunning className="text-violet" /> Outpass Requests
        </h1>
        <button className="back-btn" onClick={() => navigate('/warden/dashboard')}>
          <FaArrowLeft /> Dashboard
        </button>
      </div>

      <Container fluid>
        {error && <Alert variant="danger" className="mx-auto" style={{ maxWidth: 1400, background: 'rgba(240,96,106,0.1)', border: '1px solid var(--red)', color: 'var(--red)' }}>{error}</Alert>}
        
        <Card className="op-card">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <div className="mt-3 text-muted">Fetching outpasses...</div>
            </div>
          ) : outpasses.length === 0 ? (
            <div className="empty-state">
              <FaRegFileAlt size={50} className="mb-3 opacity-20" />
              <h4>No outpass requests found</h4>
              <p>Everything is quiet in the hostel.</p>
            </div>
          ) : (
            <Table responsive className="op-table">
              <thead>
                <tr>
                  <th><FaUser size={12} className="me-2" /> Student</th>
                  <th><FaHashtag size={12} className="me-2" /> Roll No</th>
                  <th><FaMapMarkerAlt size={12} className="me-2" /> Destination</th>
                  <th style={{ minWidth: 200 }}>Purpose</th>
                  <th><FaCalendarAlt size={12} className="me-2" /> Departure</th>
                  <th><FaCalendarAlt size={12} className="me-2" /> Return</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {outpasses.map(o => (
                  <tr key={o._id}>
                    <td><div className="fw-bold">{o.studentName}</div></td>
                    <td><code style={{ color: 'var(--cyan)' }}>{o.rollNo}</code></td>
                    <td className="text-cream">{o.destination}</td>
                    <td className="text-cream" style={{ fontSize: 14, lineHeight: '1.5' }}>{o.purpose}</td>
                    <td><div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{new Date(o.departureTime).toLocaleDateString()}<br/><span style={{ color: 'var(--violet)', fontWeight: 600 }}>{new Date(o.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div></td>
                    <td><div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{new Date(o.returnTime).toLocaleDateString()}<br/><span style={{ color: 'var(--violet)', fontWeight: 600 }}>{new Date(o.returnTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div></td>
                    <td>{getStatusBadge(o.status)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        {o.status === 'Pending' ? (
                          <>
                            <button className="op-btn op-btn-approve" onClick={() => handleStatus(o._id, 'Approved')}>
                              <FaCheckCircle /> Approve
                            </button>
                            <button className="op-btn op-btn-reject" onClick={() => handleStatus(o._id, 'Rejected')}>
                              <FaTimesCircle /> Reject
                            </button>
                          </>
                        ) : (
                          <span className={`small fw-bold ${o.status === 'Approved' ? 'text-green' : 'text-red'}`}>
                            {o.status.toUpperCase()}
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

export default WardenOutpass;
