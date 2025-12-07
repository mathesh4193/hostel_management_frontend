import React, { useEffect, useState } from "react";
import { Card, ListGroup, Container, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const StudentProfile = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    const storedPhoto = localStorage.getItem("studentPhoto");

    if (!storedStudent) {
      navigate("/login", { replace: true });
      return;
    }

    setStudent(JSON.parse(storedStudent));
    if (storedPhoto) setPhoto(storedPhoto);
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!student) return null;

  // Get initials for default avatar
  const initials = student.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Handle profile photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
      localStorage.setItem("studentPhoto", reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Save edited data
  const saveProfile = () => {
    localStorage.setItem("student", JSON.stringify(student));
    setEditing(false);
  };

  return (
    <Container style={{ maxWidth: 650 }} className="py-5">

      <Card className="shadow-lg rounded-4 border-0 profile-card">

        {/* Profile Header */}
        <div className="profile-header text-center text-white p-4 rounded-top-4">

          <label style={{ cursor: "pointer" }}>
            <div className="avatar mx-auto mb-3">
              {photo ? (
                <img
                  src={photo}
                  alt="profile"
                  className="avatar-img"
                />
              ) : (
                initials
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: "none" }}
            />
          </label>

          <h3 className="fw-bold">{student.name}</h3>
          <p className="opacity-75 m-0">{student.department}</p>
        </div>

        <Card.Body className="p-4">

          <h5 className="fw-bold mb-3 text-primary">Profile Information</h5>

          {editing ? (
            <>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    value={student.name}
                    onChange={(e) =>
                      setStudent({ ...student, name: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Room No</Form.Label>
                  <Form.Control
                    value={student.roomNo}
                    onChange={(e) =>
                      setStudent({ ...student, roomNo: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Parent Contact</Form.Label>
                  <Form.Control
                    value={student.parentContact}
                    onChange={(e) =>
                      setStudent({ ...student, parentContact: e.target.value })
                    }
                  />
                </Form.Group>
              </Form>

              <div className="d-flex gap-2">
                <Button className="w-50" variant="success" onClick={saveProfile}>
                  Save
                </Button>
                <Button
                  className="w-50"
                  variant="secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item><b>Roll No:</b> {student.rollNo}</ListGroup.Item>
                <ListGroup.Item><b>Room No:</b> {student.roomNo}</ListGroup.Item>
                <ListGroup.Item><b>Department:</b> {student.department}</ListGroup.Item>
                <ListGroup.Item><b>Year:</b> {student.year}</ListGroup.Item>
                <ListGroup.Item><b>Parent Contact:</b> {student.parentContact}</ListGroup.Item>
              </ListGroup>

              <Button
                className="w-100 mb-3 py-2 rounded-3"
                variant="primary"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>

              <Button
                variant="danger"
                className="w-100 py-2 rounded-3"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Custom CSS */}
      <style>{`
        .profile-header {
          background: linear-gradient(135deg, #0d6efd, #3a8bfd);
        }

        .avatar {
          width: 100px;
          height: 100px;
          background: white;
          color: #0d6efd;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 35px;
          font-weight: bold;
          box-shadow: 0 6px 14px rgba(255,255,255,0.3);
          overflow: hidden;
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-card {
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .profile-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
      `}</style>

    </Container>
  );
};

export default StudentProfile;
