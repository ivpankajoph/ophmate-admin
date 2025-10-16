import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/lib/axios'

interface CategoryState {
  loading: boolean
  error: string | null
  categories: any[]
}

const initialState: CategoryState = {
  loading: false,
  error: null,
  categories: [],
}

export const createCategory = createAsyncThunk(
  'categories/create',
  async (
    data: { name: string; description: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post('/categories/create', data, {})
      return res.data
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create category'
      )
    }
  }
)

export const getAllCategories = createAsyncThunk(
  'categories/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/categories/get-category', {})
      return res.data.data 
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch categories'
      )
    }
  }
)
export const uploadCategories = createAsyncThunk(
  "categories/upload",
  async (file: File, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth?.token; 

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        "/categories/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "File upload failed"
      );
    }
  }
);
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false
        state.categories.push(action.payload)
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default categorySlice.reducer
