import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Form, Row, Col, Button, Alert, Table, Badge, Spinner } from 'react-bootstrap';

const Leave = () => {
  const [formData, setFormData] = useState({
    rollno: '',
    leaveType: '',
    reason: '',
    startDate: '',
    endDate: '',
    parentContact: '', // still kept in state, but not shown in form
    address: ''
  });
  const [validated, setValidated] = useState(false);
  const [status, setStatus] = useState({ show: false, message: '', variant: '' });
  const [leaves, setLeaves] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);

const API_BASE = 'https://hostel-management-backend-eo9s.onrender.com/api';

  // 🔹 Form change
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🔹 Fetch leave history
  const fetchLeaves = useCallback(async (rollno) => {
    try {
      setLoadingLeaves(true);
      if (!rollno) return;
      const res = await fetch(`${API_BASE}/leaves?rollno=${rollno}`);
      const data = await res.json();
      setLeaves(data.sort((a, b) => new Date(b.appliedOn || b.createdAt) - new Date(a.appliedOn || a.createdAt)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLeaves(false);
    }
  }, [API_BASE]);

  // 🔹 Fetch logged-in student details from localStorage
  const fetchStudentDetails = useCallback(() => {
    const studentData = JSON.parse(localStorage.getItem('student') || '{}');
    if (studentData && studentData.rollNo) {
      setFormData(prev => ({
        ...prev,
        rollno: studentData.rollNo,
        parentContact: studentData.parentContact || ''   // auto-filled internally
      }));
      fetchLeaves(studentData.rollNo);
    }
  }, [fetchLeaves]);

  // 🔹 Submit leave
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/leaves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData) //  still includes parentContact
      });
      if (!res.ok) throw new Error('Submit failed');

      setStatus({ show: true, message: 'Leave request submitted!', variant: 'success' });

      // Reset leave-specific fields
      setFormData(prev => ({
        ...prev,
        leaveType: '',
        reason: '',
        startDate: '',
        endDate: '',
        address: ''
      }));
      setValidated(false);

      // Refresh leave history
      fetchLeaves(formData.rollno);
    } catch (err) {
      console.error(err);
      setStatus({ show: true, message: 'Error submitting leave request', variant: 'danger' });
    }
  };

  // 🔹 Delete leave
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leave request?')) return;
    try {
      const res = await fetch(`${API_BASE}/leaves/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setLeaves(prev => prev.filter(l => l._id !== id));
      setStatus({ show: true, message: 'Leave deleted successfully!', variant: 'success' });
    } catch (err) {
      console.error(err);
      setStatus({ show: true, message: 'Error deleting leave request', variant: 'danger' });
    }
  };

  const getStatusBadge = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending': return <Badge bg="warning">Pending</Badge>;
      case 'approved': return <Badge bg="success">Approved</Badge>;
      case 'rejected': return <Badge bg="danger">Rejected</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // 🔹 Load student info and leave history on mount
  useEffect(() => { fetchStudentDetails(); }, [fetchStudentDetails]);

  return (
    <Container className="py-4">
      {/* Leave Form */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white"><h4>Submit Leave Request</h4></Card.Header>
        <Card.Body>
          {status.show && <Alert variant={status.variant}>{status.message}</Alert>}
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="rollno">
                  <Form.Label>Roll Number</Form.Label>
                  <Form.Control type="text" name="rollno" value={formData.rollno} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="leaveType">
                  <Form.Label>Leave Type</Form.Label>
                  <Form.Select required name="leaveType" value={formData.leaveType} onChange={handleChange}>
                    <option value="">Select Type</option>
                    <option value="Home Visit">Home Visit</option>
                    <option value="Medical">Medical</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">Select leave type</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="startDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control required type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                  <Form.Control.Feedback type="invalid">Select start date</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="endDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control required type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                  <Form.Control.Feedback type="invalid">Select end date</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            {/* Removed Parent Contact field */}
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address During Leave</Form.Label>
              <Form.Control required type="text" name="address" value={formData.address} onChange={handleChange} />
              <Form.Control.Feedback type="invalid">Enter address</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="reason">
              <Form.Label>Reason</Form.Label>
              <Form.Control required as="textarea" rows={4} name="reason" value={formData.reason} onChange={handleChange} />
              <Form.Control.Feedback type="invalid">Enter reason</Form.Control.Feedback>
            </Form.Group>
            <div className="d-grid"><Button type="submit" variant="primary">Submit Leave Request</Button></div>
          </Form>
        </Card.Body>
      </Card>

      {/* Leave History */}
      <Card>
        <Card.Header className="bg-secondary text-white"><h5>My Leave History</h5></Card.Header>
        <Card.Body>
          {loadingLeaves ? (
            <Spinner animation="border" />
          ) : leaves.length === 0 ? (
            <p>No leave requests yet.</p>
          ) : (
            <Table striped bordered hover responsive>
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
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{leave.leaveType}</td>
                    <td>{getStatusBadge(leave.status)}</td>
                    <td>{new Date(leave.appliedOn).toLocaleDateString()}</td>
                    <td>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(leave._id)}>Delete</Button>
                    </td>
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

export default Leave;
