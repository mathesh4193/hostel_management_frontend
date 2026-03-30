import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { FaShieldAlt, FaArrowLeft, FaPhoneAlt, FaLock, FaExclamationCircle, FaUserShield } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────
   PREMIUM UI — INLINE STYLES
   ───────────────────────────────────────────── */
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
    --pink:   #f472b6;
    --cyan:   #38bdf8;
    --radius: 20px;
  }

  .sc-root {
    min-height: 100vh;
    background: 
      radial-gradient(ellipse 70% 55% at 0% 0%, #1a0533 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 100% 0%, #0c1e4a 0%, transparent 50%),
      radial-gradient(ellipse 75% 60% at 50% 60%, #0f2840 0%, transparent 60%),
      #080d1a;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    padding: 40px 20px;
  }

  .sc-container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .sc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
  }

  .sc-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--cream);
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .sc-card {
    background: var(--navy-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(12px);
    padding: 30px;
    height: 100%;
    box-shadow: 0 8px 40px rgba(0,0,0,0.4);
  }

  .sc-icon-circle {
    width: 50px;
    height: 50px;
    background: rgba(167, 139, 250, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--violet);
    font-size: 20px;
    margin-bottom: 20px;
  }

  .contact-item {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 15px 20px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: 0.3s;
  }

  .contact-item:hover {
    background: rgba(255,255,255,0.06);
    border-color: var(--violet);
  }

  .back-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 8px 16px;
    border-radius: 10px;
    font-size: 14px;
    transition: 0.2s;
  }

  .back-btn:hover {
    background: rgba(255,255,255,0.1);
    color: var(--cream);
  }

  .protocol-list .list-group-item {
    background: transparent;
    border: none;
    color: var(--text-muted);
    padding: 10px 0;
    display: flex;
    gap: 15px;
    font-size: 14px;
  }

  .protocol-list .list-group-item svg {
    color: var(--cyan);
    margin-top: 4px;
    flex-shrink: 0;
  }
`;

const Security = () => {
  const navigate = useNavigate();

  const emergencyContacts = [
    { name: 'Chief Warden', phone: '+91 99949 94991', icon: <FaUserShield /> },
    { name: 'Campus Security', phone: '+91 98765 43210', icon: <FaShieldAlt /> },
    { name: 'Hostel Office', phone: '0452-2465212', icon: <FaPhoneAlt /> },
    { name: 'Medical Emergency', phone: '108', icon: <FaExclamationCircle /> },
  ];

  return (
    <div className="sc-root">
      <style>{styles}</style>
      <Container className="sc-container">
        <div className="sc-header">
          <h1 className="sc-title"><FaShieldAlt className="text-pink" /> Security</h1>
          <button className="back-btn" onClick={() => navigate('/student/dashboard')}>
            <FaArrowLeft /> Dashboard
          </button>
        </div>

        <Row className="g-4">
          <Col lg={7}>
            <Card className="sc-card">
              <div className="sc-icon-circle"><FaLock /></div>
              <h4 className="text-cream mb-4">Campus Safety Protocols</h4>
              <ListGroup className="protocol-list">
                <ListGroup.Item>
                  <FaShieldAlt size={14} />
                  <span>Entry and exit are restricted after 9:00 PM for all students.</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaShieldAlt size={14} />
                  <span>Biometric attendance is mandatory for every check-in and check-out.</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaShieldAlt size={14} />
                  <span>Outpass requests must be approved by the warden 24 hours in advance.</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaShieldAlt size={14} />
                  <span>Possession of unauthorized electronics or prohibited items is strictly forbidden.</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaShieldAlt size={14} />
                  <span>CCTV surveillance is active 24/7 in all common areas and corridors.</span>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>

          <Col lg={5}>
            <Card className="sc-card">
              <div className="sc-icon-circle"><FaPhoneAlt /></div>
              <h4 className="text-cream mb-4">Emergency Contacts</h4>
              {emergencyContacts.map((contact, idx) => (
                <div key={idx} className="contact-item">
                  <div className="d-flex align-items-center gap-3">
                    <span style={{ color: 'var(--violet)' }}>{contact.icon}</span>
                    <div>
                      <div className="fw-bold text-cream small">{contact.name}</div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>Available 24/7</div>
                    </div>
                  </div>
                  <a href={`tel:${contact.phone}`} className="text-decoration-none" style={{ color: 'var(--cyan)', fontWeight: 700 }}>
                    {contact.phone}
                  </a>
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Security;