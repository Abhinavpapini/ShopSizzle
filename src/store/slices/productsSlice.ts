import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Product } from "@/types/product";
import { products as mock } from "@/data/products";

interface ProductsState {
  items: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
}

const initialState: ProductsState = {
  items: [],
  status: "idle",
};

export const fetchProducts = createAsyncThunk<Product[]>("products/fetch", async () => {
  await new Promise((r) => setTimeout(r, 600));
  return mock;
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;
