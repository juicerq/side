export function generateMonths() {
  type Month = {
    day: number;
    weekDay: string;
    month: string | undefined;
  };
  const today = new Date();

  const firstMonth: Month[] = [];
  const secondMonth: Month[] = [];
  const thirdMonth: Month[] = [];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
 ];


  for (let i = 0; i < 3; i++) {
    const currentMonth = (today.getMonth() + i) % 12; // Ensuring currentMonth stays within 0-11 range
    const year = today.getFullYear();
    const monthDays = getNumberOfDaysInMonth(currentMonth + 1, year);
    const month = [];

    const monthName = monthNames[currentMonth % 12]; // Ensure currentMonth index stays within 0-11 range

    for (let day = 1; day <= monthDays; day++) {
      const weekDay = new Date(year, currentMonth, day).toLocaleDateString(undefined, { weekday: "long" });
      month.push({ day, weekDay, month: monthName });
    }

    switch (i) {
      case 0:
        month.map((day) => firstMonth.push(day));
        break;
      case 1:
        month.map((day) => secondMonth.push(day));
        break;
      case 2:
        month.map((day) => thirdMonth.push(day));
        break;
    }
 }

  return {
    firstMonth,
    secondMonth,
    thirdMonth
  };
}

function getNumberOfDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}
