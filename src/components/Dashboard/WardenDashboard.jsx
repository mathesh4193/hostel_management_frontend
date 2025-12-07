// src/components/Warden/WardenDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
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

  // ---- FETCH STATS (handles both array and {key: array} formats) ----
  const fetchStats = useCallback(async () => {
    try {
      const [studentsRes, leavesRes, complaintsRes, outpassesRes] =
        await Promise.all([
          axios.get(`${API_BASE}/students`),
          axios.get(`${API_BASE}/leaves`),
          axios.get(`${API_BASE}/complaints`),
          axios.get(`${API_BASE}/outpasses`),
        ]);

      // Helper to safely extract arrays
      const extractArray = (resData, key) => {
        if (Array.isArray(resData)) return resData;
        if (resData && Array.isArray(resData[key])) return resData[key];
        return [];
      };

      const students = extractArray(studentsRes.data, "students");
      const leaves = extractArray(leavesRes.data, "leaves");
      const complaints = extractArray(complaintsRes.data, "complaints");
      const outpasses = extractArray(outpassesRes.data, "outpasses");

      setStats({
        totalStudents: students.length,
        pendingLeaves: leaves.filter(
          (l) => l.status?.toLowerCase() === "pending"
        ).length,
        activeComplaints: complaints.filter((c) =>
          ["pending", "active"].includes(c.status?.toLowerCase())
        ).length,
        roomsOccupied: students.filter(
          (s) => s.roomNo && String(s.roomNo).trim() !== ""
        ).length,
        pendingOutpass: outpasses.filter(
          (o) => o.status?.toLowerCase() === "pending"
        ).length,
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  }, [API_BASE]);

  // ---- Authentication + Auto Refresh ----
  useEffect(() => {
    const isWarden =
      localStorage.getItem("role") === "warden" &&
      localStorage.getItem("token");

    if (!isWarden) {
      navigate("/");
      return;
    }

    fetchStats(); // initial load

    const interval = setInterval(fetchStats, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [navigate, fetchStats]);

  // ---- Action Buttons ----
  const actions = [
    {
      title: "Student Management",
      icon: <PeopleIcon fontSize="large" />,
      path: "/warden/students",
      count: stats.totalStudents,
    },
    {
      title: "Leave Requests",
      icon: <AssignmentIcon fontSize="large" />,
      path: "/warden/leave-requests",
      count: stats.pendingLeaves,
    },
    {
      title: "Complaints",
      icon: <ReportProblemIcon fontSize="large" />,
      path: "/warden/complaints",
      count: stats.activeComplaints,
    },
    {
      title: "Mess Schedule",
      icon: <RestaurantMenuIcon fontSize="large" />,
      path: "/warden/mess",
      count: null,
    },
    {
      title: "Outpass Requests",
      icon: <ExitToAppIcon fontSize="large" />,
      path: "/warden/outpass",
      count: stats.pendingOutpass,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", p: 3 }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, color: "#2c387e", fontWeight: 700 }}
      >
        Welcome back, Warden!
      </Typography>

      {/* ---------- STATS GRID ---------- */}
      <Grid container spacing={3} mb={4}>
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          color="#2c387e"
        />
        <StatCard
          title="Pending Leaves"
          value={stats.pendingLeaves}
          color="#3949ab"
        />
        <StatCard
          title="Active Complaints"
          value={stats.activeComplaints}
          color="#1e88e5"
        />
        <StatCard
          title="Rooms Occupied"
          value={stats.roomsOccupied}
          color="#0277bd"
        />
      </Grid>

      {/* ---------- ACTION GRID ---------- */}
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
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 3,
                cursor: "pointer",
                gap: 2,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  bgcolor: "#3f51b5",
                },
              }}
            >
              {/* COUNT BADGE */}
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
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    minWidth: "32px",
                    textAlign: "center",
                  }}
                >
                  {action.count}
                </Box>
              )}

              <Box sx={{ fontSize: "3rem" }}>{action.icon}</Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {action.title}
              </Typography>

              <Button
                variant="contained"
                sx={{
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

// ---------- STAT CARD COMPONENT ----------
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
