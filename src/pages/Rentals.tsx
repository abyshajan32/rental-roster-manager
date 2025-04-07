
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import ContentHeader from "@/components/ContentHeader";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  FileDown, 
  Package2,
  User,
  Calendar,
  IndianRupee,
  CheckCircle,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/EmptyState";
import AddRentalDialog from "@/components/dialogs/AddRentalDialog";
import { RentalType } from "@/types";
import { formatDate, getDaysRemaining, getDaysOverdue } from "@/utils/date-utils";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  
  const handleExportRentals = () => {
    exportRentalsToCSV(rentals);
  };
  
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
            onClick={handleExportRentals}
          >
            <FileDown className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
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
          {filteredRentals.map((rental) => {
            const style = statusStyles[rental.status];
            
            return (
              <Card 
                key={rental.id} 
                className={`border-l-4 ${style.border} hover:shadow-md transition-shadow`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-start gap-2">
                        <Badge 
                          variant="outline" 
                          className={`${style.bg} ${style.text} capitalize mb-2`}
                        >
                          {rental.status}
                        </Badge>
                        
                        <h3 className="text-lg font-semibold">#{rental.id.substring(1)}</h3>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-1">
                        <Package2 className="h-4 w-4 text-gray-400" />
                        <p><span className="font-medium">Tool:</span> {rental.toolName} (x{rental.quantity})</p>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <p><span className="font-medium">Customer:</span> {rental.customerName}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                            <Calendar className="h-4 w-4" />
                            <p className="text-xs font-medium">Start Date</p>
                          </div>
                          <p className="font-medium">{formatDate(rental.startDate)}</p>
                        </div>
                        
                        <div className="text-center">
                          <div 
                            className={`flex items-center justify-center gap-1 
                            ${rental.status === 'overdue' ? 'text-overdue' : 'text-orange-500'} mb-1`}
                          >
                            <Calendar className="h-4 w-4" />
                            <p className="text-xs font-medium">
                              {rental.status === 'returned' ? 'Returned On' : 'Expected Return'}
                            </p>
                          </div>
                          <p className="font-medium">
                            {rental.status === 'returned' && rental.actualReturnDate 
                              ? formatDate(rental.actualReturnDate)
                              : formatDate(rental.expectedReturnDate)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col mt-4 md:mt-0">
                        <div className="flex items-center justify-center gap-1 text-revenue mb-1">
                          <IndianRupee className="h-4 w-4" />
                          <p className="text-xs font-medium">Rate</p>
                        </div>
                        <p className="font-medium text-center">
                          ₹{rental.ratePerDay * rental.quantity}<span className="text-xs text-gray-500">/day</span>
                        </p>
                      </div>
                      
                      {(rental.status === 'active' || rental.status === 'overdue') && (
                        <div className="flex items-center mt-4 md:mt-0">
                          <Button 
                            className="bg-active hover:bg-active/90 text-white"
                            onClick={() => handleReturn(rental)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Return
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {rental.status === 'active' && (
                    <div className="mt-3 pt-3 border-t text-sm">
                      <p className="text-gray-500">
                        <span className="font-medium text-active">
                          {getDaysRemaining(rental.expectedReturnDate)} days
                        </span> remaining until expected return
                      </p>
                    </div>
                  )}
                  
                  {rental.status === 'overdue' && (
                    <div className="mt-3 pt-3 border-t text-sm">
                      <p className="text-gray-500">
                        <span className="font-medium text-overdue">
                          {getDaysOverdue(rental.expectedReturnDate)} days
                        </span> overdue from expected return date
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
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
