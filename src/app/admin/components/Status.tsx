const statusColorMap: Record<string, string> = {
  scheduled: "bg-yellow-100 text-yellow-800 border border-yellow-700",
  concluded: "bg-emerald-700 text-emerald-100 border border-emerald-400",
  canceled: "bg-red-700 text-red-100 border border-red-400",
};

export default function Status({
  appointmentStatus,
}: {
  appointmentStatus: string;
}) {
  const color = statusColorMap[appointmentStatus];

  if (!color) return null;

  return (
    <div className="flex items-center gap-2">
      <p className={`text-xs ${color} p-1 rounded-md`}>
        {appointmentStatus.charAt(0).toUpperCase() + appointmentStatus.slice(1)}
      </p>
    </div>
  );
}
