import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ManageOrders = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const queryClient = useQueryClient();

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*");
      if (error) throw error;
      return data;
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (newOrder) => {
      const { data, error } = await supabase.from("orders").insert([newOrder]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      setIsCreateDialogOpen(false);
      toast.success("Order created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create order: ${error.message}`);
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: async (updatedOrder) => {
      const { data, error } = await supabase
        .from("orders")
        .update(updatedOrder)
        .eq("id", updatedOrder.id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      setIsEditDialogOpen(false);
      toast.success("Order updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update order: ${error.message}`);
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (id) => {
      const { data, error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      toast.success("Order deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete order: ${error.message}`);
    },
  });

  const handleCreateOrder = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newOrder = Object.fromEntries(formData.entries());
    createOrderMutation.mutate(newOrder);
  };

  const handleUpdateOrder = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedOrder = Object.fromEntries(formData.entries());
    updatedOrder.id = currentOrder.id;
    updateOrderMutation.mutate(updatedOrder);
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      deleteOrderMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">Create New Order</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Input id="status" name="status" required />
            </div>
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" name="destination" required />
            </div>
            <Button type="submit">Create Order</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.name}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.destination}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => {
                    setCurrentOrder(order);
                    setIsEditDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteOrder(order.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          {currentOrder && (
            <form onSubmit={handleUpdateOrder} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" name="name" defaultValue={currentOrder.name} required />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Input id="edit-status" name="status" defaultValue={currentOrder.status} required />
              </div>
              <div>
                <Label htmlFor="edit-destination">Destination</Label>
                <Input
                  id="edit-destination"
                  name="destination"
                  defaultValue={currentOrder.destination}
                  required
                />
              </div>
              <Button type="submit">Update Order</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageOrders;