import { PROJECT_STATUS_COMPLETED, PROJECT_STATUS_ACTIVE } from "@/lib/constants";
import { Badge } from "../ui/badge";

type StatusBadgeProps = {
  status: string
}

export default function StatusBadge({
  status
}: StatusBadgeProps) {
  return (
    <Badge variant={status === PROJECT_STATUS_ACTIVE ? 'ordinary' : status === PROJECT_STATUS_COMPLETED ? 'success' : 'error'}>{status}</Badge>
  )
}