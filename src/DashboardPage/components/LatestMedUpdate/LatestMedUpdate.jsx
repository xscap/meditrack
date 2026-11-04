import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const parseMedicineTime = (time) => {
  if (typeof time !== "string") return null;

  const match = time.trim().match(
    /^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i
  );
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();

  if (minutes > 59) return null;

  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    hours = (hours % 12) + (meridiem === "PM" ? 12 : 0);
  } else if (hours > 23) {
    return null;
  }

  return { hours, minutes };
};

const getNextMedicine = (medicines, now) => {
  return medicines.reduce((next, medicine) => {
    const time = parseMedicineTime(medicine.time);
    if (!time || !medicine.name?.trim()) return next;

    const scheduledAt = new Date(now);
    scheduledAt.setHours(time.hours, time.minutes, 0, 0);
    if (scheduledAt <= now) {
      scheduledAt.setDate(scheduledAt.getDate() + 1);
    }

    if (!next || scheduledAt < next.scheduledAt) {
      return { medicine, scheduledAt };
    }
    return next;
  }, null);
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
          ? `Next medicine ${nextMedicine.medicine.name}, ${countdown}`
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
        title={nextMedicine?.medicine.name}
      >
        {nextMedicine?.medicine.name ?? "—"}
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
