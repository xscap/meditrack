import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import DispSpinner from "../Helpers/DisplaySpinner/DispSpinner.jsx";

import "./login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigateToOtherPage = useNavigate();

  const validateForm = () => {
    let isValid = true;

    setEmailError("");
    setPasswordError("");
    setError("");
    setSuccess("");

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(
        "Password must contain at least 6 characters"
      );
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    try {
      if (!validateForm()) {
        return;
      }

      /*
       * API integration will be added later.
       * For now, simply show a success message.
       */
      setIsSubmitting(true);
      window.setTimeout(() => {
        setIsSubmitting(false);
        navigateToOtherPage("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Box className="login-page">
      <Container maxWidth="sm">
        <Paper className="login-card" elevation={6}>
          <Stack spacing={3}>
            {/* Header */}
            <Box className="login-header">
              <Box className="login-icon">
                <LockOutlined />
              </Box>

              <Typography
                variant="h4"
                className="login-title"
              >
                Welcome Back
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                className="login-subtitle"
              >
                Sign in to continue to your account
              </Typography>
            </Box>

            {/* Error */}
            {error && (
              <Alert
                severity="error"
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            {/* Success */}
            {success && (
              <Alert
                severity="success"
                onClose={() => setSuccess("")}
              >
                {success}
              </Alert>
            )}

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
            >
              <Stack spacing={2.5}>
                {/* Email */}
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setEmailError("");
                    setError("");
                  }}
                  error={Boolean(emailError)}
                  helperText={emailError}
                  autoComplete="email"
                  autoFocus
                />

                {/* Password */}
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setPasswordError("");
                    setError("");
                  }}
                  error={Boolean(passwordError)}
                  helperText={passwordError}
                  autoComplete="current-password"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowPassword(
                                (previous) => !previous
                              )
                            }
                            edge="end"
                            aria-label={
                              showPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                {/* Forgot Password */}
                <Box className="forgot-password">
                  <Button
                    type="button"
                    size="small"
                    sx={{ textTransform: "none" }}
                    onClick={() => {
                      setError("");
                      navigateToOtherPage("/forgot-password");
                    }}
                  >
                    Forgot password?
                  </Button>
                </Box>

                {/* Login Button */}
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  className="login-button"
                  disabled={isSubmitting}
                  
                >
                  {isSubmitting ? <DispSpinner message="Logging you in..." /> : "Sign In"}
                </Button>

                {/* Register */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="register-text"
                >
                  Don't have an account?{" "}
                  <Button
                    type="button"
                    size="small"
                    sx={{ textTransform: "none" }}
                    
                    onClick={() => {
                      navigateToOtherPage("/register");
                      setError("");
                      setSuccess(
                        "Registration functionality will be added later."
                      );
                    }}
                  >
                    Create account
                  </Button>
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
