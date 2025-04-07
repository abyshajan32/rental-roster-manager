
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import ContentHeader from "@/components/ContentHeader";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  FileDown, 
  Users,
  User,
  Phone,
  Briefcase,
  Calendar,
  ClipboardCheck,
  Edit,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import AddWorkerDialog from "@/components/dialogs/AddWorkerDialog";
import MarkAttendanceDialog from "@/components/dialogs/MarkAttendanceDialog";
import { WorkerType } from "@/types";
import { exportWorkersToCSV, exportAttendanceToCSV } from "@/utils/csv-export";
import { formatDate } from "@/utils/date-utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const Workers = () => {
  const { workers, workersFilter, setWorkersFilter, deleteWorker, attendance } = useAppContext();
  
  const [addWorkerDialogOpen, setAddWorkerDialogOpen] = useState(false);
  const [markAttendanceDialogOpen, setMarkAttendanceDialogOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<WorkerType | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workerToDelete, setWorkerToDelete] = useState<WorkerType | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Filter workers based on search term
  const filteredWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(workersFilter.toLowerCase()) ||
      worker.phoneNumber.includes(workersFilter) ||
      worker.role.toLowerCase().includes(workersFilter.toLowerCase())
  );
  
  // Get attendance for the selected date
  const attendanceForDate = attendance.filter(
    record => new Date(record.date).toDateString() === selectedDate.toDateString()
  );
  
  // Get attendance for all workers
  const attendanceByWorker = workers.map(worker => {
    const workerAttendance = attendance.filter(record => record.workerId === worker.id);
    const present = workerAttendance.filter(record => record.status === "present").length;
    const absent = workerAttendance.filter(record => record.status === "absent").length;
    const halfDay = workerAttendance.filter(record => record.status === "half-day").length;
    const leave = workerAttendance.filter(record => record.status === "leave").length;
    
    return {
      workerId: worker.id,
      workerName: worker.name,
      present,
      absent,
      halfDay,
      leave,
      total: present + absent + halfDay + leave
    };
  });
  
  const handleEditWorker = (worker: WorkerType) => {
    setEditingWorker(worker);
    setAddWorkerDialogOpen(true);
  };
  
  const handleDeleteWorker = (worker: WorkerType) => {
    setWorkerToDelete(worker);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (workerToDelete) {
      deleteWorker(workerToDelete.id);
    }
    setDeleteDialogOpen(false);
  };
  
  const handleExportWorkers = () => {
    exportWorkersToCSV(workers);
  };
  
  const handleExportAttendance = () => {
    exportAttendanceToCSV(attendance);
  };
  
  const getAttendanceStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-active-light text-active">Present</Badge>;
      case "absent":
        return <Badge className="bg-overdue-light text-overdue">Absent</Badge>;
      case "half-day":
        return <Badge className="bg-rented-light text-rented">Half Day</Badge>;
      case "leave":
        return <Badge className="bg-gray-100 text-gray-500">Leave</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-500">Not Marked</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <Tabs defaultValue="workers">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="workers">Workers</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setMarkAttendanceDialogOpen(true)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Mark Attendance
            </Button>
          </div>
        </div>
        
        <TabsContent value="workers" className="mt-0">
          <ContentHeader
            title="Workers"
            actionButton={{
              label: "Add Worker",
              icon: <Plus className="h-4 w-4" />,
              onClick: () => {
                setEditingWorker(undefined);
                setAddWorkerDialogOpen(true);
              },
            }}
            searchPlaceholder="Search workers..."
            onSearchChange={setWorkersFilter}
          >
            <div className="flex justify-end">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleExportWorkers}
              >
                <FileDown className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </ContentHeader>
          
          {filteredWorkers.length === 0 ? (
            <EmptyState
              title="No workers found"
              description={
                workersFilter
                  ? "No workers match your search criteria. Try a different search term."
                  : "Start by adding some workers."
              }
              icon={<Users className="h-10 w-10 text-gray-400" />}
              action={
                <Button
                  onClick={() => {
                    setEditingWorker(undefined);
                    setAddWorkerDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Worker
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredWorkers.map((worker) => (
                <Card 
                  key={worker.id} 
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-blue-500" />
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold">{worker.name}</h3>
                          
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{worker.phoneNumber}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{worker.role}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">Joined on {formatDate(worker.joiningDate)}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleEditWorker(worker)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteWorker(worker)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="attendance" className="mt-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Attendance Records</h2>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleExportAttendance}
            >
              <FileDown className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-center">Present</TableHead>
                    <TableHead className="text-center">Absent</TableHead>
                    <TableHead className="text-center">Half Day</TableHead>
                    <TableHead className="text-center">Leave</TableHead>
                    <TableHead className="text-center">Total Days</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceByWorker.map((record) => (
                    <TableRow key={record.workerId}>
                      <TableCell className="font-medium">
                        {record.workerName}
                      </TableCell>
                      <TableCell>
                        {workers.find(w => w.id === record.workerId)?.role}
                      </TableCell>
                      <TableCell className="text-center text-active font-medium">
                        {record.present}
                      </TableCell>
                      <TableCell className="text-center text-overdue font-medium">
                        {record.absent}
                      </TableCell>
                      <TableCell className="text-center text-rented font-medium">
                        {record.halfDay}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {record.leave}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {record.total}
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {attendanceByWorker.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                        No attendance records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AddWorkerDialog
        isOpen={addWorkerDialogOpen}
        onClose={() => setAddWorkerDialogOpen(false)}
        editingWorker={editingWorker}
      />
      
      <MarkAttendanceDialog
        isOpen={markAttendanceDialogOpen}
        onClose={() => setMarkAttendanceDialogOpen(false)}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Worker</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium">{workerToDelete?.name}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Workers;
