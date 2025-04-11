
import { AttendanceType, CustomerType, RentalType, ToolType, WorkerType } from "@/types";

// Empty Tool Inventory Data
export const toolsData: ToolType[] = [];

// Empty Customer Data
export const customersData: CustomerType[] = [];

// Empty Rental Data
export const rentalsData: RentalType[] = [];

// Empty Worker Data
export const workersData: WorkerType[] = [];

// Empty Attendance Data
export const attendanceData: AttendanceType[] = [];

// Empty revenue data
export const revenueData = {
  currentMonth: new Date().toLocaleString('default', { month: 'long' }),
  currentYear: new Date().getFullYear(),
  totalRevenue: 0,
  revenueByTool: {},
  revenueByCustomer: {},
  dailyRevenue: [
    { day: "01", amount: 0 },
    { day: "02", amount: 0 },
    { day: "03", amount: 0 },
    { day: "04", amount: 0 },
    { day: "05", amount: 0 },
    { day: "06", amount: 0 },
    { day: "07", amount: 0 },
  ],
};

// Initialize dashboard stats with zeros
export const dashboardStats = {
  totalTools: 0,
  availableTools: 0,
  rentedTools: 0,
  activeRentals: 0,
  overdueRentals: 0,
  monthlyRevenue: 0,
  todayNewRentals: 0,
  todayReturns: 0,
};
