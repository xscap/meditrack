
import { useId, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import "./forgotpw.css";

const ForgotPassword = () => {
  const emailId = useId();
  const errorId = useId();
  const successId = useId();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Backend/API logic will be added here later.
    setLoading(true);

    // Temporary simulation only.
    setTimeout(() => {
      setLoading(false);
      setSuccess(
        "If an account exists with this email, you will receive a password reset link shortly."
      );
    }, 1000);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);

    // Clear validation messages when the user starts correcting the field.
    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  return (
    <main className="forgot-password-page">
      <Container
        maxWidth="sm"
        className="forgot-password-container"
      >
        <Paper
          component="section"
          elevation={0}
          className="forgot-password-card"
          aria-labelledby="forgot-password-title"
        >
          <header className="forgot-password-header">
            <Typography
              id="forgot-password-title"
              component="h1"
              variant="h4"
              className="forgot-password-title"
            >
              Forgot Password?
            </Typography>

            <Typography
              component="p"
              variant="body1"
              className="forgot-password-description"
            >
              Enter the email address associated with your account and
              we'll send you a link to reset your password.
            </Typography>
          </header>

          {/* Error message */}
          {error && (
            <Alert
              id={errorId}
              severity="error"
              role="alert"
              className="forgot-password-alert"
            >
              {error}
            </Alert>
          )}

          {/* Success message */}
          {success && (
            <Alert
              id={successId}
              severity="success"
              role="status"
              className="forgot-password-alert"
            >
              {success}
            </Alert>
          )}

          <Box
            component="form"
            className="forgot-password-form"
            onSubmit={handleSubmit}
            noValidate
            aria-busy={loading}
          >
            <TextField
              id={emailId}
              name="email"
              label="Email address"
              type="email"
              value={email}
              onChange={handleEmailChange}
              autoComplete="email"
              autoFocus
              fullWidth
              required
              disabled={loading}
              error={Boolean(error)}
              aria-invalid={Boolean(error)}
              aria-describedby={
                error
                  ? errorId
                  : success
                    ? successId
                    : undefined
              }
              InputProps={{
                startAdornment: (
                  <EmailOutlinedIcon
                    className="email-icon"
                    aria-hidden="true"
                  />
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              className="forgot-password-submit"
              aria-label={
                loading
                  ? "Sending password reset link"
                  : "Send password reset link"
              }
            >
              {loading ? (
                <>
                  <CircularProgress
                    size={22}
                    color="inherit"
                    aria-hidden="true"
                  />
                  <span className="visually-hidden">
                    Sending reset link
                  </span>
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </Box>

          <nav
            className="forgot-password-navigation"
            aria-label="Account navigation"
          >
            <Link
              href="/login"
              className="back-to-login"
            >
              <ArrowBackOutlinedIcon
                fontSize="small"
                aria-hidden="true"
              />
              <span>Back to Login</span>
            </Link>
          </nav>
        </Paper>
      </Container>
    </main>
  );
};

export default ForgotPassword;
