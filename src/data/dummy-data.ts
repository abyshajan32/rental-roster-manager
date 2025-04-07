
import { AttendanceType, CustomerType, RentalType, ToolType, WorkerType } from "@/types";

// Tool Inventory Data
export const toolsData: ToolType[] = [
  {
    id: "t1",
    name: "Centering Sheet",
    category: "Formwork",
    totalQuantity: 50,
    availableQuantity: 30,
    ratePerDay: 15,
  },
  {
    id: "t2",
    name: "Adjustable Prop",
    category: "Support",
    totalQuantity: 100,
    availableQuantity: 60,
    ratePerDay: 10,
  },
  {
    id: "t3",
    name: "Rectangular Column Box",
    category: "Formwork",
    totalQuantity: 40,
    availableQuantity: 25,
    ratePerDay: 20,
  },
  {
    id: "t4",
    name: "Scaffolds",
    category: "Support",
    totalQuantity: 80,
    availableQuantity: 45,
    ratePerDay: 25,
  },
  {
    id: "t5",
    name: "Telescopic Spans",
    category: "Support",
    totalQuantity: 60,
    availableQuantity: 40,
    ratePerDay: 18,
  },
  {
    id: "t6",
    name: "Plinth Beam Sheets",
    category: "Formwork",
    totalQuantity: 30,
    availableQuantity: 20,
    ratePerDay: 22,
  },
];

// Customer Data
export const customersData: CustomerType[] = [
  {
    id: "c1",
    name: "Kannan Construction",
    phoneNumber: "9876543210",
    address: "123 Main St, Chennai",
    totalRentals: 15,
    activeRentals: 3,
  },
  {
    id: "c2",
    name: "Raj Builders",
    phoneNumber: "8765432109",
    address: "456 Park Ave, Chennai",
    totalRentals: 8,
    activeRentals: 2,
  },
  {
    id: "c3",
    name: "Suresh & Co",
    phoneNumber: "7654321098",
    address: "789 Oak Rd, Chennai",
    totalRentals: 12,
    activeRentals: 0,
  },
];

// Rental Data
export const rentalsData: RentalType[] = [
  {
    id: "r1",
    toolId: "t1",
    toolName: "Centering Sheet",
    quantity: 10,
    customerId: "c1",
    customerName: "Kannan Construction",
    startDate: new Date("2025-04-02"),
    expectedReturnDate: new Date("2025-04-12"),
    ratePerDay: 15,
    status: "active",
  },
  {
    id: "r2",
    toolId: "t2",
    toolName: "Adjustable Prop",
    quantity: 20,
    customerId: "c2",
    customerName: "Raj Builders",
    startDate: new Date("2025-03-28"),
    expectedReturnDate: new Date("2025-04-05"),
    ratePerDay: 10,
    status: "overdue",
  },
  {
    id: "r3",
    toolId: "t3",
    toolName: "Rectangular Column Box",
    quantity: 5,
    customerId: "c1",
    customerName: "Kannan Construction",
    startDate: new Date("2025-03-25"),
    expectedReturnDate: new Date("2025-04-10"),
    ratePerDay: 20,
    status: "active",
  },
  {
    id: "r4",
    toolId: "t4",
    toolName: "Scaffolds",
    quantity: 15,
    customerId: "c3",
    customerName: "Suresh & Co",
    startDate: new Date("2025-03-20"),
    expectedReturnDate: new Date("2025-03-30"),
    actualReturnDate: new Date("2025-03-30"),
    ratePerDay: 25,
    status: "returned",
  },
  {
    id: "r5",
    toolId: "t5",
    toolName: "Telescopic Spans",
    quantity: 10,
    customerId: "c2",
    customerName: "Raj Builders",
    startDate: new Date("2025-03-15"),
    expectedReturnDate: new Date("2025-03-25"),
    ratePerDay: 18,
    status: "active",
  },
  {
    id: "r6",
    toolId: "t1",
    toolName: "Centering Sheet",
    quantity: 8,
    customerId: "c1",
    customerName: "Kannan Construction",
    startDate: new Date("2025-03-10"),
    expectedReturnDate: new Date("2025-03-20"),
    actualReturnDate: new Date("2025-03-22"),
    ratePerDay: 15,
    status: "returned",
  },
];

