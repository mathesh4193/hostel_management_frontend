import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// PREMIUM ICONS
import {
  FaUserCircle,
  FaClipboardCheck,
  FaExternalLinkAlt,
  FaExclamationCircle,
  FaChartLine
} from "react-icons/fa";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const API_BASE = "https://hostel-management-backend-eo9s.onrender.com/api";

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [leaves, setLeaves] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);

  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);

  const [outpasses, setOutpasses] = useState([]);
  const [loadingOutpasses, setLoadingOutpasses] = useState(true);

  // Fetch student data
  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (!stored) {
      navigate("/login", { replace: true });
      return;
    }
    setStudent(JSON.parse(stored));
    setLoading(false);
  }, [navigate]);

  // MENU ITEMS WITH PREMIUM ICONS
  const menuItems = [
    { title: "Profile", path: "/student/profile", icon: <FaUserCircle size={38} /> },
    { title: "Leave Application", path: "/student/dashboard/leave", icon: <FaClipboardCheck size={38} /> },
    { title: "Outpass", path: "/student/dashboard/outpass", icon: <FaExternalLinkAlt size={38} /> },
    { title: "Complaints", path: "/complaints", icon: <FaExclamationCircle size={38} /> },
    { title: "Attendance", path: "/attendance", icon: <FaChartLine size={38} /> },
  ];

  const formatDateTime = (str) =>
    str ? new Date(str).toLocaleString() : "";

  // Fetch Leaves
  useEffect(() => {
    if (!student?.rollNo) return;

    const fetchLeaves = async () => {
      try {
        setLoadingLeaves(true);
        const res = await fetch(`${API_BASE}/leaves?rollno=${student.rollNo}`);
        const data = await res.json();
        setLeaves(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch {
        setError("Error fetching leaves");
      } finally {
        setLoadingLeaves(false);
      }
    };

    fetchLeaves();
  }, [student]);

  // Fetch Complaints
  useEffect(() => {
    if (!student?.rollNo) return;

    const fetchComplaints = async () => {
      try {
        setLoadingComplaints(true);
        const res = await fetch(`${API_BASE}/complaints?rollno=${student.rollNo}`);
        const data = await res.json();
        const list =
          Array.isArray(data)
            ? data
            : Array.isArray(data.complaints)
            ? data.complaints
            : [];
        setComplaints(list.slice(0, 5));
      } catch {
        setError("Error fetching complaints");
      } finally {
        setLoadingComplaints(false);
      }
    };

    fetchComplaints();
  }, [student]);

  // Fetch Outpasses
  useEffect(() => {
    if (!student?.rollNo) return;

    const fetchOutpass = async () => {
      try {
        setLoadingOutpasses(true);
        const res = await fetch(`${API_BASE}/outpasses?rollno=${student.rollNo}`);
        const data = await res.json();

        const list =
          Array.isArray(data) ||
          Array.isArray(data.outpasses)
            ? data.outpasses || data
            : [];

        setOutpasses(list.slice(0, 5));
      } catch {
        setError("Error fetching outpasses");
      } finally {
        setLoadingOutpasses(false);
      }
    };

    fetchOutpass();
  }, [student]);

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-4">
      <Row className="g-4">

        {/* MENU GRID */}
        <Col lg={12}>
          <Row className="g-4 mb-3">
            {menuItems.map((item, i) => (
              <Col key={i} md={4}>
                <Card
                  onClick={() => navigate(item.path)}
                  className="menu-card text-center p-4 shadow-sm rounded-4 border-0"
                  style={{ cursor: "pointer" }}
                >
                  <div className="menu-icon mb-3">{item.icon}</div>
                  <div className="menu-title fw-semibold fs-5">{item.title}</div>
                  <small className="text-muted">Open</small>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Recent Leaves */}
        <Col md={6}>
          <Card className="data-card shadow rounded-4 border-0">
            <Card.Header className="section-header">
              Recent Leaves
            </Card.Header>
            <Card.Body>
              {loadingLeaves ? <Spinner animation="border" /> : leaves.length === 0 ? (
                <p>No leaves found</p>
              ) : (
                leaves.map((l) => (
                  <div key={l._id} className="record">
                    <strong>{l.reason}</strong> — {l.status}
                    <br />
                    <small className="text-muted">{formatDateTime(l.createdAt)}</small>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Complaints */}
        <Col md={6}>
          <Card className="data-card shadow rounded-4 border-0">
            <Card.Header className="section-header">
              Recent Complaints
            </Card.Header>
            <Card.Body>
              {loadingComplaints ? <Spinner animation="border" /> : complaints.length === 0 ? (
                <p>No complaints found</p>
              ) : (
                complaints.map((c) => (
                  <div key={c._id} className="record">
                    <strong>{c.subject}</strong> — {c.status}
                    <br />
                    <small className="text-muted">{formatDateTime(c.createdAt)}</small>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Outpasses */}
        <Col md={12}>
          <Card className="data-card shadow rounded-4 border-0">
            <Card.Header className="section-header">
              Recent Outpasses
            </Card.Header>
            <Card.Body>
              {loadingOutpasses ? <Spinner animation="border" /> : outpasses.length === 0 ? (
                <p>No outpasses found</p>
              ) : (
                outpasses.map((o) => (
                  <div key={o._id} className="record">
                    <strong>{o.destination}</strong> — {o.status}
                    <br />
                    <small className="text-muted">
                      Departure: {formatDateTime(o.departureTime)}
                      {o.returnTime && <> | Return: {formatDateTime(o.returnTime)}</>}
                    </small>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* CSS */}
      <style>{`
        .menu-card {
          background: #ffffff;
          transition: 0.3s ease;
          border-radius: 22px;
        }
        .menu-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 28px rgba(0,0,0,0.12);
        }
        .menu-icon {
          color: #0d6efd;
          transition: 0.3s ease;
        }
        .menu-card:hover .menu-icon {
          color: #0054d3;
          transform: translateY(-4px);
        }
        .section-header {
          background: linear-gradient(135deg, #0d6efd, #3a8bfd);
          color: white;
          font-weight: 600;
          padding: 12px 18px;
          border-radius: 20px 20px 0 0;
        }
        .record {
          padding: 10px 0;
          border-bottom: 1px solid #e5e5e5;
        }
        .record:last-child {
          border-bottom: none;
        }
      `}</style>
    </Container>
  );
};

export default StudentDashboard;
