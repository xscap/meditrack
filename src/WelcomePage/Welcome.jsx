import { Box, Button, Container, Typography } from "@mui/material";
import "./welcome.css";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  
  const navigateToOtherPage = useNavigate();

  return (
    <Box component="main" aria-labelledby="welcome-title" className="welcome-page">
      <Container maxWidth="sm">
        <Box className="welcome-content">
          <Box className="welcome-mark" aria-hidden="true">
            <span className="welcome-mark__cross">+</span>
          </Box>

          <Typography id="welcome-title" component="h1" className="welcome-title">
            Stay on track with your medicines.
          </Typography>

          <Typography component="p" className="welcome-description">
            Simple reminders that help you take the right medicine at the
            right time.
          </Typography>

          <Box component="nav" aria-label="Get started" className="welcome-actions">
            <Button
              variant="contained"
              type="button"
              onClick={() => navigateToOtherPage("/register")}
              className="welcome-button welcome-button--primary"
            >
              Get started
            </Button>

            <Button
              variant="contained"
              type="button"
              
              className="welcome-button welcome-button--secondary"
              onClick={() => navigateToOtherPage("/login")}
            >
              I already have an account
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
