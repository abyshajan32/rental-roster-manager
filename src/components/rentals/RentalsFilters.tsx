
import { Button } from "@/components/ui/button";
import { ColumnsIcon, FileDown } from "lucide-react";

interface RentalsFiltersProps {
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  showRateColumn: boolean;
  toggleRateColumn: () => void;
  handleExportRentals: () => void;
}

export const RentalsFilters = ({ 
  statusFilter, 
  setStatusFilter, 
  showRateColumn, 
  toggleRateColumn, 
  handleExportRentals 
}: RentalsFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <Button
        variant="outline"
        size="sm"
        className={`${!statusFilter ? "bg-blue-50 border-blue-200" : ""}`}
        onClick={() => setStatusFilter(null)}
      >
        All
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className={`${statusFilter === "active" ? "bg-active-light border-active text-active" : ""}`}
        onClick={() => setStatusFilter("active")}
      >
        Active
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className={`${statusFilter === "overdue" ? "bg-overdue-light border-overdue text-overdue" : ""}`}
        onClick={() => setStatusFilter("overdue")}
      >
        Overdue
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className={`${statusFilter === "returned" ? "bg-gray-100 border-gray-300" : ""}`}
        onClick={() => setStatusFilter("returned")}
      >
        Returned
      </Button>
      
      <div className="flex-grow"></div>
      
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={toggleRateColumn}
      >
        <ColumnsIcon className="h-4 w-4" />
        <span>{showRateColumn ? "Hide Rate" : "Show Rate"}</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleExportRentals}
      >
        <FileDown className="h-4 w-4" />
        <span>Export</span>
      </Button>
    </div>
  );
};
