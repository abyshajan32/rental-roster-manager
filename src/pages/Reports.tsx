
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, IndianRupee } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMonth } from "@/utils/date-utils";
import { exportRevenueToCSV } from "@/utils/csv-export";

const Reports = () => {
  const { revenue } = useAppContext();
  
  // Tool revenue data for charts
  const toolRevenueData = Object.entries(revenue.revenueByTool).map(([name, value]) => ({
    name,
    value,
  }));
  
  // Customer revenue data for charts
  const customerRevenueData = Object.entries(revenue.revenueByCustomer).map(([name, value]) => ({
    name,
    value,
  }));
  
  // Colors for charts
  const COLORS = ["#4285F4", "#F29A37", "#34A853", "#EA4335", "#8E24AA", "#0097A7"];
  
  const handleExportReport = () => {
    exportRevenueToCSV(revenue);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Revenue Reports</h1>
          <p className="text-gray-500">{formatMonth(new Date())}</p>
        </div>
        
        <Button
          onClick={handleExportReport}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          <span>Export Report</span>
        </Button>
      </div>
      
      <Card className="border-l-4 border-revenue mb-8">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-600 font-medium mb-1">Monthly Revenue</p>
            <p className="text-4xl font-bold text-revenue">₹{revenue.totalRevenue}</p>
          </div>
          <div className="h-16 w-16 rounded-lg flex items-center justify-center bg-revenue-light text-revenue">
            <IndianRupee className="h-8 w-8" />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Revenue by Tool</CardTitle>
            <CardDescription>
              Tool-wise revenue distribution for the current month
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={toolRevenueData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {toolRevenueData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Revenue by Customer</CardTitle>
            <CardDescription>
              Customer-wise revenue distribution for the current month
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerRevenueData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                  <Bar dataKey="value" fill="#F29A37" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Detailed Revenue Report</CardTitle>
            <CardDescription>
              Breakdown of revenue by different categories
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Category</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Tool Revenue */}
                {Object.entries(revenue.revenueByTool).map(([tool, amount], index) => (
                  <TableRow key={`tool-${index}`}>
                    {index === 0 && (
                      <TableCell className="font-medium" rowSpan={Object.keys(revenue.revenueByTool).length}>
                        Tools
                      </TableCell>
                    )}
                    <TableCell>{tool}</TableCell>
                    <TableCell className="text-right">₹{String(amount)}</TableCell>
                    <TableCell className="text-right">
                      {((Number(amount) / revenue.totalRevenue) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Customer Revenue */}
                {Object.entries(revenue.revenueByCustomer).map(([customer, amount], index) => (
                  <TableRow key={`customer-${index}`}>
                    {index === 0 && (
                      <TableCell className="font-medium" rowSpan={Object.keys(revenue.revenueByCustomer).length}>
                        Customers
                      </TableCell>
                    )}
                    <TableCell>{customer}</TableCell>
                    <TableCell className="text-right">₹{String(amount)}</TableCell>
                    <TableCell className="text-right">
                      {((Number(amount) / revenue.totalRevenue) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
