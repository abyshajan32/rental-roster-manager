
import { Badge } from "@/components/ui/badge";
import { RentalStatus } from "@/types";

interface RentalStatusBadgeProps {
  status: RentalStatus;
}

const statusStyles = {
  active: {
    bg: "bg-active-light",
    text: "text-active",
    border: "border-active",
  },
  overdue: {
    bg: "bg-overdue-light",
    text: "text-overdue",
    border: "border-overdue",
  },
  returned: {
    bg: "bg-gray-100",
    text: "text-gray-500",
    border: "border-gray-300",
  },
  cancelled: {
    bg: "bg-gray-100",
    text: "text-gray-500",
    border: "border-gray-300",
  },
};

export const RentalStatusBadge = ({ status }: RentalStatusBadgeProps) => {
  const style = statusStyles[status];
  
  return (
    <Badge 
      variant="outline" 
      className={`${style.bg} ${style.text} capitalize mb-2`}
    >
      {status}
    </Badge>
  );
};
