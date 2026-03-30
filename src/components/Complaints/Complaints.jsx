import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Form, Row, Col, Button, Alert, Table, Badge, Spinner } from 'react-bootstrap';
import { FaExclamationTriangle, FaHistory, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://hostel-management-backend-eo9s.onrender.com/api';

/* ================= PREMIUM UI FIX ================= */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700&display=swap');

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
  

.cp-container {
  max-width: 1000px;
  margin: 0 auto;
}
.cp-input option {
background: #111827;
color: #ffffff;
}

.cp-input select {
color: #ffffff !important;
}
.cp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
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
  padding: 30px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.4);
}

.cp-input {
  background: rgba(255,255,255,0.05) !important;
  border: 1px solid var(--border) !important;
  color: var(--cream) !important;
  border-radius: 12px !important;
  padding: 12px 15px !important;
}

.cp-input:focus {
  background: rgba(255,255,255,0.1) !important;
  border-color: var(--violet) !important;
  box-shadow: none !important;
}

.cp-label {
  color: var(--text-muted);
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.cp-btn {
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

.cp-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139,92,246,0.4);
}

.cp-table-card {
  background: var(--navy-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  backdrop-filter: blur(12px);
  overflow: hidden;
  margin-top: 30px;
}

.cp-table {
  margin-bottom: 0;
  color: var(--text-primary);
}

.cp-table thead th {
  background: rgba(139,92,246,0.15);
  color: var(--violet);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1px;
  padding: 20px;
  border-bottom: 2px solid var(--border);
}

.cp-table tbody td {
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

.bg-resolved { background: rgba(52,217,160,0.15); color: #34d9a0; border: 1px solid rgba(52,217,160,0.3); }
.bg-pending { background: rgba(245,166,35,0.15); color: #f5a623; border: 1px solid rgba(245,166,35,0.3); }
.bg-progress { background: rgba(56,189,248,0.15); color: #38bdf8; border: 1px solid rgba(56,189,248,0.3); }
`;

const StudentComplaint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: ''
  });

  const [submitStatus, setSubmitStatus] = useState({
    show: false,
    message: '',
    variant: ''
  });

  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const student = JSON.parse(localStorage.getItem('student') || '{}');

  const fetchComplaints = useCallback(async () => {
    if (!student.rollNo) return;

    try {
      setLoadingComplaints(true);
      const res = await fetch(`${API_BASE}/complaints?rollno=${student.rollNo}`);
      const data = await res.json();
      setComplaints(data.reverse());
    } finally {
      setLoadingComplaints(false);
    }
  }, [student.rollNo]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.subject || !formData.description) {
      setSubmitStatus({
        show: true,
        message: "Please fill all fields",
        variant: "danger"
      });
      return;
    }

    try {
      setLoadingSubmit(true);

      await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: student.name,
          rollno: student.rollNo
        })
      });

      setSubmitStatus({
        show: true,
        message: "Complaint submitted successfully!",
        variant: "success"
      });

      setFormData({
        category: '',
        subject: '',
        description: ''
      });

      fetchComplaints();

    } catch {
      setSubmitStatus({
        show: true,
        message: "Submission failed",
        variant: "danger"
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || 'pending').toLowerCase();
    if (s === 'resolved') return <Badge className="bg-resolved px-3 py-2">Resolved</Badge>;
    if (s === 'in-progress') return <Badge className="bg-progress px-3 py-2">In Progress</Badge>;
    return <Badge className="bg-pending px-3 py-2">Pending</Badge>;
  };

  return (
    <div className="cp-root">
      <style>{styles}</style>

      <Container className="cp-container">
        <div className="cp-header">
          <h1 className="cp-title"><FaExclamationTriangle className="text-pink" /> Complaints</h1>
          <button className="back-btn" onClick={() => navigate('/student/dashboard')}>
            <FaArrowLeft /> Dashboard
          </button>
        </div>

        {/* FORM */}
        <Card className="cp-card mb-5">
          <h5 
className="mb-4 d-flex align-items-center gap-2"
style={{ color: "#ffffff", fontWeight: 600 }}
>
<FaPaperPlane style={{ color:"#38bdf8" }} />
Submit New Complaint
</h5>

          {submitStatus.show && (
            <Alert variant={submitStatus.variant} className="border-0" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
              {submitStatus.message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Label className="cp-label">Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="cp-input"
                >
                  <option value="">Select Category</option>
                  <option>Maintenance</option>
                  <option>Electrical</option>
                  <option>Cleanliness</option>
                </Form.Select>
              </Col>

              <Col md={6}>
                <Form.Label className="cp-label">Subject</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's the issue?"
                  className="cp-input"
                />
              </Col>
            </Row>

            <Form.Label className="cp-label">Detailed Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide more details about the problem..."
              className="cp-input mb-4"
            />

            <Button type="submit" className="cp-btn w-100" disabled={loadingSubmit}>
              {loadingSubmit ? <Spinner size="sm" /> : <><FaPaperPlane /> Send Complaint</>}
            </Button>
          </Form>
        </Card>

        {/* TABLE */}
        <div className="cp-table-card">
          <div style={{ padding: '20px 25px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <FaHistory className="text-violet" />
            <h5 className="m-0">Complaint History</h5>
          </div>

          <div className="table-responsive">
            <Table className="cp-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loadingComplaints ? (
                  <tr><td colSpan="4" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
                ) : complaints.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-5 text-muted">No complaints submitted yet.</td></tr>
                ) : (
                  complaints.map(c => (
                    <tr key={c._id}>
                      <td className="fw-bold text-cream">{new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="text-muted">{c.category}</td>
                      <td className="text-cream">{c.subject}</td>
                      <td>{getStatusBadge(c.status)}</td>
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

export default StudentComplaint;