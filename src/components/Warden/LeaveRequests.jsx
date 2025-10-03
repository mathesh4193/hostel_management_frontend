import React, { useEffect, useState, useCallback } from 'react';
import { Container, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';

const WardenLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/leaves`);
      const data = await res.json();
      setLeaves(data);
    } catch (err) {
      console.error(err);
      setError('Error fetching leave requests');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/leaves/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updatedLeave = await res.json();
      setLeaves(leaves.map(l => l._id === id ? updatedLeave : l));
    } catch (err) {
      console.error(err);
      alert('Failed to update leave status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <Badge bg="warning">Pending</Badge>;
      case 'approved': return <Badge bg="success">Approved</Badge>;
      case 'rejected': return <Badge bg="danger">Rejected</Badge>;
      default: return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Leave Requests</h2>
      {leaves.length === 0 ? (
        <Alert variant="info">No leave requests found.</Alert>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Student Roll</th>
                <th>Type</th>
                <th>Reason</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(leave => (
                <tr key={leave._id}>
                  <td>{leave.rollno}</td>
                  <td>{leave.leaveType}</td>
                  <td>{leave.reason}</td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>{getStatusBadge(leave.status)}</td>
                  <td>
                    {leave.status === 'pending' && (
                      <>
                        <Button size="sm" variant="success" className="me-2" onClick={() => updateStatus(leave._id, 'approved')}>Approve</Button>
                        <Button size="sm" variant="danger" onClick={() => updateStatus(leave._id, 'rejected')}>Reject</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default WardenLeave;
