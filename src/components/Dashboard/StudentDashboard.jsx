import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const API_BASE =
    "https://hostel-management-backend-eo9s.onrender.com/api";

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [leaves, setLeaves] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);

  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);

  const [outpasses, setOutpasses] = useState([]);
  const [loadingOutpasses, setLoadingOutpasses] = useState(true);

  // Fetch student
  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (!storedStudent) {
      navigate("/login", { replace: true });
      return;
    }
    setStudent(JSON.parse(storedStudent));
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
        setError("Error fetching leaves");
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
        const res = await fetch(
          `${API_BASE}/complaints?rollno=${student.rollNo}`
        );
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.complaints)
          ? data.complaints
          : [];
        setComplaints(list.slice(0, 5));
      } catch (err) {
        setError("Error fetching complaints");
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
        const res = await fetch(
          `${API_BASE}/outpasses?rollno=${student.rollNo}`
        );
        const data = await res.json();
        const list =
          Array.isArray(data) || Array.isArray(data?.outpasses)
            ? data.outpasses || data
            : [];
        setOutpasses(list.slice(0, 5));
      } catch (err) {
        setError("Error fetching outpasses");
      } finally {
        setLoadingOutpasses(false);
      }
    };

    fetchOutpasses();
  }, [student]);

  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const menuItems = [
    { title: "Leave Application", path: "/student/dashboard/leave" },
    { title: "Outpass", path: "/student/dashboard/outpass" },
    { title: "Complaints", path: "/complaints" },
    { title: "Attendance", path: "/attendance" },
  ];

  const formatDateTime = (str) => {
    if (!str) return "";
    return new Date(str).toLocaleString();
  };

  if (loading)
    return (
      <Spinner animation="border" className="d-block mx-auto mt-5" />
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-4" style={{ maxWidth: 1200 }}>
      <Row className="g-4">
        {/* Profile */}
        <Col lg={4}>
          <Card className="shadow rounded-4 border-0 profile-card">
            <Card.Header className="bg-primary text-white text-center rounded-top-4">
              <h5 className="m-0">Student Profile</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <b>Name:</b> {student.name}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Roll No:</b> {student.rollNo}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Room:</b> {student.roomNo}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Department:</b> {student.department}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Year:</b> {student.year}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Parent Contact:</b> {student.parentContact}
                </ListGroup.Item>
              </ListGroup>

              <div className="d-grid mt-3">
                <Button
                  variant="danger"
                  onClick={logout}
                  className="rounded-3 py-2"
                >
                  Logout
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Dashboard */}
        <Col lg={8}>
          {/* Menu */}
          <Row className="g-4 mb-3">
            {menuItems.map((item, i) => (
              <Col md={6} key={i}>
                <Card
                  onClick={() => navigate(item.path)}
                  className="shadow-sm rounded-4 text-center p-4 border-0 menu-card"
                  style={{ cursor: "pointer" }}
                >
                  <div className="fw-semibold fs-5">{item.title}</div>
                  <div className="mt-2 small text-muted">
                    Click to open
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Recent Data */}
          <Row className="g-4">
            {/* Leaves */}
            <Col md={6}>
              <Card className="shadow rounded-4 border-0 section-card">
                <Card.Header className="bg-primary text-white rounded-top-4">
                  Recent Leaves
                </Card.Header>
                <Card.Body>
                  {loadingLeaves ? (
                    <Spinner animation="border" />
                  ) : leaves.length === 0 ? (
                    <p>No leaves found</p>
                  ) : (
                    leaves.map((l) => (
                      <div key={l._id} className="mb-2">
                        <b>{l.reason}</b> — {l.status}
                        <br />
                        <small className="text-muted">
                          {formatDateTime(l.createdAt)}
                        </small>
                      </div>
                    ))
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Complaints */}
            <Col md={6}>
              <Card className="shadow rounded-4 border-0 section-card">
                <Card.Header className="bg-primary text-white rounded-top-4">
                  Recent Complaints
                </Card.Header>
                <Card.Body>
                  {loadingComplaints ? (
                    <Spinner animation="border" />
                  ) : complaints.length === 0 ? (
                    <p>No complaints found</p>
                  ) : (
                    complaints.map((c) => (
                      <div key={c._id} className="mb-2">
                        <b>{c.subject}</b> — {c.status}
                        <br />
                        <small className="text-muted">
                          {formatDateTime(c.createdAt)}
                        </small>
                      </div>
                    ))
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Outpasses */}
            <Col md={12}>
              <Card className="shadow rounded-4 border-0 section-card">
                <Card.Header className="bg-primary text-white rounded-top-4">
                  Recent Outpasses
                </Card.Header>
                <Card.Body>
                  {loadingOutpasses ? (
                    <Spinner animation="border" />
                  ) : outpasses.length === 0 ? (
                    <p>No outpasses found</p>
                  ) : (
                    outpasses.map((o) => (
                      <div key={o._id} className="mb-2">
                        <b>{o.destination}</b> — {o.status}
                        <br />
                        <small className="text-muted">
                          Departure: {formatDateTime(o.departureTime)}{" "}
                          {o.returnTime && (
                            <> | Return: {formatDateTime(o.returnTime)}</>
                          )}
                        </small>
                      </div>
                    ))
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Custom UI Styles */}
      <style>{`
        .menu-card {
          transition: all 0.25s ease;
          background: linear-gradient(145deg, #ffffff, #f3f4f7);
        }
        .menu-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 28px rgba(0,0,0,0.15);
          background: #ffffff;
        }

        .section-card {
          transition: all 0.2s ease;
        }
        .section-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 22px rgba(0,0,0,0.12);
        }

        .profile-card {
          background: #ffffff;
        }
      `}</style>
    </Container>
  );
};

export default StudentDashboard;
