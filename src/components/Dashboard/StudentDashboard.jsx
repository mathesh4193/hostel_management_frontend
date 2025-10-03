import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const API_BASE = 'https://hostel-management-backend-eo9s.onrender.com/api';

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [leaves, setLeaves] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);

  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);

  const [outpasses, setOutpasses] = useState([]);
  const [loadingOutpasses, setLoadingOutpasses] = useState(true);

  // Fetch logged-in student info
  useEffect(() => {
    const storedStudent = localStorage.getItem('student');
    if (!storedStudent) {
      navigate('/login', { replace: true });
      return;
    }
    const s = JSON.parse(storedStudent);
    setStudent(s);
    setLoading(false);
  }, [navigate]);

  // Fetch leaves
  useEffect(() => {
    if (!student?.rollNo) return;

    const fetchLeaves = async () => {
      try {
        setLoadingLeaves(true);
        const res = await fetch(`${API_BASE}/leaves?rollno=${student.rollNo}`);
        const data = await res.json();
        setLeaves(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch (err) {
        console.error('Error fetching leaves:', err);
        setError('Error fetching leaves.');
        setLeaves([]);
      } finally {
        setLoadingLeaves(false);
      }
    };

    fetchLeaves();
  }, [student]);

  // Fetch complaints
  useEffect(() => {
    if (!student?.rollNo) return;

    const fetchComplaints = async () => {
      try {
        setLoadingComplaints(true);
        const res = await fetch(`${API_BASE}/complaints?rollno=${student.rollNo}`);
        const data = await res.json();
        const complaintsList = Array.isArray(data) ? data : Array.isArray(data.complaints) ? data.complaints : [];
        setComplaints(complaintsList.slice(0, 5));
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setError('Error fetching complaints.');
        setComplaints([]);
      } finally {
        setLoadingComplaints(false);
      }
    };

    fetchComplaints();
  }, [student]);

  // Fetch outpasses
  useEffect(() => {
    if (!student?.rollNo) return;

    const fetchOutpasses = async () => {
      try {
        setLoadingOutpasses(true);
        const res = await fetch(`${API_BASE}/outpasses?rollno=${student.rollNo}`);
        const data = await res.json();
        const outpassList = Array.isArray(data)
          ? data
          : Array.isArray(data.outpasses)
            ? data.outpasses
            : [];
        setOutpasses(outpassList.slice(0, 5));
      } catch (err) {
        console.error('Error fetching outpasses:', err);
        setError('Error fetching outpasses.');
        setOutpasses([]);
      } finally {
        setLoadingOutpasses(false);
      }
    };

    fetchOutpasses();
  }, [student]);

  const handleLogout = () => {
    localStorage.removeItem('student');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { title: 'Leave Application', path: '/student/dashboard/leave', icon: '📝' },
    { title: 'Outpass', path: '/student/dashboard/outpass', icon: '🚪' },
    { title: 'Complaints', path: '/complaints', icon: '⚠️' },
    { title: 'Attendance', path: 'attendance', icon: '📊' },
  ];

  if (loading) return <Spinner animation="border" className="d-block mx-auto my-5" />;
  if (error) return <Alert variant="danger" className="my-5 text-center">{error}</Alert>;

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '' : d.toLocaleString();
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        {/* Profile */}
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white text-center">
              <h4>My Profile</h4>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item><strong>Name:</strong> {student.name}</ListGroup.Item>
                <ListGroup.Item><strong>Roll Number:</strong> {student.rollNo}</ListGroup.Item>
                <ListGroup.Item><strong>Room No:</strong> {student.roomNo}</ListGroup.Item>
                <ListGroup.Item><strong>Department:</strong> {student.department}</ListGroup.Item>
                <ListGroup.Item><strong>Year:</strong> {student.year}</ListGroup.Item>
                <ListGroup.Item><strong>Parent Contact:</strong> {student.parentContact}</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          <div className="d-grid mt-3">
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </div>
        </Col>

        {/* Dashboard */}
        <Col md={8}>
          {/* Menu */}
          <Row className="g-4 mb-4">
            {menuItems.map((item, idx) => (
              <Col key={idx} md={6}>
                <Card
                  className="h-100 text-center hover-card"
                  onClick={() => navigate(item.path)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body>
                    <div className="display-4 mb-3">{item.icon}</div>
                    <Card.Title>{item.title}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Recent Leaves */}
          <Row>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header className="bg-primary text-white">Recent Leaves</Card.Header>
                <Card.Body>
                  {loadingLeaves ? <Spinner animation="border" /> :
                    leaves.length === 0 ? <p>No recent leaves</p> :
                      <ul className="list-unstyled">
                        {leaves.map(l => (
                          <li key={l._id}>
                            <strong>{l.reason || l.purpose}</strong> - {l.status}<br />
                            <small>{formatDateTime(l.createdAt)}</small>
                          </li>
                        ))}
                      </ul>
                  }
                </Card.Body>
              </Card>
            </Col>

            {/* Recent Complaints */}
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header className="bg-primary text-white">Recent Complaints</Card.Header>
                <Card.Body>
                  {loadingComplaints ? <Spinner animation="border" /> :
                    complaints.length === 0 ? <p>No recent complaints</p> :
                      <ul className="list-unstyled">
                        {complaints.map(c => (
                          <li key={c._id}>
                            <strong>{c.subject}</strong> - {c.status}<br />
                            <small>{formatDateTime(c.createdAt)}</small>
                          </li>
                        ))}
                      </ul>
                  }
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Outpasses */}
          <Row>
            <Col md={12}>
              <Card className="mb-4">
                <Card.Header className="bg-primary text-white">Recent Outpasses</Card.Header>
                <Card.Body>
                  {loadingOutpasses ? <Spinner animation="border" /> :
                    outpasses.length === 0 ? <p>No recent outpasses</p> :
                      <ul className="list-unstyled">
                        {outpasses.map(o => (
                          <li key={o._id}>
                            <strong>{o.destination}</strong> - {o.status}<br />
                            {o.departureTime && o.returnTime && (
                              <>Departure: {formatDateTime(o.departureTime)} | Return: {formatDateTime(o.returnTime)}</>
                            )}
                          </li>
                        ))}
                      </ul>
                  }
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDashboard;
