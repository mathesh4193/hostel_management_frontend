import React, { useEffect, useState, useCallback } from 'react';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';

const WardenOutpass = () => {
  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = 'https://hostel-management-backend-eo9s.onrender.com/api';

  const fetchOutpasses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/outpasses`);
      if (!res.ok) throw new Error('Failed to fetch outpasses');
      const data = await res.json();
      setOutpasses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error fetching outpasses');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => { fetchOutpasses(); }, [fetchOutpasses]);

  const handleStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/outpasses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updated = await res.json();
      setOutpasses(prev => prev.map(o => o._id === updated._id ? updated : o));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto my-5" />;
  if (error) return <Alert variant="danger" className="text-center">{error}</Alert>;

  return (
    <Container className="py-5">
      <h3 className="mb-4">Student Outpass Requests</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Destination</th>
            <th>Purpose</th>
            <th>Departure</th>
            <th>Return</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {outpasses.length === 0 ? (
            <tr><td colSpan="8" className="text-center">No outpass requests</td></tr>
          ) : (
            outpasses.map(o => (
              <tr key={o._id}>
                <td>{o.studentName}</td>
                <td>{o.rollNo}</td>
                <td>{o.destination}</td>
                <td>{o.purpose}</td>
                <td>{new Date(o.departureTime).toLocaleString()}</td>
                <td>{new Date(o.returnTime).toLocaleString()}</td>
                <td>{o.status}</td>
                <td>
                  {o.status === 'Pending' ? (
                    <>
                      <Button size="sm" variant="success" onClick={() => handleStatus(o._id, 'Approved')} className="me-2">Approve</Button>
                      <Button size="sm" variant="danger" onClick={() => handleStatus(o._id, 'Rejected')}>Reject</Button>
                    </>
                  ) : (
                    <span>{o.status}</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default WardenOutpass;
