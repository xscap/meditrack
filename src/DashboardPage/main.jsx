import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import DateTime from "./components/DateTime/CurrentDateTime.jsx";
import UserDetails from "./components/User/User.jsx";
import MedicineCount from "./components/MedicineCount/MedicineCount.jsx";
import LatestMedUpdate from "./components/LatestMedUpdate/LatestMedUpdate.jsx";
import Medileft from "./components/MedLeft/Medileft.jsx";
import MedList from "./components/MedicineList/MedList.jsx";
import "./dashboard.css";
import "./components/MedicineCount/medcount.css";

const initialMedicines = [
  { id: 1, name: "Metformin", time: "11:00" },
  { id: 2, name: "Vitamin D3", time: "14:00" },
  { id: 3, name: "Paracetamol", time: "16:00" },
];

const Dashboard = () => {
  const [medicines, setMedicines] = useState(initialMedicines);
  const navigate = useNavigate();

  return (
    <Box component="main" className="dashboard-page">
      <Box component="header" className="dashboard-header">
        <div className="dashboard-header-inner">
          <DateTime />
          <UserDetails
            medicines={medicines}
            onSave={setMedicines}
            onLogout={() => navigate("/login")}
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

        <div className="medicine-metrics-grid">
          <MedicineCount count={medicines.length} />
          <LatestMedUpdate />
          <Medileft />
        </div>
      </Box>


      <div className="medicine-list-section">
        <MedList
          medicines={medicines}
          onMedicinesChange={setMedicines}
        />
      </div>
    </Box>
  );
};

export default Dashboard;