import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Layout and Components
import Layout from './components/Layout/Layout.jsx';
import Home from './components/Home/Home.jsx';
import SignIn from './components/Auth/SignIn.jsx';
import StudentDashboard from './components/Dashboard/StudentDashboard.jsx';
import WardenDashboard from './components/Dashboard/WardenDashboard.jsx';
import About from './components/About/About.jsx';
import Leave from './components/Leave/Leave.jsx';
import Complaints from './components/Complaints/Complaints.jsx';
import OutpassForm from './components/Outpass/OutpassForm.jsx';
import Attendance from './components/Attendance/Attendance.jsx';
import Students from './components/Warden/Students.jsx';
import LeaveRequests from './components/Warden/LeaveRequests.jsx';
import PrivateRoute from './components/Auth/PrivateRoute.jsx';

// Update imports
import WardenComplaints from './components/Warden/Complaints.jsx';

// Add this import at the top
import Outpass from './components/Warden/Outpass.jsx';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="student/login" element={<SignIn />} />
          
          {/* Student Dashboard Routes - Protected with PrivateRoute */}
          <Route path="/student/dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
          <Route path="/student/dashboard/leave" element={<PrivateRoute><Leave /></PrivateRoute>} />
          <Route path="/student/dashboard/outpass" element={<PrivateRoute><OutpassForm /></PrivateRoute>} />
          <Route path="/complaints" element={<PrivateRoute><Complaints /></PrivateRoute>} />
          <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />

          {/* Warden Dashboard */}
          <Route path="/warden/dashboard" element={<PrivateRoute><WardenDashboard /></PrivateRoute>} />
          {/* OutpassForm Routes */}
          <Route path="/student/dashboard/outpass" element={<OutpassForm />} />
          <Route path="/outpass" element={<OutpassForm />} />
          <Route path="/warden/students" element={<Students />} />
          {/* Inside your Router configuration */}
          <Route path="/warden/leave-requests" element={<LeaveRequests />} />
          {/* Add this route in your Routes component */}
          <Route path="/warden/outpass" element={<Outpass />} />
          {/* Add this route in your Routes section */}
          <Route path="/warden/complaints" element={<WardenComplaints />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
