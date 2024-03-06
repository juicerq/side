export function getTimestamp(month: string, weekDay: string, hour: string) {
  // Converting month and week day to lowercase
  month = month.toLowerCase();
  weekDay = weekDay.toLowerCase();

  // Mapping month names to their numerical representation
  const months: Record<string, number> = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };

  // Mapping week day names to their numerical representation
  const weekDays: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  // Splitting hour and minute
  const [hourPart, minutePart] = hour.split(":");

  const monthToUse = months[month];
  const weekDayToUse = weekDays[weekDay];

  if (
    !month ||
    !weekDay ||
    !hourPart ||
    !minutePart ||
    !monthToUse ||
    !weekDayToUse
  ) {
    return null;
  }

  // Get current date
  const currentDate = new Date();

  // Set month, day, hour, and minute based on provided strings
  currentDate.setMonth(monthToUse);
  currentDate.setDate(
    currentDate.getDate() + ((weekDayToUse + 7 - currentDate.getDay()) % 7)
  ); // Set to next week if needed
  currentDate.setHours(parseInt(hourPart, 10));
  currentDate.setMinutes(parseInt(minutePart, 10));
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);

  currentDate.setUTCHours(
    currentDate.getUTCHours() - currentDate.getTimezoneOffset() / 60
  );

  const formattedDate = currentDate
    .toISOString()
    .replace("T", " ")
    .replace(/\.\d{3}Z$/, ".000");

  return formattedDate;
}
