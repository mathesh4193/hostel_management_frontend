import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { 
  FaUsers, 
  FaFileAlt, 
  FaExclamationTriangle, 
  FaBed, 
  FaRunning, 
  FaUtensils, 
  FaChevronRight,
  FaClipboardCheck
} from "react-icons/fa";
import axios from "axios";

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
    --gold-light: #fad98a;
    --cream:      #f5f0ff;
    --text-primary: #eeeaf8;
    --text-muted:   #9b9ec8;
    --border:       rgba(160,130,255,0.18);
    --violet: #a78bfa;
    --pink:   #f472b6;
    --cyan:   #38bdf8;
    --radius: 20px;
    --shadow: 0 8px 40px rgba(0,0,0,0.45);
  }

  .wd-root {
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

  .wd-header {
    max-width: 1200px;
    margin: 0 auto 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .wd-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--cream);
  }

  .wd-stat-card {
    background: var(--navy-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    height: 100%;
    backdrop-filter: blur(12px);
    transition: transform 0.3s;
  }
  .wd-stat-card:hover { transform: translateY(-5px); }

  .wd-stat-label { font-size: 13px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
  .wd-stat-value { font-size: 36px; font-weight: 700; color: #fff; margin: 8px 0; }
  .wd-stat-icon { font-size: 24px; opacity: 0.8; }

  .wd-action-card {
    background: var(--navy-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 30px;
    height: 100%;
    cursor: pointer;
    text-align: center;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  .wd-action-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(236,72,153,0.1) 100%);
    opacity: 0;
    transition: 0.3s;
  }
  .wd-action-card:hover { transform: translateY(-8px); border-color: var(--violet); }
  .wd-action-card:hover::before { opacity: 1; }

  .wd-action-icon { font-size: 40px; color: var(--violet); margin-bottom: 20px; position: relative; z-index: 1; }
  .wd-action-title { font-size: 18px; font-weight: 600; color: var(--cream); position: relative; z-index: 1; }
  .wd-action-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    background: #ef4444;
    color: white;
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 20px;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(239,68,68,0.4);
    z-index: 2;
  }

  .logout-btn {
    background: rgba(240,96,106,0.1);
    border: 1px solid rgba(240,96,106,0.25);
    color: var(--red);
    padding: 8px 16px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: 0.2s;
  }
  .logout-btn:hover { background: #f0606a; color: #fff; }
`;

const WardenDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingLeaves: 0,
    activeComplaints: 0,
    roomsOccupied: 0,
    pendingOutpass: 0,
  });

  const API = "https://hostel-management-backend-eo9s.onrender.com/api";

  const [attendanceCount, setAttendanceCount] = useState(0);

  const fetchStats = useCallback(async () => {
    try {
      const [
        studentsRes,
        leavesRes,
        complaintsRes,
        outpassesRes,
        attendanceRes
      ] = await Promise.all([
        axios.get(`${API}/students`).catch(() => ({ data: [] })),
        axios.get(`${API}/leaves`).catch(() => ({ data: [] })),
        axios.get(`${API}/complaints`).catch(() => ({ data: [] })),
        axios.get(`${API}/outpasses`).catch(() => ({ data: [] })),
        axios.get(`${API}/attendance`).catch(() => ({ data: [] }))
      ]);

      const students = studentsRes.data.students || studentsRes.data || [];
      const leaves = leavesRes.data.leaves || leavesRes.data || [];
      const complaints = complaintsRes.data.complaints || complaintsRes.data || [];
      const outpasses = outpassesRes.data.outpasses || outpassesRes.data || [];
      const attendance = attendanceRes.data.attendance || attendanceRes.data || [];

      setStats({
        totalStudents: students.length,
        pendingLeaves: leaves.filter(l => l.status?.toLowerCase() === "pending").length,
        activeComplaints: complaints.filter(c => c.status?.toLowerCase() === "pending" || c.status?.toLowerCase() === "active").length,
        roomsOccupied: students.filter(s => s.roomNo && s.roomNo.toString().trim() !== "").length,
        pendingOutpass: outpasses.filter(o => o.status?.toLowerCase() === "pending").length
      });
      setAttendanceCount(Array.isArray(attendance) ? attendance.filter(a => a.date === new Date().toISOString().split('T')[0]).length : 0);
    } catch (error) {
      console.log("Dashboard error:", error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const actions = [
    {
      title: "Student Management",
      icon: <FaUsers />,
      path: "/warden/students",
      count: stats.totalStudents,
    },
    {
      title: "Leave Requests",
      icon: <FaFileAlt />,
      path: "/warden/leave-requests",
      count: stats.pendingLeaves,
    },
    {
      title: "Complaints",
      icon: <FaExclamationTriangle />,
      path: "/warden/complaints",
      count: stats.activeComplaints,
    },
    {
      title: "Outpass Requests",
      icon: <FaRunning />,
      path: "/warden/outpass",
      count: stats.pendingOutpass,
    },
    {
      title: "Attendance Logs",
      icon: <FaClipboardCheck />,
      path: "/warden/attendance",
      count: attendanceCount || null,
    },
    {
      title: "Mess Schedule",
      icon: <FaUtensils />,
      path: "/warden/mess",
      count: null,
    }
  ];

  return (
    <div className="wd-root">
      <style>{styles}</style>
      
     

      <Container maxWidth="1200px">
        {/* STATS ROW */}
        <Row className="g-4 mb-5">
          <Col md={3}>
            <div className="wd-stat-card">
              <div className="wd-stat-label">Total Students</div>
              <div className="wd-stat-value">{stats.totalStudents}</div>
              <div className="wd-stat-icon" style={{ color: "var(--cyan)" }}><FaUsers /></div>
            </div>
          </Col>
          <Col md={3}>
            <div className="wd-stat-card">
              <div className="wd-stat-label">Pending Leaves</div>
              <div className="wd-stat-value">{stats.pendingLeaves}</div>
              <div className="wd-stat-icon" style={{ color: "var(--violet)" }}><FaFileAlt /></div>
            </div>
          </Col>
          <Col md={3}>
            <div className="wd-stat-card">
              <div className="wd-stat-label">Active Complaints</div>
              <div className="wd-stat-value">{stats.activeComplaints}</div>
              <div className="wd-stat-icon" style={{ color: "var(--pink)" }}><FaExclamationTriangle /></div>
            </div>
          </Col>
          <Col md={3}>
            <div className="wd-stat-card">
              <div className="wd-stat-label">Rooms Occupied</div>
              <div className="wd-stat-value">{stats.roomsOccupied}</div>
              <div className="wd-stat-icon" style={{ color: "var(--gold)" }}><FaBed /></div>
            </div>
          </Col>
        </Row>

        {/* ACTIONS GRID */}
        <div style={{ marginBottom: 20, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--text-muted)" }}>Management Actions</div>
        <Row className="g-4">
          {actions.map(action => (
            <Col md={4} key={action.title}>
              <div className="wd-action-card" onClick={() => navigate(action.path)}>
                {action.count > 0 && <div className="wd-action-badge">{action.count}</div>}
                <div className="wd-action-icon">{action.icon}</div>
                <div className="wd-action-title">{action.title}</div>
                <div style={{ marginTop: 15, fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                  Manage Details <FaChevronRight size={10} />
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default WardenDashboard;
