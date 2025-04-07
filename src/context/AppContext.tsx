
import React, { createContext, useState, useContext, ReactNode } from "react";
import { 
  AttendanceType, 
  CustomerType, 
  RentalType, 
  ToolType, 
  WorkerType 
} from "@/types";
import { 
  attendanceData, 
  customersData, 
  dashboardStats, 
  rentalsData, 
  revenueData, 
  toolsData, 
  workersData 
} from "@/data/dummy-data";
import { isRentalOverdue } from "@/utils/date-utils";
import { useToast } from "@/hooks/use-toast";

interface AppContextProps {
  // Data states
  tools: ToolType[];
  rentals: RentalType[];
  customers: CustomerType[];
  workers: WorkerType[];
  attendance: AttendanceType[];
  revenue: any;
  stats: typeof dashboardStats;
  
  // Filter states
  toolsFilter: string;
  rentalsFilter: string;
  customersFilter: string;
  workersFilter: string;
  
  // CRUD operations
  addTool: (tool: Omit<ToolType, "id">) => void;
  updateTool: (tool: ToolType) => void;
  deleteTool: (id: string) => void;
  
  addRental: (rental: Omit<RentalType, "id" | "status">) => void;
  updateRental: (rental: RentalType) => void;
  deleteRental: (id: string) => void;
  markRentalAsReturned: (id: string) => void;
  
  addCustomer: (customer: Omit<CustomerType, "id" | "totalRentals" | "activeRentals">) => void;
  updateCustomer: (customer: CustomerType) => void;
  deleteCustomer: (id: string) => void;
  
  addWorker: (worker: Omit<WorkerType, "id">) => void;
  updateWorker: (worker: WorkerType) => void;
  deleteWorker: (id: string) => void;
  
  markAttendance: (workerId: string, workerName: string, date: Date, status: AttendanceType["status"]) => void;
  
  // Filter setters
  setToolsFilter: (filter: string) => void;
  setRentalsFilter: (filter: string) => void;
  setCustomersFilter: (filter: string) => void;
  setWorkersFilter: (filter: string) => void;
  
  // Excel import/export
  importFromExcel: (file: File) => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // Data states
  const [tools, setTools] = useState<ToolType[]>(toolsData);
  const [rentals, setRentals] = useState<RentalType[]>(rentalsData);
  const [customers, setCustomers] = useState<CustomerType[]>(customersData);
  const [workers, setWorkers] = useState<WorkerType[]>(workersData);
  const [attendance, setAttendance] = useState<AttendanceType[]>(attendanceData);
  const [revenue, setRevenue] = useState(revenueData);
  const [stats, setStats] = useState(dashboardStats);
  
  // Filter states
  const [toolsFilter, setToolsFilter] = useState("");
  const [rentalsFilter, setRentalsFilter] = useState("");
  const [customersFilter, setCustomersFilter] = useState("");
  const [workersFilter, setWorkersFilter] = useState("");
  
  // Update dashboard stats when relevant data changes
  React.useEffect(() => {
    const newStats = {
      totalTools: tools.reduce((sum, tool) => sum + tool.totalQuantity, 0),
      availableTools: tools.reduce((sum, tool) => sum + tool.availableQuantity, 0),
      rentedTools: tools.reduce((sum, tool) => sum + (tool.totalQuantity - tool.availableQuantity), 0),
      activeRentals: rentals.filter(rental => rental.status === "active").length,
      overdueRentals: rentals.filter(rental => rental.status === "overdue").length,
      monthlyRevenue: revenue.totalRevenue,
      todayNewRentals: rentals.filter(rental => isRentalOverdue(rental.startDate)).length,
      todayReturns: rentals.filter(rental => 
        rental.actualReturnDate && 
        new Date(rental.actualReturnDate).toDateString() === new Date().toDateString()
      ).length,
    };
    
    setStats(newStats);
  }, [tools, rentals, revenue]);
  
  // CRUD operations for tools
  const addTool = (newTool: Omit<ToolType, "id">) => {
    const tool: ToolType = {
      ...newTool,
      id: `t${tools.length + 1}`,
    };
    
    setTools([...tools, tool]);
    toast({
      title: "Tool Added",
      description: `${newTool.name} has been added to inventory.`,
    });
  };
  
