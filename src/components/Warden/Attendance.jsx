import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Table, Spinner, Alert, Card, Badge } from 'react-bootstrap';
import { 
  FaClipboardCheck, 
  FaSearch, 
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser
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
    --radius: 20px;
  }

  .wa-root {
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

  .wa-header {
    max-width: 1400px;
    margin: 0 auto 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .wa-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--cream);
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .wa-card {
    background: var(--navy-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(12px);
    overflow: hidden;
    max-width: 1400px;
    margin: 0 auto;
    box-shadow: 0 8px 40px rgba(0,0,0,0.4);
  }

  .wa-search-container {
    max-width: 1400px;
    margin: 0 auto 20px;
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }

  .wa-search-input {
    flex: 1;
    min-width: 250px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px 20px 12px 45px;
    color: var(--text-primary);
    font-size: 15px;
    transition: 0.2s;
  }
  .wa-search-input:focus {
    outline: none;
    background: rgba(255,255,255,0.08);
    border-color: var(--violet);
    box-shadow: 0 0 0 3px rgba(167,139,250,0.15);
  }

  .wa-date-input {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px 20px;
    color: var(--text-primary);
    font-size: 15px;
  }

  .wa-table {
    margin-bottom: 0;
    color: var(--text-primary);
    border-color: var(--border);
  }
  .wa-table thead th {
    background: rgba(139,92,246,0.1);
    color: var(--violet);
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 20px 15px;
    border-bottom: 2px solid var(--border);
  }
  .wa-table tbody td {
    padding: 18px 15px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
    font-size: 14px;
    color: var(--text-primary);
    background: transparent !important;
  }

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

  .bg-success-glass { background: rgba(52,217,160,0.15); color: #34d9a0; border: 1px solid rgba(52,217,160,0.3); }

  @media (max-width: 992px) {
    .wa-header { flex-direction: column; gap: 20px; align-items: flex-start; }
    .wa-search-container { flex-direction: column; }
  }
`;

const WardenAttendance = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = 'https://hostel-management-backend-eo9s.onrender.com/api';

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_BASE}/attendance`);
      const data = response.data.attendance || response.data || [];
      setAttendance(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching attendance', err);
      setError('Failed to fetch attendance logs');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = 
      record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.rollNo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = record.date === filterDate;
    
    return matchesSearch && (filterDate ? matchesDate : true);
  });

  return (
    <div className="wa-root">
      <style>{styles}</style>

      <div className="wa-header">
        <h1 className="wa-title">
          <FaClipboardCheck className="text-violet" /> Student Attendance
        </h1>
        <button className="back-btn" onClick={() => navigate('/warden/dashboard')}>
          <FaArrowLeft /> Dashboard
        </button>
      </div>

      <Container fluid>
        <div className="wa-search-container">
          <div style={{ position: 'relative', flex: 1 }}>
            <FaSearch style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="wa-search-input"
              placeholder="Search by student name or roll no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted small text-uppercase fw-bold"><FaCalendarAlt /> Date:</span>
            <input
              type="date"
              className="wa-date-input"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>

        <Card className="wa-card">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <div className="mt-3 text-muted">Loading attendance logs...</div>
            </div>
          ) : error ? (
            <Alert variant="danger" className="m-4">{error}</Alert>
          ) : filteredAttendance.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaClipboardCheck size={40} className="mb-3 opacity-20" />
              <p>No attendance records found for the selected criteria.</p>
            </div>
          ) : (
            <Table responsive className="wa-table">
              <thead>
                <tr>
                  <th><FaUser size={12} className="me-2" /> Student Name</th>
                  <th>Roll No</th>
                  <th><FaCalendarAlt size={12} className="me-2" /> Date</th>
                  <th>Status</th>
                  <th><FaMapMarkerAlt size={12} className="me-2" /> Location Verified</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((record, idx) => (
                  <tr key={idx}>
                    <td><div className="fw-bold text-cream">{record.name}</div></td>
                    <td><code style={{ color: 'var(--cyan)' }}>{record.rollNo}</code></td>
                    <td className="text-muted">
                      {new Date(record.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <Badge className="bg-success-glass px-3 py-2">
                        {record.status}
                      </Badge>
                    </td>
                    <td style={{ maxWidth: 300 }} className="small text-muted">
                      {record.location || "Coordinates verified"}
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

export default WardenAttendance;