// Worker Data
export const workersData: WorkerType[] = [
  {
    id: "w1",
    name: "Ramesh Kumar",
    phoneNumber: "9988776655",
    role: "Supervisor",
    joiningDate: new Date("2023-01-15"),
  },
  {
    id: "w2",
    name: "Vijay Singh",
    phoneNumber: "8877665544",
    role: "Helper",
    joiningDate: new Date("2023-03-10"),
  },
  {
    id: "w3",
    name: "Suresh Patel",
    phoneNumber: "7766554433",
    role: "Driver",
    joiningDate: new Date("2023-02-20"),
  },
  {
    id: "w4",
    name: "Manoj Tiwari",
    phoneNumber: "6655443322",
    role: "Helper",
    joiningDate: new Date("2023-04-05"),
  },
];

// Attendance Data
export const attendanceData: AttendanceType[] = [
  {
    id: "a1",
    workerId: "w1",
    workerName: "Ramesh Kumar",
    date: new Date("2025-04-01"),
    status: "present",
  },
  {
    id: "a2",
    workerId: "w2",
    workerName: "Vijay Singh",
    date: new Date("2025-04-01"),
    status: "present",
  },
  {
    id: "a3",
    workerId: "w3",
    workerName: "Suresh Patel",
    date: new Date("2025-04-01"),
    status: "absent",
  },
  {
    id: "a4",
    workerId: "w4",
    workerName: "Manoj Tiwari",
    date: new Date("2025-04-01"),
    status: "half-day",
  },
  {
    id: "a5",
    workerId: "w1",
    workerName: "Ramesh Kumar",
    date: new Date("2025-04-02"),
    status: "present",
  },
  {
    id: "a6",
    workerId: "w2",
    workerName: "Vijay Singh",
    date: new Date("2025-04-02"),
    status: "leave",
  },
  {
    id: "a7",
    workerId: "w3",
    workerName: "Suresh Patel",
    date: new Date("2025-04-02"),
    status: "present",
  },
  {
    id: "a8",
    workerId: "w4",
    workerName: "Manoj Tiwari",
    date: new Date("2025-04-02"),
    status: "present",
  },
];

// Mock monthly revenue data
export const revenueData = {
  currentMonth: "April",
  currentYear: 2025,
  totalRevenue: 2600,
  revenueByTool: {
    "Centering Sheet": 750,
    "Adjustable Prop": 600,
    "Rectangular Column Box": 400,
    "Scaffolds": 500,
    "Telescopic Spans": 350,
  },
  revenueByCustomer: {
    "Kannan Construction": 1100,
    "Raj Builders": 900,
    "Suresh & Co": 600,
  },
  dailyRevenue: [
    { day: "01", amount: 120 },
    { day: "02", amount: 90 },
    { day: "03", amount: 150 },
    { day: "04", amount: 85 },
    { day: "05", amount: 110 },
    { day: "06", amount: 95 },
    { day: "07", amount: 180 },
  ],
};

// Calculate dashboard stats
export const dashboardStats = {
  totalTools: toolsData.reduce((sum, tool) => sum + tool.totalQuantity, 0),
  availableTools: toolsData.reduce((sum, tool) => sum + tool.availableQuantity, 0),
  rentedTools: toolsData.reduce((sum, tool) => sum + (tool.totalQuantity - tool.availableQuantity), 0),
  activeRentals: rentalsData.filter(rental => rental.status === "active").length,
  overdueRentals: rentalsData.filter(rental => rental.status === "overdue").length,
  monthlyRevenue: revenueData.totalRevenue,
  todayNewRentals: 0,
  todayReturns: 0,
};
