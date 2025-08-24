import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  loginApi, 
  registerApi, 
  logoutApi, 
  checkAuthApi, 
  refreshTokenApi, 
  updateUserApi 
} from "./auth.api";
import { jwtDecode } from "jwt-decode";

// Login thunk
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginApi(credentials);
      const decodedToken = jwtDecode(data.token);
      const expirationDate = Date.now() + 90 * 24 * 60 * 60 * 1000;
      
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("tokenExpiration", expirationDate.toString());
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Register thunk (with auto-login after registration)
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      // Step 1: Register the user
      await registerApi(userData);
      
      // Step 2: Log in immediately after registration
      const loginData = await loginApi({
        email: userData.email,
        password: userData.password
      });
      
      const decodedToken = jwtDecode(loginData.token);
      const expirationDate = Date.now() + 90 * 24 * 60 * 60 * 1000;
      
      await AsyncStorage.setItem("token", loginData.token);
      await AsyncStorage.setItem("tokenExpiration", expirationDate.toString());
      await AsyncStorage.setItem("user", JSON.stringify(loginData.user));
      
      return loginData;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Logout thunk
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      await AsyncStorage.multiRemove(["token", "tokenExpiration", "user"]);
      return true;
    } catch (error) {
      // Even if the API call fails, clear local storage
      await AsyncStorage.multiRemove(["token", "tokenExpiration", "user"]);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Check authentication status
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const expiration = await AsyncStorage.getItem("tokenExpiration");
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      
      if (!token) {
        return rejectWithValue("No token found");
      }
      
      // Check token expiration
      if (expiration && new Date().getTime() > parseInt(expiration, 10)) {
        await AsyncStorage.multiRemove(["token", "tokenExpiration", "user"]);
        return rejectWithValue("Token expired");
      }
      
      // Verify token with server
      const response = await checkAuthApi(token, user?._id || user?.id);
      
      // Update user data if needed
      if (response.user) {
        await AsyncStorage.setItem("user", JSON.stringify(response.user));
      }
      
      return { ...response, token }; // Include token in the response
    } catch (error) {
      await AsyncStorage.multiRemove(["token", "tokenExpiration", "user"]);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Refresh token
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      
      if (!token) {
        return rejectWithValue("No token found");
      }
      
      const response = await refreshTokenApi(token);
      const decodedToken = jwtDecode(response.newToken);
      const expirationDate = Date.now() + 90 * 24 * 60 * 60 * 1000;
      
      await AsyncStorage.setItem("token", response.newToken);
      await AsyncStorage.setItem("tokenExpiration", expirationDate.toString());
      
      return response;
    } catch (error) {
      await AsyncStorage.multiRemove(["token", "tokenExpiration", "user"]);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update user profile
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ userId, updateData }, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(userId, updateData);

      // Get current user and merge with updated data
      const userString = await AsyncStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        const updatedUser = { ...user, ...updateData }; // Merge with updateData
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Return the merged user data
        return { user: updatedUser, response };
      }
      
      return {response:response};
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Validate token on app load
export const validateAuthToken = () => async (dispatch) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const expiration = await AsyncStorage.getItem("tokenExpiration");
    
    if (token && expiration && new Date().getTime() < parseInt(expiration, 10)) {
      await dispatch(checkAuth()).unwrap();
      return;
    }
  } catch (error) {
    console.log("Auth check failed, logging out...");
  }
  
  await AsyncStorage.multiRemove(["token", "tokenExpiration", "user"]);
  dispatch(clearAuth());
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    setTokenFromStorage: (state, action) => {
      state.token = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // Check Authentication
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.token = action.payload.token; // Use token from the response
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.newToken;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuth, setCredentials, setTokenFromStorage } = authSlice.actions;
export default authSlice.reducer;