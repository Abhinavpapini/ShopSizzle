import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useAuth } from "./lib/auth";
import RoleSelector from "./components/auth/RoleSelector";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Auth from "./pages/Auth";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading, isAuthenticated, hasRole } = useAuth();

  // Show role selector if user is authenticated but doesn't have a role
  if (isAuthenticated && !loading && user && !hasRole) {
    return (
      <RoleSelector 
        userEmail={user.email} 
        onRoleSelected={() => window.location.reload()} 
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/about" element={<About />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
