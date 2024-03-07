export function getTimestamp(
  month: string,
  day: number,
  hour: string
): Date | null {
  // Mapping month numbers to their numerical representation
  const months: Record<string, number> = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  // Splitting hour and minute
  const [hourPart, minutePart] = hour.split(":");

  const monthToUse = months[month];

  if (
    month === undefined ||
    day === undefined ||
    !hourPart ||
    !minutePart ||
    !monthToUse ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  // Get current date
  const currentDate = new Date();

  // Set month, day, hour, and minute based on provided strings
  currentDate.setMonth(monthToUse);
  currentDate.setDate(day);
  currentDate.setHours(parseInt(hourPart, 10));
  currentDate.setMinutes(parseInt(minutePart, 10));
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);

  return currentDate;
}
