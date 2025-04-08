
import { Button } from "@/components/ui/button";
import { ColumnsIcon, FileDown, Settings } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface RentalsFiltersProps {
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  showRateColumn: boolean;
  toggleRateColumn: () => void;
  handleExportRentals: () => void;
  columnVisibility: ColumnVisibility;
  setColumnVisibility: (visibility: ColumnVisibility) => void;
}

export interface ColumnVisibility {
  rate: boolean;
  startDate: boolean;
  returnDate: boolean;
  customer: boolean;
  quantity: boolean;
}

export const RentalsFilters = ({ 
  statusFilter, 
  setStatusFilter, 
  showRateColumn, 
  toggleRateColumn, 
  handleExportRentals,
  columnVisibility,
  setColumnVisibility
}: RentalsFiltersProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleColumnToggle = (column: keyof ColumnVisibility) => {
    const newVisibility = {
      ...columnVisibility,
      [column]: !columnVisibility[column]
    };
    
    // Don't allow hiding all columns
    const visibleColumnsCount = Object.values(newVisibility).filter(Boolean).length;
    if (visibleColumnsCount === 0) {
      toast({
        title: "Cannot hide all columns",
        description: "At least one column must remain visible",
        duration: 3000,
      });
      return;
    }
    
    setColumnVisibility(newVisibility);
    toast({
      title: newVisibility[column] ? `${column} column shown` : `${column} column hidden`,
      description: newVisibility[column] 
        ? `The ${column} column is now visible.` 
        : `The ${column} column has been hidden from view.`,
      duration: 2000,
    });
  };

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
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            <span>Manage Columns</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Toggle Column Visibility</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="rate-column" className="text-sm font-medium">
                  Rate
                </label>
                <Switch 
                  id="rate-column"
                  checked={columnVisibility.rate}
                  onCheckedChange={() => handleColumnToggle('rate')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="startdate-column" className="text-sm font-medium">
                  Start Date
                </label>
                <Switch 
                  id="startdate-column"
                  checked={columnVisibility.startDate}
                  onCheckedChange={() => handleColumnToggle('startDate')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="returndate-column" className="text-sm font-medium">
                  Return Date
                </label>
                <Switch 
                  id="returndate-column"
                  checked={columnVisibility.returnDate}
                  onCheckedChange={() => handleColumnToggle('returnDate')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="customer-column" className="text-sm font-medium">
                  Customer
                </label>
                <Switch 
                  id="customer-column"
                  checked={columnVisibility.customer}
                  onCheckedChange={() => handleColumnToggle('customer')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="quantity-column" className="text-sm font-medium">
                  Quantity
                </label>
                <Switch 
                  id="quantity-column"
                  checked={columnVisibility.quantity}
                  onCheckedChange={() => handleColumnToggle('quantity')}
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
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
