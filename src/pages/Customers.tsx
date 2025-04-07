
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import ContentHeader from "@/components/ContentHeader";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  FileDown, 
  Users,
  User,
  Phone,
  MapPin,
  Package2,
  Edit,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import AddCustomerDialog from "@/components/dialogs/AddCustomerDialog";
import { CustomerType } from "@/types";
import { exportCustomersToCSV } from "@/utils/csv-export";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Customers = () => {
  const { customers, customersFilter, setCustomersFilter, deleteCustomer } = useAppContext();
  
  const [addCustomerDialogOpen, setAddCustomerDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerType | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerType | null>(null);
  
  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(customersFilter.toLowerCase()) ||
      customer.phoneNumber.includes(customersFilter) ||
      customer.address.toLowerCase().includes(customersFilter.toLowerCase())
  );
  
  const handleEditCustomer = (customer: CustomerType) => {
    setEditingCustomer(customer);
    setAddCustomerDialogOpen(true);
  };
  
  const handleDeleteCustomer = (customer: CustomerType) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete.id);
    }
    setDeleteDialogOpen(false);
  };
  
  const handleExportCustomers = () => {
    exportCustomersToCSV(customers);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <ContentHeader
        title="Customers"
        actionButton={{
          label: "Add Customer",
          icon: <Plus className="h-4 w-4" />,
          onClick: () => {
            setEditingCustomer(undefined);
            setAddCustomerDialogOpen(true);
          },
        }}
        searchPlaceholder="Search customers..."
        onSearchChange={setCustomersFilter}
      >
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleExportCustomers}
          >
            <FileDown className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </ContentHeader>
      
      {filteredCustomers.length === 0 ? (
        <EmptyState
          title="No customers found"
          description={
            customersFilter
              ? "No customers match your search criteria. Try a different search term."
              : "Start by adding some customers."
          }
          icon={<Users className="h-10 w-10 text-gray-400" />}
          action={
            <Button
              onClick={() => {
                setEditingCustomer(undefined);
                setAddCustomerDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredCustomers.map((customer) => (
            <Card 
              key={customer.id} 
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-500" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">{customer.name}</h3>
                      
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{customer.phoneNumber}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{customer.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{customer.totalRentals}</p>
                      <p className="text-sm text-gray-500">Total Rentals</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-500">{customer.activeRentals}</p>
                      <p className="text-sm text-gray-500">Active Rentals</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEditCustomer(customer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteCustomer(customer)}
                        disabled={customer.activeRentals > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <AddCustomerDialog
        isOpen={addCustomerDialogOpen}
        onClose={() => setAddCustomerDialogOpen(false)}
        editingCustomer={editingCustomer}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium">{customerToDelete?.name}</span>?
              
              {customerToDelete?.activeRentals > 0 && (
                <p className="mt-2 text-red-500">
                  You cannot delete this customer because they have active rentals. Please mark all rentals as returned first.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {customerToDelete?.activeRentals === 0 && (
              <AlertDialogAction onClick={confirmDelete}>
                Yes, Delete
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Customers;
