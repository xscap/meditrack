
import "./medlist.css"

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  TextField,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import { useState } from "react";

const MedicineTable = ({ medicines, onMedicinesChange, isSaving }) => {
  const [medicineToEdit, setMedicineToEdit] = useState(null);
  const [editError, setEditError] = useState("");

  const handleEdit = async (event) => {
    event.preventDefault();
    const updatedMedicines = medicines.map((medicine) =>
      medicine.id === medicineToEdit.id ? medicineToEdit : medicine
    );
    const saved = await onMedicinesChange(updatedMedicines);
    if (saved) {
      setMedicineToEdit(null);
      setEditError("");
    } else {
      setEditError("The changes could not be saved. Please try again.");
    }
  };

  const handleDelete = (medicineId) => {
    onMedicinesChange(
      medicines.filter((medicine) => medicine.id !== medicineId)
    );
  };

  const handleAddMedicine = () => {
    onMedicinesChange([
      ...medicines,
      {
        id: crypto.randomUUID(),
        name: "New medicine",
        time: "08:00",
      },
    ]);
  };

  return (
    <Box
      component="section"
      className="medicine-table-section"
      aria-labelledby="medicine-table-title"
    >
      {/* Header */}

      <Box className="medicine-table-header">
        <Box>
          <Typography
            id="medicine-table-title"
            component="h2"
            variant="h5"
            className="medicine-table-title"
          >
            Medicines
          </Typography>

          <Typography
            component="p"
            variant="body2"
            className="medicine-table-description"
          >
            Manage your medicines and scheduled times.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon aria-hidden="true" />}
          onClick={handleAddMedicine}
          className="add-medicine-table-button"
          disabled={isSaving}
        >
          Add Medicine
        </Button>
      </Box>

      {/* Table */}

      <TableContainer
        component={Paper}
        elevation={0}
        className="medicine-table-container"
      >
        <Table
          aria-label="Patient medicines and scheduled times"
          className="medicine-table"
        >
          <TableHead>
            <TableRow>
              <TableCell
                component="th"
                scope="col"
              >
                Medicine Name
              </TableCell>

              <TableCell
                component="th"
                scope="col"
              >
                Medicine Time
              </TableCell>

              <TableCell
                component="th"
                scope="col"
                align="right"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {medicines.length > 0 ? (
              medicines.map((medicine) => (
                <TableRow
                  key={medicine.id}
                  hover
                >
                  <TableCell
                    component="th"
                    scope="row"
                    className="medicine-name-cell"
                  >
                    {medicine.name}
                  </TableCell>

                  <TableCell>
                    <span className="medicine-time">
                      {medicine.time}
                    </span>
                  </TableCell>

                  <TableCell align="right">
                    <Box className="medicine-table-actions">
                      <Tooltip title={`Edit ${medicine.name}`}>
                        <IconButton
                          aria-label={`Edit ${medicine.name}`}
                          onClick={() => {
                            setMedicineToEdit({ ...medicine });
                            setEditError("");
                          }}
                          className="medicine-edit-button"
                          disabled={isSaving}
                        >
                          <EditOutlinedIcon
                            aria-hidden="true"
                          />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={`Delete ${medicine.name}`}>
                        <IconButton
                          aria-label={`Delete ${medicine.name}`}
                          onClick={() =>
                            handleDelete(medicine.id)
                          }
                          className="medicine-delete-button"
                          disabled={isSaving}
                        >
                          <DeleteOutlinedIcon
                            aria-hidden="true"
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="medicine-empty-cell"
                >
                  <Typography
                    component="p"
                    variant="body2"
                    role="status"
                  >
                    No medicines added yet.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Medicine count */}

      <Typography
        component="p"
        variant="body2"
        className="medicine-table-footer"
        aria-live="polite"
      >
        Total medicines: {medicines.length}
      </Typography>

      <Dialog
        open={Boolean(medicineToEdit)}
        onClose={() => !isSaving && setMedicineToEdit(null)}
        aria-labelledby="edit-medicine-title"
      >
        <Box component="form" onSubmit={handleEdit}>
          <DialogTitle id="edit-medicine-title">Edit medicine</DialogTitle>
          <DialogContent sx={{ display: "grid", gap: 2, pt: "8px !important" }}>
            {editError && <Alert severity="error">{editError}</Alert>}
            <TextField
              label="Medicine name"
              value={medicineToEdit?.name ?? ""}
              onChange={(event) =>
                setMedicineToEdit((previous) => ({
                  ...previous,
                  name: event.target.value,
                }))
              }
              required
              disabled={isSaving}
            />
            <TextField
              type="time"
              label="Medicine time"
              value={medicineToEdit?.time ?? ""}
              onChange={(event) =>
                setMedicineToEdit((previous) => ({
                  ...previous,
                  time: event.target.value,
                }))
              }
              required
              disabled={isSaving}
            />
          </DialogContent>
          <DialogActions>
            <Button
              type="button"
              onClick={() => setMedicineToEdit(null)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default MedicineTable;
