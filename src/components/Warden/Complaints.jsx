import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';

const Complaints = () => {
  const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/complaints/all`);
      if (!res.ok) throw new Error('Failed to fetch complaints');
      const data = await res.json();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error fetching complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/complaints/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updated = await res.json();
      setComplaints(prev => prev.map(c => (c._id === updated._id ? updated : c)));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error updating status');
    }
  };

  const getStatusBadge = (status) => {
    switch ((status || 'pending').toLowerCase()) {
      case 'pending': return <Badge bg="warning">Pending</Badge>;
      case 'in-progress': return <Badge bg="info">In Progress</Badge>;
      case 'resolved': return <Badge bg="success">Resolved</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Student Complaints</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? <div className="text-center"><Spinner animation="border" /></div> : complaints.length === 0 ? <p className="text-center">No complaints submitted yet.</p> :
        <Table striped bordered hover responsive>
          <thead>
            <tr><th>Name</th><th>Roll No</th><th>Room No</th><th>Category</th><th>Subject</th><th>Description</th><th>Date</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.rollno}</td>
                <td>{c.roomNo}</td>
                <td>{c.category}</td>
                <td>{c.subject}</td>
                <td>{c.description}</td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td>{getStatusBadge(c.status)}</td>
                <td>
                  {c.status.toLowerCase() === 'pending' && <>
                    <Button size="sm" className="me-2" onClick={() => updateStatus(c._id, 'in-progress')}>In Progress</Button>
                    <Button size="sm" variant="success" onClick={() => updateStatus(c._id, 'resolved')}>Resolve</Button>
                  </>}
                  {c.status.toLowerCase() === 'in-progress' &&
                    <Button size="sm" variant="success" onClick={() => updateStatus(c._id, 'resolved')}>Resolve</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      }
    </Container>
  );
};

export default Complaints;
