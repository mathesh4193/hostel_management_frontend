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

  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingLeaves: 0,
    activeComplaints: 0,
    roomsOccupied: 0
  });

  const API_BASE = "https://hostel-management-backend-eo9s.onrender.com/api";

  const fetchStats = async () => {
    try {
      const [studentsRes, leavesRes, complaintsRes] = await Promise.all([
        axios.get(`${API_BASE}/students`),
        axios.get(`${API_BASE}/leaves`),
        axios.get(`${API_BASE}/complaints`),
      ]);

      // Students API returns { students: [...] }
      const students = studentsRes.data.students || [];

      // Leaves API returns [] (array directly)
      const leaves = Array.isArray(leavesRes.data)
        ? leavesRes.data
        : leavesRes.data.leaves || [];

      // Complaints API returns [] (array directly)
      const complaints = Array.isArray(complaintsRes.data)
        ? complaintsRes.data
        : complaintsRes.data.complaints || [];

      const totalStudents = students.length;
      const pendingLeaves = leaves.filter(
        (l) => l.status?.toLowerCase() === "pending"
      ).length;
      const activeComplaints = complaints.filter(
        (c) =>
          c.status?.toLowerCase() === "pending" ||
          c.status?.toLowerCase() === "active"
      ).length;
      const roomsOccupied = students.filter(
        (s) => s.roomNo && s.roomNo.trim() !== ""
      ).length;

      setStats({ totalStudents, pendingLeaves, activeComplaints, roomsOccupied });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    const wardenAuth =
      localStorage.getItem("role") === "warden" &&
      localStorage.getItem("token");

    if (!wardenAuth) {
      navigate("/"); // redirect to login if not authorized
      return;
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, [navigate]);

  const actionItems = [
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

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3, bgcolor: "#2c387e", color: "white", borderRadius: 2, height: "140px" }}>
            <Typography variant="h6">Total Students</Typography>
            <Typography variant="h3">{stats.totalStudents}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3, bgcolor: "#3949ab", color: "white", borderRadius: 2, height: "140px" }}>
            <Typography variant="h6">Pending Leaves</Typography>
            <Typography variant="h3">{stats.pendingLeaves}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3, bgcolor: "#1e88e5", color: "white", borderRadius: 2, height: "140px" }}>
            <Typography variant="h6">Active Complaints</Typography>
            <Typography variant="h3">{stats.activeComplaints}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3, bgcolor: "#0277bd", color: "white", borderRadius: 2, height: "140px" }}>
            <Typography variant="h6">Rooms Occupied</Typography>
            <Typography variant="h3">{stats.roomsOccupied}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Cards */}
      <Grid container spacing={3}>
        {actionItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.title}>
            <Paper
              elevation={3}
              onClick={() => navigate(item.path)}
              sx={{
                bgcolor: "#2c387e",
                color: "white",
                p: 3,
                textAlign: "center",
                height: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                cursor: "pointer",
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)", bgcolor: "#3f51b5" },
              }}
            >
              <Box sx={{ fontSize: "2.5rem" }}>{item.icon}</Box>
              <Typography variant="h6">{item.title}</Typography>
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

export default WardenDashboard;
