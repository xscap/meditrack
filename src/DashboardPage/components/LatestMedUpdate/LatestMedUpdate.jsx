import { Box, Typography } from "@mui/material";

const LatestMedUpdate = () => {
  return (
    <Box
      component="article"
      className="medicine-metric medicine-metric--treatments"
      aria-label="Next medicine: no data available"
    >
      <Typography component="h2" variant="body2" className="medicine-metric-title">
        Next Medicine in..
      </Typography>
      <Typography component="p" variant="h2" className="medicine-metric-value">
        —   {/* Placeholder for the next medicine update both Medicine Name and time will be displayed here, one catch the time will be deleted from Datetime components time to show medicine in _ hours, l if time gets overdue Overdue label or Taken label (also a confirm button that medicine is taken ) */}
      </Typography>
      <Typography component="p" variant="body2" className="medicine-metric-description">
        No data available yet
      </Typography>
    </Box>
  );
};

export default LatestMedUpdate;