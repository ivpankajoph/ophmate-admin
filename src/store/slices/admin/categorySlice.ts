/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { VITE_PUBLIC_API_URL } from '@/config'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

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

const BASE_URL = VITE_PUBLIC_API_URL

export const createCategory = createAsyncThunk(
  'categories/create',
  async (payload: any, { rejectWithValue, getState }) => {
    try {
      const state: any = getState()
      const token = state?.auth?.token

      console.log('Token in createCategory thunk:', token)

      const res = await axios.post(
        `${BASE_URL}/categories/create`,
        payload, // <-- JSON Data
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // <-- IMPORTANT
          },
        }
      )

      return res.data
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create category'
      )
    }
  }
)

export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async (categoryData: any, { rejectWithValue, getState }) => {
    try {
      const state: any = getState()
      const token = state?.auth?.token
      const response = await axios.put(
        `${BASE_URL}/categories/update/${categoryData.id}`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update category'
      )
    }
  }
)

export const getAllCategories = createAsyncThunk(
  'categories/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/categories/get-category`, {})
      return res.data.data
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch categories'
      )
    }
  }
)
export const uploadCategories = createAsyncThunk(
  'categories/upload',
  async (file: File, { getState, rejectWithValue }) => {
    try {
      const state: any = getState()
      const token = state.auth?.token

      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(
        `${BASE_URL}/categories/import`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'File upload failed'
      )
    }
  }
)
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
      .addCase(updateCategory.pending, (state) => {
        state.loading = true
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false
        // Update the category in the list
        const index = state.categories.findIndex(
          (cat) => cat.id === action.payload.id
        )
        if (index !== -1) {
          state.categories[index] = action.payload
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default categorySlice.reducer
