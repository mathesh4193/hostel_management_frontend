import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Image } from 'react-bootstrap';

const StudentOutpass = () => {
  const student = JSON.parse(localStorage.getItem('student') || '{}');
  const [outpasses, setOutpasses] = useState([]);
  const [showQR, setShowQR] = useState({ show: false, qr: '' });

  const API_BASE = 'https://hostel-management-backend-eo9s.onrender.com/api';

  useEffect(() => {
    const fetchOutpasses = async () => {
      const res = await fetch(`${API_BASE}/outpasses?rollNo=${student.rollNo}`);
      const data = await res.json();
      setOutpasses(Array.isArray(data) ? data : []);
    };
    fetchOutpasses();
  }, [student.rollNo]);

  return (
    <Container className="py-5">
      <h3 className="mb-4">My Outpass Requests</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Destination</th>
            <th>Purpose</th>
            <th>Departure</th>
            <th>Return</th>
            <th>Status</th>
            <th>QR</th>
          </tr>
        </thead>
        <tbody>
          {outpasses.length === 0 ? (
            <tr><td colSpan="6" className="text-center">No outpass requests</td></tr>
          ) : (
            outpasses.map(o => (
              <tr key={o._id}>
                <td>{o.destination}</td>
                <td>{o.purpose}</td>
                <td>{new Date(o.departureTime).toLocaleString()}</td>
                <td>{new Date(o.returnTime).toLocaleString()}</td>
                <td>{o.status}</td>
                <td>
                  {o.status === 'Approved' && o.qrCode ? (
                    <Button size="sm" variant="info" onClick={() => setShowQR({ show: true, qr: o.qrCode })}>
                      View QR
                    </Button>
                  ) : o.status === 'Rejected' ? (
                    'Rejected'
                  ) : (
                    'Pending'
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* QR Modal */}
      <Modal show={showQR.show} onHide={() => setShowQR({ show: false, qr: '' })} centered>
        <Modal.Header closeButton>
          <Modal.Title>Approved Outpass QR</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {showQR.qr ? <Image src={showQR.qr} fluid /> : <p>No QR available</p>}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default StudentOutpass;
