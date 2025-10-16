import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { toast } from "sonner";

interface ProductState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: ProductState = {
  loading: false,
  success: false,
  error: null,
};

// ✅ Async thunk for creating product (multipart/form-data)
export const createProduct = createAsyncThunk(
  "product/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await api.post("/products/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("🎉 Product created successfully!");
      return res.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create product";
      toast.error(`❌ ${message}`);
      return rejectWithValue(message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;
