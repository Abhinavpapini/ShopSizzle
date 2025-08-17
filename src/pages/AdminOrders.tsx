import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useAdminStats } from "@/hooks/useAdminStats";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { formatINR } from "@/lib/utils";
import { 
  Package, 
  Search, 
  Filter, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ArrowLeft,
  Calendar,
  User,
  ShoppingBag
} from "lucide-react";

interface OrderItem {
  id: string;
  title: string;
  price: number;
  qty: number;
  image?: string;
}

interface Order {
  id: string;
  customerId: string;
  customerEmail: string;
  total: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: OrderItem[];
  paymentId?: string;
}

interface StoredOrderData {
  id?: string;
  customerEmail?: string;
  total?: number;
  status?: string;
  date?: string;
  items?: OrderItem[];
  paymentId?: string;
}

const AdminOrders = () => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { allOrders, refreshStats } = useAdminStats();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Convert admin orders to the Order format
  const orders: Order[] = allOrders.map(order => ({
    id: order.id,
    customerId: order.customerId,
    customerEmail: order.customerEmail,
    total: order.total,
    status: order.status as Order['status'],
    date: order.date,
    items: order.items,
    paymentId: order.paymentId,
  }));

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      navigate("/");
      return;
    }
  }, [loading, isAuthenticated, isAdmin, navigate]);

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.paymentId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const orderToUpdate = orders.find(order => order.id === orderId);
      if (!orderToUpdate) return;

      // Update the order in localStorage
      const storageKey = `orders_${orderToUpdate.customerId}`;
      const userOrders: StoredOrderData[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      const updatedUserOrders = userOrders.map((order: StoredOrderData) => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      });

      localStorage.setItem(storageKey, JSON.stringify(updatedUserOrders));

      // Refresh the stats and orders data
      refreshStats();

      toast({
        title: "Order Updated",
        description: `Order #${orderId} status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Package className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'processing':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Order Management</h1>
              <p className="text-muted-foreground">
                Manage and track all customer orders
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by Order ID, Customer Email, or Payment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
            <CardDescription>
              {searchTerm || statusFilter !== "all" 
                ? `Showing filtered results`
                : "All customer orders"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">#{order.id}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.customerEmail} • {order.items.length} items
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatINR(order.total)}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.paymentId ? `Payment: ${order.paymentId.substring(0, 12)}...` : 'No payment ID'}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Select
                          value={order.status}
                          onValueChange={(value: Order['status']) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Order Details - #{selectedOrder?.id}</DialogTitle>
                              <DialogDescription>
                                Complete order information and items
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedOrder && (
                              <div className="space-y-6">
                                {/* Order Info */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm font-medium">Customer</span>
                                    </div>
                                    <p className="text-sm">{selectedOrder.customerEmail}</p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm font-medium">Order Date</span>
                                    </div>
                                    <p className="text-sm">
                                      {new Date(selectedOrder.date).toLocaleString()}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <Badge className={getStatusColor(selectedOrder.status)} variant="secondary">
                                    {selectedOrder.status}
                                  </Badge>
                                  <span className="text-lg font-bold">
                                    {formatINR(selectedOrder.total)}
                                  </span>
                                </div>

                                <Separator />

                                {/* Order Items */}
                                <div>
                                  <div className="flex items-center gap-2 mb-4">
                                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Order Items</span>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    {selectedOrder.items.map((item, index) => (
                                      <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                                        {item.image && (
                                          <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-12 w-12 rounded object-cover"
                                          />
                                        )}
                                        <div className="flex-1">
                                          <h4 className="font-medium">{item.title}</h4>
                                          <p className="text-sm text-muted-foreground">
                                            Qty: {item.qty} × {formatINR(item.price)}
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-semibold">
                                            {formatINR(item.price * item.qty)}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {selectedOrder.paymentId && (
                                  <>
                                    <Separator />
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        <strong>Payment ID:</strong> {selectedOrder.paymentId}
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "No orders have been placed yet"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOrders;
