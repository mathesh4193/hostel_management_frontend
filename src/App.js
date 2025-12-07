import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout & Common Components
import Layout from "./components/Layout/Layout.jsx";
import Home from "./components/Home/Home.jsx";
import About from "./components/About/About.jsx";

// Auth
import SignIn from "./components/Auth/SignIn.jsx";
import PrivateRoute from "./components/Auth/PrivateRoute.jsx";

// Student Components
import StudentDashboard from "./components/Dashboard/StudentDashboard.jsx";
import Leave from "./components/Leave/Leave.jsx";
import Complaints from "./components/Complaints/Complaints.jsx";
import OutpassForm from "./components/Outpass/OutpassForm.jsx";
import Attendance from "./components/Attendance/Attendance.jsx";

// NEW — Profile Page
import StudentProfile from "./pages/StudentProfile.jsx";

// Warden Components
import WardenDashboard from "./components/Dashboard/WardenDashboard.jsx";
import Students from "./components/Warden/Students.jsx";
import LeaveRequests from "./components/Warden/LeaveRequests.jsx";
import WardenComplaints from "./components/Warden/Complaints.jsx";
import Outpass from "./components/Warden/Outpass.jsx";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/student/login" element={<SignIn />} />

          {/* Student Protected Routes */}
          <Route
            path="/student/dashboard"
            element={
              <PrivateRoute>
                <StudentDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/student/profile"
            element={
              <PrivateRoute>
                <StudentProfile />
              </PrivateRoute>
            }
          />

          <Route
            path="/student/dashboard/leave"
            element={
              <PrivateRoute>
                <Leave />
              </PrivateRoute>
            }
          />

          <Route
            path="/student/dashboard/outpass"
            element={
              <PrivateRoute>
                <OutpassForm />
              </PrivateRoute>
            }
          />

          <Route
            path="/complaints"
            element={
              <PrivateRoute>
                <Complaints />
              </PrivateRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <PrivateRoute>
                <Attendance />
              </PrivateRoute>
            }
          />

          {/* Warden Dashboard */}
          <Route
            path="/warden/dashboard"
            element={
              <PrivateRoute>
                <WardenDashboard />
              </PrivateRoute>
            }
          />

          <Route path="/warden/students" element={<Students />} />
          <Route path="/warden/leave-requests" element={<LeaveRequests />} />
          <Route path="/warden/outpass" element={<Outpass />} />
          <Route path="/warden/complaints" element={<WardenComplaints />} />

          {/* For safety add a fallback route */}
          <Route path="*" element={<h2 className='text-center mt-5'>404 - Page Not Found</h2>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
