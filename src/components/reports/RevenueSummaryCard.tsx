
import { IndianRupee } from "lucide-react";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";

interface RevenueSummaryCardProps {
  totalRevenue: number;
}

export const RevenueSummaryCard = ({ totalRevenue }: RevenueSummaryCardProps) => {
  return (
    <Card className="border-l-4 border-revenue mb-8">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-gray-600 font-medium mb-1">Monthly Revenue</p>
          <p className="text-4xl font-bold text-revenue">₹{totalRevenue}</p>
        </div>
        <div className="h-16 w-16 rounded-lg flex items-center justify-center bg-revenue-light text-revenue">
          <IndianRupee className="h-8 w-8" />
        </div>
      </CardContent>
    </Card>
  );
};
