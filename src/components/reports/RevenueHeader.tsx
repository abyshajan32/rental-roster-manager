
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMonth } from "@/utils/date-utils";
import { RevenueType } from "@/types";
import { exportRevenueToCSV } from "@/utils/csv-export";

interface RevenueHeaderProps {
  revenue: RevenueType;
}

export const RevenueHeader = ({ revenue }: RevenueHeaderProps) => {
  const handleExportReport = () => {
    exportRevenueToCSV(revenue);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Revenue Reports</h1>
        <p className="text-gray-500">{formatMonth(new Date())}</p>
      </div>
      
      <Button
        onClick={handleExportReport}
        className="flex items-center gap-2"
      >
        <FileDown className="h-4 w-4" />
        <span>Export Report</span>
      </Button>
    </div>
  );
};
