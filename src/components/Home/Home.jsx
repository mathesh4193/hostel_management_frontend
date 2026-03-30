import React, { useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  FaInfoCircle, 
  FaCalendarCheck, 
  FaExclamationTriangle, 
  FaUtensils, 
  FaBed, 
  FaShieldAlt, 
  FaTachometerAlt, 
  FaRunning, 
  FaClipboardList,
  FaArrowRight
} from 'react-icons/fa';
import Footer from '../Layout/Footer';

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

  .home-root {
    min-height: 100vh;
    background: 
      radial-gradient(ellipse 70% 55% at 0% 0%, #1a0533 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 100% 0%, #0c1e4a 0%, transparent 50%),
      radial-gradient(ellipse 75% 60% at 50% 60%, #0f2840 0%, transparent 60%),
      #080d1a;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    padding-top: 100px;
    padding-bottom: 60px;
  }

  .hero-section {
    text-align: center;
    margin-bottom: 80px;
    padding: 0 20px;
  }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(40px, 8vw, 72px);
    font-weight: 700;
    color: var(--cream);
    margin-bottom: 20px;
    line-height: 1.1;
  }

  .hero-subtitle {
    font-size: clamp(16px, 2vw, 20px);
    color: var(--text-muted);
    max-width: 600px;
    margin: 0 auto 40px;
    line-height: 1.6;
  }

  .hero-btn {
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    border: none;
    color: white;
    padding: 16px 40px;
    border-radius: 40px;
    font-weight: 700;
    font-size: 18px;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 8px 30px rgba(139, 92, 246, 0.3);
  }

  .hero-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(139, 92, 246, 0.4);
    opacity: 0.9;
  }

  .section-label {
    text-transform: uppercase;
    letter-spacing: 3px;
    font-weight: 700;
    font-size: 13px;
    color: var(--violet);
    margin-bottom: 15px;
    display: block;
  }

  .features-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .feature-card {
    background: var(--navy-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 40px 30px;
    height: 100%;
    backdrop-filter: blur(12px);
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .feature-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(135deg, rgba(167, 139, 250, 0.1), transparent);
    opacity: 0;
    transition: 0.3s;
  }

  .feature-card:hover {
    transform: translateY(-10px);
    border-color: var(--violet);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  }

  .feature-card:hover::before {
    opacity: 1;
  }

  .feature-icon-wrapper {
    width: 70px;
    height: 70px;
    background: rgba(167, 139, 250, 0.1);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 25px;
    font-size: 28px;
    color: var(--violet);
    transition: 0.3s;
    position: relative;
    z-index: 1;
  }

  .feature-card:hover .feature-icon-wrapper {
    background: var(--violet);
    color: #fff;
    transform: scale(1.1);
  }

  .feature-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--cream);
    margin-bottom: 12px;
    position: relative;
    z-index: 1;
  }

  .feature-desc {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.6;
    position: relative;
    z-index: 1;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const featuresRef = useRef(null);

  const handleFeatureClick = (feature) => {
    const isLoggedIn = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    
    const publicFeatures = ['about', 'complaint', 'attendance'];
    
    if (feature === 'mess' && userRole !== 'warden') {
      alert('Mess menu can only be accessed by wardens');
      return;
    }

    if (feature === 'dashboard') {
      if (userRole === 'warden') {
        navigate('/warden/dashboard');
        return;
      } else if (userRole === 'admin') {
        navigate('/admin/dashboard');
        return;
      }
    }

    if (!isLoggedIn && !publicFeatures.includes(feature)) {
      navigate('student/login', { state: { from: feature } });
      return;
    }

    const navigationPaths = {
      about: '/about',
      leave: '/student/dashboard/leave',
      complaint: '/complaints',
      mess: '/student/dashboard/mess',
      room: '/student/dashboard/roomAllocation',
      security: '/student/dashboard/security',
      dashboard: '/student/dashboard',
      outpass: '/student/dashboard/outpass',
      attendance: '/attendance'
    };

    if (navigationPaths[feature]) {
      navigate(navigationPaths[feature]);
    }
  };

  const features = [
    { id: 'about', title: 'About Us', desc: 'Learn more about our hostel facilities and vision.', icon: <FaInfoCircle /> },
    { id: 'leave', title: 'Leave Management', desc: 'Apply for leaves and track status online.', icon: <FaCalendarCheck /> },
    { id: 'complaint', title: 'Complaints', desc: 'Submit and track your maintenance or service issues.', icon: <FaExclamationTriangle /> },
    { id: 'mess', title: 'Mess Menu', desc: 'Check today\'s daily menu and dietary info.', icon: <FaUtensils /> },
    { id: 'room', title: 'Room Allocation', desc: 'View your room details and request changes.', icon: <FaBed /> },
    { id: 'security', title: 'Security', desc: 'Campus safety protocols and emergency contacts.', icon: <FaShieldAlt /> },
    { id: 'dashboard', title: 'Dashboard', desc: 'Quick access to your personal portal.', icon: <FaTachometerAlt /> },
    { id: 'outpass', title: 'Out Pass', desc: 'Request temporary out pass for short leaves.', icon: <FaRunning /> },
    { id: 'attendance', title: 'Attendance', desc: 'Daily location-based secure check-ins.', icon: <FaClipboardList /> },
  ];

  return (
    <div className="home-root">
      <style>{styles}</style>
      
      <Container className="hero-section">
        <span className="section-label">Welcome to Excellence</span>
        <h1 className="hero-title">VCET <span style={{ color: 'var(--violet)' }}>Hostel</span></h1>
        <p className="hero-subtitle">
          Managing student accommodation with modern technology, ensuring safety, comfort, and seamless daily operations.
        </p>
        <button className="hero-btn" onClick={() => navigate('student/login')}>
          Get Started <FaArrowRight />
        </button>
      </Container>

      <div className="features-container" ref={featuresRef}>
        <div className="text-center mb-5">
          <span className="section-label">Our Features</span>
          <h2 style={{ fontFamily: 'Playfair Display', color: 'var(--cream)', fontWeight: 700 }}>Smart Management</h2>
        </div>
        
        <Row className="g-4">
          {features.map((feature) => (
            <Col key={feature.id} lg={4} md={6}>
              <div className="feature-card" onClick={() => handleFeatureClick(feature.id)}>
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
                <div style={{ marginTop: 'auto', paddingTop: '20px', color: 'var(--violet)', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Explore <FaArrowRight size={10} />
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
