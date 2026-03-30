import React from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { 
  FaHome, 
  FaUsers, 
  FaWifi, 
  FaShieldAlt, 
  FaUtensils, 
  FaGamepad, 
  FaBookReader, 
  FaMedkit,
  FaLightbulb,
  FaBullseye
} from 'react-icons/fa';

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

  .ab-root {
    min-height: 100vh;
    background: 
      radial-gradient(ellipse 70% 55% at 0% 0%, #1a0533 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 100% 0%, #0c1e4a 0%, transparent 50%),
      radial-gradient(ellipse 75% 60% at 50% 60%, #0f2840 0%, transparent 60%),
      #080d1a;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    padding: 60px 20px;
  }

  .ab-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .ab-header {
    text-align: center;
    margin-bottom: 60px;
  }

  .ab-title {
    font-family: 'Playfair Display', serif;
    font-size: 48px;
    font-weight: 700;
    color: var(--cream);
    margin-bottom: 15px;
  }

  .ab-subtitle {
    color: var(--violet);
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-size: 14px;
  }

  .ab-card {
    background: var(--navy-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(12px);
    padding: 30px;
    height: 100%;
    transition: transform 0.3s;
  }
  .ab-card:hover { transform: translateY(-5px); border-color: var(--violet); }

  .ab-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--cream);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .ab-text {
    color: var(--text-muted);
    line-height: 1.7;
    font-size: 15px;
  }

  .ab-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .ab-list-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    color: var(--text-primary);
    font-size: 14px;
  }
  .ab-icon-circle {
    width: 32px;
    height: 32px;
    background: rgba(167,139,250,0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--violet);
    flex-shrink: 0;
  }

  .ab-table-card {
    background: var(--navy-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(12px);
    overflow: hidden;
    margin-top: 40px;
  }

  .ab-table {
    margin-bottom: 0;
    color: var(--text-primary);
  }
  .ab-table thead th {
    background: rgba(139,92,246,0.15);
    color: var(--violet);
    font-weight: 700;
    text-transform: uppercase;
    font-size: 13px;
    letter-spacing: 1.5px;
    padding: 22px 20px;
    border-bottom: 2px solid var(--border);
  }
  .ab-table tbody td {
    padding: 20px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
    font-size: 15px;
    color: var(--text-primary);
    background: transparent !important;
  }
  .ab-table .ab-designation {
    color: var(--cyan);
    font-weight: 500;
    font-size: 14px;
  }
  .ab-table a { color: var(--violet); text-decoration: none; font-weight: 600; }
  .ab-table a:hover { color: var(--pink); }

  .vision-mission-box {
    background: rgba(255,255,255,0.03);
    border-radius: 15px;
    padding: 25px;
    border: 1px solid var(--border);
  }

  .footer-text {
    text-align: center;
    margin-top: 60px;
    color: var(--text-muted);
    font-size: 13px;
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    .ab-title { font-size: 36px; }
    .ab-root { padding: 40px 15px; }
  }
`;

const About = () => {
  return (
    <div className="ab-root">
      <style>{styles}</style>
      
      <div className="ab-container">
        <header className="ab-header">
          <div className="ab-subtitle">Velammal College of Engineering & Technology</div>
          <h1 className="ab-title">About VCET Hostel</h1>
          <div style={{ width: 60, height: 4, background: 'var(--violet)', margin: '0 auto', borderRadius: 2 }}></div>
        </header>

        <Row className="g-4 mb-4">
          <Col md={6}>
            <div className="ab-card">
              <h2 className="ab-card-title"><FaHome className="text-violet" /> Your Second Home</h2>
              <p className="ab-text">
                The students can live away from home, with all the comforts they are used to plus added conveniences. 
                At VCET, students are part of a diverse and lively community of scholars. The hostel is dedicated to providing 
                a safe space to explore campus life, whether academic, athletic, cultural, recreational, or social.
              </p>
            </div>
          </Col>
          <Col md={6}>
            <div className="ab-card">
              <h2 className="ab-card-title"><FaUsers className="text-pink" /> Student Activities</h2>
              <p className="ab-text">
                For all-round development, the college offers various student activities ranging from sports and hobbies 
                to technical interests. Students are encouraged to join clubs like the Robotics Club, Programming Club, 
                Application Development Club, and Computer Services Center to build organizational skills.
              </p>
            </div>
          </Col>
        </Row>

        <Row className="g-4 mb-4">
          <Col md={6}>
            <div className="ab-card">
              <h2 className="ab-card-title"><FaUtensils className="text-gold" /> Hostel Facilities</h2>
              <p className="ab-text">
                Separate hostels are available for boys and girls, with accommodations for 360 boys and 420 girls. 
                The mess is spacious, with separate seating arrangements for vegetarians and non-vegetarians, ensuring 
                a comfortable dining experience for all residents.
              </p>
            </div>
          </Col>
          <Col md={6}>
            <div className="ab-card">
              <h2 className="ab-card-title"><FaLightbulb className="text-cyan" /> Modern Amenities</h2>
              <div className="row">
                <div className="col-6">
                  <ul className="ab-list">
                    <li className="ab-list-item"><div className="ab-icon-circle"><FaWifi size={14}/></div> Wi-Fi Campus</li>
                    <li className="ab-list-item"><div className="ab-icon-circle"><FaShieldAlt size={14}/></div> 24/7 Security</li>
                    <li className="ab-list-item"><div className="ab-icon-circle"><FaUtensils size={14}/></div> Hygienic Food</li>
                  </ul>
                </div>
                <div className="col-6">
                  <ul className="ab-list">
                    <li className="ab-list-item"><div className="ab-icon-circle"><FaGamepad size={14}/></div> Recreation</li>
                    <li className="ab-list-item"><div className="ab-icon-circle"><FaBookReader size={14}/></div> Study Rooms</li>
                    <li className="ab-list-item"><div className="ab-icon-circle"><FaMedkit size={14}/></div> Medical Care</li>
                  </ul>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="ab-table-card">
          <div style={{ padding: '25px 25px 5px', borderBottom: '1px solid var(--border)' }}>
            <h2 className="ab-card-title m-0"><FaUsers className="text-violet" /> Hostel Administration</h2>
          </div>
          <div className="table-responsive">
            <Table className="ab-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Contact Number</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-bold text-cream">Dr. P. Alli, Principal</td>
                  <td><span className="ab-designation">Chief Warden</span></td>
                  <td><a href="tel:+919443566537">9443566537</a></td>
                </tr>
                <tr>
                  <td className="fw-bold text-cream">Dr. S. Gopalakrishnan</td>
                  <td><span className="ab-designation">Warden/Men's Hostel</span></td>
                  <td><a href="tel:+917373018067">7373018067</a></td>
                </tr>
                <tr>
                  <td className="fw-bold text-cream">Mrs. A. Maheswari</td>
                  <td><span className="ab-designation">Warden/Ladies Hostel</span></td>
                  <td><a href="tel:+919150343292">9150343292</a></td>
                </tr>
                <tr>
                  <td className="fw-bold text-cream">Mr. P. Radhakrishnan</td>
                  <td><span className="ab-designation">Deputy Warden / Men's Hostel</span></td>
                  <td><a href="tel:+919363338971">9363338971</a></td>
                </tr>
                <tr>
                  <td className="fw-bold text-cream">Mr. R. Thavamani</td>
                  <td><span className="ab-designation">Deputy Warden / Men's Hostel</span></td>
                  <td><a href="tel:+919566513579">9566513579</a></td>
                </tr>
                <tr>
                  <td className="fw-bold text-cream">Ms. N. Alima Banu</td>
                  <td><span className="ab-designation">Deputy Warden / Women's Hostel</span></td>
                  <td><a href="tel:+919944566610">9944566610</a></td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>

        <div className="ab-card mt-4">
          <h2 className="ab-card-title"><FaBullseye className="text-pink" /> Vision & Mission</h2>
          <Row className="g-4">
            <Col md={6}>
              <div className="vision-mission-box">
                <h5 style={{ color: 'var(--violet)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 }}>Vision</h5>
                <p className="ab-text m-0">To revolutionize academic administration through innovative digital solutions that enhance the educational experience for every resident.</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="vision-mission-box">
                <h5 style={{ color: 'var(--pink)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 }}>Mission</h5>
                <p className="ab-text m-0">Creating seamless connections between students, faculty, and administration while maintaining the highest levels of transparency and efficiency.</p>
              </div>
            </Col>
          </Row>
        </div>

        <footer className="footer-text">
          <p>A proud initiative developed by Department of Computer Science and Engineering.</p>
        </footer>
      </div>
    </div>
  );
};

export default About;
