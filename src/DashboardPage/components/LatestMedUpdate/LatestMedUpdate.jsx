import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  getLocalDateKey,
  getScheduledTime,
} from "../../../Helpers/medicineSchedule.js";

const getNextMedicine = (medicines, now) => {
  const scheduledMedicines = medicines.reduce((scheduled, medicine) => {
    const scheduledAt = getScheduledTime(now, medicine.time);
    if (!scheduledAt || !medicine.name?.trim()) return scheduled;

    if (medicine.takenDate === getLocalDateKey(now) || scheduledAt <= now) {
      scheduledAt.setDate(scheduledAt.getDate() + 1);
    }

    scheduled.push({ medicine, scheduledAt });
    return scheduled;
  }, []);

  if (!scheduledMedicines?.length) return null;

  const nextScheduledAt = scheduledMedicines.reduce(
    (next, scheduled) =>
      scheduled.scheduledAt < next ? scheduled.scheduledAt : next,
    scheduledMedicines[0].scheduledAt
  );

  return {
    medicines: scheduledMedicines
      .filter(
        ({ scheduledAt }) => scheduledAt.getTime() === nextScheduledAt.getTime()
      )
      .map(({ medicine }) => medicine),
    scheduledAt: nextScheduledAt,
  };
};

const formatCountdown = (milliseconds) => {
  const minutesRemaining = Math.ceil(milliseconds / 60000);
  const hours = Math.floor(minutesRemaining / 60);
  const minutes = minutesRemaining % 60;

  if (hours === 0) {
    return `in ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }
  if (minutes === 0) {
    return `in ${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  return `in ${hours} ${hours === 1 ? "hour" : "hours"} and ${minutes} ${
    minutes === 1 ? "minute" : "minutes"
  }`;
};

const LatestMedUpdate = ({ medicines = [] }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const nextMedicine = getNextMedicine(medicines, now);
  const countdown = nextMedicine
    ? formatCountdown(nextMedicine.scheduledAt - now)
    : null;
  const medicineNames = nextMedicine?.medicines
    .map((medicine) => medicine.name)
    .join(", ");
  const scheduledTime = nextMedicine?.scheduledAt.toLocaleTimeString(
    undefined,
    { hour: "numeric", minute: "2-digit" }
  );

  return (
    <Box
      component="article"
      className="medicine-metric medicine-metric--treatments medicine-metric--next"
      aria-label={
        nextMedicine
          ? `Next medicines ${medicineNames}, ${countdown}`
          : "No scheduled medicines"
      }
    >
      <Typography
        component="h2"
        variant="body2"
        className="medicine-metric-title"
      >
        {nextMedicine ? `Next medicine ${countdown}` : "Next medicine"}
      </Typography>
      <Typography
        component="p"
        variant="h2"
        className="medicine-metric-value"
        title={medicineNames}
      >
        {medicineNames ?? "—"}
      </Typography>
      <Typography
        component="p"
        variant="body2"
        className="medicine-metric-description"
      >
        {nextMedicine
          ? `Scheduled at ${scheduledTime}`
          : "No scheduled medicine times"}
      </Typography>
    </Box>
  );
};

export default LatestMedUpdate;
