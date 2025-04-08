
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import ContentHeader from "@/components/ContentHeader";
import { Plus, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import AddRentalDialog from "@/components/dialogs/AddRentalDialog";
import { RentalType } from "@/types";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { exportRentalsToCSV } from "@/utils/csv-export";
import { useToast } from "@/hooks/use-toast";
import { RentalCard } from "@/components/rentals/RentalCard";
import { ColumnVisibility, RentalsFilters } from "@/components/rentals/RentalsFilters";
import { getDaysOverdue } from "@/utils/date-utils";

const Rentals = () => {
  const { 
    rentals, 
    rentalsFilter, 
    setRentalsFilter, 
    markRentalAsReturned,
    deleteRental
  } = useAppContext();
  
  const [addRentalDialogOpen, setAddRentalDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<RentalType | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    rate: true,
    startDate: true,
    returnDate: true,
    customer: true,
    quantity: true
  });
  const { toast } = useToast();
  
  // Filter rentals based on search term and status
  const filteredRentals = rentals.filter(
    (rental) => {
      const matchesSearch = 
        rental.toolName.toLowerCase().includes(rentalsFilter.toLowerCase()) ||
        rental.customerName.toLowerCase().includes(rentalsFilter.toLowerCase());
      
      const matchesStatus = statusFilter ? rental.status === statusFilter : true;
      
      return matchesSearch && matchesStatus;
    }
  );
  
  const handleReturn = (rental: RentalType) => {
    setSelectedRental(rental);
    setReturnDialogOpen(true);
  };
  
  const confirmReturn = () => {
    if (selectedRental) {
      markRentalAsReturned(selectedRental.id);
    }
    setReturnDialogOpen(false);
  };

  const handleDelete = (rental: RentalType) => {
    deleteRental(rental.id);
    toast({
      title: "Rental Deleted",
      description: `Rental for ${rental.toolName} has been deleted.`,
      duration: 3000,
    });
  };
  
  const handleExportRentals = () => {
    exportRentalsToCSV(rentals);
  };

  const toggleRateColumn = () => {
    setColumnVisibility({
      ...columnVisibility,
      rate: !columnVisibility.rate
    });
    
    toast({
      title: columnVisibility.rate ? "Rate column hidden" : "Rate column visible",
      description: columnVisibility.rate ? "The rate column has been hidden from view." : "The rate column is now visible.",
      duration: 3000,
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <ContentHeader
        title="Rentals"
        actionButton={{
          label: "New Rental",
          icon: <Plus className="h-4 w-4" />,
          onClick: () => setAddRentalDialogOpen(true),
        }}
        searchPlaceholder="Search rentals..."
        onSearchChange={setRentalsFilter}
        filterButton={true}
        onFilterClick={() => {}}
      >
        <RentalsFilters 
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          showRateColumn={columnVisibility.rate}
          toggleRateColumn={toggleRateColumn}
          handleExportRentals={handleExportRentals}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
        />
      </ContentHeader>
      
      {filteredRentals.length === 0 ? (
        <EmptyState
          title="No rentals found"
          description={
            rentalsFilter || statusFilter
              ? "No rentals match your search criteria. Try a different search term or filter."
              : "Start by creating a new rental."
          }
          icon={<Package2 className="h-10 w-10 text-gray-400" />}
          action={
            <Button
              onClick={() => setAddRentalDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Rental
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredRentals.map((rental) => (
            <RentalCard 
              key={rental.id}
              rental={rental} 
              columnVisibility={columnVisibility} 
              onReturn={handleReturn}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      
      <AddRentalDialog 
        isOpen={addRentalDialogOpen} 
        onClose={() => setAddRentalDialogOpen(false)} 
      />
      
      <AlertDialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Returned</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark{" "}
              <span className="font-medium">
                {selectedRental?.toolName} (x{selectedRental?.quantity})
              </span>{" "}
              as returned by{" "}
              <span className="font-medium">{selectedRental?.customerName}</span>?
              {selectedRental?.status === "overdue" && (
                <p className="mt-2 text-red-500">
                  This rental is currently {getDaysOverdue(selectedRental.expectedReturnDate)} days overdue.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReturn}>
              Yes, Mark as Returned
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Rentals;
