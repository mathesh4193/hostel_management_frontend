import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Form, Row, Col, Button, Alert, Table, Badge, Spinner } from 'react-bootstrap';
import { FaCalendarAlt, FaHistory, FaPaperPlane, FaArrowLeft, FaTrash } from 'react-icons/fa';
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

  .lv-root {
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
.lv-input option {
  background: #0a0f1e;
  color: #fff;
}

.lv-input select {
  color: #fff !important;
}
  
  .lv-table tbody tr td {
color: #ffffff !important;
font-weight: 500;
}

.lv-table tbody tr {
background: rgba(17,24,39,0.4);
}

.lv-table tbody tr:hover {
background: rgba(139,92,246,0.1);
}
  .lv-container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .lv-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
  }

  .lv-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--cream);
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .lv-card {
    background: var(--navy-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(12px);
    padding: 30px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.4);
  }

  .lv-input {
    background: rgba(255,255,255,0.05) !important;
    border: 1px solid var(--border) !important;
    color: var(--cream) !important;
    border-radius: 12px !important;
    padding: 12px 15px !important;
  }

  .lv-input:focus {
    background: rgba(255,255,255,0.1) !important;
    border-color: var(--violet) !important;
    box-shadow: none !important;
  }

  .lv-label {
    color: var(--text-muted);
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }

  .lv-btn {
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    border: none;
    border-radius: 12px;
    padding: 14px;
    font-weight: 700;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .lv-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139,92,246,0.4);
  }

  .lv-table-card {
    background: var(--navy-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(12px);
    overflow: hidden;
    margin-top: 30px;
  }

  .lv-table {
    margin-bottom: 0;
    color: var(--text-primary);
  }

  .lv-table thead th {
    background: rgba(139,92,246,0.15);
    color: var(--violet);
    font-weight: 700;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 1px;
    padding: 20px;
    border-bottom: 2px solid var(--border);
  }

  .lv-table tbody td {
    padding: 18px 20px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
    font-size: 14px;
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

  .back-btn:hover {
    background: rgba(255,255,255,0.1);
    color: var(--cream);
  }

  .bg-approved { background: rgba(52,217,160,0.15); color: #34d9a0; border: 1px solid rgba(52,217,160,0.3); }
  .bg-pending { background: rgba(245,166,35,0.15); color: #f5a623; border: 1px solid rgba(245,166,35,0.3); }
  .bg-rejected { background: rgba(240,96,106,0.15); color: #f0606a; border: 1px solid rgba(240,96,106,0.3); }
`;

const Leave = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rollno: '',
    leaveType: '',
    reason: '',
    startDate: '',
    endDate: '',
    parentContact: '',
    address: ''
  });

  const [validated, setValidated] = useState(false);
  const [status, setStatus] = useState({ show: false, message: '', variant: '' });
  const [leaves, setLeaves] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const API_BASE = 'https://hostel-management-backend-eo9s.onrender.com/api';

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const getArray = (data, key) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data[key])) return data[key];
    return [];
  };

  const fetchLeaves = useCallback(async (rollno = formData.rollno) => {
    try {
      if (!rollno) return;
      setLoadingLeaves(true);

      const res = await fetch(`${API_BASE}/leaves?rollno=${rollno}`);
      const data = await res.json();
      const list = getArray(data, "leaves");

      setLeaves(
        list.sort(
          (a, b) => new Date(b.appliedOn || b.createdAt) - new Date(a.appliedOn || a.createdAt)
        )
      );
    } catch (err) {
      console.error("Error fetching leaves:", err);
    } finally {
      setLoadingLeaves(false);
    }
  }, [formData.rollno]);

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem("student") || "{}");
    if (s.rollNo) {
      setFormData(prev => ({
        ...prev,
        rollno: s.rollNo,
        parentContact: s.parentContact || ""
      }));
      fetchLeaves(s.rollNo);
    }
  }, [fetchLeaves]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      setLoadingSubmit(true);
      const res = await fetch(`${API_BASE}/leaves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Submit failed");

      setStatus({ show: true, message: "Leave request submitted successfully!", variant: "success" });

      setFormData(prev => ({
        ...prev,
        leaveType: "",
        reason: "",
        startDate: "",
        endDate: "",
        address: ""
      }));

      setValidated(false);
      fetchLeaves();
    } catch (err) {
      setStatus({ show: true, message: "Error submitting leave request", variant: "danger" });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave request?")) return;

    try {
      const res = await fetch(`${API_BASE}/leaves/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      setLeaves(prev => prev.filter(l => l._id !== id));
      setStatus({ show: true, message: "Leave deleted successfully!", variant: "success" });
    } catch (err) {
      setStatus({ show: true, message: "Error deleting leave request", variant: "danger" });
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "approved") return <Badge className="bg-approved px-3 py-2">Approved</Badge>;
    if (s === "rejected") return <Badge className="bg-rejected px-3 py-2">Rejected</Badge>;
    return <Badge className="bg-pending px-3 py-2">Pending</Badge>;
  };

  return (
    <div className="lv-root">
      <style>{styles}</style>
      <Container className="lv-container">
        <div className="lv-header">
          <h1 className="lv-title"><FaCalendarAlt className="text-pink" /> Leave Requests</h1>
          <button className="back-btn" onClick={() => navigate('/student/dashboard')}>
            <FaArrowLeft /> Dashboard
          </button>
        </div>

        {/* Leave Form */}
        <Card className="lv-card mb-5">
          <h5 
className="mb-4 d-flex align-items-center gap-2"
style={{ color: "#ffffff", fontWeight: 600 }}
>
<FaPaperPlane style={{ color:"#38bdf8" }} />
Submit New Leave Request
</h5>
          {status.show && (
            <Alert variant={status.variant} className="border-0" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
              {status.message}
            </Alert>
          )}
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="lv-label">Roll Number</Form.Label>
                  <Form.Control type="text" name="rollno" value={formData.rollno} readOnly className="lv-input" style={{ opacity: 0.7 }} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="lv-label">Leave Type</Form.Label>
                  <Form.Select required name="leaveType" value={formData.leaveType} onChange={handleChange} className="lv-input">
                    <option value="">Select Type</option>
                    <option value="Home Visit">Home Visit</option>
                    <option value="Medical">Medical</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="lv-label">Start Date</Form.Label>
                  <Form.Control required type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="lv-input" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="lv-label">End Date</Form.Label>
                  <Form.Control required type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="lv-input" />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-4">
              <Form.Label className="lv-label">Address During Leave</Form.Label>
              <Form.Control required type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Full address where you will be staying" className="lv-input" />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="lv-label">Reason for Leave</Form.Label>
              <Form.Control required as="textarea" rows={4} name="reason" value={formData.reason} onChange={handleChange} placeholder="Detailed reason for your leave request..." className="lv-input" />
            </Form.Group>
            <Button type="submit" className="lv-btn w-100" disabled={loadingSubmit}>
              {loadingSubmit ? <Spinner size="sm" /> : <><FaPaperPlane /> Submit Leave Request</>}
            </Button>
          </Form>
        </Card>

        {/* Leave History */}
        <div className="lv-table-card">
          <div style={{ padding: '20px 25px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <FaHistory className="text-violet" />
            <h5 className="m-0">My Leave History</h5>
          </div>
          <div className="table-responsive">
            <Table className="lv-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Applied On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loadingLeaves ? (
                  <tr><td colSpan="6" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
                ) : leaves.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-5 text-muted">No leave requests found.</td></tr>
                ) : (
                  leaves.map((leave) => (
                    <tr key={leave._id}>
                      <td className="text-cream">{new Date(leave.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                      <td className="text-cream">{new Date(leave.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                      <td className="text-muted small">{leave.leaveType}</td>
                      <td>{getStatusBadge(leave.status)}</td>
                      <td className="text-muted small">{new Date(leave.appliedOn || leave.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>
                        <Button size="sm" variant="link" className="text-danger p-0" onClick={() => handleDelete(leave._id)} title="Delete Request">
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Leave;
