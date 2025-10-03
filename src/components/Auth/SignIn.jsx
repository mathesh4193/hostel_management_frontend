import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignIn.css';

const SignIn = () => {
  const [activeRole, setActiveRole] = useState('student'); // 'student' or 'warden'
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setUserId('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!userId || !password) {
      setError('Please enter all fields');
      return;
    }

    try {
      // Endpoint based on role
      const endpoint =
        activeRole === 'student' ? '/api/auth/student-login' : '/api/auth/warden-login';

      const payload =
        activeRole === 'student'
          ? { rollNo: userId, regNo: password }
          : { userId, password };

      const res = await axios.post(`http://localhost:5000${endpoint}`, payload);

      // Store info in localStorage
      if (activeRole === 'student') {
        localStorage.setItem('token', 'student-token'); // optional token
        localStorage.setItem('role', 'student');
        localStorage.setItem('student', JSON.stringify(res.data.student));
      } else {
        localStorage.setItem('token', 'warden-token'); // optional token
        localStorage.setItem('role', 'warden');
        localStorage.setItem('warden', JSON.stringify(res.data.warden));
      }

      // Navigate to dashboard (absolute path)
      navigate(`/${activeRole}/dashboard`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Sign In</h2>

              {error && <Alert variant="danger">{error}</Alert>}

              {/* Role Selector */}
              <div className="mb-4 text-center">
                <p>Please select your role and enter credentials</p>
                <div className="d-flex mb-4">
                  <Button
                    variant={activeRole === 'student' ? 'primary' : 'outline-primary'}
                    className="flex-grow-1 me-2"
                    onClick={() => handleRoleChange('student')}
                  >
                    Student <br />
                    <small>Roll Number & Password</small>
                  </Button>

                  <Button
                    variant={activeRole === 'warden' ? 'primary' : 'outline-primary'}
                    className="flex-grow-1"
                    onClick={() => handleRoleChange('warden')}
                  >
                    Warden <br />
                    <small>ID & Password</small>
                  </Button>
                </div>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>{activeRole === 'student' ? 'Roll Number' : 'Warden ID'}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={`Enter ${activeRole === 'student' ? 'Roll Number' : 'Warden ID'}`}
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>{activeRole === 'student' ? 'Registration Number' : 'Password'}</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      variant="link"
                      className="position-absolute end-0 top-0 text-decoration-none"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ padding: '0.375rem 0.75rem' }}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 py-2 mb-3">
                  Sign In
                </Button>

                <div className="text-center">
                  <a href="#forgot-password" className="text-decoration-none">
                    Forgot Password?
                  </a>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
