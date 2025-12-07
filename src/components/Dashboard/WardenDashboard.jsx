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
    roomsOccupied: 0,
    pendingOutpass: 0,
  });

  const API_BASE = "https://hostel-management-backend-eo9s.onrender.com/api";

  const fetchStats = async () => {
    try {
      const [studentsRes, leavesRes, complaintsRes, outpassRes] = await Promise.all([
        axios.get(`${API_BASE}/students`),
        axios.get(`${API_BASE}/leaves`),
        axios.get(`${API_BASE}/complaints`),
        axios.get(`${API_BASE}/outpasses`)
      ]);

      const students = studentsRes.data.students || [];

      const leaves = Array.isArray(leavesRes.data)
        ? leavesRes.data
        : leavesRes.data.leaves || [];

      const complaints = Array.isArray(complaintsRes.data)
        ? complaintsRes.data
        : complaintsRes.data.complaints || [];

      const outpasses = Array.isArray(outpassRes.data)
        ? outpassRes.data
        : outpassRes.data.outpasses || [];

      setStats({
        totalStudents: students.length,
        pendingLeaves: leaves.filter(
          (l) => l.status?.toLowerCase() === "pending"
        ).length,
        activeComplaints: complaints.filter((c) =>
          ["pending", "active"].includes(c.status?.toLowerCase())
        ).length,
        roomsOccupied: students.filter((s) => s.roomNo?.trim()).length,
        pendingOutpass: outpasses.filter(
          (o) => o.status?.toLowerCase() === "pending"
        ).length,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    }
  };

  useEffect(() => {
    const isWarden =
      localStorage.getItem("role") === "warden" &&
      localStorage.getItem("token");

    if (!isWarden) {
      navigate("/"); 
      return;
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000); 
    return () => clearInterval(interval);
  }, [navigate]);

  const actions = [
    {
      title: "Student Management",
      icon: <PeopleIcon fontSize="large" />,
      path: "/warden/students",
      count: stats.totalStudents
    },
    {
      title: "Leave Requests",
      icon: <AssignmentIcon fontSize="large" />,
      path: "/warden/leave-requests",
      count: stats.pendingLeaves
    },
    {
      title: "Complaints",
      icon: <ReportProblemIcon fontSize="large" />,
      path: "/warden/complaints",
      count: stats.activeComplaints
    },
    {
      title: "Mess Schedule",
      icon: <RestaurantMenuIcon fontSize="large" />,
      path: "/warden/mess",
      count: null
    },
    {
      title: "Outpass Requests",
      icon: <ExitToAppIcon fontSize="large" />,
      path: "/warden/outpass",
      count: stats.pendingOutpass
    }
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: "#2c387e", fontWeight: 700 }}>
        Welcome back, Warden!
      </Typography>

      {/* Stats Section */}
      <Grid container spacing={3} mb={4}>
        <StatCard title="Total Students" value={stats.totalStudents} color="#2c387e" />
        <StatCard title="Pending Leaves" value={stats.pendingLeaves} color="#3949ab" />
        <StatCard title="Active Complaints" value={stats.activeComplaints} color="#1e88e5" />
        <StatCard title="Rooms Occupied" value={stats.roomsOccupied} color="#0277bd" />
      </Grid>

      {/* Actions Section */}
      <Grid container spacing={3}>
        {actions.map((action) => (
          <Grid item xs={12} sm={6} md={4} key={action.title}>
            <Paper
              elevation={3}
              onClick={() => navigate(action.path)}
              sx={{
                bgcolor: "#2c387e",
                color: "white",
                p: 3,
                textAlign: "center",
                height: "220px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                position: "relative",
                borderRadius: 3,
                transition: "transform 0.3s, background-color 0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  bgcolor: "#3f51b5"
                },
              }}
            >
              {/* Count Badge */}
              {action.count !== null && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    bgcolor: "#ff5252",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    minWidth: "32px",
                    textAlign: "center",
                  }}
                >
                  {action.count}
                </Box>
              )}

              <Box sx={{ fontSize: "2.5rem" }}>{action.icon}</Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {action.title}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 1,
                  bgcolor: "#fff",
                  color: "#2c387e",
                  fontWeight: 600,
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

const StatCard = ({ title, value, color }) => (
  <Grid item xs={12} md={6} lg={3}>
    <Paper
      sx={{
        p: 3,
        bgcolor: color,
        color: "white",
        borderRadius: 3,
        height: "140px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      elevation={3}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </Paper>
  </Grid>
);

export default WardenDashboard;
