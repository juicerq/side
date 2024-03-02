import { ToastT, toast } from "sonner";

interface ToastProps {
  message: string;
  description?: string;
  icon?: ToastT["icon"];
  position?: ToastT["position"]
  style?: ToastT["style"]
  success?: boolean
}

export default function Toast({ message, description, icon, position, style, success }: ToastProps) {
  const borderColor = success ? "#00A86B" : "#B71C1C";
  return (
    toast(message, {
      description,
      icon,
      position: position ?? "bottom-center",
      style: {
        borderLeft: `2px solid ${borderColor}`,
        color: "white",
        display: "flex",
        gap: "1rem",
        padding: "1rem 1rem",
        ...style,
      }
    })
  )
}