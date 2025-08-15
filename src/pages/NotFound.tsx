import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
            <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
            <p className="text-muted-foreground mb-6">
              Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or doesn't exist.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link to="/products">
                <Search className="mr-2 h-4 w-4" />
                Browse Products
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-muted-foreground">
            If you think this is an error, please contact our support team.
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