  const updateTool = (updatedTool: ToolType) => {
    setTools(tools.map(tool => tool.id === updatedTool.id ? updatedTool : tool));
    toast({
      title: "Tool Updated",
      description: `${updatedTool.name} has been updated.`,
    });
  };
  
  const deleteTool = (id: string) => {
    const toolToDelete = tools.find(tool => tool.id === id);
    if (!toolToDelete) return;
    
    setTools(tools.filter(tool => tool.id !== id));
    toast({
      title: "Tool Deleted",
      description: `${toolToDelete.name} has been removed from inventory.`,
    });
  };
  
  // CRUD operations for rentals
  const addRental = (newRental: Omit<RentalType, "id" | "status">) => {
    const rental: RentalType = {
      ...newRental,
      id: `r${rentals.length + 1}`,
      status: "active",
    };
    
    // Update tool availability
    const toolToUpdate = tools.find(tool => tool.id === rental.toolId);
    if (toolToUpdate) {
      const updatedTool = {
        ...toolToUpdate,
        availableQuantity: toolToUpdate.availableQuantity - rental.quantity,
      };
      updateTool(updatedTool);
    }
    
    // Update customer active rentals
    const customerToUpdate = customers.find(customer => customer.id === rental.customerId);
    if (customerToUpdate) {
      const updatedCustomer = {
        ...customerToUpdate,
        activeRentals: customerToUpdate.activeRentals + 1,
        totalRentals: customerToUpdate.totalRentals + 1,
      };
      updateCustomer(updatedCustomer);
    }
    
    setRentals([...rentals, rental]);
    toast({
      title: "Rental Added",
      description: `New rental created for ${rental.customerName}.`,
    });
  };
  
  const updateRental = (updatedRental: RentalType) => {
    setRentals(rentals.map(rental => rental.id === updatedRental.id ? updatedRental : rental));
    toast({
      title: "Rental Updated",
      description: `Rental #${updatedRental.id.substring(1)} has been updated.`,
    });
  };
  
  const deleteRental = (id: string) => {
    const rentalToDelete = rentals.find(rental => rental.id === id);
    if (!rentalToDelete) return;
    
    setRentals(rentals.filter(rental => rental.id !== id));
    toast({
      title: "Rental Deleted",
      description: `Rental for ${rentalToDelete.customerName} has been deleted.`,
    });
  };
  
  const markRentalAsReturned = (id: string) => {
    const rentalToUpdate = rentals.find(rental => rental.id === id);
    if (!rentalToUpdate) return;
    
    const updatedRental = {
      ...rentalToUpdate,
      status: "returned" as const,
      actualReturnDate: new Date(),
    };
    
    // Update tool availability
    const toolToUpdate = tools.find(tool => tool.id === updatedRental.toolId);
    if (toolToUpdate) {
      const updatedTool = {
        ...toolToUpdate,
        availableQuantity: toolToUpdate.availableQuantity + updatedRental.quantity,
      };
      updateTool(updatedTool);
    }
    
    // Update customer active rentals
    const customerToUpdate = customers.find(customer => customer.id === updatedRental.customerId);
    if (customerToUpdate) {
      const updatedCustomer = {
        ...customerToUpdate,
        activeRentals: customerToUpdate.activeRentals - 1,
      };
      updateCustomer(updatedCustomer);
    }
    
    updateRental(updatedRental);
    toast({
      title: "Rental Returned",
      description: `${updatedRental.toolName} has been returned by ${updatedRental.customerName}.`,
    });
  };
  
  // CRUD operations for customers
  const addCustomer = (newCustomer: Omit<CustomerType, "id" | "totalRentals" | "activeRentals">) => {
    const customer: CustomerType = {
      ...newCustomer,
      id: `c${customers.length + 1}`,
      totalRentals: 0,
      activeRentals: 0,
    };
    
    setCustomers([...customers, customer]);
    toast({
      title: "Customer Added",
      description: `${newCustomer.name} has been added as a customer.`,
    });
  };
  
