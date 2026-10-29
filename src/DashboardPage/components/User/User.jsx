import { useState } from "react";
import {
  Avatar,
  Button,
  Box,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";

const createMedicine = () => ({
  id: crypto.randomUUID(),
  name: "",
  time: "08:00",
});

const UserDetails = ({ medicines, onSave, onLogout }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [medicineDraft, setMedicineDraft] = useState([]);

  const openDialog = () => {
    setMedicineDraft(medicines.map((medicine) => ({ ...medicine })));
    setDialogOpen(true);
  };

  const updateMedicine = (medicineId, field, value) => {
    setMedicineDraft((previous) =>
      previous.map((medicine) =>
        medicine.id === medicineId
          ? { ...medicine, [field]: value }
          : medicine
      )
    );
  };

  const saveMedicines = (event) => {
    event.preventDefault();
    onSave(medicineDraft.filter((medicine) => medicine.name.trim()));
    setDialogOpen(false);
  };

  return (
    <>
      <IconButton
        aria-label="Open user details"
        onClick={openDialog}
        size="small"
      >
        <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
      </IconButton>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="user-details-title"
      >
        <DialogTitle id="user-details-title">Manage medicines</DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="medicine-profile-form" onSubmit={saveMedicines}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Update the names and scheduled times in your medicine list.
            </Typography>
            {medicineDraft.map((medicine, index) => (
              <Box
                key={medicine.id}
                sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", mb: 2 }}
              >
                <TextField
                  label={`Medicine ${index + 1}`}
                  value={medicine.name}
                  onChange={(event) =>
                    updateMedicine(medicine.id, "name", event.target.value)
                  }
                  required
                  fullWidth
                  size="small"
                />
                <TextField
                  type="time"
                  label="Time"
                  value={medicine.time}
                  onChange={(event) =>
                    updateMedicine(medicine.id, "time", event.target.value)
                  }
                  sx={{ minWidth: 140 }}
                  size="small"
                  required
                />
                <IconButton
                  type="button"
                  aria-label={`Remove medicine ${index + 1}`}
                  onClick={() =>
                    setMedicineDraft((previous) =>
                      previous.filter((item) => item.id !== medicine.id)
                    )
                  }
                  disabled={medicineDraft.length === 1}
                  color="error"
                >
                  <DeleteOutlinedIcon aria-hidden="true" />
                </IconButton>
              </Box>
            ))}
            <Button
              type="button"
              onClick={() => setMedicineDraft((previous) => [...previous, createMedicine()])}
            >
              Add medicine
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button color="error" onClick={onLogout}>
            Logout
          </Button>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" form="medicine-profile-form" variant="contained">
              Save changes
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

export default UserDetails;
