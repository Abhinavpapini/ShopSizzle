import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useWishlist } from "@/hooks/useWishlist";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { formatINR } from "@/lib/utils";
import { 
  User, 
  Mail, 
  Calendar, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut,
  Package,
  CreditCard,
  BarChart3
} from "lucide-react";

const Profile = () => {
  const { user, loading, signOut, isAuthenticated, isAdmin } = useAuth();
  const { wishlistCount, wishlistItems } = useWishlist();
  const cartTotal = useSelector((s: RootState) => s.cart.totalAmount);
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  // Calculate total spent (in a real app, this would come from order history API)
  // For now, we'll use a simple calculation based on completed orders stored in localStorage
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    // Load order history from localStorage (in real app, this would be from API)
    if (!user?.id) return;
    
    setStatsLoading(true);
    try {
      const orderHistory = JSON.parse(localStorage.getItem(`orders_${user.id}`) || '[]');
      const spent = orderHistory.reduce((sum: number, order: { total?: number }) => sum + (order.total || 0), 0);
      setTotalSpent(spent);
      setTotalOrders(orderHistory.length);
    } catch {
      setTotalSpent(0);
      setTotalOrders(0);
    } finally {
      setStatsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, loading, navigate]);

  // Refresh stats when the page becomes visible (user navigates back to it)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.id) {
        // Reload order history when page becomes visible
        try {
          const orderHistory = JSON.parse(localStorage.getItem(`orders_${user.id}`) || '[]');
          const spent = orderHistory.reduce((sum: number, order: { total?: number }) => sum + (order.total || 0), 0);
          setTotalSpent(spent);
          setTotalOrders(orderHistory.length);
        } catch {
          setTotalSpent(0);
          setTotalOrders(0);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user?.id]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
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

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const userInitials = user.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : user.email?.[0].toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl">
                    {user.name || "User"}
                    {isAdmin && (
                      <Badge variant="secondary" className="ml-3 bg-red-100 text-red-800">
                        Administrator
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {user.email}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">
                      <Calendar className="mr-1 h-3 w-3" />
                      ShopSizzle Member
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="self-start"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isSigningOut ? "Signing out..." : "Sign Out"}
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{statsLoading ? "..." : totalOrders}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{wishlistCount}</p>
                  <p className="text-sm text-muted-foreground">Wishlist Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CreditCard className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{statsLoading ? "..." : formatINR(totalSpent)}</p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Full Name</p>
                  <p className="text-sm text-muted-foreground">
                    {user.name || "Not provided"}
                  </p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your shopping experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/orders">
                  <Package className="mr-2 h-4 w-4" />
                  {isAdmin ? 'All Orders' : 'View Order History'}
                </Link>
              </Button>
              
              {isAdmin && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/admin">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </Button>
              )}
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/wishlist">
                  <Heart className="mr-2 h-4 w-4" />
                  My Wishlist
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/products">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
              
              <Separator />
              
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
