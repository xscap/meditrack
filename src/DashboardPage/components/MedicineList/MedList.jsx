
import "./medlist.css"

import {
  Box,
  Button,
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
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const MedicineTable = ({ medicines, onMedicinesChange }) => {

  const handleEdit = (medicine) => {
    // Add edit functionality here later.
    console.log("Edit medicine:", medicine);
  };

  const handleDelete = (medicineId) => {
    onMedicinesChange((previous) =>
      previous.filter((medicine) => medicine.id !== medicineId)
    );
  };

  const handleAddMedicine = () => {
    onMedicinesChange((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        name: "New medicine",
        timeline: "1 Month",
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
            Manage your medicines and their timelines.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon aria-hidden="true" />}
          onClick={handleAddMedicine}
          className="add-medicine-table-button"
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
          aria-label="Patient medicines and timelines"
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
                Timeline
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
                    <span className="medicine-timeline">
                      {medicine.timeline}
                    </span>
                  </TableCell>

                  <TableCell align="right">
                    <Box className="medicine-table-actions">
                      <Tooltip title={`Edit ${medicine.name}`}>
                        <IconButton
                          aria-label={`Edit ${medicine.name}`}
                          onClick={() => handleEdit(medicine)}
                          className="medicine-edit-button"
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
    </Box>
  );
};

export default MedicineTable;
