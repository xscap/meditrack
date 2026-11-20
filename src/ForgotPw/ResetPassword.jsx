import { useEffect, useId, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { Link as RouterLink } from "react-router-dom";
import { supabase } from "../Services/supabase.jsx";
import { updatePassword } from "../Services/authService.jsx";
import "./forgotpw.css";

const hasRecoveryCallback = () => {
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const queryParams = new URLSearchParams(window.location.search);

  return hashParams.get("type") === "recovery" || queryParams.has("code");
};

const ResetPassword = () => {
  const passwordId = useId();
  const confirmPasswordId = useId();
  const errorId = useId();
  const [isRecovery, setIsRecovery] = useState(hasRecoveryCallback);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess("Your password has been reset. You can now sign in.");
      setPassword("");
      setConfirmPassword("");
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? resetError.message
          : "Unable to reset your password. Request a new reset link and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="forgot-password-page">
      <Container maxWidth="sm" className="forgot-password-container">
        <Paper
          component="section"
          elevation={0}
          className="forgot-password-card"
          aria-labelledby="reset-password-title"
        >
          <header className="forgot-password-header">
            <Typography
              id="reset-password-title"
              component="h1"
              variant="h4"
              className="forgot-password-title"
            >
              Reset Password
            </Typography>
            <Typography
              component="p"
              variant="body1"
              className="forgot-password-description"
            >
              Choose a new password for your account.
            </Typography>
          </header>

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

          {success && (
            <Alert severity="success" role="status" className="forgot-password-alert">
              {success}
            </Alert>
          )}

          {isRecovery ? (
            <Box
              component="form"
              className="forgot-password-form"
              onSubmit={handleSubmit}
              noValidate
              aria-busy={loading}
            >
              <TextField
                id={passwordId}
                label="New password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                autoFocus
                fullWidth
                required
                disabled={loading || Boolean(success)}
                error={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
              />
              <TextField
                id={confirmPasswordId}
                label="Confirm new password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                fullWidth
                required
                disabled={loading || Boolean(success)}
                error={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || Boolean(success)}
                className="forgot-password-submit"
              >
                {loading ? "Saving password..." : "Update Password"}
              </Button>
            </Box>
          ) : (
            <Alert severity="info" role="status">
              This reset link is invalid or has expired. Request a new one to
              continue.
            </Alert>
          )}

          <nav
            className="forgot-password-navigation"
            aria-label="Account navigation"
          >
            <Link
              component={RouterLink}
              to="/login"
              className="back-to-login"
            >
              <ArrowBackOutlinedIcon fontSize="small" aria-hidden="true" />
              <span>Back to Login</span>
            </Link>
          </nav>
        </Paper>
      </Container>
    </main>
  );
};

export default ResetPassword;
