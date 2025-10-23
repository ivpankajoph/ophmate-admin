/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface Banner {
  id: string
  title: string
  description: string
  imageUrl: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface BannerState {
  banners: Banner[]
  loading: boolean
  error: string | null
  success: boolean
}

const initialState: BannerState = {
  banners: [],
  loading: false,
  error: null,
  success: false,
}

const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL;


export const createBanner = createAsyncThunk<
  Banner, // return type
  { title: string; description: string; image: File }, // input type
  { rejectValue: string }
>('banners/createBanner', async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('image', data.image)

    const res = await axios.post(`${BASE_URL}/banners`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return res.data // Assuming backend returns created banner JSON
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Failed to create banner'
    )
  }
})

export const fetchBanners = createAsyncThunk<
  Banner[],
  void,
  { rejectValue: string }
>('banners/fetchBanners', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${BASE_URL}/banners`)

    if (!Array.isArray(res.data)) {
      console.error('Unexpected response format:', res.data)
      throw new Error('Invalid response structure')
    }

    return res.data
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Failed to fetch banners'
    )
  }
})

const bannerSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {
    resetBannerState: (state) => {
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      // createBanner
      .addCase(createBanner.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.banners.push(action.payload)
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Something went wrong'
      })
      // fetchBanners
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false
        state.banners = action.payload
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Error fetching banners'
      })
  },
})

export const { resetBannerState } = bannerSlice.actions
export default bannerSlice.reducer
