// src/components/Student/OutpassForm.jsx
import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';

const OutpassForm = () => {
  const student = JSON.parse(localStorage.getItem('student') || '{}');

  const [formData, setFormData] = useState({
    rollNo: student.rollNo || '',
    studentName: student.name || '',
    roomNo: student.roomNo || '',
    destination: '',
    purpose: '',
    departureDate: '',
    departureTime: '',
    returnDate: '',
    returnTime: '',
    emergencyContact: ''
  });

  const [validated, setValidated] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ show: false, message: '', variant: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const payload = {
        ...formData,
        departureTime: `${formData.departureDate}T${formData.departureTime}`,
        returnTime: `${formData.returnDate}T${formData.returnTime}`
      };

      const res = await fetch(`${process.env.REACT_APP_API_URL}/outpasses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to submit outpass');

      setSubmitStatus({ show: true, message: 'Outpass submitted successfully!', variant: 'success' });
      setFormData({ ...formData, destination: '', purpose: '', departureDate: '', departureTime: '', returnDate: '', returnTime: '', emergencyContact: '' });
      setValidated(false);

    } catch (err) {
      setSubmitStatus({ show: true, message: err.message, variant: 'danger' });
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">Outpass Request Form</Card.Header>
        <Card.Body>
          {submitStatus.show && <Alert variant={submitStatus.variant} dismissible onClose={() => setSubmitStatus({ show: false })}>{submitStatus.message}</Alert>}
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}><Form.Group><Form.Label>Roll No</Form.Label><Form.Control type="text" value={formData.rollNo} readOnly /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Name</Form.Label><Form.Control type="text" value={formData.studentName} readOnly /></Form.Group></Col>
            </Row>

            <Form.Group className="mb-3"><Form.Label>Destination</Form.Label><Form.Control required type="text" name="destination" value={formData.destination} onChange={handleChange} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Purpose</Form.Label><Form.Control required as="textarea" rows={3} name="purpose" value={formData.purpose} onChange={handleChange} /></Form.Group>

            <Row className="mb-3">
              <Col md={6}><Form.Group><Form.Label>Departure Date</Form.Label><Form.Control required type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Departure Time</Form.Label><Form.Control required type="time" name="departureTime" value={formData.departureTime} onChange={handleChange} /></Form.Group></Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}><Form.Group><Form.Label>Return Date</Form.Label><Form.Control required type="date" name="returnDate" value={formData.returnDate} onChange={handleChange} /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Return Time</Form.Label><Form.Control required type="time" name="returnTime" value={formData.returnTime} onChange={handleChange} /></Form.Group></Col>
            </Row>

            <Form.Group className="mb-3"><Form.Label>Emergency Contact</Form.Label><Form.Control required type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} /></Form.Group>

            <div className="d-grid"><Button type="submit" variant="primary">Submit Outpass</Button></div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OutpassForm;
