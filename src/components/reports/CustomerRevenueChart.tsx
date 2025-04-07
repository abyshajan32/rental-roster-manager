
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

interface CustomerRevenueChartProps {
  revenueByCustomer: Record<string, number>;
}

export const CustomerRevenueChart = ({ revenueByCustomer }: CustomerRevenueChartProps) => {
  // Customer revenue data for charts
  const customerRevenueData = Object.entries(revenueByCustomer).map(([name, value]) => ({
    name,
    value,
  }));

  return (
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
  );
};
