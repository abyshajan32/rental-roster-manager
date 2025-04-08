
import { Package2, User, Calendar, IndianRupee, CheckCircle } from "lucide-react";
import { RentalType } from "@/types";
import { RentalStatusBadge } from "./RentalStatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, getDaysRemaining, getDaysOverdue } from "@/utils/date-utils";

interface RentalCardProps {
  rental: RentalType;
  showRateColumn: boolean;
  onReturn: (rental: RentalType) => void;
}

export const RentalCard = ({ rental, showRateColumn, onReturn }: RentalCardProps) => {
  return (
    <Card 
      key={rental.id} 
      className={`border-l-4 ${
        rental.status === 'active' ? 'border-active' : 
        rental.status === 'overdue' ? 'border-overdue' : 
        'border-gray-300'
      } hover:shadow-md transition-shadow`}
    >
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-start gap-2">
              <RentalStatusBadge status={rental.status} />
              <h3 className="text-lg font-semibold">#{rental.id.substring(1)}</h3>
            </div>
            
            <div className="flex items-center gap-1 mb-1">
              <Package2 className="h-4 w-4 text-gray-400" />
              <p><span className="font-medium">Tool:</span> {rental.toolName} (x{rental.quantity})</p>
            </div>
            
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-gray-400" />
              <p><span className="font-medium">Customer:</span> {rental.customerName}</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="flex gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                  <Calendar className="h-4 w-4" />
                  <p className="text-xs font-medium">Start Date</p>
                </div>
                <p className="font-medium">{formatDate(rental.startDate)}</p>
              </div>
              
              <div className="text-center">
                <div 
                  className={`flex items-center justify-center gap-1 
                  ${rental.status === 'overdue' ? 'text-overdue' : 'text-orange-500'} mb-1`}
                >
                  <Calendar className="h-4 w-4" />
                  <p className="text-xs font-medium">
                    {rental.status === 'returned' ? 'Returned On' : 'Expected Return'}
                  </p>
                </div>
                <p className="font-medium">
                  {rental.status === 'returned' && rental.actualReturnDate 
                    ? formatDate(rental.actualReturnDate)
                    : formatDate(rental.expectedReturnDate)}
                </p>
              </div>
            </div>
            
            {showRateColumn && (
              <div className="flex flex-col mt-4 md:mt-0">
                <div className="flex items-center justify-center gap-1 text-revenue mb-1">
                  <IndianRupee className="h-4 w-4" />
                  <p className="text-xs font-medium">Rate</p>
                </div>
                <p className="font-medium text-center">
                  ₹{rental.ratePerDay * rental.quantity}<span className="text-xs text-gray-500">/day</span>
                </p>
              </div>
            )}
            
            {(rental.status === 'active' || rental.status === 'overdue') && (
              <div className="flex items-center mt-4 md:mt-0">
                <Button 
                  className="bg-active hover:bg-active/90 text-white"
                  onClick={() => onReturn(rental)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Return
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {rental.status === 'active' && (
          <div className="mt-3 pt-3 border-t text-sm">
            <p className="text-gray-500">
              <span className="font-medium text-active">
                {getDaysRemaining(rental.expectedReturnDate)} days
              </span> remaining until expected return
            </p>
          </div>
        )}
        
        {rental.status === 'overdue' && (
          <div className="mt-3 pt-3 border-t text-sm">
            <p className="text-gray-500">
              <span className="font-medium text-overdue">
                {getDaysOverdue(rental.expectedReturnDate)} days
              </span> overdue from expected return date
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
