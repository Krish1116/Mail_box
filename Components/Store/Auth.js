import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = { isAuthenticated: false, token: null };

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducer: {
    login(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

export const authAction = authSlice.actions;
export default authSlice.reducer;
