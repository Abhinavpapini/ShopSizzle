import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User as UserIcon, Search, Heart, Menu, X } from "lucide-react";
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
import { useWishlist } from "@/hooks/useWishlist";
import type { RootState } from "@/store/store";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const totalQty = useSelector((s: RootState) => s.cart.totalQty);
  const { user, signOut, signIn, loading, isAdmin } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
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

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
    { to: "/profile", label: "Profile" },
    { to: "/about", label: "About" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50">
        <div className="backdrop-blur-md bg-white/90 dark:bg-black/80 border-b border-border/40 shadow-sm">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link 
                to="/" 
                aria-label="ShopSizzle home" 
                className="flex items-center gap-3 group"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary/90 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    S
                  </div>
                  <div className="absolute inset-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary/60 to-purple-500/60 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    ShopSizzle
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    Modern E‑Commerce
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                {navLinks.map((nav) => (
                  <Link
                    key={nav.to}
                    to={nav.to}
                    className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group px-1 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {nav.label}
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-primary to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                  </Link>
                ))}
              </div>

              {/* Search Bar - Desktop */}
              <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                <form onSubmit={handleSearch} className="relative w-full group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 h-10 bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </form>
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-2">
                {/* Wishlist - Desktop */}
                {user && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="relative p-2 hover:bg-muted/70 transition-colors hidden sm:flex" 
                    asChild
                  >
                    <Link to="/wishlist" aria-label="View wishlist">
                      <Heart className="h-4 w-4" />
                      {wishlistCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                          {wishlistCount > 99 ? '99+' : wishlistCount}
                        </span>
                      )}
                    </Link>
                  </Button>
                )}

                {/* Cart */}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="relative group hover:bg-primary hover:text-primary-foreground transition-all duration-200" 
                  aria-label="Open cart" 
                  onClick={() => setOpen(true)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Cart</span>
                  {totalQty > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground group-hover:bg-background group-hover:text-primary transition-colors">
                      {totalQty > 99 ? '99+' : totalQty}
                    </span>
                  )}
                </Button>

                {/* Profile dropdown or login button */}
                {!loading && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="relative h-10 w-10 rounded-full hover:bg-muted/70 transition-colors"
                      >
                        <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-primary/20 transition-all">
                          <AvatarImage src={user.avatar} className="object-cover" />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-primary-foreground text-sm font-semibold">
                            {userInitials}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
                      <div className="px-3 py-2">
                        <div className="text-sm font-semibold">{user.name || "User"}</div>
                        <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer">
                          <UserIcon className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="cursor-pointer">
                            <div className="mr-2 h-4 w-4 rounded bg-primary/20 flex items-center justify-center">
                              <span className="text-xs font-bold text-primary">A</span>
                            </div>
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link to="/wishlist" className="cursor-pointer">
                          <Heart className="mr-2 h-4 w-4" />
                          Wishlist
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 cursor-pointer">
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={signIn}
                    disabled={loading}
                    className="hover:scale-105 transition-transform"
                  >
                    {loading ? "Loading..." : "Sign In"}
                  </Button>
                )}

                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden p-2"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle mobile menu"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden border-b border-border/40 bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-10 bg-muted/50 border-0"
              />
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="fixed top-16 right-0 h-full w-80 bg-background border-l border-border shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              {/* Mobile Navigation Links */}
              <nav className="space-y-4">
                {navLinks.map((nav) => (
                  <Link
                    key={nav.to}
                    to={nav.to}
                    className="block text-base font-medium text-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {nav.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile User Actions */}
              {user && (
                <div className="border-t border-border pt-4 space-y-3">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 text-base font-medium text-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted/50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="h-4 w-4 rounded bg-primary/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">A</span>
                      </div>
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/wishlist"
                    className="flex items-center gap-3 text-base font-medium text-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart className="h-4 w-4" />
                    Wishlist
                    {wishlistCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full text-left text-base font-medium text-red-600 hover:text-red-700 transition-colors py-2 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <CartSheet open={open} onOpenChange={setOpen} />
    </>
  );
};

export default Navbar;