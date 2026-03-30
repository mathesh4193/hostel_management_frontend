import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Table, Spinner, Alert } from 'react-bootstrap';
import { 
  FaMapMarkerAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaChartLine,
  FaMapPin
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  .text-violet { color: var(--violet) !important; }
  .text-cyan { color: var(--cyan) !important; }
  .text-pink { color: var(--pink) !important; }
  .text-green { color: var(--green) !important; }
  .text-cream { color: var(--cream) !important; }
  .text-muted { color: var(--text-muted) !important; }

  .at-root {
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

  .at-container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .at-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
  }

  .at-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--cream);
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .at-card {
    background: var(--navy-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(12px);
    padding: 30px;
    height: 100%;
    box-shadow: 0 8px 40px rgba(0,0,0,0.4);
  }

  .at-status-box {
    background: rgba(139,92,246,0.1);
    border: 1px solid rgba(139,92,246,0.2);
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 25px;
    text-align: center;
  }

  .at-badge {
    padding: 8px 16px;
    border-radius: 40px;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .bg-success-glass { background: rgba(52,217,160,0.15); color: var(--green); border: 1px solid rgba(52,217,160,0.3); }
  .bg-danger-glass { background: rgba(240,96,106,0.15); color: var(--red); border: 1px solid rgba(240,96,106,0.3); }

  .at-btn {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 16px;
    border: none;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .btn-mark-success { background: linear-gradient(135deg, #34d9a0, #059669); color: #fff; }
  .btn-mark-success:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(52,217,160,0.3); }
  
  .btn-mark-danger { background: linear-gradient(135deg, #f0606a, #dc2626); color: #fff; }
  .btn-mark-danger:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(240,96,106,0.3); }

  .at-stat-box {
    text-align: center;
    padding: 20px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 15px;
  }
  .at-stat-label { font-size: 12px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin-bottom: 5px; }
  .at-stat-value { font-size: 28px; font-weight: 800; color: var(--cream); }

  .at-table-card {
    background: var(--navy-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(12px);
    overflow: hidden;
    margin-top: 30px;
  }

  .at-table {
    margin-bottom: 0;
    color: var(--text-primary);
  }
  .at-table thead th {
    background: rgba(139,92,246,0.15);
    color: var(--violet);
    font-weight: 700;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 1px;
    padding: 20px;
    border-bottom: 2px solid var(--border);
  }
  .at-table tbody td {
    padding: 18px 20px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
    font-size: 14px;
    background: transparent !important;
  }

  .at-month-input {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    color: var(--cream);
    border-radius: 10px;
    padding: 8px 15px;
  }
  .at-month-input:focus { background: rgba(255,255,255,0.1); border-color: var(--violet); color: #fff; box-shadow: none; }

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
`;

/* ================== LOGIC ================== */
const VCET_COORDS = {
  latitude: 9.8945572,
  longitude: 78.1776890,
  radius: 200
};

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/* ================== COMPONENT ================== */
const Attendance = () => {
  const navigate = useNavigate();
  const [isInCampus, setIsInCampus] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [address, setAddress] = useState("");
  const [student, setStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);

  const API_BASE = "https://hostel-management-backend-eo9s.onrender.com/api";

  const fetchAttendance = useCallback(async (rollNo) => {
    try {
      const res = await axios.get(`${API_BASE}/attendance?rollno=${rollNo}`);
      // Handle both { attendance: [...] } and directly [...]
      const data = res.data.attendance || res.data || [];
      setAttendanceData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  }, [API_BASE]);

  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (stored) {
      const studentInfo = JSON.parse(stored);
      setStudent(studentInfo);
      fetchAttendance(studentInfo.rollNo);
    } else {
      navigate("/login");
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const dist = getDistance(
          latitude,
          longitude,
          VCET_COORDS.latitude,
          VCET_COORDS.longitude
        );

        setIsInCampus(dist <= VCET_COORDS.radius);

        if (dist > VCET_COORDS.radius) {
          setError(`You are ${Math.round(dist)}m away from campus`);
        }

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(res => res.json())
          .then(data => setAddress(data.display_name))
          .catch(() => setAddress("Location coordinates obtained"));

        setLoading(false);
      },
      () => {
        setError("Please enable location services to mark attendance");
        setLoading(false);
      }
    );
  }, [navigate, fetchAttendance]);

  const stats = {
    total: attendanceData.length,
    present: attendanceData.filter(d => d.status === "Present").length,
    percentage: attendanceData.length > 0 
      ? ((attendanceData.filter(d => d.status === "Present").length / attendanceData.length) * 100).toFixed(1)
      : "0.0"
  };

  const markAttendance = async () => {
    if (!isInCampus) {
      alert("ABSENT: You are outside the campus radius.");
      return;
    }
    
    if (!student) return;

    try {
      setMarking(true);
      const res = await axios.post(`${API_BASE}/attendance`, {
        rollNo: student.rollNo,
        name: student.name,
        date: new Date().toISOString().split('T')[0],
        status: "Present",
        location: address
      });
      alert(res.data.message || "PRESENT: Attendance marked successfully!");
      fetchAttendance(student.rollNo);
    } catch (err) {
      console.error("Error marking attendance:", err);
      alert("Failed to mark attendance. Please try again.");
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="at-root">
      <style>{styles}</style>

      <div className="at-container">
        <div className="at-header">
          <h1 className="at-title"><FaMapPin className="text-violet" /> Smart Attendance</h1>
          <button className="back-btn" onClick={() => navigate('/student/dashboard')}>
            <FaArrowLeft /> Dashboard
          </button>
        </div>

        <Row className="g-4 mb-4">
          <Col lg={7}>
            <div className="at-card">
              <h5 className="mb-4 d-flex align-items-center gap-2"><FaMapMarkerAlt className="text-cyan" /> Verification Status</h5>
              
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <div className="mt-3 text-muted">Verifying your location...</div>
                </div>
              ) : (
                <>
                  {error && <Alert variant="danger" style={{ background: 'rgba(240,96,106,0.1)', border: '1px solid var(--red)', color: 'var(--red)', fontSize: 14 }}>{error}</Alert>}

                  <div className="at-status-box">
                    <div className="at-stat-label">Current Verification</div>
                    <div className="my-3">
                      <span className={`at-badge ${isInCampus ? "bg-success-glass" : "bg-danger-glass"}`}>
                        {isInCampus ? <><FaCheckCircle /> Inside Campus</> : <><FaTimesCircle /> Outside Campus</>}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto' }}>{address}</div>
                  </div>

                  <button 
                    className={`at-btn ${isInCampus ? "btn-mark-success" : "btn-mark-danger"}`}
                    onClick={markAttendance}
                    disabled={loading || marking || (!!error && !isInCampus)}
                  >
                    {marking ? <Spinner size="sm" /> : isInCampus ? <FaCheckCircle /> : <FaTimesCircle />} Mark Attendance
                  </button>
                </>
              )}
            </div>
          </Col>
          
          <Col lg={5}>
            <div className="at-card">
              <h5 className="mb-4 d-flex align-items-center gap-2"><FaChartLine className="text-pink" /> Attendance Overview</h5>
              <Row className="g-3">
                <Col xs={12}>
                  <div className="at-stat-box">
                    <div className="at-stat-label">Total Records</div>
                    <div className="at-stat-value">{stats.total}</div>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="at-stat-box">
                    <div className="at-stat-label">Present</div>
                    <div className="at-stat-value text-green">{stats.present}</div>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="at-stat-box">
                    <div className="at-stat-label">Percentage</div>
                    <div className="at-stat-value text-cyan">{stats.percentage}%</div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <div className="at-table-card">
          <div style={{ padding: '20px 25px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 15 }}>
            <h5 className="m-0 d-flex align-items-center gap-2"><FaCalendarAlt className="text-violet" /> History Logs</h5>
          </div>

          <div className="table-responsive">
            <Table className="at-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Status</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">No attendance records found.</td>
                  </tr>
                ) : (
                  attendanceData.map((d, i) => (
                    <tr key={i}>
                      <td className="fw-bold text-cream">{new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="text-muted">{new Date(d.date).toLocaleDateString('en-IN', { weekday: 'long' })}</td>
                      <td>
                        <span className={`at-badge ${d.status === "Present" ? "bg-success-glass" : "bg-danger-glass"}`} style={{ padding: '4px 12px', fontSize: 11 }}>
                          {d.status}
                        </span>
                      </td>
                      <td className="small text-muted" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {d.location || "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
