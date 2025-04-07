
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { RevenueHeader } from "@/components/reports/RevenueHeader";
import { RevenueSummaryCard } from "@/components/reports/RevenueSummaryCard";
import { ToolRevenueChart } from "@/components/reports/ToolRevenueChart";
import { CustomerRevenueChart } from "@/components/reports/CustomerRevenueChart";
import { DetailedRevenueTable } from "@/components/reports/DetailedRevenueTable";
import { RevenueSkeletonLoader } from "@/components/reports/RevenueSkeletonLoader";

const Reports = () => {
  const { revenue } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return <RevenueSkeletonLoader />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <RevenueHeader revenue={revenue} />
      <RevenueSummaryCard totalRevenue={revenue.totalRevenue} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ToolRevenueChart revenueByTool={revenue.revenueByTool} />
        <CustomerRevenueChart revenueByCustomer={revenue.revenueByCustomer} />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <DetailedRevenueTable revenue={revenue} />
      </div>
    </div>
  );
};

export default Reports;
