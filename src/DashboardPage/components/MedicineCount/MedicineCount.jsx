import { Box, Typography } from "@mui/material";
import "./medcount.css";

const MedicineCount = ({ count = 0 }) => {
  return (
    <Box
      component="article"
      className="medicine-metric medicine-metric--primary"
      aria-label={`Total medicines: ${count}`}
    >
      <Typography component="h2" variant="body2" className="medicine-metric-title">
        Total medicines
      </Typography>
      <Typography component="p" variant="h2" className="medicine-metric-value">
        {count}
      </Typography>
      <Typography component="p" variant="body2" className="medicine-metric-description">
        Across your medicine list
      </Typography>
    </Box>
  );
};

export default MedicineCount;