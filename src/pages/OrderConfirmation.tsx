import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { CartItem } from "@/store/slices/cartSlice";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Home, 
  ShoppingBag, 
  Calendar,
  CreditCard,
  Mail
} from "lucide-react";

interface OrderDetails {
  id: string;
  paymentId: string;
  status: string;
  items: CartItem[];
  total: number;
  estimatedDelivery: Date;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const cartItems = useSelector((s: RootState) => s.cart.items);
  const cartTotal = useSelector((s: RootState) => s.cart.totalAmount);

  useEffect(() => {
    // In a real app, you'd fetch order details from the server using order ID
    const orderId = searchParams.get("order_id") || generateOrderId();
    const paymentId = searchParams.get("payment_id");

    if (!paymentId && cartItems.length === 0) {
      // If no payment ID and no items in cart, redirect to home
      navigate("/");
      return;
    }

    // Mock order details - in real app this would come from your backend
    setOrderDetails({
      id: orderId,
      paymentId: paymentId || "mock_payment_id",
      status: "confirmed",
      items: cartItems,
      total: cartTotal,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      shippingAddress: {
        name: "John Doe",
        address: "123 Main St, Apartment 4B",
        city: "Mumbai",
        postalCode: "400001",
        country: "India"
      }
    });
  }, [searchParams, cartItems, cartTotal, navigate]);

  const generateOrderId = () => {
    return `ORD-${Date.now().toString().slice(-8).toUpperCase()}`;
  };

  if (!orderDetails) {
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

  const deliverySteps = [
    { icon: CheckCircle, label: "Order Confirmed", completed: true },
    { icon: Package, label: "Processing", completed: false },
    { icon: Truck, label: "Shipped", completed: false },
    { icon: Home, label: "Delivered", completed: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Details
                </CardTitle>
                <CardDescription>
                  Order #{orderDetails.id} • Placed on {new Date().toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.qty} • Price: {formatINR(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatINR(item.price * item.qty)}</p>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount</span>
                  <span>{formatINR(orderDetails.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliverySteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        step.completed ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
                      }`}>
                        <step.icon className="h-4 w-4" />
                      </div>
                      <span className={step.completed ? 'font-medium' : 'text-muted-foreground'}>
                        {step.label}
                      </span>
                      {step.completed && (
                        <Badge variant="secondary" className="ml-auto">
                          Completed
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>Estimated Delivery: {orderDetails.estimatedDelivery.toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>Order ID: {orderDetails.id}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>Payment ID: {orderDetails.paymentId}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>Confirmation sent to email</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{orderDetails.shippingAddress.name}</p>
                  <p>{orderDetails.shippingAddress.address}</p>
                  <p>{orderDetails.shippingAddress.city} {orderDetails.shippingAddress.postalCode}</p>
                  <p>{orderDetails.shippingAddress.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full" onClick={() => navigate("/products")}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
              
              <Button variant="outline" className="w-full" onClick={() => navigate("/orders")}>
                View All Orders
              </Button>
              
              <Button variant="ghost" className="w-full" onClick={() => navigate("/")}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
