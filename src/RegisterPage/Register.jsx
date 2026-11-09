import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  Alert,
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
  UploadFileOutlined,
} from "@mui/icons-material";
import DispSpinner from "../Helpers/DisplaySpinner/DispSpinner.jsx";
import { signUpWithEmail } from "../Services/authService.jsx";
import "./register.css";

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return "";

  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayHasPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!birthdayHasPassed) age -= 1;
  return age >= 0 ? String(age) : "";
};

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
  });
  const [prescription, setPrescription] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [success, setSuccess] = useState("");
  

  const updateField = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
    setAuthError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setAuthError("");
    setSuccess("");
    const nextErrors = {};

    if (!form.firstName.trim()) nextErrors.firstName = "First name is required";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required";
    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Please enter a valid email address";
    }
    if (!form.password) {
      nextErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      nextErrors.password = "Password must contain at least 6 characters";
    }
    if (!form.dateOfBirth) {
      nextErrors.dateOfBirth = "Date of birth is required";
    } else if (!calculateAge(form.dateOfBirth)) {
      nextErrors.dateOfBirth = "Please enter a valid date of birth";
    }

    setErrors(nextErrors);
    
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await signUpWithEmail(form);
      if (data.session) {
        navigate("/user-med-form");
      } else {
        setSuccess(
          "Account created. Confirm your email, then sign in to complete your medical information."
        );
      }
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrescriptionChange = (event) => {
    const file = event.target.files?.[0];
    

    if (file && file.type !== "application/pdf") {
      setPrescription(null);
      setErrors((previous) => ({
        ...previous,
        prescription: "Please choose a PDF file",
      }));
      event.target.value = "";
      return;
    }

    setPrescription(file ?? null);
    setErrors((previous) => ({ ...previous, prescription: "" }));
  };

  return (
    <Box component="main" className="register-page">
      <Container maxWidth="md">
        <Paper className="register-card" elevation={4}>
          <Box className="register-header">
            <Box className="register-icon" aria-hidden="true">
              <LockOutlined />
            </Box>
            <Typography component="h1" variant="h4" className="register-title">
              Create your account
            </Typography>
            <Typography color="text.secondary" className="register-subtitle">
              Keep your medication details and reminders in one place.
            </Typography>
          </Box>

          {authError && (
            <Alert severity="error" role="alert" sx={{ mb: 2 }}>
              {authError}
            </Alert>
          )}
          {success && (
            <Alert severity="success" role="status" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <Box className="register-fields">
                <TextField
                  label="First name"
                  value={form.firstName}
                  onChange={updateField("firstName")}
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName}
                  autoComplete="given-name"
                  required
                />
                <TextField
                  label="Middle name"
                  value={form.middleName}
                  onChange={updateField("middleName")}
                  autoComplete="additional-name"
                />
                <TextField
                  label="Last name"
                  value={form.lastName}
                  onChange={updateField("lastName")}
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName}
                  autoComplete="family-name"
                  required
                />
                <TextField
                  label="Email address"
                  type="email"
                  value={form.email}
                  onChange={updateField("email")}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  autoComplete="email"
                  required
                />
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={updateField("password")}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  autoComplete="new-password"
                  required
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((previous) => !previous)}
                            edge="end"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  label="Date of birth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={updateField("dateOfBirth")}
                  error={Boolean(errors.dateOfBirth)}
                  helperText={errors.dateOfBirth}
                  autoComplete="bday"
                  required
                  slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                  label="Age"
                  value={calculateAge(form.dateOfBirth)}
                  slotProps={{ htmlInput: { readOnly: true } }}
                  helperText="Calculated from date of birth"
                />
              </Box>

              <Box className="prescription-field">
                <Typography component="h2" variant="subtitle1">
                  Prescription PDF <span className="optional-label">Optional</span>
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadFileOutlined />}
                  className="prescription-upload"
                >
                  {prescription ? "Choose a different PDF" : "Upload prescription"}
                  <input
                    hidden
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handlePrescriptionChange}
                  />
                </Button>
                <Typography variant="body2" color="text.secondary" aria-live="polite">
                  {errors.prescription || prescription?.name || "PDF files only"}
                </Typography>
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                className="register-button"
                disabled={isSubmitting}
                
              >
                {isSubmitting ? <DispSpinner message="Creating account..." /> : "Create account"}
              </Button>

              <Typography className="login-prompt" variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Button
                  type="button"
                  size="small"
                  sx={{ textTransform: "none" }}
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </Button>
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;