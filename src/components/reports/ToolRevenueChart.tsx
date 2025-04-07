
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

// Colors for charts
const COLORS = ["#4285F4", "#F29A37", "#34A853", "#EA4335", "#8E24AA", "#0097A7"];

interface ToolRevenueChartProps {
  revenueByTool: Record<string, number>;
}

export const ToolRevenueChart = ({ revenueByTool }: ToolRevenueChartProps) => {
  // Tool revenue data for charts
  const toolRevenueData = Object.entries(revenueByTool).map(([name, value]) => ({
    name,
    value,
  }));

  return (
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
  );
};
