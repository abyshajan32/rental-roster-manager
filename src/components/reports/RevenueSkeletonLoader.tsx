
import { Loader } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const RevenueSkeletonLoader = () => {
  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      
      {/* Revenue summary card skeleton */}
      <Card className="border-l-4 border-gray-300 mb-8">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-16 w-16 rounded-lg" />
        </CardContent>
      </Card>
      
      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>
              <Skeleton className="h-6 w-40" />
            </CardTitle>
            <Skeleton className="h-4 w-60 mt-1" />
          </CardHeader>
          <CardContent className="p-6 flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Loader className="h-10 w-10 text-gray-300 animate-spin" />
              <Skeleton className="h-4 w-36" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>
              <Skeleton className="h-6 w-40" />
            </CardTitle>
            <Skeleton className="h-4 w-60 mt-1" />
          </CardHeader>
          <CardContent className="p-6 flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Loader className="h-10 w-10 text-gray-300 animate-spin" />
              <Skeleton className="h-4 w-36" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Table skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4">
            <div className="border-b pb-4">
              <div className="grid grid-cols-4 gap-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
            
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="py-4 border-b">
                <div className="grid grid-cols-4 gap-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
