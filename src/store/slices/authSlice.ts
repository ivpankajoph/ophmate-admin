import api from "@/lib/axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";


// 👇 Define the Auth State shape
interface AuthState {
  token: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// 👇 Initial state
const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// 👇 Async thunk for login API
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await  api.post("/admin/login", credentials);

      // Example expected API response:
      // { token: "jwt_token", user: { id, name, email, ... } }
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

// 👇 Create slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginAdmin.fulfilled,
        (state, action: PayloadAction<{ token: string; user: any }>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      )
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
