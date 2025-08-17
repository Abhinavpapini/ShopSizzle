import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, User, ShoppingBag, BarChart3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RoleSelectorProps {
  userEmail: string;
  onRoleSelected: (role: 'user' | 'admin') => void;
}

const RoleSelector = ({ userEmail, onRoleSelected }: RoleSelectorProps) => {
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelection = async (role: 'user' | 'admin') => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Save role to localStorage (in production, this would be saved to database)
      localStorage.setItem(`user_role_${userEmail}`, role);
      
      toast({
        title: "Role Selected",
        description: `You are now registered as a ${role}.`,
      });
      
      onRoleSelected(role);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set user role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to ShopSizzle!</h1>
          <p className="text-muted-foreground">
            Please select your account type. This cannot be changed later.
          </p>
          <p className="text-sm text-muted-foreground">
            Account: {userEmail}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Role Card */}
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedRole === 'user' ? 'ring-2 ring-primary border-primary' : ''
            }`}
            onClick={() => setSelectedRole('user')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Customer</CardTitle>
              <CardDescription>
                Shop for products and manage your orders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <span>Browse and purchase products</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Manage personal profile</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <span>View order history</span>
              </div>
            </CardContent>
          </Card>

          {/* Admin Role Card */}
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedRole === 'admin' ? 'ring-2 ring-primary border-primary' : ''
            }`}
            onClick={() => setSelectedRole('admin')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle>Administrator</CardTitle>
              <CardDescription>
                Manage the store and oversee operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span>View analytics dashboard</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <span>Manage all orders</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>View customer data</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedRole && (
          <div className="flex justify-center">
            <Button 
              onClick={() => handleRoleSelection(selectedRole)}
              disabled={isSubmitting}
              size="lg"
              className="px-12"
            >
              {isSubmitting ? "Setting up..." : `Continue as ${selectedRole === 'user' ? 'Customer' : 'Administrator'}`}
            </Button>
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground">
          <p>⚠️ This selection is permanent and cannot be changed later.</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
