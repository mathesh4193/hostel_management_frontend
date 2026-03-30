import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaTachometerAlt, FaExclamationCircle, FaClipboardCheck, FaSignOutAlt } from 'react-icons/fa';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

  :root {
    --navy:       #0a0f1e;
    --navy-mid:   #111827;
    --navy-card:  rgba(15, 20, 40, 0.72);
    --gold:       #f0c060;
    --cream:      #f5f0ff;
    --text-primary: #eeeaf8;
    --text-muted:   #9b9ec8;
    --border:       rgba(160,130,255,0.18);
    --violet: #a78bfa;
    --radius: 12px;
  }

  .premium-nav {
    background: rgba(8, 13, 26, 0.8) !important;
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 15px 0;
    font-family: 'DM Sans', sans-serif;
  }

  .nav-brand {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: 22px;
    color: var(--cream) !important;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .nav-link-custom {
    color: var(--text-muted) !important;
    font-weight: 500;
    font-size: 15px;
    margin: 0 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s;
    border-radius: 8px;
    padding: 8px 15px !important;
  }

  .nav-link-custom:hover {
    color: var(--violet) !important;
    background: rgba(167, 139, 250, 0.1);
  }

  .nav-link-custom.active {
    color: var(--violet) !important;
    background: rgba(167, 139, 250, 0.15);
  }

  .logout-btn-custom {
    color: #f0606a !important;
    background: rgba(240, 96, 106, 0.1) !important;
    border: 1px solid rgba(240, 96, 106, 0.2) !important;
    font-weight: 600;
    margin-left: 15px;
  }

  .logout-btn-custom:hover {
    background: #f0606a !important;
    color: #fff !important;
  }

  .layout-main {
    margin-top: 80px;
    min-height: calc(100vh - 80px);
    background: #080d1a;
  }
`;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('student/login');
  };

  return (
    <div>
      <style>{styles}</style>
      <Navbar expand="lg" className="premium-nav fixed-top" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/" className="nav-brand">
            <img src="/Vcet_logo.jpg" alt="VCET Logo" height="35" style={{ borderRadius: '8px' }} />
            <span>Hostel <span style={{ color: 'var(--violet)' }}>Management</span></span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className="nav-link-custom">
                <FaHome size={18} /> Home
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className="nav-link-custom">
                <FaInfoCircle size={18} /> About
              </Nav.Link>
              
              {isLoggedIn && userRole === 'student' && (
                <>
                  <Nav.Link as={Link} to="/student/dashboard" className="nav-link-custom">
                    <FaTachometerAlt size={18} /> Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/complaints" className="nav-link-custom">
                    <FaExclamationCircle size={18} /> Complaints
                  </Nav.Link>
                  <Nav.Link as={Link} to="/attendance" className="nav-link-custom">
                    <FaClipboardCheck size={18} /> Attendance
                  </Nav.Link>
                </>
              )}
              
              {isLoggedIn && userRole === 'warden' && (
                <Nav.Link as={Link} to="/warden/dashboard" className="nav-link-custom">
                  <FaTachometerAlt size={18} /> Warden Dashboard
                </Nav.Link>
              )}
            </Nav>
            
            <Nav>
              {!isLoggedIn ? (
                <Nav.Link as={Link} to="student/login" className="nav-link-custom px-4" style={{ color: 'var(--violet) !important' }}>
                  Sign In
                </Nav.Link>
              ) : (
                <Nav.Link onClick={handleLogout} className="nav-link-custom logout-btn-custom px-4">
                  <FaSignOutAlt /> Sign Out
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main className="layout-main">{children}</main>
    </div>
  );
};

export default Layout;