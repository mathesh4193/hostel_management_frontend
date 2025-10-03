import React, { useEffect, useState, useCallback } from 'react';
import { Container, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';

const WardenLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Use deployed backend URL
  const API_BASE = 'https://hostel-management-backend-eo9s.onrender.com/api';

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/leaves`);
      if (!res.ok) throw new Error('Failed to fetch leave requests');
      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.leaves)
          ? data.leaves
          : [];
      setLeaves(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error('Fetch leaves error:', err);
      setError(err.message || 'Error fetching leave requests');
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
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update leave status');
      const updatedLeave = await res.json();
      setLeaves(prev => prev.map(l => l._id === updatedLeave._id ? updatedLeave : l));
    } catch (err) {
      console.error('Update status error:', err);
      alert(err.message || 'Failed to update leave status');
    }
  };

  const getStatusBadge = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending': return <Badge bg="warning">Pending</Badge>;
      case 'approved': return <Badge bg="success">Approved</Badge>;
      case 'rejected': return <Badge bg="danger">Rejected</Badge>;
      default: return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="my-5 text-center">{error}</Alert>;

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
                    {leave.status.toLowerCase() === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="success"
                          className="me-2"
                          onClick={() => updateStatus(leave._id, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => updateStatus(leave._id, 'rejected')}
                        >
                          Reject
                        </Button>
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
