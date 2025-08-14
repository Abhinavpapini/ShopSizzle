import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateOrderBody {
  amount: number; // in paise
  currency?: string; // default INR
  notes?: Record<string, unknown>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency = "INR", notes } = (await req.json()) as CreateOrderBody;

    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: "Invalid amount" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const key_id = Deno.env.get("RAZORPAY_KEY_ID") || "";
    const key_secret = Deno.env.get("RAZORPAY_KEY_SECRET") || "";

    if (!key_id || !key_secret) {
      return new Response(JSON.stringify({ error: "Razorpay keys not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const authHeader = "Basic " + btoa(`${key_id}:${key_secret}`);

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency,
        payment_capture: 1,
        notes,
      }),
    });

    const order = await res.json();
    if (!res.ok) {
      console.error("create-razorpay-order: Razorpay error", { status: res.status, body: order });
      throw new Error(order?.error?.description || "Failed to create order");
    }

    console.log("create-razorpay-order: order created", { amount, currency, order_id: order?.id });
    return new Response(JSON.stringify({ order, key_id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
