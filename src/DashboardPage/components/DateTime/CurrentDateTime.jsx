import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import "./datetime.css";

const CurrentDateTime = () => {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const time = currentDate.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const date = currentDate.toLocaleDateString();

  return (
    <Typography variant="h6" align="center" className="current-date-time" sx ={{display: 'inline-flex', gap: 2}}>
        <Typography className="current-time" aria-label="current-time">
            Time:{time} 
        </Typography>
         
        <Typography className="current-date" aria-label="current-date">
            Date:{date}
        </Typography>
    </Typography>
  );
}
       
export default CurrentDateTime