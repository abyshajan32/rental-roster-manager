import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import StatsCard from "@/components/StatsCard";
import {
  Package2,
  PackageOpen,
  CheckCircle,
  AlertCircle,
  IndianRupee,
  Calendar,
  RotateCcw,
  Users,
  ClipboardCheck,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/date-utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import MarkAttendanceDialog from "@/components/dialogs/MarkAttendanceDialog";
import ImportDialog from "@/components/dialogs/ImportDialog";

const Dashboard = () => {
  const { stats, tools, rentals, workers, customers, revenue } = useAppContext();
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importType, setImportType] = useState<"tools" | "rentals" | "customers" | "workers">("tools");
  
  // Active and overdue rentals for today's activity
  const activeRentals = rentals.filter(rental => rental.status === "active");
  const overdueRentals = rentals.filter(rental => rental.status === "overdue");
  
  const openImportDialog = (type: "tools" | "rentals" | "customers" | "workers") => {
    setImportType(type);
    setImportDialogOpen(true);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">S R Agency</h1>
          <p className="text-gray-500">Rental Management</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setAttendanceDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <ClipboardCheck className="h-4 w-4" />
            <span>Mark Attendance</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => openImportDialog("tools")}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            <span>Import Data</span>
          </Button>
        </div>
      </header>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Available Tools"
          value={stats.availableTools}
          icon={<Package2 className="h-6 w-6" />}
          color="available"
        />
        <StatsCard
          title="Rented Tools"
          value={stats.rentedTools}
          icon={<PackageOpen className="h-6 w-6" />}
          color="rented"
        />
        <StatsCard
          title="Active Rentals"
          value={activeRentals.length}
          icon={<CheckCircle className="h-6 w-6" />}
          color="active"
        />
        <StatsCard
          title="Overdue Rentals"
          value={overdueRentals.length}
          icon={<AlertCircle className="h-6 w-6" />}
          color="overdue"
        />
      </div>
      
      <Card className="border-l-4 border-revenue mb-8">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-600 font-medium mb-1">Monthly Revenue</p>
            <p className="text-3xl font-bold text-revenue">₹{revenue.totalRevenue}</p>
          </div>
          <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-revenue-light text-revenue">
            <IndianRupee className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenue.dailyRevenue}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`₹${value}`, "Revenue"]}
                    labelFormatter={(label) => `Day ${label}`}
                  />
                  <Bar dataKey="amount" fill="#F29A37" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-bold mb-4">Today's Activity</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <Card className="bg-blue-50">
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-4xl font-bold text-blue-500">{stats.todayNewRentals}</p>
            <p className="text-gray-600">New Rentals</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <RotateCcw className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-4xl font-bold text-green-500">{stats.todayReturns}</p>
            <p className="text-gray-600">Returns</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Access</h2>
        <Tabs defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active Rentals</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="customers">Top Customers</TabsTrigger>
            <TabsTrigger value="tools">Low Stock</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Tool</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Expected Return</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeRentals.slice(0, 5).map((rental) => (
                      <TableRow key={rental.id}>
                        <TableCell>{rental.customerName}</TableCell>
                        <TableCell>{rental.toolName}</TableCell>
                        <TableCell>{rental.quantity}</TableCell>
                        <TableCell>{formatDate(rental.startDate)}</TableCell>
                        <TableCell>{formatDate(rental.expectedReturnDate)}</TableCell>
                      </TableRow>
                    ))}
                    {activeRentals.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                          No active rentals
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="overdue">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Tool</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Expected Return</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overdueRentals.slice(0, 5).map((rental) => (
                      <TableRow key={rental.id}>
                        <TableCell>{rental.customerName}</TableCell>
                        <TableCell>{rental.toolName}</TableCell>
                        <TableCell>{rental.quantity}</TableCell>
                        <TableCell>{formatDate(rental.expectedReturnDate)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-red-100 text-red-500 border-red-200">
                            Overdue
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {overdueRentals.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                          No overdue rentals
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Total Rentals</TableHead>
                      <TableHead>Active Rentals</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers
                      .sort((a, b) => b.totalRentals - a.totalRentals)
                      .slice(0, 5)
                      .map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell>{customer.phoneNumber}</TableCell>
                          <TableCell>{customer.address}</TableCell>
                          <TableCell>{customer.totalRentals}</TableCell>
                          <TableCell>{customer.activeRentals}</TableCell>
                        </TableRow>
                      ))}
                    {customers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                          No customers found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tools">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tool</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tools
                      .sort((a, b) => (a.availableQuantity / a.totalQuantity) - (b.availableQuantity / b.totalQuantity))
                      .slice(0, 5)
                      .map((tool) => (
                        <TableRow key={tool.id}>
                          <TableCell>{tool.name}</TableCell>
                          <TableCell>{tool.category}</TableCell>
                          <TableCell>{tool.totalQuantity}</TableCell>
                          <TableCell>{tool.availableQuantity}</TableCell>
                          <TableCell>
                            {tool.availableQuantity < tool.totalQuantity * 0.2 ? (
                              <Badge variant="outline" className="bg-red-100 text-red-500 border-red-200">
                                Low Stock
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-100 text-green-500 border-green-200">
                                In Stock
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    {tools.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                          No tools found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <MarkAttendanceDialog 
        isOpen={attendanceDialogOpen} 
        onClose={() => setAttendanceDialogOpen(false)} 
      />
      
      <ImportDialog
        isOpen={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        type={importType}
      />
    </div>
  );
};

export default Dashboard;
