import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Row, Col, Button, Table, Badge, Spinner, Alert } from 'react-bootstrap';

const StudentComplaint = () => {
  const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: ''
  });

  const [validated, setValidated] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ show: false, message: '', variant: '' });
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Get logged-in student info
  const student = JSON.parse(localStorage.getItem('student') || '{}');

  // Fetch complaint history for this roll number
  const fetchComplaints = async () => {
    if (!student.rollNo) return;
    try {
      setLoadingComplaints(true);
      const res = await fetch(`${API_BASE}/complaints?rollno=${student.rollNo}`);
      if (!res.ok) throw new Error('Failed to fetch complaints');
      const data = await res.json();
      // Sort by latest first
      setComplaints(data.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComplaints(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [student.rollNo]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!student.name || !student.rollNo || !student.roomNo) {
      alert('Student not logged in properly!');
      return;
    }

    const payload = {
      name: student.name,
      rollno: student.rollNo,
      roomNo: student.roomNo,
      category: formData.category,
      subject: formData.subject,
      description: formData.description
    };

    try {
      setLoadingSubmit(true);
      const res = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Missing required fields');

      setSubmitStatus({ show: true, message: 'Complaint submitted successfully!', variant: 'success' });
      setFormData({ category: '', subject: '', description: '' });
      setValidated(false);
      fetchComplaints();
    } catch (err) {
      console.error(err);
      setSubmitStatus({ show: true, message: err.message, variant: 'danger' });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const getStatusBadge = (status) => {
    switch ((status || 'pending').toLowerCase()) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'in-progress':
        return <Badge bg="info">In Progress</Badge>;
      case 'resolved':
        return <Badge bg="success">Resolved</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <h4>Submit Complaint</h4>
        </Card.Header>
        <Card.Body>
          {submitStatus.show && <Alert variant={submitStatus.variant}>{submitStatus.message}</Alert>}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" value={student.name || ''} readOnly />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Roll Number</Form.Label>
                  <Form.Control type="text" value={student.rollNo || ''} readOnly />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Room Number</Form.Label>
                  <Form.Control type="text" value={student.roomNo || ''} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select required name="category" value={formData.category} onChange={handleChange}>
                    <option value="">Select Category</option>
                    <option>Maintenance</option>
                    <option>Electrical</option>
                    <option>Plumbing</option>
                    <option>Furniture</option>
                    <option>Cleanliness</option>
                    <option>Other</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">Select a category</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief subject"
                  />
                  <Form.Control.Feedback type="invalid">Enter a subject</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed description"
              />
              <Form.Control.Feedback type="invalid">Enter a description</Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid">
              <Button type="submit" variant="primary" disabled={loadingSubmit}>
                {loadingSubmit ? 'Submitting...' : 'Submit Complaint'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Complaint History */}
      <Card>
        <Card.Header className="bg-secondary text-white">
          <h5>My Complaint History</h5>
        </Card.Header>
        <Card.Body>
          {loadingComplaints ? (
            <Spinner animation="border" />
          ) : complaints.length === 0 ? (
            <p>No complaints submitted yet.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c._id}>
                    <td>{new Date(c.date || c.createdAt).toLocaleDateString()}</td>
                    <td>{c.category}</td>
                    <td>{c.subject}</td>
                    <td>{c.description}</td>
                    <td>{getStatusBadge(c.status)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentComplaint;
