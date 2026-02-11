import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const { login, register } = useAuth(); // ✅ FIXED HERE
const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let result;
    if (mode === "login") {
      result = await login(form.email, form.password);
    } else {
      result = await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
    }

    if (result?.success) {
      toast.success(mode === "login" ? "Welcome back!" : "Account created!");
        navigate("/", { replace: true });
      
    } else {
      toast.error(result?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6366f1, #9333ea)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: 420,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={1}
        >
          Reco Admin
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          color="text.secondary"
          mb={3}
        >
          {mode === "login"
            ? "Sign in to your dashboard"
            : "Create your admin account"}
        </Typography>

        {/* Tabs */}
        <Tabs
          value={mode}
          onChange={(_, v) => setMode(v)}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Login" value="login" />
          <Tab label="Register" value="register" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <TextField
              fullWidth
              margin="normal"
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1 }} />,
              }}
              required
            />
          )}

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: <EmailIcon sx={{ mr: 1 }} />,
            }}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: <LockIcon sx={{ mr: 1 }} />,
            }}
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              py: 1.3,
              background: "linear-gradient(90deg, #6366f1, #9333ea)",
            }}
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : mode === "login" ? (
                <LoginIcon />
              ) : (
                <AppRegistrationIcon />
              )
            }
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
