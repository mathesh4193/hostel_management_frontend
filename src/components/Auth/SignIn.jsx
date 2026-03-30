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

  //  Backend base URL (Render deployment)
  const API_BASE = 'https://hostel-management-backend-eo9s.onrender.com';

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

      //  Now call your deployed backend
      const res = await axios.post(`${API_BASE}${endpoint}`, payload);

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
    <div className="signin-bg py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className={`signin-card fade-in-up role-${activeRole}`}>
              <Card.Body className="p-4">
                <h2 className="text-center mb-1">Sign In</h2>
                <p className="text-center text-muted mb-4">Access your dashboard</p>

                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                <div className="mb-3 text-center">
                  <div className="d-flex mb-3">
                    <Button
                      variant={activeRole === 'student' ? 'primary' : 'outline-primary'}
                      className={`flex-grow-1 me-2 role-toggle-btn ${activeRole === 'student' ? 'active' : ''}`}
                      onClick={() => handleRoleChange('student')}
                    >
                      Student<br />
                      <small>Roll Number & Password</small>
                    </Button>

                    <Button
                      variant={activeRole === 'warden' ? 'primary' : 'outline-primary'}
                      className={`flex-grow-1 role-toggle-btn ${activeRole === 'warden' ? 'active' : ''}`}
                      onClick={() => handleRoleChange('warden')}
                    >
                      Warden<br />
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

                  <Button variant="primary" type="submit" className="w-100 py-2 mb-3 glow-btn">
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
    </div>
  );
};

export default SignIn;
