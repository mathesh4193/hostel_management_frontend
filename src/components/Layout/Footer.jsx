import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaEnvelope, FaPhoneAlt, FaGlobe, FaMapMarkerAlt, FaCode } from 'react-icons/fa';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

  .premium-footer {
    background: rgba(8, 13, 26, 0.95);
    border-top: 1px solid rgba(160, 130, 255, 0.15);
    padding: 60px 0 30px;
    color: #9b9ec8;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    z-index: 10;
  }

  .footer-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: #f5f0ff;
    margin-bottom: 25px;
    letter-spacing: 0.5px;
  }

  .footer-logo-container {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .footer-logo-img {
    height: 45px;
    border-radius: 8px;
    border: 1px solid rgba(167, 139, 250, 0.3);
  }

  .footer-text {
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .footer-link-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #9b9ec8;
    text-decoration: none;
    margin-bottom: 12px;
    font-size: 14px;
    transition: all 0.3s;
  }

  .footer-link-item:hover {
    color: #a78bfa;
    transform: translateX(5px);
  }

  .footer-contact-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 15px;
    font-size: 14px;
  }

  .footer-icon {
    color: #a78bfa;
    margin-top: 3px;
    flex-shrink: 0;
  }

  .footer-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(160, 130, 255, 0.2), transparent);
    margin: 40px 0 25px;
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
    font-size: 13px;
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    .footer-bottom {
      flex-direction: column;
      text-align: center;
    }
  }
`;

const Footer = () => {
  const location = useLocation();
  
  // Hide footer on dashboard pages if preferred, but usually home needs it
  const isDashboardPage = location.pathname.includes('dashboard');
  if (isDashboardPage) return null;

  return (
    <footer className="premium-footer">
      <style>{styles}</style>
      <Container>
        <Row className="g-5">
          <Col lg={4} md={6}>
            <div className="footer-logo-container">
              <img src="/Vcet_logo.jpg" alt="VCET Logo" className="footer-logo-img" />
              <div className="footer-title mb-0">VCET <span style={{ color: '#a78bfa' }}>Hostel</span></div>
            </div>
            <p className="footer-text">
              Velammal College of Engineering and Technology - Madurai. Providing a secure and modern living environment for students with excellence in management and technology.
            </p>
            <div className="footer-contact-item">
              <FaMapMarkerAlt className="footer-icon" />
              <span>Velammal Nagar, Viraganoor, Madurai - 625009, Tamil Nadu, India.</span>
            </div>
          </Col>

          <Col lg={4} md={6}>
            <h4 className="footer-title">Quick Links</h4>
            <div className="d-flex flex-column">
              <Link to="/" className="footer-link-item">Home</Link>
              <Link to="/about" className="footer-link-item">About Us</Link>
              <a href="https://vcet.ac.in/vcetit/hostel.html" target="_blank" rel="noopener noreferrer" className="footer-link-item">
                VCET Hostel Official Page
              </a>
              <a href="https://www.vcet.ac.in" target="_blank" rel="noopener noreferrer" className="footer-link-item">
                <FaGlobe className="footer-icon" /> University Website
              </a>
            </div>
          </Col>

          <Col lg={4} md={12}>
            <h4 className="footer-title">Contact Support</h4>
            <div className="footer-contact-item">
              <FaEnvelope className="footer-icon" />
              <a href="mailto:principal@vcet.ac.in" style={{ color: 'inherit', textDecoration: 'none' }}>principal@vcet.ac.in</a>
            </div>
            <div className="footer-contact-item">
              <FaPhoneAlt className="footer-icon" />
              <a href="tel:9994994991" style={{ color: 'inherit', textDecoration: 'none' }}>+91 99949 94991</a>
            </div>
            <div className="mt-4 p-3" style={{ background: 'rgba(167, 139, 250, 0.05)', borderRadius: '12px', border: '1px solid rgba(167, 139, 250, 0.1)' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <FaCode style={{ color: '#a78bfa' }} />
                <span className="small fw-bold text-cream">Development Team</span>
              </div>
              <p className="small mb-0">Designed and Developed by Department of Computer Science and Engineering.</p>
            </div>
          </Col>
        </Row>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} VCET Hostel Management. All rights reserved.</div>
          <div className="d-flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;