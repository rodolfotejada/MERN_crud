import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

//REDUX INIT STATE SETUP: Get user from localStorage & set init state.
const user = JSON.parse(localStorage.getItem('user'));
const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// A) Register user (with an 'AsyncThunk' function used with extraReducers):

export const register = createAsyncThunk(
  //step 1: 'auth/register' is the redux action path.
  'auth/register',
  //step 2: the 'user' below is coming from the '/register page' and 'thunkAPI is for catch(error).
  async (user, thunkAPI) => {
    try {
      //step 3: we call the service 'register' to actually add user to DB.
      return await authService.register(user);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// C) Login user (Async thunk function)
//step 1: 'auth/login' is the redux action path.
//step 2: the 'user' param is coming from the 'login page'.
//step 3: we call the service 'login' to verify the user in the DB and create 'user' item in localStorage.

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user); //sending user to the service.
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// D) Logout user (Async thunk function)
//step 1: 'auth/logout' is the redux action path.
//step 2: we call the service 'logout' to actually clear local storage.
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

//REDUX SLICE SETUP:
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      //register: the function above //pending: the promise(http) status //state: the init state.
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload; //this is the return of register() above.
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; //this is the return from the .catch register().
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
