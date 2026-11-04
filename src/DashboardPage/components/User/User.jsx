import { useState } from "react";
import {
  Avatar,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";

const UserDetails = ({ profile, onLogout }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const fullName = [
    profile?.first_name,
    profile?.middle_name,
    profile?.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <IconButton
        aria-label="Open user details"
        onClick={() => setDialogOpen(true)}
        size="small"
      >
        <Avatar sx={{ width: 32, height: 32 }}>
          {fullName ? fullName.charAt(0).toUpperCase() : "U"}
        </Avatar>
      </IconButton>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="user-details-title"
      >
        <DialogTitle id="user-details-title">User information</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "grid", gap: 1 }}>
            <Typography><strong>Name:</strong> {fullName || "—"}</Typography>
            <Typography><strong>Age:</strong> {profile?.age ?? "—"}</Typography>
            <Typography>
              <strong>Diagnosed condition:</strong> {profile?.disease || "—"}
            </Typography>
            <Typography>
              <strong>Doctor:</strong> {profile?.doctor_name || "—"}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button color="error" onClick={onLogout}>
            Logout
          </Button>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserDetails;
