import { Box, Typography } from "@mui/material";

const Medileft = () => {
	return (
		<Box
			component="article"
			className="medicine-metric medicine-metric--refills"
			aria-label="Medicine left: no data available"
		>
			<Typography component="h2" variant="body2" className="medicine-metric-title">
				Medicine left
			</Typography>
			<Typography component="p" variant="h2" className="medicine-metric-value">
				—
			</Typography>
			<Typography component="p" variant="body2" className="medicine-metric-description">
				No data available yet
			</Typography>
		</Box>
	);
};

export default Medileft;
