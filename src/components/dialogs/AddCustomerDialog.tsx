
import { FC } from "react";
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
import { CustomerType } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddCustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingCustomer?: CustomerType;
}

const AddCustomerDialog: FC<AddCustomerDialogProps> = ({ 
  isOpen, 
  onClose,
  editingCustomer
}) => {
  const { addCustomer, updateCustomer } = useAppContext();
  const isEditing = !!editingCustomer;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing
      ? {
          name: editingCustomer.name,
          phoneNumber: editingCustomer.phoneNumber,
          address: editingCustomer.address,
        }
      : {
          name: "",
          phoneNumber: "",
          address: "",
        },
  });
  
  const onSubmit = (values: FormValues) => {
    if (isEditing) {
      updateCustomer({
        ...editingCustomer,
        name: values.name,
        phoneNumber: values.phoneNumber,
        address: values.address,
      });
    } else {
      addCustomer({
        name: values.name,
        phoneNumber: values.phoneNumber,
        address: values.address,
      });
    }
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Customer" : "Add New Customer"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? "Update" : "Add Customer"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerDialog;
