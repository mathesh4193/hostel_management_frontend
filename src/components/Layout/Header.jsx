import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const styles = `
  .premium-header {
    background: transparent !important;
    border-bottom: 1px solid rgba(160, 130, 255, 0.1);
    margin-top: 80px;
    padding: 25px 0;
  }

  .header-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: #f5f0ff;
    letter-spacing: 0.5px;
  }
`;

const Header = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/about') return 'About VCET Hostel';
    if (path === '/complaints') return 'Complaints';
    if (path === '/attendance') return 'Smart Attendance';
    if (path.includes('/student/dashboard')) return 'Student Dashboard';
    if (path.includes('/warden/dashboard')) return 'Warden Dashboard';
    if (path === '/outpass') return 'Out Pass Management';
    return 'VCET Hostel';
  };

  return (
    <Navbar className="premium-header shadow-none">
      <style>{styles}</style>
      <Container>
        <div className="d-flex align-items-center gap-3">
          <div style={{ width: '4px', height: '30px', background: 'var(--violet)', borderRadius: '2px' }}></div>
          <h2 className="header-title mb-0">{getPageTitle()}</h2>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;