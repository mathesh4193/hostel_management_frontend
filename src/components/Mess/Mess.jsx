import React from 'react';
import { Container, Table, Row, Col } from 'react-bootstrap';
import { FaUtensils, FaArrowLeft, FaClock, FaCalendarDay } from 'react-icons/fa';
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

  .ms-root {
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

  .ms-container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .ms-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
  }

  .ms-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--cream);
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .ms-table-card {
    background: var(--navy-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(12px);
    overflow: hidden;
    box-shadow: 0 8px 40px rgba(0,0,0,0.4);
  }

  .ms-table {
    margin-bottom: 0;
    color: var(--text-primary);
  }

  .ms-table thead th {
    background: rgba(139,92,246,0.15);
    color: var(--violet);
    font-weight: 700;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 1px;
    padding: 20px;
    border-bottom: 2px solid var(--border);
  }

  .ms-table tbody td {
    padding: 20px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
    font-size: 14px;
    background: transparent !important;
  }

  .ms-day-cell {
    font-weight: 700;
    color: var(--cream);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ms-meal-tag {
    font-size: 11px;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--violet);
    display: block;
    margin-bottom: 5px;
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
`;

const Mess = () => {
  const navigate = useNavigate();
  const messSchedule = {
    Monday: {
      breakfast: 'Idli, Sambar, Chutney',
      lunch: 'Rice, Dal, Vegetables, Curd',
      dinner: 'Chapati, Curry, Rice'
    },
    Tuesday: {
      breakfast: 'Dosa, Chutney, Sambhar',
      lunch: 'Rice, Sambar, Poriyal, Curd',
      dinner: 'Pulao, Veg Gravy, Raita'
    },
    Wednesday: {
      breakfast: 'Pongal, Medu Vada, Chutney',
      lunch: 'Rice, Kara Kuzhambu, Kootu',
      dinner: 'Idli, Sambar, Tomato Chutney'
    },
    Thursday: {
      breakfast: 'Poori, Potato Masala',
      lunch: 'Rice, More Kuzhambu, Veg Fry',
      dinner: 'Parotta, Veg Salna, Onion Raitha'
    },
    Friday: {
      breakfast: 'Uthappam, Sambar, Chutney',
      lunch: 'Veg Biryani, Brinjal Curry, Raitha',
      dinner: 'Dosa, Chutney, Sambar'
    },
    Saturday: {
      breakfast: 'Semiya Upma, Chutney',
      lunch: 'Rice, Rasam, Appalam, Veg',
      dinner: 'Fried Rice, Gobi Manchurian'
    },
    Sunday: {
      breakfast: 'Appam, Coconut Milk',
      lunch: 'Special Meal, Sweet, Curd',
      dinner: 'Chapati, Paneer Butter Masala'
    }
  };

  return (
    <div className="ms-root">
      <style>{styles}</style>
      <Container className="ms-container">
        <div className="ms-header">
          <h1 className="ms-title"><FaUtensils className="text-pink" /> Mess Menu</h1>
          <button className="back-btn" onClick={() => navigate('/student/dashboard')}>
            <FaArrowLeft /> Dashboard
          </button>
        </div>

        <div className="ms-table-card">
          <div className="table-responsive">
            <Table className="ms-table">
              <thead>
                <tr>
                  <th><FaCalendarDay /> Day</th>
                  <th><FaClock /> Breakfast</th>
                  <th><FaClock /> Lunch</th>
                  <th><FaClock /> Dinner</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(messSchedule).map(([day, meals]) => (
                  <tr key={day}>
                    <td className="ms-day-cell">{day}</td>
                    <td>
                      <span className="ms-meal-tag">Morning</span>
                      <span className="text-cream">{meals.breakfast}</span>
                    </td>
                    <td>
                      <span className="ms-meal-tag">Noon</span>
                      <span className="text-cream">{meals.lunch}</span>
                    </td>
                    <td>
                      <span className="ms-meal-tag">Night</span>
                      <span className="text-cream">{meals.dinner}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Mess;