import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User as UserIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CartSheet from "@/components/cart/CartSheet";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "@/lib/auth";
import type { RootState } from "@/store/store";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const totalQty = useSelector((s: RootState) => s.cart.totalQty);
  const { user, signOut, signIn, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const userInitials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : user?.email?.[0].toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50">
      <div className="backdrop-blur-xl bg-white/70 dark:bg-black/60 shadow-lg border-b border-primary/10">
        <nav className="container flex items-center justify-between py-4">
          {/* Logo and subtitle */}
          <Link to="/" aria-label="ShopSizzle home" className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg animate-pulse">S</span>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-primary bg-clip-text text-transparent">ShopSizzle</span>
            <span className="text-base text-muted-foreground hidden sm:inline">Modern E‑Commerce</span>
          </Link>

          {/* Navigation links with crazy animated underline */}
          <div className="hidden lg:flex items-center gap-8">
            {[
              { to: "/", label: "Home" },
              { to: "/products", label: "Products" },
              { to: "/profile", label: "Profile" },
              { to: "/about", label: "About" },
            ].map((nav) => (
              <Link
                key={nav.to}
                to={nav.to}
                className="relative text-base font-semibold text-muted-foreground hover:text-primary transition-colors px-2"
              >
                {nav.label}
                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-primary to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 bg-muted/50 border-none focus:bg-background"
              />
            </form>
          </div>

          {/* Right side: Cart and Profile */}
          <div className="flex items-center gap-4">
            <Button variant="default" className="relative shadow-lg hover:scale-105 transition-transform" aria-label="Open cart" onClick={() => setOpen(true)}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Cart
              {totalQty > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-2 text-xs font-bold text-primary animate-bounce">
                  {totalQty}
                </span>
              )}
            </Button>

            {/* Profile dropdown or login button */}
            {!loading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user.name || "User"}
                  </div>
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" className="ml-2" onClick={signIn}>
                {loading ? "Loading..." : "Sign In"}
              </Button>
            )}
          </div>
        </nav>
      </div>
      <CartSheet open={open} onOpenChange={setOpen} />
    </header>
  );
};

export default Navbar;
