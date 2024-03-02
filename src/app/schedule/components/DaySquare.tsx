export function DaySquare({ day }: { day: number }) {
  return (
    <div
      className={`hover:bg-secondary ${day % 2 ? "cursor-pointer text-emerald-500 hover:rounded-lg" : "pointer-events-none text-red-500"} flex h-10 w-10 items-center justify-center rounded-md border text-sm transition-all duration-300 active:scale-110`}
    >
      {day}
    </div>
  );
}