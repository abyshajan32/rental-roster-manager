
import { FC, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: "available" | "rented" | "active" | "overdue" | "revenue";
}

const StatsCard: FC<StatsCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    available: "bg-available-light border-l-4 border-available",
    rented: "bg-rented-light border-l-4 border-rented",
    active: "bg-active-light border-l-4 border-active",
    overdue: "bg-overdue-light border-l-4 border-overdue",
    revenue: "bg-revenue-light border-l-4 border-revenue",
  };

  const iconColorClasses = {
    available: "text-available bg-available-light",
    rented: "text-rented bg-rented-light",
    active: "text-active bg-active-light",
    overdue: "text-overdue bg-overdue-light",
    revenue: "text-revenue bg-revenue-light",
  };

  const valueColorClasses = {
    available: "text-available",
    rented: "text-rented",
    active: "text-active",
    overdue: "text-overdue",
    revenue: "text-revenue",
  };

  return (
    <Card className={`${colorClasses[color]} overflow-hidden shadow-sm`}>
      <CardContent className="p-6 flex items-start justify-between">
        <div>
          <p className="text-gray-600 font-medium mb-1">{title}</p>
          <p className={`text-3xl font-bold ${valueColorClasses[color]}`}>{value}</p>
        </div>
        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${iconColorClasses[color]}`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
