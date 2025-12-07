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

  const formatDateTime = (str) => {
    if (!str) return "";
    return new Date(str).toLocaleString();
  };

  // Fetch leaves
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
        setComplaints(
          Array.isArray(data)
            ? data.slice(0, 5)
            : Array.isArray(data.complaints)
            ? data.complaints.slice(0, 5)
            : []
        );
      } catch {
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

    const fetchOutpass = async () => {
      try {
        setLoadingOutpasses(true);
        const res = await fetch(
          `${API_BASE}/outpasses?rollno=${student.rollNo}`
        );
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.outpasses)
          ? data.outpasses
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
    return (
      <Spinner animation="border" className="d-block mx-auto mt-5" />
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-4">
      <Row className="g-4">

        {/* Menu Grid */}
        <Col lg={12}>
          <Row className="g-4 mb-1">
            {menuItems.map((item, i) => (
              <Col key={i} md={4}>
                <Card
                  onClick={() => navigate(item.path)}
                  className="shadow-sm rounded-4 text-center p-4 border-0 menu-card"
                  style={{ cursor: "pointer" }}
                >
                  <div className="fw-bold fs-5">{item.title}</div>
                  <div className="mt-2 small text-muted">Open</div>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Recent Leaves */}
        <Col md={6}>
          <Card className="shadow rounded-4 border-0">
            <Card.Header className="bg-primary text-white rounded-top-4">
              Recent Leaves
            </Card.Header>
            <Card.Body>
              {loadingLeaves ? (
                <Spinner animation="border" />
              ) : leaves.length === 0 ? (
                <p>No leaves</p>
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

        {/* Recent Complaints */}
        <Col md={6}>
          <Card className="shadow rounded-4 border-0">
            <Card.Header className="bg-primary text-white rounded-top-4">
              Recent Complaints
            </Card.Header>
            <Card.Body>
              {loadingComplaints ? (
                <Spinner animation="border" />
              ) : complaints.length === 0 ? (
                <p>No complaints</p>
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

        {/* Recent Outpasses */}
        <Col md={12}>
          <Card className="shadow rounded-4 border-0">
            <Card.Header className="bg-primary text-white rounded-top-4">
              Recent Outpasses
            </Card.Header>
            <Card.Body>
              {loadingOutpasses ? (
                <Spinner animation="border" />
              ) : outpasses.length === 0 ? (
                <p>No outpasses</p>
              ) : (
                outpasses.map((o) => (
                  <div key={o._id} className="mb-2">
                    <b>{o.destination}</b> — {o.status}
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

      {/* Card Hover Style */}
      <style>{`
        .menu-card {
          transition: all 0.25s ease;
          background: linear-gradient(145deg, #ffffff, #f3f4f7);
        }
        .menu-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 26px rgba(0,0,0,0.15);
        }
      `}</style>
    </Container>
  );
};

export default StudentDashboard;
