const statusMap: Record<string, string> = {
  scheduled: "Scheduled",
  concluded: "Concluded",
  canceled: "Canceled",
};

type ColorMap = "yellow" | "emerald" | "red";

const statusColorMap: Record<string, ColorMap> = {
  scheduled: "yellow",
  concluded: "emerald",
  canceled: "red",
};

export default function Status({
  appointmentStatus,
}: {
  appointmentStatus: string;
}) {
  const status = statusColorMap[appointmentStatus];

  if (!status) return null;

  return (
    <div className="flex items-center gap-2">
      <div className={`size-1.5 rounded-full bg-${status}-500`}></div>{" "}
      <p className="text-xs">{statusMap[appointmentStatus]}</p>
    </div>
  );
}
