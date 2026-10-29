import { Box } from "@mui/material";
import "./dispspin.css";

const DispSpinner = ({ message = "Loading..." }) => (
	<Box className="display-spinner" role="status" aria-live="polite">
		<span className="display-spinner__indicator" aria-hidden="true" />
		<span>{message}</span>
	</Box>
);

export default DispSpinner;
