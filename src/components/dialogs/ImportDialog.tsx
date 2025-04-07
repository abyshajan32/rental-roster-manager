
import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/context/AppContext";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: "tools" | "rentals" | "customers" | "workers";
}

const ImportDialog: FC<ImportDialogProps> = ({ isOpen, onClose, type }) => {
  const { importFromExcel } = useAppContext();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      // Check if file is Excel
      if (
        selectedFile.type === "application/vnd.ms-excel" ||
        selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setFile(selectedFile);
        setError(null);
      } else {
        setFile(null);
        setError("Please select a valid Excel file (.xls or .xlsx)");
      }
    }
  };
  
  const handleImport = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await importFromExcel(file);
      onClose();
    } catch (err) {
      setError("Error importing data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const typeTitle = {
    tools: "Tool Inventory",
    rentals: "Rental Records",
    customers: "Customer Data",
    workers: "Worker Information",
  }[type];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import {typeTitle} from Excel</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-2">
              Upload your Excel file with {type} data
            </p>
            <Label
              htmlFor="file-upload"
              className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 cursor-pointer"
            >
              <FileText className="mr-2 h-4 w-4" />
              Select File
            </Label>
            <Input
              id="file-upload"
              type="file"
              accept=".xls,.xlsx"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          
          {file && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium">Selected file:</p>
              <p className="text-sm">{file.name}</p>
            </div>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="text-sm text-gray-500">
            <p>File should contain the following columns:</p>
            {type === "tools" && (
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Name</li>
                <li>Category</li>
                <li>Total Quantity</li>
                <li>Rate Per Day</li>
              </ul>
            )}
            {type === "rentals" && (
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Tool Name</li>
                <li>Customer Name</li>
                <li>Start Date</li>
                <li>Expected Return Date</li>
                <li>Quantity</li>
                <li>Rate Per Day</li>
              </ul>
            )}
            {type === "customers" && (
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Name</li>
                <li>Phone Number</li>
                <li>Address</li>
              </ul>
            )}
            {type === "workers" && (
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Name</li>
                <li>Phone Number</li>
                <li>Role</li>
                <li>Joining Date</li>
              </ul>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleImport} 
            disabled={!file || isLoading}
          >
            {isLoading ? "Importing..." : "Import Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDialog;
