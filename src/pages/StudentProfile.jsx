import React, { useEffect, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaSignOutAlt, FaTachometerAlt, FaClipboardList, FaArrowLeft, FaCamera, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

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
    --green:  #34d9a0;
    --amber:  #f5a623;
    --red:    #f0606a;
    --violet: #a78bfa;
    --pink:   #f472b6;
    --cyan:   #38bdf8;
    --radius: 20px;
    --shadow: 0 8px 40px rgba(0,0,0,0.45);
  }

  .sp-root {
    min-height: 100vh;
    background: 
      radial-gradient(ellipse 70% 55% at 0% 0%, #1a0533 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 100% 0%, #0c1e4a 0%, transparent 50%),
      radial-gradient(ellipse 75% 60% at 50% 60%, #0f2840 0%, transparent 60%),
      #080d1a;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    padding: 40px 20px;
    overflow-x: hidden;
  }

  .sp-card {
    background: var(--navy-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(16px);
    box-shadow: var(--shadow);
    max-width: 800px;
    margin: 0 auto;
    overflow: hidden;
    animation: fadeUp 0.6s ease-out;
  }

  .sp-header {
    background: linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.08) 100%);
    padding: 40px 30px;
    border-bottom: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
  }

  .sp-avatar-container {
    position: relative;
    width: 140px;
    height: 140px;
    margin-bottom: 24px;
    transition: transform 0.3s;
  }
  .sp-avatar-container:hover { transform: scale(1.03); }

  .sp-avatar {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 60%, #38bdf8 100%);
    border-radius: 50%;
    display: flex;
    align-items: center; justify-content: center;
    font-size: 52px;
    font-weight: 800;
    color: #fff;
    box-shadow: 0 0 0 5px rgba(139,92,246,0.15), 0 0 40px rgba(139,92,246,0.3);
    font-family: 'Playfair Display', serif;
    overflow: hidden;
  }
  .sp-avatar-img { width: 100%; height: 100%; object-fit: cover; }

  .sp-upload-btn {
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 38px;
    height: 38px;
    background: var(--violet);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: 0.2s;
    border: 3px solid var(--navy);
  }
  .sp-upload-btn:hover { background: var(--pink); transform: scale(1.1); }

  .sp-name {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 700;
    color: var(--cream);
    margin-bottom: 8px;
  }
  .sp-dept { color: var(--violet); font-weight: 600; font-size: 15px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }

  .sp-chips { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .sp-chip {
    background: rgba(139,92,246,0.1);
    border: 1px solid rgba(139,92,246,0.22);
    border-radius: 40px;
    padding: 6px 16px;
    font-size: 13px;
    color: #c4b5fd;
    font-weight: 500;
    backdrop-filter: blur(8px);
  }

  .sp-body { padding: 40px; }
  .sp-section-title {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--text-muted);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .sp-section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .sp-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
  .sp-info-item { display: flex; flex-direction: column; gap: 6px; }
  .sp-info-label { font-size: 12px; color: var(--text-muted); font-weight: 600; }
  .sp-info-value { font-size: 16px; color: var(--cream); font-weight: 500; }

  .sp-actions { display: flex; gap: 14px; margin-top: 20px; flex-wrap: wrap; }
  .sp-btn {
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
  }
  .sp-btn-primary { background: linear-gradient(135deg, #8b5cf6, #ec4899); color: #fff; border: none; }
  .sp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(139,92,246,0.4); opacity: 0.9; }
  
  .sp-btn-outline { background: rgba(255,255,255,0.03); border: 1px solid var(--border); color: var(--text-primary); }
  .sp-btn-outline:hover { background: rgba(255,255,255,0.08); border-color: var(--violet); transform: translateY(-2px); }

  .sp-btn-danger { background: rgba(240,96,106,0.1); border: 1px solid rgba(240,96,106,0.25); color: var(--red); }
  .sp-btn-danger:hover { background: var(--red); color: #fff; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(240,96,106,0.3); }

  .sp-form-group { margin-bottom: 24px; }
  .sp-label { font-size: 13px; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; display: block; }
  .sp-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 18px;
    color: var(--cream);
    font-size: 15px;
    transition: all 0.2s;
  }
  .sp-input:focus { outline: none; border-color: var(--violet); background: rgba(255,255,255,0.07); box-shadow: 0 0 0 3px rgba(139,92,246,0.15); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 600px) {
    .sp-info-grid { grid-template-columns: 1fr; gap: 20px; }
    .sp-name { font-size: 28px; }
    .sp-body { padding: 30px 20px; }
    .sp-btn { width: 100%; }
  }
`;

const StudentProfile = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    const storedPhoto = localStorage.getItem("studentPhoto");

    if (!storedStudent) {
      navigate("/login", { replace: true });
      return;
    }

    setStudent(JSON.parse(storedStudent));
    if (storedPhoto) setPhoto(storedPhoto);
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!student) return null;

  const initials = student.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
      localStorage.setItem("studentPhoto", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    localStorage.setItem("student", JSON.stringify(student));
    setEditing(false);
  };

  return (
    <div className="sp-root">
      <style>{styles}</style>
      
      <div className="sp-card">
        {/* HEADER */}
        <div className="sp-header">
          <div className="sp-avatar-container">
            <div className="sp-avatar">
              {photo ? <img src={photo} alt="profile" className="sp-avatar-img" /> : initials}
            </div>
            <label className="sp-upload-btn" title="Upload Photo">
              <FaCamera size={18} />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
            </label>
          </div>

          <h1 className="sp-name">{student.name}</h1>
          <div className="sp-dept">{student.department}</div>

          <div className="sp-chips">
            {student.rollNo && <span className="sp-chip">🎓 {student.rollNo}</span>}
            {student.hostel && <span className="sp-chip">🏠 {student.hostel}</span>}
            {student.roomNo && <span className="sp-chip">🚪 Room {student.roomNo}</span>}
            {student.year && <span className="sp-chip">📅 Year {student.year}</span>}
          </div>
        </div>

        {/* BODY */}
        <div className="sp-body">
          <div className="sp-section-title">Account Details</div>

          {editing ? (
            <Form onSubmit={(e) => { e.preventDefault(); saveProfile(); }}>
              <Row>
                <Col md={6}>
                  <div className="sp-form-group">
                    <label className="sp-label">Full Name</label>
                    <input 
                      className="sp-input"
                      value={student.name}
                      onChange={(e) => setStudent({ ...student, name: e.target.value })}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="sp-form-group">
                    <label className="sp-label">Room Number</label>
                    <input 
                      className="sp-input"
                      value={student.roomNo}
                      onChange={(e) => setStudent({ ...student, roomNo: e.target.value })}
                    />
                  </div>
                </Col>
                <Col md={12}>
                  <div className="sp-form-group">
                    <label className="sp-label">Parent Contact</label>
                    <input 
                      className="sp-input"
                      value={student.parentContact}
                      onChange={(e) => setStudent({ ...student, parentContact: e.target.value })}
                    />
                  </div>
                </Col>
              </Row>

              <div className="sp-actions">
                <button type="submit" className="sp-btn sp-btn-primary" style={{ flex: 1 }}>
                  <FaCheckCircle /> Save Changes
                </button>
                <button type="button" className="sp-btn sp-btn-outline" style={{ flex: 1 }} onClick={() => setEditing(false)}>
                  <FaTimesCircle /> Cancel
                </button>
              </div>
            </Form>
          ) : (
            <>
              <div className="sp-info-grid">
                <div className="sp-info-item">
                  <span className="sp-info-label">Roll Number</span>
                  <span className="sp-info-value">{student.rollNo}</span>
                </div>
                <div className="sp-info-item">
                  <span className="sp-info-label">Room Number</span>
                  <span className="sp-info-value">{student.roomNo || "Not Assigned"}</span>
                </div>
                <div className="sp-info-item">
                  <span className="sp-info-label">Department</span>
                  <span className="sp-info-value">{student.department}</span>
                </div>
                <div className="sp-info-item">
                  <span className="sp-info-label">Current Year</span>
                  <span className="sp-info-value">{student.year} Year</span>
                </div>
                <div className="sp-info-item">
                  <span className="sp-info-label">Parent Contact</span>
                  <span className="sp-info-value">{student.parentContact || "Not Provided"}</span>
                </div>
              </div>

              <div className="sp-section-title">Navigation</div>
              <div className="sp-actions">
                <button className="sp-btn sp-btn-primary" onClick={() => setEditing(true)}>
                  <FaUserEdit /> Edit Profile
                </button>
                <button className="sp-btn sp-btn-outline" onClick={() => navigate("/student/dashboard")}>
                  <FaTachometerAlt /> Dashboard
                </button>
                <button className="sp-btn sp-btn-outline" onClick={() => navigate("/student/dashboard/leave")}>
                  <FaClipboardList /> View Leaves
                </button>
                <button className="sp-btn sp-btn-danger" onClick={logout} style={{ marginLeft: "auto" }}>
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 30, opacity: 0.4, fontSize: 12 }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, margin: "0 auto" }}>
          <FaArrowLeft /> Go Back
        </button>
      </div>
    </div>
  );
};

export default StudentProfile;
