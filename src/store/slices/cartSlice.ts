import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types/product";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  qty: number;
};

interface CartState {
  items: CartItem[];
  totalQty: number;
  totalAmount: number; // in same unit as price
}

const saved = (() => {
  try { return JSON.parse(localStorage.getItem("cart") || "null"); } catch { return null; }
})();

const initialState: CartState = saved ?? {
  items: [],
  totalQty: 0,
  totalAmount: 0,
};

function recalc(state: CartState) {
  state.totalQty = state.items.reduce((s, i) => s + i.qty, 0);
  state.totalAmount = state.items.reduce((s, i) => s + i.qty * i.price, 0);
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const p = action.payload;
      const existing = state.items.find((i) => i.id === p.id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ id: p.id, title: p.title, price: p.price, image: p.image, qty: 1 });
      }
      recalc(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      recalc(state);
    },
    changeQty: (state, action: PayloadAction<{ id: string; qty: number }>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.qty = Math.max(1, action.payload.qty);
      }
      recalc(state);
    },
    clearCart: (state) => {
      state.items = [];
      recalc(state);
    },
  },
});

export const { addToCart, removeFromCart, changeQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
