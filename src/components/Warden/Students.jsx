import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Table, Badge, Spinner, Alert, Card, Row, Col, Form, Button } from 'react-bootstrap';
import { 
  FaUsers, 
  FaSearch, 
  FaPlus, 
  FaTimes, 
  FaArrowLeft,
  FaUser,
  FaHashtag,
  FaBuilding,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGraduationCap
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

  .sd-root {
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

  .sd-header {
    max-width: 1400px;
    margin: 0 auto 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sd-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--cream);
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .sd-card {
    background: var(--navy-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(12px);
    overflow: hidden;
    max-width: 1400px;
    margin: 0 auto;
    box-shadow: 0 8px 40px rgba(0,0,0,0.4);
  }

  .sd-search-container {
    max-width: 1400px;
    margin: 0 auto 20px;
    display: flex;
    gap: 15px;
  }

  .sd-search-input {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px 20px 12px 45px;
    color: var(--text-primary);
    font-size: 15px;
    transition: 0.2s;
  }
  .sd-search-input:focus {
    outline: none;
    background: rgba(255,255,255,0.08);
    border-color: var(--violet);
    box-shadow: 0 0 0 3px rgba(167,139,250,0.15);
  }

  .sd-table {
    margin-bottom: 0;
    color: var(--text-primary);
    border-color: var(--border);
  }
  .sd-table thead th {
    background: rgba(139,92,246,0.1);
    color: var(--violet);
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 20px 15px;
    border-bottom: 2px solid var(--border);
  }
  .sd-table tbody td {
    padding: 18px 15px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
    font-size: 14px;
    color: var(--text-primary);
    background: transparent !important;
  }

  .sd-form-card {
    background: rgba(139,92,246,0.05);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 30px;
    margin-bottom: 30px;
    max-width: 1400px;
    margin: 0 auto 30px;
  }

  .sd-input {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 16px;
    color: var(--text-primary);
    transition: 0.2s;
  }
  .sd-input:focus {
    background: rgba(255,255,255,0.07);
    border-color: var(--violet);
    color: #fff;
    box-shadow: none;
  }
  .sd-input::placeholder { color: rgba(155,158,200,0.5); }

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

  .add-btn {
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    border: none;
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: 0.2s;
  }
  .add-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(139,92,246,0.3); opacity: 0.9; }

  .cancel-btn {
    background: rgba(240,96,106,0.1);
    border: 1px solid rgba(240,96,106,0.2);
    color: var(--red);
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
  }
  .cancel-btn:hover { background: var(--red); color: white; }

  @media (max-width: 992px) {
    .sd-header { flex-direction: column; gap: 20px; align-items: flex-start; }
    .sd-search-container { flex-direction: column; }
  }
`;

const Students = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNo: '',
    regNo: '',
    roomNo: '',
    department: '',
    year: '',
    address: '',
    contact: '',
    parentContact: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = 'https://hostel-management-backend-eo9s.onrender.com/api';

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_BASE}/students`);
      setStudents(Array.isArray(response.data.students) ? response.data.students : []);
    } catch (err) {
      console.error('Error fetching students', err);
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/students`, newStudent);
      alert(response.data.message || 'Student added successfully!');
      setNewStudent({
        name: '', rollNo: '', regNo: '', roomNo: '', department: '',
        year: '', address: '', contact: '', parentContact: ''
      });
      setShowForm(false);
      fetchStudents();
    } catch (err) {
      console.error('Error adding student', err);
      alert('Failed to add student');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.regNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roomNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sd-root">
      <style>{styles}</style>

      <div className="sd-header">
        <h1 className="sd-title">
          <FaUsers className="text-violet" /> Student Directory
        </h1>
        <button className="back-btn" onClick={() => navigate('/warden/dashboard')}>
          <FaArrowLeft /> Dashboard
        </button>
      </div>

      <Container fluid>
        <div className="sd-search-container">
          <div style={{ position: 'relative', flex: 1 }}>
            <FaSearch style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="sd-search-input"
              placeholder="Search by name, roll no, room or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className={showForm ? "cancel-btn" : "add-btn"} onClick={() => setShowForm(!showForm)}>
            {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add Student</>}
          </button>
        </div>

        {showForm && (
          <Card className="sd-form-card">
            <h4 className="mb-4 text-cream">Register New Student</h4>
            <Form onSubmit={handleAddStudent}>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="small text-muted fw-bold text-uppercase">Name</Form.Label>
                    <Form.Control className="sd-input" name="name" value={newStudent.name} onChange={handleInputChange} required placeholder="Full Name" />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="small text-muted fw-bold text-uppercase">Roll Number</Form.Label>
                    <Form.Control className="sd-input" name="rollNo" value={newStudent.rollNo} onChange={handleInputChange} required placeholder="Roll No" />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="small text-muted fw-bold text-uppercase">Registration Number</Form.Label>
                    <Form.Control className="sd-input" name="regNo" value={newStudent.regNo} onChange={handleInputChange} required placeholder="Reg No" />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="small text-muted fw-bold text-uppercase">Room Number</Form.Label>
                    <Form.Control className="sd-input" name="roomNo" value={newStudent.roomNo} onChange={handleInputChange} required placeholder="Room No" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small text-muted fw-bold text-uppercase">Department</Form.Label>
                    <Form.Control className="sd-input" name="department" value={newStudent.department} onChange={handleInputChange} required placeholder="e.g. Computer Science" />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="small text-muted fw-bold text-uppercase">Year</Form.Label>
                    <Form.Control className="sd-input" name="year" value={newStudent.year} onChange={handleInputChange} required placeholder="Current Year" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="small text-muted fw-bold text-uppercase">Address</Form.Label>
                    <Form.Control className="sd-input" name="address" value={newStudent.address} onChange={handleInputChange} required placeholder="Full Residential Address" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small text-muted fw-bold text-uppercase">Student Contact</Form.Label>
                    <Form.Control className="sd-input" name="contact" value={newStudent.contact} onChange={handleInputChange} required placeholder="Mobile Number" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small text-muted fw-bold text-uppercase">Parent Contact</Form.Label>
                    <Form.Control className="sd-input" name="parentContact" value={newStudent.parentContact} onChange={handleInputChange} required placeholder="Parent's Mobile Number" />
                  </Form.Group>
                </Col>
              </Row>
              <div className="mt-4 d-flex justify-content-end">
                <Button type="submit" className="add-btn px-5">Complete Registration</Button>
              </div>
            </Form>
          </Card>
        )}

        <Card className="sd-card">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <div className="mt-3 text-muted">Loading directory...</div>
            </div>
          ) : error ? (
            <Alert variant="danger" className="m-4">{error}</Alert>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaUsers size={40} className="mb-3 opacity-20" />
              <p>No students match your search.</p>
            </div>
          ) : (
            <Table responsive className="sd-table">
              <thead>
                <tr>
                  <th><FaUser size={12} className="me-2" /> Name</th>
                  <th><FaHashtag size={12} className="me-2" /> Roll No</th>
                  <th>Reg. No</th>
                  <th><FaBuilding size={12} className="me-2" /> Room</th>
                  <th><FaGraduationCap size={12} className="me-2" /> Dept / Year</th>
                  <th><FaMapMarkerAlt size={12} className="me-2" /> Address</th>
                  <th><FaPhoneAlt size={12} className="me-2" /> Contacts</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student._id}>
                    <td><div className="fw-bold text-cream">{student.name}</div></td>
                    <td><code style={{ color: 'var(--cyan)' }}>{student.rollNo}</code></td>
                    <td className="small">{student.regNo}</td>
                    <td><Badge bg="dark" className="border border-secondary">{student.roomNo}</Badge></td>
                    <td>
                      <div className="fw-medium text-cream">{student.department}</div>
                      <div className="small" style={{ color: 'var(--violet)', fontWeight: 600 }}>{student.year} Year</div>
                    </td>
                    <td style={{ maxWidth: 250 }} className="small text-cream">{student.address}</td>
                    <td>
                      <div className="small mb-1"><span style={{ color: 'var(--text-muted)', fontWeight: 700, marginRight: 5 }}>S:</span> <a href={`tel:${student.contact}`} className="text-violet text-decoration-none fw-bold">{student.contact}</a></div>
                      <div className="small"><span style={{ color: 'var(--text-muted)', fontWeight: 700, marginRight: 5 }}>P:</span> <a href={`tel:${student.parentContact}`} className="text-pink text-decoration-none fw-bold">{student.parentContact}</a></div>
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

export default Students;
