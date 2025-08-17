import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useAdminStats } from "@/hooks/useAdminStats";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { 
  BarChart3, 
  Package, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  Truck
} from "lucide-react";

const AdminDashboard = () => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const { user: clerkUser } = useUser();
  const navigate = useNavigate();
  const { stats, allOrders, isLoading: statsLoading } = useAdminStats();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      navigate("/");
      return;
    }
  }, [loading, isAuthenticated, isAdmin, navigate]);

  // Get recent orders (top 5)
  const recentOrders = allOrders.slice(0, 5).map(order => ({
    id: order.id,
    customerEmail: order.customerEmail,
    total: order.total,
    status: order.status,
    date: order.date,
    itemCount: order.items.length,
  }));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading || statsLoading) {
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
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user.name}! Here's your store overview.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatINR(stats.totalRevenue)}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                  <p className="text-sm text-muted-foreground">Customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders and Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </div>
              <button 
                onClick={() => navigate("/admin/orders")}
                className="text-sm text-primary hover:underline"
              >
                View All Orders
              </button>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.customerEmail} • {order.itemCount} items
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatINR(order.total)}</p>
                        <Badge variant="secondary" className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No orders found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Order Statistics</CardTitle>
              <CardDescription>Order status breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Delivered</span>
                </div>
                <span className="font-semibold">{stats.deliveredOrders}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Shipped</span>
                </div>
                <span className="font-semibold">{stats.shippedOrders}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Processing</span>
                </div>
                <span className="font-semibold">{stats.processingOrders}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Confirmed</span>
                </div>
                <span className="font-semibold">{stats.confirmedOrders}</span>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Success Rate</span>
                  </div>
                  <span className="font-bold text-lg">
                    {stats.totalOrders > 0 ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0}%
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Order</span>
                  <span className="font-semibold">
                    {formatINR(stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debug Section - Remove this after troubleshooting */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>🔧 Quick Debug</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p><strong>Current User:</strong> {clerkUser?.emailAddresses?.[0]?.emailAddress}</p>
                  <p><strong>User ID:</strong> {clerkUser?.id}</p>
                  <p><strong>Expected Order Key:</strong> orders_{clerkUser?.id}</p>
                  <p><strong>Order Keys Found:</strong> {Object.keys(localStorage).filter(k => k.startsWith('orders_')).length}</p>
                  <p><strong>Role:</strong> {localStorage.getItem(`user_role_${clerkUser?.emailAddresses?.[0]?.emailAddress}`)}</p>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Manual Debug:</h4>
                  <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                    onClick={() => {
                      console.log("=== MANUAL DEBUG ===");
                      const orderKeys = Object.keys(localStorage).filter(k => k.startsWith('orders_'));
                      console.log("Order keys:", orderKeys);
                      orderKeys.forEach(key => {
                        const orders = JSON.parse(localStorage.getItem(key) || '[]');
                        console.log(`${key}:`, orders);
                      });
                      
                      // Force refresh admin stats
                      window.location.reload();
                    }}
                  >
                    Check Console & Refresh
                  </button>
                  
                  <button 
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={() => {
                      // Manually add test order to current user to verify flow
                      const testOrder = {
                        id: `TEST_${Date.now()}`,
                        total: 999,
                        status: 'confirmed',
                        date: new Date().toISOString(),
                        customerEmail: clerkUser?.emailAddresses?.[0]?.emailAddress,
                        items: [{ id: 'test', title: 'Test Product', price: 999, qty: 1 }],
                        paymentId: 'TEST_PAYMENT'
                      };
                      
                      const orderKey = `orders_${clerkUser?.id}`;
                      const existingOrders = JSON.parse(localStorage.getItem(orderKey) || '[]');
                      existingOrders.push(testOrder);
                      localStorage.setItem(orderKey, JSON.stringify(existingOrders));
                      
                      alert('Test order added! Refreshing...');
                      window.location.reload();
                    }}
                  >
                    Add Test Order
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
