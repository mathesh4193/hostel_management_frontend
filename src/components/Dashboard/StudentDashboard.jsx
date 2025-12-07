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

  // Get logged in student
  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (!stored) {
      navigate("/login", { replace: true });
      return;
    }
    setStudent(JSON.parse(stored));
    setLoading(false);
  }, [navigate]);

  const menuItems = [
    { title: "Profile", path: "/student/profile" },
    { title: "Leave Application", path: "/student/dashboard/leave" },
    { title: "Outpass", path: "/student/dashboard/outpass" },
    { title: "Complaints", path: "/complaints" },
    { title: "Attendance", path: "/attendance" },
  ];

  const formatDateTime = (str) =>
    str ? new Date(str).toLocaleString() : "";

  // Fetch Leaves
  useEffect(() => {
    if (!student?.rollNo) return;

    const loadLeaves = async () => {
      try {
        setLoadingLeaves(true);
        const res = await fetch(`${API_BASE}/leaves?rollno=${student.rollNo}`);
        const data = await res.json();
        setLeaves(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch {
        setError("Error loading leaves");
      } finally {
        setLoadingLeaves(false);
      }
    };

    loadLeaves();
  }, [student]);

  // Fetch Complaints
  useEffect(() => {
    if (!student?.rollNo) return;

    const loadComplaints = async () => {
      try {
        setLoadingComplaints(true);
        const res = await fetch(`${API_BASE}/complaints?rollno=${student.rollNo}`);
        const data = await res.json();
        setComplaints(
          Array.isArray(data)
            ? data.slice(0, 5)
            : Array.isArray(data.complaints)
            ? data.complaints.slice(0, 5)
            : []
        );
      } catch {
        setError("Error loading complaints");
      } finally {
        setLoadingComplaints(false);
      }
    };

    loadComplaints();
  }, [student]);

  // Fetch Outpasses
  useEffect(() => {
    if (!student?.rollNo) return;

    const loadOutpass = async () => {
      try {
        setLoadingOutpasses(true);
        const res = await fetch(`${API_BASE}/outpasses?rollno=${student.rollNo}`);
        const data = await res.json();

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.outpasses)
          ? data.outpasses
          : [];

        setOutpasses(list.slice(0, 5));
      } catch {
        setError("Error loading outpasses");
      } finally {
        setLoadingOutpasses(false);
      }
    };

    loadOutpass();
  }, [student]);

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-4 high-dashboard">
      
      {/* Menu Section */}
      <Row className="g-4 mb-4">
        {menuItems.map((item, i) => (
          <Col key={i} sm={6} lg={4}>
            <Card
              onClick={() => navigate(item.path)}
              className="menu-block glass-card text-center p-4 rounded-4"
            >
              <div className="menu-title">{item.title}</div>
              <small className="text-muted">Tap to open</small>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Data Section */}
      <Row className="g-4">

        {/* Leaves */}
        <Col md={6}>
          <Card className="data-card shadow rounded-4 border-0">
            <Card.Header className="section-header">
              Recent Leaves
            </Card.Header>
            <Card.Body>
              {loadingLeaves ? (
                <Spinner animation="border" />
              ) : leaves.length === 0 ? (
                <p>No leaves found</p>
              ) : (
                leaves.map((item) => (
                  <div key={item._id} className="record">
                    <strong>{item.reason}</strong> — {item.status}
                    <br />
                    <small className="text-muted">
                      {formatDateTime(item.createdAt)}
                    </small>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Complaints */}
        <Col md={6}>
          <Card className="data-card shadow rounded-4 border-0">
            <Card.Header className="section-header">
              Recent Complaints
            </Card.Header>
            <Card.Body>
              {loadingComplaints ? (
                <Spinner animation="border" />
              ) : complaints.length === 0 ? (
                <p>No complaints found</p>
              ) : (
                complaints.map((c) => (
                  <div key={c._id} className="record">
                    <strong>{c.subject}</strong> — {c.status}
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
          <Card className="data-card shadow rounded-4 border-0">
            <Card.Header className="section-header">
              Recent Outpasses
            </Card.Header>
            <Card.Body>
              {loadingOutpasses ? (
                <Spinner animation="border" />
              ) : outpasses.length === 0 ? (
                <p>No outpasses found</p>
              ) : (
                outpasses.map((o) => (
                  <div key={o._id} className="record">
                    <strong>{o.destination}</strong> — {o.status}
                    <br />
                    <small className="text-muted">
                      Departure: {formatDateTime(o.departureTime)}  
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

      {/* Custom CSS */}
      <style>{`
        .high-dashboard {
          animation: fadeIn 0.5s ease-in-out;
        }

        /* Menu blocks */
        .menu-block {
          cursor: pointer;
          font-size: 1.2rem;
          padding: 28px 20px;
          transition: 0.3s ease;
          border-radius: 20px;
        }

        .menu-title {
          font-weight: 600;
          font-size: 1.4rem;
          margin-bottom: 5px;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .menu-block:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.15);
        }

        /* Section headers */
        .section-header {
          background: linear-gradient(135deg, #0d6efd, #3a8bfd);
          color: white;
          font-weight: 600;
          border-radius: 20px 20px 0 0;
          padding: 12px 18px;
        }

        /* Records */
        .record {
          padding: 10px 0;
          border-bottom: 1px solid #e1e1e1;
        }

        .record:last-child {
          border-bottom: none;
        }

        /* Fade animation */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Container>
  );
};

export default StudentDashboard;
