import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import DateTime from "./components/DateTime/CurrentDateTime.jsx";
import UserDetails from "./components/User/User.jsx";
import MedicineCount from "./components/MedicineCount/MedicineCount.jsx";
import LatestMedUpdate from "./components/LatestMedUpdate/LatestMedUpdate.jsx";
import Medileft from "./components/MedLeft/Medileft.jsx";
import MedList from "./components/MedicineList/MedList.jsx";
import {
  getMedicalProfile,
  saveMedicineList,
  signOut,
} from "../Services/authService.jsx";
import "./dashboard.css";
import "./components/MedicineCount/medcount.css";

const getMedicines = (profile) =>
  Array.isArray(profile?.medicines)
    ? profile.medicines.map((medicine) => ({
        ...medicine,
        id: medicine.id ?? crypto.randomUUID(),
      }))
    : [];

const Dashboard = () => {
  const location = useLocation();
  const [profile, setProfile] = useState(
    location.state?.savedProfile ?? null
  );
  const [medicines, setMedicines] = useState(() =>
    getMedicines(location.state?.savedProfile)
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const profile = await getMedicalProfile();
        if (!active) return;

        if (!profile && !location.state?.savedProfile) {
          navigate("/user-med-form", { replace: true });
          return;
        }

        const loadedProfile = profile ?? location.state.savedProfile;
        setProfile(loadedProfile);
        setMedicines(getMedicines(loadedProfile));
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load your medical information."
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, [location.state, navigate]);

  const handleMedicinesChange = async (nextMedicines) => {
    if (isSaving) return false;

    const previousMedicines = medicines;
    setIsSaving(true);
    setError("");
    setMedicines(nextMedicines);

    try {
      const savedMedicines = await saveMedicineList(nextMedicines);
      setMedicines(savedMedicines);
      return true;
    } catch (saveError) {
      setMedicines(previousMedicines);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update your medicines. Please try again."
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (logoutError) {
      setError(
        logoutError instanceof Error
          ? logoutError.message
          : "Unable to sign out. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <Box
        component="main"
        className="dashboard-page"
        sx={{ display: "grid", placeItems: "center", minHeight: "100vh" }}
      >
        <CircularProgress aria-label="Loading medical information" />
      </Box>
    );
  }

  return (
    <Box component="main" className="dashboard-page">
      {error && (
        <Alert severity="error" role="alert" onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      <Box component="header" className="dashboard-header">
        <div className="dashboard-header-inner">
          <DateTime />
          <UserDetails
            medicines={medicines}
            onSave={handleMedicinesChange}
            isSaving={isSaving}
            saveError={error}
            onLogout={handleLogout}
          />
        </div>
      </Box>

      <Box component="section" className="dashboard-content" aria-label="Dashboard overview">
        <div className="medicine-count-heading">
          <Typography component="h1" variant="h5" className="medicine-count-title">
            Overview
          </Typography>
          <Typography component="p" variant="body2" className="medicine-count-subtitle">
            A quick look at your medication
          </Typography>
        </div>

        <Box
          component="section"
          aria-label="Saved patient information"
          sx={{
            backgroundColor: "white",
            border: "1px solid #e0e9e4",
            borderRadius: 2,
            display: "grid",
            gap: 1,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            mt: 3,
            p: 2.5,
          }}
        >
          <Typography variant="h6" sx={{ gridColumn: "1 / -1" }}>
            Patient information
          </Typography>
          <Typography>
            <strong>Name:</strong>{" "}
            {[profile?.first_name, profile?.middle_name, profile?.last_name]
              .filter(Boolean)
              .join(" ")}
          </Typography>
          <Typography>
            <strong>Age:</strong> {profile?.age}
          </Typography>
          <Typography>
            <strong>Diagnosed condition:</strong> {profile?.disease}
          </Typography>
          <Typography>
            <strong>Doctor:</strong> {profile?.doctor_name}
          </Typography>
        </Box>

        <div className="medicine-metrics-grid">
          <MedicineCount count={medicines.length} />
          <LatestMedUpdate />
          <Medileft />
        </div>
      </Box>


      <div className="medicine-list-section">
        <MedList
          medicines={medicines}
          onMedicinesChange={handleMedicinesChange}
          isSaving={isSaving}
        />
      </div>
    </Box>
  );
};

export default Dashboard;