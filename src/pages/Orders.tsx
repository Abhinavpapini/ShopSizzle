import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatINR } from "@/lib/utils";
import { 
  ShoppingBag, 
  Package, 
  Calendar, 
  CreditCard, 
  Eye,
  ArrowLeft
} from "lucide-react";

interface Order {
  id: string;
  paymentId: string;
  total: number;
  items: Array<{
    id: string;
    title: string;
    price: number;
    qty: number;
  }>;
  date: string;
  status: string;
}

const Orders = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
      return;
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const orderHistory = JSON.parse(localStorage.getItem(`orders_${user.id}`) || '[]');
      // Sort by date (newest first)
      orderHistory.sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(orderHistory);
    } catch (error) {
      console.error('Failed to load order history:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || isLoading) {
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

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order History</h1>
            <p className="text-muted-foreground">
              View all your previous orders and their status
            </p>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">
                Start shopping to see your orders here
              </p>
              <Button onClick={() => navigate("/products")}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Order #{order.id}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          Payment: {order.paymentId}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div className="flex-1">
                          <span className="font-medium">{item.title}</span>
                          <span className="text-muted-foreground ml-2">x{item.qty}</span>
                        </div>
                        <span className="font-medium">{formatINR(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Order Summary */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </span>
                      <span className="text-lg font-bold">
                        Total: {formatINR(order.total)}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-3 w-3" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
