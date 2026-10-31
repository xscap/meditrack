
import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { saveMedicalProfile } from "../Services/authService.jsx";

import "./userform.css";

const createMedicine = () => ({
  id: crypto.randomUUID(),
  name: "",
  time: "",
});

const UserMedForm = () => {
  const navigate = useNavigate();
  const firstNameId = useId();
  const middleNameId = useId();
  const lastNameId = useId();
  const diseaseId = useId();
  const doctorNameId = useId();
  const ageId = useId();

  const [modalOpen, setModalOpen] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    disease: "",
    doctorName: "",
    age: "",
  });

  const [medicines, setMedicines] = useState([
    createMedicine(),
  ]);

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear field-specific error once user starts correcting it.
    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }

    setSuccess("");
  };

  const handleMedicineChange = (medicineId, field, value) => {
    setMedicines((previous) =>
      previous.map((medicine) =>
        medicine.id === medicineId
          ? {
              ...medicine,
              [field]: value,
            }
          : medicine
      )
    );

    setSuccess("");
  };

  const handleAddMedicine = () => {
    setMedicines((previous) => [
      ...previous,
      createMedicine(),
    ]);
  };

  const handleRemoveMedicine = (medicineId) => {
    /*
     * Keep at least one medicine row.
     */
    if (medicines.length === 1) {
      return;
    }

    setMedicines((previous) =>
      previous.filter(
        (medicine) => medicine.id !== medicineId
      )
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    if (!formData.disease.trim()) {
      newErrors.disease =
        "Please enter the diagnosed disease.";
    }

    if (!formData.doctorName.trim()) {
      newErrors.doctorName = "Doctor name is required.";
    }

    if (!formData.age) {
      newErrors.age = "Age is required.";
    } else if (
      Number(formData.age) < 1 ||
      Number(formData.age) > 150
    ) {
      newErrors.age = "Please enter a valid age.";
    }

    medicines.forEach((medicine, index) => {
      if (!medicine.name.trim()) {
        newErrors[`medicine_${medicine.id}_name`] =
          `Medicine ${index + 1} name is required.`;
      }

      if (!medicine.time) {
        newErrors[`medicine_${medicine.id}_time`] =
          `Please select a time for medicine ${index + 1}.`;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccess("");
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const savedProfile = await saveMedicalProfile({
        ...formData,
        medicines,
      });
      navigate("/dashboard", {
        replace: true,
        state: { savedProfile },
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to save medical information. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* =========================================
          Initial Modal
          ========================================= */}

      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="scroll-modal-title"
        aria-describedby="initial-modal-description"
        fullWidth
        maxWidth="sm"
        className="medical-info-dialog"
      >
        <DialogTitle
          id="scroll-modal-title"
          className="medical-info-dialog-title"
        >
          Dummy Header
        </DialogTitle>

        <IconButton
          aria-label="Close information dialog"
          onClick={handleModalClose}
          className="medical-info-dialog-close"
        >
          <CloseIcon aria-hidden="true" />
        </IconButton>

        <DialogContent
          id="initial-modal-description"
          className="medical-info-dialog-content"
        >
          <Typography variant="body1">
            This is dummy modal content for now. The
            information shown here will be updated later.
          </Typography>

          <Button
            variant="contained"
            onClick={handleModalClose}
            className="medical-info-dialog-button"
          >
            Continue
          </Button>
        </DialogContent>
      </Dialog>

      {/* =========================================
          Main Page
          ========================================= */}

      <main className="medical-info-page">
        <Container
          maxWidth="md"
          className="medical-info-container"
        >
          <Paper
            component="section"
            elevation={0}
            className="medical-info-card"
            aria-labelledby="medical-info-title"
          >
            <header className="medical-info-header">
              <Typography
                id="medical-info-title"
                component="h1"
                variant="h4"
                className="medical-info-title"
              >
                Medical Information
              </Typography>

              <Typography
                component="p"
                variant="body1"
                className="medical-info-description"
              >
                Please provide the patient's basic medical
                information and current medicines.
              </Typography>
            </header>

            {success && (
              <Alert
                severity="success"
                role="status"
                className="medical-info-alert"
              >
                {success}
              </Alert>
            )}
            {submitError && (
              <Alert
                severity="error"
                role="alert"
                className="medical-info-alert"
              >
                {submitError}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              className="medical-info-form"
            >
              {/* =========================================
                  Patient Name
                  ========================================= */}

              <fieldset className="form-section">
                <legend className="form-section-title">
                  Patient Information
                </legend>

                <div className="name-grid">
                  <TextField
                    id={firstNameId}
                    name="firstName"
                    label="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    error={Boolean(errors.firstName)}
                    helperText={errors.firstName}
                    autoComplete="given-name"
                  />

                  <TextField
                    id={middleNameId}
                    name="middleName"
                    label="Middle name"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    fullWidth
                    autoComplete="additional-name"
                  />

                  <TextField
                    id={lastNameId}
                    name="lastName"
                    label="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    error={Boolean(errors.lastName)}
                    helperText={errors.lastName}
                    autoComplete="family-name"
                  />
                </div>
              </fieldset>

              {/* =========================================
                  Medical Information
                  ========================================= */}

              <fieldset className="form-section">
                <legend className="form-section-title">
                  Medical Information
                </legend>

                <div className="medical-fields-grid">
                  <TextField
                    id={diseaseId}
                    name="disease"
                    label="Disease diagnosed with"
                    value={formData.disease}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    error={Boolean(errors.disease)}
                    helperText={errors.disease}
                    placeholder="e.g. Diabetes"
                  />

                  <TextField
                    id={doctorNameId}
                    name="doctorName"
                    label="Doctor name"
                    value={formData.doctorName}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    error={Boolean(errors.doctorName)}
                    helperText={errors.doctorName}
                    placeholder="e.g. Dr. John Smith"
                    autoComplete="name"
                  />

                  <TextField
                    id={ageId}
                    name="age"
                    label="Age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    error={Boolean(errors.age)}
                    helperText={errors.age}
                    inputProps={{
                      min: 1,
                      max: 150,
                      inputMode: "numeric",
                    }}
                  />
                </div>
              </fieldset>

              {/* =========================================
                  Medicines
                  ========================================= */}

              <fieldset className="form-section">
                <legend className="form-section-title">
                  Medicines
                </legend>

                <Typography
                  component="p"
                  variant="body2"
                  className="medicine-description"
                >
                  Add one or more medicines and specify when
                  each medicine should be taken.
                </Typography>

                <div
                  className="medicine-list"
                  aria-live="polite"
                >
                  {medicines.map((medicine, index) => {
                    const medicineNameError =
                      errors[
                        `medicine_${medicine.id}_name`
                      ];

                    const medicineTimeError =
                      errors[
                        `medicine_${medicine.id}_time`
                      ];

                    return (
                      <div
                        key={medicine.id}
                        className="medicine-row"
                      >
                        <div className="medicine-number">
                          <span>
                            Medicine {index + 1}
                          </span>
                        </div>

                        <div className="medicine-fields">
                          <TextField
                            id={`medicine-name-${medicine.id}`}
                            label="Medicine name"
                            value={medicine.name}
                            onChange={(event) =>
                              handleMedicineChange(
                                medicine.id,
                                "name",
                                event.target.value
                              )
                            }
                            required
                            fullWidth
                            error={Boolean(
                              medicineNameError
                            )}
                            helperText={
                              medicineNameError
                            }
                            placeholder="e.g. Metformin"
                          />

                          <TextField
                            id={`medicine-time-${medicine.id}`}
                            type="time"
                            label="Medicine time"
                            value={medicine.time}
                            onChange={(event) =>
                              handleMedicineChange(
                                medicine.id,
                                "time",
                                event.target.value
                              )
                            }
                            required
                            fullWidth
                            error={Boolean(
                              medicineTimeError
                            )}
                            helperText={
                              medicineTimeError
                            }
                          />
                        </div>

                        <IconButton
                          type="button"
                          onClick={() =>
                            handleRemoveMedicine(
                              medicine.id
                            )
                          }
                          disabled={medicines.length === 1}
                          aria-label={`Remove medicine ${
                            index + 1
                          }`}
                          className="remove-medicine-button"
                        >
                          <DeleteOutlinedIcon aria-hidden="true" />
                        </IconButton>
                      </div>
                    );
                  })}
                </div>

                <Button
                  type="button"
                  variant="outlined"
                  startIcon={
                    <AddIcon aria-hidden="true" />
                  }
                  onClick={handleAddMedicine}
                  className="add-medicine-button"
                >
                  Add Medicine
                </Button>
              </fieldset>

              {/* =========================================
                  Submit
                  ========================================= */}

              <div className="medical-info-actions">
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  className="save-medical-info-button"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Medical Information"}
                </Button>
              </div>
            </Box>
          </Paper>
        </Container>
      </main>
    </>
  );
};

export default UserMedForm;
