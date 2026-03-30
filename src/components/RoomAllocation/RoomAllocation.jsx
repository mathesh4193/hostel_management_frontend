import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Form,
  Row,
  Col,
  Button,
  Badge,
  Card,
} from "react-bootstrap";

import {
  FaBed,
  FaArrowLeft,
  FaPlus,
  FaHistory,
  FaUser,
  FaDoorOpen,
  FaCalendarAlt,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { roomService } from "../../services/api";

const RoomAllocation = () => {
  const navigate = useNavigate();

  const [allocations, setAllocations] = useState([]);
  const [formData, setFormData] = useState({
    student: "",
    room: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      const res = await roomService.getRoomAllocations();
      setAllocations(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await roomService.allocateRoom(formData);
      fetchAllocations();

      setFormData({
        student: "",
        room: "",
        startDate: "",
        endDate: "",
      });
    } catch (err) {
      alert("Allocation failed");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="ra-root">
      <Container>

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">
            <FaBed /> Room Allocation
          </h3>

          <Button
            variant="dark"
            onClick={() => navigate("/warden/dashboard")}
          >
            <FaArrowLeft /> Back
          </Button>
        </div>

        {/* FORM CARD */}
        <Card className="p-4 mb-4 shadow">
          <h5 className="mb-3">
            <FaPlus /> New Allocation
          </h5>

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Student Roll No</Form.Label>
                  <Form.Control
                    name="student"
                    value={formData.student}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Room No</Form.Label>
                  <Form.Control
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button
              className="mt-3 w-100"
              type="submit"
            >
              Allocate Room
            </Button>
          </Form>
        </Card>

        {/* TABLE */}
        <Card className="shadow">
          <Card.Header>
            <FaHistory /> Allocation History
          </Card.Header>

          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Student</th>
                <th>Room</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {allocations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No records
                  </td>
                </tr>
              ) : (
                allocations.map((a, i) => (
                  <tr key={i}>
                    <td>{a.student}</td>

                    <td>
                      <Badge bg="dark">
                        {a.room}
                      </Badge>
                    </td>

                    <td>
                      {new Date(
                        a.startDate
                      ).toLocaleDateString()}{" "}
                      -
                      {new Date(
                        a.endDate
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <Badge bg="success">
                        Active
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
      </Container>
    </div>
  );
};

export default RoomAllocation;