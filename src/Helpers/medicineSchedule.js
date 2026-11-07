export const getLocalDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseMedicineTime = (time) => {
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

export const getScheduledTime = (date, time) => {
  const parsedTime = parseMedicineTime(time);
  if (!parsedTime) return null;

  const scheduledAt = new Date(date);
  scheduledAt.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
  return scheduledAt;
};
