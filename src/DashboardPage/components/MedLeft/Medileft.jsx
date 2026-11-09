import { Box, Typography } from "@mui/material";

const Medileft = ({ count = 0 }) => {
	return (
		<Box
			component="article"
			className="medicine-metric medicine-metric--refills"
			aria-label={`${count} medicine doses not taken today`}
		>
			<Typography component="h2" variant="body2" className="medicine-metric-title">
				Medicine left
			</Typography>
			<Typography component="p" variant="h2" className="medicine-metric-value">
				{count}
			</Typography>
			<Typography component="p" variant="body2" className="medicine-metric-description">
				Doses not marked taken today
			</Typography>
		</Box>
	);
};

export default Medileft;
