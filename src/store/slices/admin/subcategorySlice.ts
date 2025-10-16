import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import Swal from "sweetalert2";

export const createSubcategory = createAsyncThunk(
  "subcategory/createSubcategory",
  async (
    data: {
      name: string;
      category_id: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/subcategories", data);

      Swal.fire({
        title: "Success!",
        text: "Subcategory created successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to create subcategory.";

      Swal.fire({
        title: "Error!",
        text: message,
        icon: "error",
      });

      return rejectWithValue(message);
    }
  }
);

export interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}

// 🧱 Initial state
interface SubcategoryState {
  subcategories: Subcategory[];
  loading: boolean;
  error: string | null;
}

const initialState: SubcategoryState = {
  subcategories: [],
  loading: false,
  error: null,
};

const subcategorySlice = createSlice({
  name: "subcategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubcategory.fulfilled, (state, action) => {
        state.loading = false;

        // Ensure payload structure matches backend (usually { success, data })
        if (action.payload?.data) {
          state.subcategories.push(action.payload.data as Subcategory);
        }
      })
      .addCase(createSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default subcategorySlice.reducer;
