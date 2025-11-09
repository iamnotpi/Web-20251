import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  toast: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    showToast(state, action) {
      const { message, type = 'info', duration = 3000 } = action.payload;
      state.toast = { message, type, duration };
    },
    clearToast(state) {
      state.toast = null;
    },
  },
});

export const { setLoading, showToast, clearToast } = appSlice.actions;

export default appSlice.reducer;

