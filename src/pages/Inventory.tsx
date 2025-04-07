
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import ContentHeader from "@/components/ContentHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FileDown, Package2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import EmptyState from "@/components/EmptyState";
import AddToolDialog from "@/components/dialogs/AddToolDialog";
import { exportToolsToCSV } from "@/utils/csv-export";
import { ToolType } from "@/types";

const Inventory = () => {
  const { tools, toolsFilter, setToolsFilter } = useAppContext();
  const [addToolDialogOpen, setAddToolDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<ToolType | undefined>(undefined);
  
  // Filter tools based on search term
  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(toolsFilter.toLowerCase()) ||
      tool.category.toLowerCase().includes(toolsFilter.toLowerCase())
  );
  
  const handleEditTool = (tool: ToolType) => {
    setEditingTool(tool);
    setAddToolDialogOpen(true);
  };
  
  const handleExportTools = () => {
    exportToolsToCSV(tools);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <ContentHeader
        title="Inventory"
        actionButton={{
          label: "Add Tool",
          icon: <Plus className="h-4 w-4" />,
          onClick: () => {
            setEditingTool(undefined);
            setAddToolDialogOpen(true);
          },
        }}
        searchPlaceholder="Search tools..."
        onSearchChange={setToolsFilter}
      >
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleExportTools}
          >
            <FileDown className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </ContentHeader>
      
      {filteredTools.length === 0 ? (
        <EmptyState
          title="No tools found"
          description={
            toolsFilter
              ? "No tools match your search criteria. Try a different search term."
              : "Start by adding some tools to your inventory."
          }
          icon={<Package2 className="h-10 w-10 text-gray-400" />}
          action={
            <Button
              onClick={() => {
                setEditingTool(undefined);
                setAddToolDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tool
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <Card 
              key={tool.id} 
              className="overflow-hidden hover:shadow-md transition-shadow"
              onClick={() => handleEditTool(tool)}
            >
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                {tool.imageUrl ? (
                  <img
                    src={tool.imageUrl}
                    alt={tool.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package2 className="h-16 w-16 text-gray-300" />
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{tool.name}</h3>
                  <Badge variant="outline" className="bg-gray-100">
                    {tool.category}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-medium">{tool.totalQuantity}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <div>
                      <p className="text-sm text-gray-500">Available</p>
                      <p className="font-medium text-available text-center">
                        {tool.availableQuantity}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Rented</p>
                      <p className="font-medium text-rented text-center">
                        {tool.totalQuantity - tool.availableQuantity}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t">
                  <p className="text-lg font-bold text-revenue">₹{tool.ratePerDay}<span className="text-sm font-normal text-gray-500">/day</span></p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <AddToolDialog
        isOpen={addToolDialogOpen}
        onClose={() => setAddToolDialogOpen(false)}
        editingTool={editingTool}
      />
    </div>
  );
};

export default Inventory;
