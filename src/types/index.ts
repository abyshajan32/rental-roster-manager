
export type ToolType = {
  id: string;
  name: string;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  ratePerDay: number;
  imageUrl?: string;
};

export type CustomerType = {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  totalRentals: number;
  activeRentals: number;
};

export type RentalStatus = "active" | "overdue" | "returned" | "cancelled";

export type RentalType = {
  id: string;
  toolId: string;
  toolName: string;
  quantity: number;
  customerId: string;
  customerName: string;
  startDate: Date;
  expectedReturnDate: Date;
  actualReturnDate?: Date;
  ratePerDay: number;
  status: RentalStatus;
};

export type WorkerType = {
  id: string;
  name: string;
  phoneNumber: string;
  role: string;
  joiningDate: Date;
};

export type AttendanceType = {
  id: string;
  workerId: string;
  workerName: string;
  date: Date;
  status: "present" | "absent" | "half-day" | "leave";
};

export type RevenueType = {
  month: string;
  year: number;
  totalRevenue: number;
  toolRevenue: Record<string, number>;
  customerRevenue: Record<string, number>;
};