  const updateCustomer = (updatedCustomer: CustomerType) => {
    setCustomers(customers.map(customer => customer.id === updatedCustomer.id ? updatedCustomer : customer));
    toast({
      title: "Customer Updated",
      description: `${updatedCustomer.name}'s information has been updated.`,
    });
  };
  
  const deleteCustomer = (id: string) => {
    const customerToDelete = customers.find(customer => customer.id === id);
    if (!customerToDelete) return;
    
    // Check if customer has active rentals
    if (customerToDelete.activeRentals > 0) {
      toast({
        title: "Cannot Delete Customer",
        description: `${customerToDelete.name} has active rentals. Return all tools first.`,
        variant: "destructive",
      });
      return;
    }
    
    setCustomers(customers.filter(customer => customer.id !== id));
    toast({
      title: "Customer Deleted",
      description: `${customerToDelete.name} has been removed from customers.`,
    });
  };
  
  // CRUD operations for workers
  const addWorker = (newWorker: Omit<WorkerType, "id">) => {
    const worker: WorkerType = {
      ...newWorker,
      id: `w${workers.length + 1}`,
    };
    
    setWorkers([...workers, worker]);
    toast({
      title: "Worker Added",
      description: `${newWorker.name} has been added as a worker.`,
    });
  };
  
  const updateWorker = (updatedWorker: WorkerType) => {
    setWorkers(workers.map(worker => worker.id === updatedWorker.id ? updatedWorker : worker));
    toast({
      title: "Worker Updated",
      description: `${updatedWorker.name}'s information has been updated.`,
    });
  };
  
  const deleteWorker = (id: string) => {
    const workerToDelete = workers.find(worker => worker.id === id);
    if (!workerToDelete) return;
    
    setWorkers(workers.filter(worker => worker.id !== id));
    toast({
      title: "Worker Deleted",
      description: `${workerToDelete.name} has been removed from workers.`,
    });
  };
  
  // Attendance operations
  const markAttendance = (workerId: string, workerName: string, date: Date, status: AttendanceType["status"]) => {
    // Check if attendance record already exists for this worker and date
    const existingRecord = attendance.find(
      record => record.workerId === workerId && 
      new Date(record.date).toDateString() === new Date(date).toDateString()
    );
    
    if (existingRecord) {
      // Update existing record
      const updatedAttendance = attendance.map(record => {
        if (record.id === existingRecord.id) {
          return { ...record, status };
        }
        return record;
      });
      
      setAttendance(updatedAttendance);
      toast({
        title: "Attendance Updated",
        description: `${workerName}'s attendance updated to ${status}.`,
      });
    } else {
      // Create new record
      const newAttendanceRecord: AttendanceType = {
        id: `a${attendance.length + 1}`,
        workerId,
        workerName,
        date,
        status,
      };
      
      setAttendance([...attendance, newAttendanceRecord]);
      toast({
        title: "Attendance Marked",
        description: `${workerName} marked as ${status} for ${date.toLocaleDateString()}.`,
      });
    }
  };
  
  // Excel import/export
  const importFromExcel = async (file: File): Promise<void> => {
    // This is a placeholder for Excel import functionality
    // In a real app, you would use a library like SheetJS (xlsx) to parse Excel files
    return new Promise((resolve) => {
      setTimeout(() => {
        toast({
          title: "Import Completed",
          description: "Data has been imported from Excel successfully.",
        });
        resolve();
      }, 1000);
    });
  };
  
  return (
    <AppContext.Provider
      value={{
        // Data states
        tools,
        rentals,
        customers,
        workers,
        attendance,
        revenue,
        stats,
        
        // Filter states
        toolsFilter,
        rentalsFilter,
        customersFilter,
        workersFilter,
        
        // CRUD operations
        addTool,
        updateTool,
        deleteTool,
        
        addRental,
        updateRental,
        deleteRental,
        markRentalAsReturned,
        
        addCustomer,
        updateCustomer,
        deleteCustomer,
        
        addWorker,
        updateWorker,
        deleteWorker,
        
        markAttendance,
        
        // Filter setters
        setToolsFilter,
        setRentalsFilter,
        setCustomersFilter,
        setWorkersFilter,
        
        // Excel import/export
        importFromExcel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
