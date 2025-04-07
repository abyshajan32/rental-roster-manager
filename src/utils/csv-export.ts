
import { AttendanceType, CustomerType, RentalType, ToolType, WorkerType } from "@/types";
import { formatDateShort } from "./date-utils";

export const exportToCSV = <T>(data: T[], filename: string, headers: string[]): void => {
  // Convert data to CSV format
  const csvContent = [
    headers.join(","),
    ...data.map(row => Object.values(row).join(","))
  ].join("\n");
  
  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
  // Create a download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  
  // Append to the DOM, trigger click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportRentalsToCSV = (rentals: RentalType[]): void => {
  const headers = ["ID", "Tool", "Quantity", "Customer", "Start Date", "Expected Return", "Actual Return", "Rate/Day", "Status"];
  
  const formattedData = rentals.map(rental => ({
    id: rental.id,
    toolName: rental.toolName,
    quantity: rental.quantity,
    customerName: rental.customerName,
    startDate: formatDateShort(rental.startDate),
    expectedReturnDate: formatDateShort(rental.expectedReturnDate),
    actualReturnDate: rental.actualReturnDate ? formatDateShort(rental.actualReturnDate) : "-",
    ratePerDay: `₹${rental.ratePerDay}`,
    status: rental.status,
  }));
  
  exportToCSV(formattedData, "rentals", headers);
};

export const exportToolsToCSV = (tools: ToolType[]): void => {
  const headers = ["ID", "Name", "Category", "Total Quantity", "Available", "Rate/Day"];
  
  const formattedData = tools.map(tool => ({
    id: tool.id,
    name: tool.name,
    category: tool.category,
    totalQuantity: tool.totalQuantity,
    availableQuantity: tool.availableQuantity,
    ratePerDay: `₹${tool.ratePerDay}`,
  }));
  
  exportToCSV(formattedData, "tools", headers);
};

export const exportCustomersToCSV = (customers: CustomerType[]): void => {
  const headers = ["ID", "Name", "Phone", "Address", "Total Rentals", "Active Rentals"];
  
  const formattedData = customers.map(customer => ({
    id: customer.id,
    name: customer.name,
    phone: customer.phoneNumber,
    address: customer.address,
    totalRentals: customer.totalRentals,
    activeRentals: customer.activeRentals,
  }));
  
  exportToCSV(formattedData, "customers", headers);
};

export const exportWorkersToCSV = (workers: WorkerType[]): void => {
  const headers = ["ID", "Name", "Phone", "Role", "Joining Date"];
  
  const formattedData = workers.map(worker => ({
    id: worker.id,
    name: worker.name,
    phone: worker.phoneNumber,
    role: worker.role,
    joiningDate: formatDateShort(worker.joiningDate),
  }));
  
  exportToCSV(formattedData, "workers", headers);
};

export const exportAttendanceToCSV = (attendance: AttendanceType[]): void => {
  const headers = ["ID", "Worker", "Date", "Status"];
  
  const formattedData = attendance.map(record => ({
    id: record.id,
    workerName: record.workerName,
    date: formatDateShort(record.date),
    status: record.status,
  }));
  
  exportToCSV(formattedData, "attendance", headers);
};

export const exportRevenueToCSV = (revenue: any): void => {
  const headers = ["Month", "Year", "Tool", "Customer", "Revenue"];
  
  // Prepare data for tools revenue
  const toolRevenueData = Object.entries(revenue.revenueByTool).map(([tool, amount]) => ({
    month: revenue.currentMonth,
    year: revenue.currentYear,
    tool,
    customer: "-",
    revenue: `₹${amount}`,
  }));
  
  // Prepare data for customer revenue
  const customerRevenueData = Object.entries(revenue.revenueByCustomer).map(([customer, amount]) => ({
    month: revenue.currentMonth,
    year: revenue.currentYear,
    tool: "-",
    customer,
    revenue: `₹${amount}`,
  }));
  
  // Combine both datasets
  const formattedData = [...toolRevenueData, ...customerRevenueData];
  
  exportToCSV(formattedData, "revenue", headers);
};
