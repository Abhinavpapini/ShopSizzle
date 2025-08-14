import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store/store";
import { changeQty, removeFromCart, clearCart } from "@/store/slices/cartSlice";
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { formatINR } from "@/lib/utils";
interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartSheet = ({ open, onOpenChange }: CartSheetProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, totalQty } = useSelector((s: RootState) => s.cart);

  const [isLoading, setIsLoading] = useState(false);

  const loadRazorpayScript = useCallback(async (): Promise<boolean> => {
    if (document.getElementById("razorpay-js")) return true;
    return new Promise((resolve) => {
      const s = document.createElement("script");
      s.id = "razorpay-js";
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });
  }, []);

  const handleCheckout = useCallback(async () => {
    if (items.length === 0) return;
    try {
      setIsLoading(true);
      toast({ title: "Redirecting to payment...", description: "Opening Razorpay Checkout" });

      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Failed to load Razorpay");

      const amountPaise = Math.round(totalAmount * 100);
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: {
          amount: amountPaise,
          currency: "INR",
          notes: { items: items.map((i) => ({ id: i.id, t: i.title, q: i.qty })) },
        },
      });
      if (error) throw error;

      interface RazorpayOrderResponse {
        order: {
          id: string;
          amount: number;
          currency: string;
        };
        key_id: string;
      }
      const { order, key_id } = data as RazorpayOrderResponse;

      interface RazorpayOptions {
        key: string;
        amount: number;
        currency: string;
        name: string;
        description: string;
        order_id: string;
        handler: (response: { razorpay_payment_id: string; razorpay_signature: string }) => void;
        theme?: { color: string };
      }

      const options: RazorpayOptions = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: "ShopFlow",
        description: "Order payment",
        order_id: order.id,
        handler: async (response: { razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke("verify-razorpay-payment", {
              body: {
                order_id: order.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            });
            if (verifyError) throw verifyError;

            if (verifyData && 'valid' in verifyData && verifyData.valid) {
              toast({ title: "Payment successful", description: "Thank you for your purchase!" });
              dispatch(clearCart());
              onOpenChange(false);
              // Redirect to order confirmation page
              navigate(`/order-confirmation?order_id=${order.id}&payment_id=${response.razorpay_payment_id}`);
            } else {
              throw new Error("Verification failed");
            }
          } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "Please contact support";
            toast({ title: "Payment verification failed", description: errorMsg });
          }
        },
        theme: { color: "#0ea5e9" },
      };

      // Define Razorpay type for window object
      interface RazorpayErrorResponse {
        error?: { 
          code?: string; 
          description?: string; 
          metadata?: { payment_id?: string } 
        };
      }
      
      interface RazorpayInstance {
        open: () => void;
        on: (event: string, handler: (resp: RazorpayErrorResponse) => void) => void;
      }
      
      interface RazorpayConstructor {
        new (options: RazorpayOptions): RazorpayInstance;
      }
      
      interface WindowWithRazorpay extends Window {
        Razorpay?: RazorpayConstructor;
      }
      
      const windowWithRazorpay = window as WindowWithRazorpay;
      if (!windowWithRazorpay.Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }
      
      const rzp = new windowWithRazorpay.Razorpay(options);
      
      rzp.on("payment.failed", (resp: RazorpayErrorResponse) => {
        const code = resp?.error?.code;
        const desc = resp?.error?.description;
        const pid = resp?.error?.metadata?.payment_id;
        toast({ title: "Payment failed", description: `${desc || "Please try again"}${code ? ` (Code: ${code})` : ""}${pid ? ` | Payment: ${pid}` : ""}` });
      });
      rzp.on("modal.closed", () => {
        // Reopen cart after checkout modal closes so users can retry
        onOpenChange(true);
      });
      // Close cart sheet before opening Razorpay to avoid focus/overlay conflicts
      onOpenChange(false);
      setTimeout(() => rzp.open(), 50);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Please try again";
      toast({ title: "Checkout error", description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, [items, totalAmount, dispatch, onOpenChange, loadRazorpayScript, navigate]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild></SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>Review your cart and proceed to secure checkout.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {items.length === 0 && (
            <div className="text-sm text-muted-foreground">Your cart is empty.</div>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <img src={item.image} alt={item.title} loading="lazy" className="h-16 w-16 rounded-md object-cover" />
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-muted-foreground">{formatINR(item.price)}</div>
                <div className="mt-2 inline-flex items-center gap-2">
                  <Button variant="secondary" size="sm" aria-label="Decrease quantity" onClick={() => dispatch(changeQty({ id: item.id, qty: item.qty - 1 }))}>-</Button>
                  <span className="min-w-8 text-center text-sm">{item.qty}</span>
                  <Button variant="secondary" size="sm" aria-label="Increase quantity" onClick={() => dispatch(changeQty({ id: item.id, qty: item.qty + 1 }))}>+</Button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="font-semibold">{formatINR(item.price * item.qty)}</div>
                <Button variant="ghost" size="sm" aria-label="Remove from cart" onClick={() => dispatch(removeFromCart(item.id))}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
        <Separator className="my-6" />
        <div className="flex items-center justify-between text-sm">
          <span>Items</span>
          <span className="font-medium">{totalQty}</span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold mt-2">
          <span>Subtotal</span>
          <span>{formatINR(totalAmount)}</span>
        </div>
        <div className="mt-6 flex gap-3">
          <Button className="flex-1" disabled={items.length === 0 || isLoading} onClick={handleCheckout}>
            {isLoading ? "Processing..." : "Checkout"}
          </Button>
          <Button variant="secondary" onClick={() => dispatch(clearCart())} disabled={items.length === 0}>Clear</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
