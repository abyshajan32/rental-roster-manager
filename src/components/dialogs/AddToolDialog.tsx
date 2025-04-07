
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { ToolType } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(2, "Category is required"),
  totalQuantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  ratePerDay: z.coerce.number().min(1, "Rate must be at least 1"),
  imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddToolDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingTool?: ToolType;
}

const AddToolDialog: FC<AddToolDialogProps> = ({ isOpen, onClose, editingTool }) => {
  const { addTool, updateTool } = useAppContext();
  const isEditing = !!editingTool;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing
      ? {
          name: editingTool.name,
          category: editingTool.category,
          totalQuantity: editingTool.totalQuantity,
          ratePerDay: editingTool.ratePerDay,
          imageUrl: editingTool.imageUrl || "",
        }
      : {
          name: "",
          category: "",
          totalQuantity: 1,
          ratePerDay: 10,
          imageUrl: "",
        },
  });

  const onSubmit = (values: FormValues) => {
    if (isEditing) {
      const availableQty = editingTool.availableQuantity + (values.totalQuantity - editingTool.totalQuantity);
      
      updateTool({
        ...editingTool,
        name: values.name,
        category: values.category,
        totalQuantity: values.totalQuantity,
        availableQuantity: availableQty >= 0 ? availableQty : 0,
        ratePerDay: values.ratePerDay,
        imageUrl: values.imageUrl,
      });
    } else {
      addTool({
        name: values.name,
        category: values.category,
        totalQuantity: values.totalQuantity,
        availableQuantity: values.totalQuantity,
        ratePerDay: values.ratePerDay,
        imageUrl: values.imageUrl,
      });
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Tool" : "Add New Tool"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tool Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tool name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="totalQuantity"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Total Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ratePerDay"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Rate Per Day (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter image URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? "Update" : "Add Tool"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddToolDialog;
