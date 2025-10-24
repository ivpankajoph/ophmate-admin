/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import axios from "axios";



const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL;

// Create Subcategory
export const createSubcategory = createAsyncThunk(
  "subcategories/create",
  async (formData: FormData, { rejectWithValue,getState }) => {
    try {
      const state:any = getState()
      const token = state?.auth?.token
      const res = await axios.post(`${BASE_URL}/subcategories/create`, formData, {
        headers: {
          Authorization : `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create subcategory"
      );
    }
  }
);

// Fetch Subcategories
export const fetchSubcategories = createAsyncThunk<
  Subcategory[],
  void,
  { rejectValue: string }
>("subcategories/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${BASE_URL}/subcategories`);
    return res.data.data; // backend wraps data in { success, data }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch subcategories");
  }
});


export const importSubcategories = createAsyncThunk<
  any, 
  FormData,
  { rejectValue: string }
>(
  "subcategories/import",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await api.post("/subcategories/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to import CSV");
    }
  }
);

// Types
export interface CategoryNested {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  display_order: number | null;
  is_active: boolean;
  created_by: string | null;
  updated_by: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  category_id: string;
  createdAt: string;
  updatedAt: string;
  category: CategoryNested;
}

// Initial state
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

// Slice
const subcategorySlice = createSlice({
  name: "subcategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubcategory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.subcategories.push(action.payload.data as Subcategory);
        }
      })
      .addCase(createSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch
      .addCase(fetchSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action: PayloadAction<Subcategory[]>) => {
        state.loading = false;
        state.subcategories = action.payload; // FIXED: was `state.data`
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch subcategories";
      });
  },
});

export default subcategorySlice.reducer;
