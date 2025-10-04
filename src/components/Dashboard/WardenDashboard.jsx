// src/components/Warden/WardenDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Paper,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import axios from "axios";

const WardenDashboard = () => {
  const navigate = useNavigate();

  // Dashboard stats state
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingLeaves: 0,
    activeComplaints: 0,
    roomsOccupied: 0,
  });

  const API_BASE = "https://hostel-management-backend-eo9s.onrender.com/api";

  // Fetch dashboard data (students, leaves, complaints)
  const fetchStats = async () => {
    try {
      const [studentsRes, leavesRes, complaintsRes] = await Promise.all([
        axios.get(`${API_BASE}/students`),
        axios.get(`${API_BASE}/leaves`),
        axios.get(`${API_BASE}/complaints`),
      ]);

      const students = studentsRes.data.students || [];
      const leaves = Array.isArray(leavesRes.data)
        ? leavesRes.data
        : leavesRes.data.leaves || [];
      const complaints = Array.isArray(complaintsRes.data)
        ? complaintsRes.data
        : complaintsRes.data.complaints || [];

      setStats({
        totalStudents: students.length,
        pendingLeaves: leaves.filter(l => l.status?.toLowerCase() === "pending").length,
        activeComplaints: complaints.filter(
          c => ["pending", "active"].includes(c.status?.toLowerCase())
        ).length,
        roomsOccupied: students.filter(s => s.roomNo?.trim()).length,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    }
  };

  // Run once on mount
  useEffect(() => {
    const isWarden =
      localStorage.getItem("role") === "warden" &&
      localStorage.getItem("token");

    if (!isWarden) {
      navigate("/"); // redirect if not authorized
      return;
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [navigate]);

  // Dashboard actions
  const actions = [
    { title: "Student Management", icon: <PeopleIcon />, path: "/warden/students" },
    { title: "Leave Requests", icon: <AssignmentIcon />, path: "/warden/leave-requests" },
    { title: "Complaints", icon: <ReportProblemIcon />, path: "/warden/complaints" },
    { title: "Mess Schedule", icon: <RestaurantMenuIcon />, path: "/warden/mess" },
    { title: "Outpass Requests", icon: <ExitToAppIcon />, path: "/warden/outpass" },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: "#2c387e" }}>
        Welcome back, Warden!
      </Typography>

      {/* Stats Section */}
      <Grid container spacing={3} mb={4}>
        <StatCard title="Total Students" value={stats.totalStudents} color="#2c387e" />
        <StatCard title="Pending Leaves" value={stats.pendingLeaves} color="#3949ab" />
        <StatCard title="Active Complaints" value={stats.activeComplaints} color="#1e88e5" />
        <StatCard title="Rooms Occupied" value={stats.roomsOccupied} color="#0277bd" />
      </Grid>

      {/* Action Section */}
      <Grid container spacing={3}>
        {actions.map(action => (
          <Grid item xs={12} sm={6} md={4} key={action.title}>
            <Paper
              elevation={3}
              onClick={() => navigate(action.path)}
              sx={{
                bgcolor: "#2c387e",
                color: "white",
                p: 3,
                textAlign: "center",
                height: "200px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)", bgcolor: "#3f51b5" },
              }}
            >
              <Box sx={{ fontSize: "2.5rem" }}>{action.icon}</Box>
              <Typography variant="h6">{action.title}</Typography>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#fff",
                  color: "#2c387e",
                  "&:hover": { bgcolor: "#e0e0e0" },
                }}
              >
                MANAGE
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Small reusable card for stats
const StatCard = ({ title, value, color }) => (
  <Grid item xs={12} md={6} lg={3}>
    <Paper
      sx={{
        p: 3,
        bgcolor: color,
        color: "white",
        borderRadius: 2,
        height: "140px",
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h3">{value}</Typography>
    </Paper>
  </Grid>
);

export default WardenDashboard;
