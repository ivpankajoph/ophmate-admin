import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";

interface Vendor {
  id: string;
  business_name: string;
  gst_number?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  role?: string;
  is_active?: boolean;
  is_verified?: boolean;
  is_profile_completed?: boolean;
  profile_complete_level?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface VendorState {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
}

const initialState: VendorState = {
  vendors: [],
  loading: false,
  error: null,
};

// ✅ Async thunk to fetch all vendors (Admin)
export const fetchAllVendors = createAsyncThunk(
  "vendors/fetchAllVendors",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/admin/vendors");
      return res.data.vendors || res.data.data || []; // depending on backend response
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch vendors"
      );
    }
  }
);

const vendorSlice = createSlice({
  name: "vendors",
  initialState,
  reducers: {
    resetVendorState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVendors.fulfilled, (state, action: PayloadAction<Vendor[]>) => {
        state.loading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchAllVendors.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetVendorState } = vendorSlice.actions;
export default vendorSlice.reducer;
