
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { RevenueType } from "@/types";

interface DetailedRevenueTableProps {
  revenue: RevenueType;
}

export const DetailedRevenueTable = ({ revenue }: DetailedRevenueTableProps) => {
  return (
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
  );
};
