
import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useAppContext } from "@/context/AppContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AttendanceType } from "@/types";

interface MarkAttendanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const MarkAttendanceDialog: FC<MarkAttendanceDialogProps> = ({ isOpen, onClose }) => {
  const { workers, attendance, markAttendance } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Get attendance for the selected date
  const attendanceForDate = attendance.filter(
    record => new Date(record.date).toDateString() === selectedDate.toDateString()
  );
  
  // Create a map of worker IDs to their attendance status for the selected date
  const attendanceMap = attendanceForDate.reduce((map, record) => {
    map[record.workerId] = record.status;
    return map;
  }, {} as Record<string, AttendanceType["status"]>);
  
  const handleAttendanceChange = (workerId: string, workerName: string, status: AttendanceType["status"]) => {
    markAttendance(workerId, workerName, selectedDate, status);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4">
          <div className="flex justify-center mb-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </div>
          
          <h3 className="font-medium">Attendance for {format(selectedDate, "PPP")}</h3>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workers.map((worker) => (
                  <TableRow key={worker.id}>
                    <TableCell>{worker.name}</TableCell>
                    <TableCell>{worker.role}</TableCell>
                    <TableCell>
                      <Select
                        value={attendanceMap[worker.id] || "absent"}
                        onValueChange={(value) => 
                          handleAttendanceChange(
                            worker.id, 
                            worker.name, 
                            value as AttendanceType["status"]
                          )
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="half-day">Half Day</SelectItem>
                          <SelectItem value="leave">Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" onClick={onClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarkAttendanceDialog;
