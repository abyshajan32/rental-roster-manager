
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
import { AttendanceType, WorkerType } from "@/types";
import { Input } from "@/components/ui/input";
import { Plus, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MarkAttendanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const MarkAttendanceDialog: FC<MarkAttendanceDialogProps> = ({ isOpen, onClose }) => {
  const { workers, attendance, markAttendance, addWorker } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newWorkerName, setNewWorkerName] = useState("");
  const [newWorkerRole, setNewWorkerRole] = useState("");
  const [newWorkerPhone, setNewWorkerPhone] = useState("");
  const [showAddWorker, setShowAddWorker] = useState(false);
  const { toast } = useToast();
  
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
  
  const handleAddWorker = () => {
    if (!newWorkerName.trim()) {
      toast({
        title: "Worker name is required",
        variant: "destructive",
      });
      return;
    }
    
    const newWorker: Omit<WorkerType, "id"> = {
      name: newWorkerName,
      phoneNumber: newWorkerPhone || "Not provided",
      role: newWorkerRole || "General Worker",
      joiningDate: new Date(),
    };
    
    addWorker(newWorker);
    
    // Reset form
    setNewWorkerName("");
    setNewWorkerRole("");
    setNewWorkerPhone("");
    setShowAddWorker(false);
    
    toast({
      title: "Worker Added",
      description: `${newWorkerName} has been added as a worker.`,
    });
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
          
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Attendance for {format(selectedDate, "PPP")}</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAddWorker(!showAddWorker)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Worker
            </Button>
          </div>
          
          {showAddWorker && (
            <div className="bg-gray-50 p-4 rounded-md border space-y-3">
              <h4 className="font-medium text-sm">Add New Worker</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="workerName" className="text-sm font-medium">
                    Name *
                  </label>
                  <Input
                    id="workerName"
                    placeholder="Worker name"
                    value={newWorkerName}
                    onChange={(e) => setNewWorkerName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="workerRole" className="text-sm font-medium">
                    Role
                  </label>
                  <Input
                    id="workerRole"
                    placeholder="Worker role"
                    value={newWorkerRole}
                    onChange={(e) => setNewWorkerRole(e.target.value)}
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label htmlFor="workerPhone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <Input
                    id="workerPhone"
                    placeholder="Phone number"
                    value={newWorkerPhone}
                    onChange={(e) => setNewWorkerPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  size="sm" 
                  onClick={handleAddWorker}
                  className="flex items-center gap-1"
                >
                  <Save className="h-4 w-4" />
                  Save Worker
                </Button>
              </div>
            </div>
          )}
          
          <div className="rounded-md border">
            {workers.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No workers found. Add a worker to mark attendance.</p>
              </div>
            ) : (
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
            )}
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
