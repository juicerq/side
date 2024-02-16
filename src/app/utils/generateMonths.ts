export function generateMonths() {
  const date = new Date();

  function getNumberOfDaysInMonth(month: number, year: number): number {
    const date = new Date(year, month, 0);
    return date.getDate();
  }

  const monthDays = getNumberOfDaysInMonth(
    date.getMonth() + 1,
    date.getFullYear(),
  );

  const firstMonth: { day: number; weekDay: string }[] = [];

  for (let i = 1; i <= monthDays; i++) {
    const day = {
      day: i,
      weekDay: new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        i - 1,
      ).toLocaleDateString("pt-BR", { weekday: "long" }),
    };

    firstMonth.push(day);
  }

  return firstMonth;
}
