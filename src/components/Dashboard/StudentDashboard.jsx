import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaClipboardCheck,
  FaExternalLinkAlt,
  FaExclamationCircle,
  FaChartLine,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

/* ─────────────────────────────────────────────
   INLINE STYLES — no external CSS file needed
   ───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

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
    --green:  #34d9a0;
    --amber:  #f5a623;
    --red:    #f0606a;
    --violet: #a78bfa;
    --pink:   #f472b6;
    --cyan:   #38bdf8;
    --radius: 16px;
    --shadow: 0 8px 40px rgba(0,0,0,0.45);
  }

  .sd-root {
    min-height: 100vh;
    background:
      radial-gradient(ellipse 70% 55% at 0%   0%,   #1a0533 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 100% 0%,   #0c1e4a 0%, transparent 50%),
      radial-gradient(ellipse 75% 60% at 50%  60%,  #0f2840 0%, transparent 60%),
      radial-gradient(ellipse 55% 45% at 100% 100%, #1a0f3a 0%, transparent 55%),
      radial-gradient(ellipse 65% 50% at 0%   100%, #041a2e 0%, transparent 55%),
      #080d1a;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    padding-bottom: 60px;
    position: relative;
    overflow-x: hidden;
  }

  /* animated mesh orbs */
  .sd-root::before, .sd-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    z-index: 0;
    animation: float 12s ease-in-out infinite alternate;
  }
  .sd-root::before {
    width: 480px; height: 480px;
    top: -120px; left: -140px;
    background: radial-gradient(circle, rgba(139,92,246,0.22) 0%, rgba(59,130,246,0.10) 60%, transparent 80%);
  }
  .sd-root::after {
    width: 420px; height: 420px;
    bottom: -100px; right: -120px;
    background: radial-gradient(circle, rgba(236,72,153,0.18) 0%, rgba(6,182,212,0.09) 60%, transparent 80%);
    animation-duration: 16s;
    animation-delay: -6s;
  }
  @keyframes float {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(30px, 20px) scale(1.08); }
  }

  /* keep all content above orbs */
  .sd-topbar, .sd-main { position: relative; z-index: 1; }

  /* ── TOP BAR ── */
  .sd-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    height: 68px;
    background: rgba(8, 10, 24, 0.75);
    border-bottom: 1px solid rgba(160,130,255,0.15);
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .sd-topbar-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .sd-logo-ring {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 2px solid var(--violet);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    color: var(--violet);
    font-weight: 700;
  }
  .sd-topbar-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--cream);
    letter-spacing: 0.3px;
  }
  .sd-topbar-title span { color: var(--violet); }

  .sd-topbar-right { display: flex; align-items: center; gap: 16px; }
  .sd-icon-btn {
    background: none; border: none; cursor: pointer;
    color: var(--text-muted);
    padding: 8px; border-radius: 10px;
    transition: color 0.2s, background 0.2s;
    display: flex; align-items: center;
  }
  .sd-icon-btn:hover { color: var(--gold); background: rgba(232,184,75,0.08); }

  .sd-user-chip {
    display: flex; align-items: center; gap: 10px;
    padding: 6px 14px 6px 8px;
    background: rgba(20,15,50,0.6);
    border: 1px solid rgba(160,130,255,0.20);
    border-radius: 40px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    cursor: default;
    backdrop-filter: blur(8px);
  }
  .sd-avatar {
    width: 30px; height: 30px;
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 13px; color: #fff;
  }

  /* ── MAIN WRAPPER ── */
  .sd-main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 36px 24px 0;
  }

  /* ── HERO WELCOME ── */
  .sd-hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 36px;
    padding: 28px 32px;
    background: rgba(20, 15, 50, 0.55);
    border: 1px solid rgba(160,130,255,0.22);
    border-radius: var(--radius);
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(16px);
    box-shadow: 0 4px 32px rgba(100,60,200,0.12), inset 0 1px 0 rgba(255,255,255,0.06);
  }
  .sd-hero::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(115deg, rgba(139,92,246,0.08) 0%, rgba(236,72,153,0.04) 60%, transparent 100%);
    pointer-events: none;
  }
  .sd-hero-greeting {
    font-size: 13px;
    color: var(--violet);
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .sd-hero-name {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    font-weight: 700;
    color: var(--cream);
    line-height: 1.1;
    margin-bottom: 10px;
  }
  .sd-hero-meta {
    display: flex; gap: 10px; flex-wrap: wrap;
  }
  .sd-meta-pill {
    background: rgba(139,92,246,0.12);
    border: 1px solid rgba(139,92,246,0.25);
    border-radius: 30px;
    padding: 4px 14px;
    font-size: 12.5px;
    color: #c4b5fd;
    font-weight: 500;
  }
  .sd-hero-date {
    font-size: 13px;
    color: var(--text-muted);
    display: flex; align-items: center; gap: 6px;
    white-space: nowrap;
    align-self: flex-start;
  }

  /* ── STATS ROW ── */
  .sd-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 36px;
  }
  .sd-stat-card {
    background: rgba(20, 15, 50, 0.50);
    border: 1px solid rgba(160,130,255,0.18);
    border-radius: var(--radius);
    padding: 20px 22px;
    display: flex; align-items: center; gap: 16px;
    transition: transform 0.2s, box-shadow 0.2s;
    backdrop-filter: blur(12px);
    box-shadow: 0 2px 20px rgba(80,40,160,0.10);
  }
  .sd-stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(100,60,200,0.18); }
  .sd-stat-icon {
    width: 46px; height: 46px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 18px;
  }
  .sd-stat-icon.green  { background: rgba(62,207,142,0.12); color: var(--green); }
  .sd-stat-icon.amber  { background: rgba(245,166,35,0.12);  color: var(--amber); }
  .sd-stat-icon.blue   { background: rgba(99,163,255,0.12);  color: #63a3ff; }
  .sd-stat-label { font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }
  .sd-stat-value { font-size: 22px; font-weight: 700; color: var(--cream); }

  /* ── MENU GRID ── */
  .sd-section-title {
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 16px;
  }
  .sd-menu-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 14px;
    margin-bottom: 36px;
  }
  .sd-menu-card {
    background: rgba(20, 15, 50, 0.50);
    border: 1px solid rgba(160,130,255,0.16);
    border-radius: var(--radius);
    padding: 24px 12px 20px;
    display: flex; flex-direction: column;
    align-items: center; gap: 12px;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    text-align: center;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(12px);
  }
  .sd-menu-card:hover {
    border-color: var(--violet);
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(0,0,0,0.3), 0 0 0 1px rgba(139,92,246,0.20);
  }
  .sd-menu-card:hover .sd-menu-icon { color: var(--violet); transform: scale(1.1); }
  .sd-menu-icon {
    font-size: 26px;
    color: var(--text-muted);
    transition: color 0.2s, transform 0.2s;
  }
  .sd-menu-label {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.3;
  }
  .sd-menu-sub {
    font-size: 11px;
    color: var(--text-muted);
  }
  .sd-menu-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--violet), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .sd-menu-card:hover::before { opacity: 1; }

  /* ── DATA GRID ── */
  .sd-data-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  .sd-data-card {
    background: rgba(20, 15, 50, 0.50);
    border: 1px solid rgba(160,130,255,0.16);
    border-radius: var(--radius);
    overflow: hidden;
    backdrop-filter: blur(12px);
  }
  .sd-data-header {
    padding: 16px 20px;
    border-bottom: 1px solid rgba(160,130,255,0.12);
    display: flex; align-items: center; justify-content: space-between;
  }
  .sd-data-header-title {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--cream);
    letter-spacing: 0.2px;
  }
  .sd-count-badge {
    font-size: 11px;
    padding: 2px 10px;
    background: rgba(139,92,246,0.12);
    border: 1px solid rgba(139,92,246,0.25);
    color: #c4b5fd;
    border-radius: 20px;
    font-weight: 600;
  }
  .sd-data-body { padding: 10px 16px 14px; }
  .sd-record {
    padding: 12px 4px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
  }
  .sd-record:last-child { border-bottom: none; }
  .sd-record-main { font-size: 13.5px; font-weight: 500; color: var(--cream); margin-bottom: 3px; }
  .sd-record-sub  { font-size: 11.5px; color: var(--text-muted); }
  .sd-status {
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
    flex-shrink: 0;
    display: flex; align-items: center;
  }
  .sd-status.approved  { background: rgba(62,207,142,0.12);  color: var(--green); }
  .sd-status.pending   { background: rgba(245,166,35,0.12);  color: var(--amber); }
  .sd-status.rejected  { background: rgba(224,92,92,0.12);   color: var(--red);   }
  .sd-status.default   { background: rgba(99,163,255,0.10);  color: #63a3ff;      }

  .sd-empty { font-size: 13px; color: var(--text-muted); padding: 20px 4px; text-align: center; }

  /* ── OUTPASS WIDE ── */
  .sd-outpass-row {
    padding: 12px 4px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto;
    align-items: center;
    gap: 12px;
  }
  .sd-outpass-row:last-child { border-bottom: none; }

  /* ── SPINNER ── */
  .sd-spinner {
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
  }
  .sd-spin {
    width: 22px; height: 22px;
    border: 2px solid var(--border);
    border-top-color: var(--violet);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── FADE IN ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.45s ease both; }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .sd-menu-grid { grid-template-columns: repeat(3, 1fr); }
    .sd-data-grid { grid-template-columns: 1fr; }
    .sd-stats { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 600px) {
    .sd-main { padding: 20px 14px 0; }
    .sd-topbar { padding: 0 16px; }
    .sd-hero { flex-direction: column; align-items: flex-start; gap: 12px; padding: 20px; }
    .sd-menu-grid { grid-template-columns: repeat(2, 1fr); }
    .sd-stats { grid-template-columns: 1fr; }
    .sd-outpass-row { grid-template-columns: 1fr auto; }
    .sd-hero-name { font-size: 24px; }
  }
`;

/* ─────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────── */
const formatDate = (str) =>
  str
    ? new Date(str).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "—";

const formatTime = (str) =>
  str
    ? new Date(str).toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit", hour12: true,
      })
    : "—";

const getStatusClass = (status = "") => {
  const s = status.toLowerCase();
  if (s.includes("approv")) return "approved";
  if (s.includes("pend"))   return "pending";
  if (s.includes("reject")) return "rejected";
  return "default";
};

const StatusIcon = ({ status }) => {
  const cls = getStatusClass(status);
  if (cls === "approved") return <FaCheckCircle style={{ color: "var(--green)", marginRight: 5 }} />;
  if (cls === "rejected") return <FaTimesCircle  style={{ color: "var(--red)",   marginRight: 5 }} />;
  return <FaClock style={{ color: "var(--amber)", marginRight: 5 }} />;
};

const Spinner = () => (
  <div className="sd-spinner"><div className="sd-spin" /></div>
);

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */
const StudentDashboard = () => {
  const navigate = useNavigate();
  const API_BASE = "https://hostel-management-backend-eo9s.onrender.com/api";

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [leaves,            setLeaves]            = useState([]);
  const [loadingLeaves,     setLoadingLeaves]     = useState(true);
  const [complaints,        setComplaints]        = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [outpasses,         setOutpasses]         = useState([]);
  const [loadingOutpasses,  setLoadingOutpasses]  = useState(true);

  /* ── Auth ── */
  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (!stored) { navigate("/login", { replace: true }); return; }
    setStudent(JSON.parse(stored));
    setLoading(false);
  }, [navigate]);

  /* ── Data fetches ── */
  useEffect(() => {
    if (!student?.rollNo) return;
    (async () => {
      try {
        const res  = await fetch(`${API_BASE}/leaves?rollno=${student.rollNo}`);
        const data = await res.json();
        setLeaves(Array.isArray(data) ? data.slice(0, 5) : []);
      } finally { setLoadingLeaves(false); }
    })();
  }, [student]);

  useEffect(() => {
    if (!student?.rollNo) return;
    (async () => {
      try {
        const res  = await fetch(`${API_BASE}/complaints?rollno=${student.rollNo}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.complaints ?? []);
        setComplaints(list.slice(0, 5));
      } finally { setLoadingComplaints(false); }
    })();
  }, [student]);

  useEffect(() => {
    if (!student?.rollNo) return;
    (async () => {
      try {
        const res  = await fetch(`${API_BASE}/outpasses?rollno=${student.rollNo}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.outpasses ?? []);
        setOutpasses(list.slice(0, 5));
      } finally { setLoadingOutpasses(false); }
    })();
  }, [student]);

  const menuItems = [
    { title: "Profile",           sub: "View & edit",       path: "/student/profile",           icon: <FaUserCircle /> },
    { title: "Leave Application", sub: "Apply now",          path: "/student/dashboard/leave",   icon: <FaClipboardCheck /> },
    { title: "Outpass",           sub: "Request gate pass",  path: "/student/dashboard/outpass", icon: <FaExternalLinkAlt /> },
    { title: "Complaints",        sub: "Raise an issue",     path: "/complaints",                icon: <FaExclamationCircle /> },
    { title: "Attendance",        sub: "Track record",       path: "/attendance",                icon: <FaChartLine /> },
  ];

  const stats = [
    { label: "Total Leaves",     value: leaves.length,     icon: <FaCalendarAlt />,      cls: "green" },
    { label: "Complaints Filed", value: complaints.length, icon: <FaExclamationCircle />, cls: "amber" },
    { label: "Outpasses Issued", value: outpasses.length,  icon: <FaExternalLinkAlt />,  cls: "blue"  },
  ];

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const initials = student?.name
    ? student.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "ST";

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#080d1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 36, height: 36, border: "3px solid rgba(139,92,246,0.2)", borderTopColor: "#8b5cf6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="sd-root">

        {/* TOP BAR */}
       

        <main className="sd-main">

          {/* HERO — Profile Card */}
          <div className="sd-hero fade-up" style={{ animationDelay: "0.05s", alignItems: "stretch", gap: 28 }}>

            {/* Avatar column */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, flexShrink: 0 }}>
              <div style={{
                width: 80, height: 80,
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 60%, #38bdf8 100%)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, fontWeight: 800, color: "#fff",
                boxShadow: "0 0 0 4px rgba(139,92,246,0.20), 0 0 28px rgba(139,92,246,0.30)",
                fontFamily: "'Playfair Display', serif",
                letterSpacing: 1,
              }}>
                {initials}
              </div>
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: 1.2,
                textTransform: "uppercase", color: "#a78bfa",
                background: "rgba(139,92,246,0.12)",
                border: "1px solid rgba(139,92,246,0.22)",
                borderRadius: 20, padding: "3px 12px",
              }}>
                Student
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: 1, background: "rgba(160,130,255,0.15)", alignSelf: "stretch", flexShrink: 0 }} />

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div className="sd-hero-greeting">Welcome back</div>
              <div className="sd-hero-name">{student?.name ?? "Student"}</div>
              <div className="sd-hero-meta" style={{ marginTop: 10 }}>
                {student?.rollNo  && <span className="sd-meta-pill">🎓 {student.rollNo}</span>}
                {student?.hostel  && <span className="sd-meta-pill">🏠 {student.hostel}</span>}
                {student?.roomNo  && <span className="sd-meta-pill">🚪 Room {student.roomNo}</span>}
                {student?.branch  && <span className="sd-meta-pill">📚 {student.branch}</span>}
              </div>
            </div>

            {/* Date pill */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "flex-start", gap: 8, flexShrink: 0 }}>
              <div className="sd-hero-date">
                <FaCalendarAlt style={{ color: "var(--violet)", flexShrink: 0 }} />
                {today}
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="sd-stats">
            {stats.map((s, i) => (
              <div key={i} className="sd-stat-card fade-up" style={{ animationDelay: `${0.1 + i * 0.06}s` }}>
                <div className={`sd-stat-icon ${s.cls}`}>{s.icon}</div>
                <div>
                  <div className="sd-stat-label">{s.label}</div>
                  <div className="sd-stat-value">{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div className="sd-section-title">Quick Actions</div>
          <div className="sd-menu-grid">
            {menuItems.map((item, i) => (
              <div
                key={i}
                className="sd-menu-card fade-up"
                style={{ animationDelay: `${0.18 + i * 0.05}s` }}
                onClick={() => navigate(item.path)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(item.path)}
              >
                <div className="sd-menu-icon">{item.icon}</div>
                <div>
                  <div className="sd-menu-label">{item.title}</div>
                  <div className="sd-menu-sub">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* LEAVES + COMPLAINTS */}
          <div className="sd-data-grid">
            <div className="sd-data-card fade-up" style={{ animationDelay: "0.36s" }}>
              <div className="sd-data-header">
                <span className="sd-data-header-title">Recent Leaves</span>
                {leaves.length > 0 && <span className="sd-count-badge">{leaves.length}</span>}
              </div>
              <div className="sd-data-body">
                {loadingLeaves ? <Spinner /> : leaves.length === 0
                  ? <p className="sd-empty">No leave records found</p>
                  : leaves.map((l) => (
                    <div key={l._id} className="sd-record">
                      <div>
                        <div className="sd-record-main">{l.reason || "Leave"}</div>
                        <div className="sd-record-sub">{formatDate(l.createdAt)}</div>
                      </div>
                      <span className={`sd-status ${getStatusClass(l.status)}`}>
                        <StatusIcon status={l.status} />{l.status}
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>

            <div className="sd-data-card fade-up" style={{ animationDelay: "0.40s" }}>
              <div className="sd-data-header">
                <span className="sd-data-header-title">Recent Complaints</span>
                {complaints.length > 0 && <span className="sd-count-badge">{complaints.length}</span>}
              </div>
              <div className="sd-data-body">
                {loadingComplaints ? <Spinner /> : complaints.length === 0
                  ? <p className="sd-empty">No complaints filed</p>
                  : complaints.map((c) => (
                    <div key={c._id} className="sd-record">
                      <div>
                        <div className="sd-record-main">{c.subject || "Complaint"}</div>
                        <div className="sd-record-sub">{formatDate(c.createdAt)}</div>
                      </div>
                      <span className={`sd-status ${getStatusClass(c.status)}`}>
                        <StatusIcon status={c.status} />{c.status}
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          {/* OUTPASSES */}
          <div className="sd-data-card fade-up" style={{ animationDelay: "0.44s" }}>
            <div className="sd-data-header">
              <span className="sd-data-header-title">Recent Outpasses</span>
              {outpasses.length > 0 && <span className="sd-count-badge">{outpasses.length}</span>}
            </div>
            <div className="sd-data-body">
              {loadingOutpasses ? <Spinner /> : outpasses.length === 0
                ? <p className="sd-empty">No outpass records found</p>
                : outpasses.map((o) => (
                  <div key={o._id} className="sd-outpass-row">
                    <div>
                      <div className="sd-record-main">{o.destination || "—"}</div>
                      <div className="sd-record-sub">Applied: {formatDate(o.createdAt)}</div>
                    </div>
                    <div>
                      <div className="sd-record-sub" style={{ marginBottom: 3 }}>Departure</div>
                      <div className="sd-record-main" style={{ fontSize: 13 }}>
                        {formatDate(o.departureTime)}<br />
                        <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>{formatTime(o.departureTime)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="sd-record-sub" style={{ marginBottom: 3 }}>Return</div>
                      <div className="sd-record-main" style={{ fontSize: 13 }}>
                        {o.returnTime ? <>{formatDate(o.returnTime)}<br /><span style={{ color: "var(--text-muted)", fontWeight: 400 }}>{formatTime(o.returnTime)}</span></> : "—"}
                      </div>
                    </div>
                    <span className={`sd-status ${getStatusClass(o.status)}`}>
                      <StatusIcon status={o.status} />{o.status}
                    </span>
                  </div>
                ))
              }
            </div>
          </div>

        </main>
      </div>
    </>
  );
};

export default StudentDashboard;