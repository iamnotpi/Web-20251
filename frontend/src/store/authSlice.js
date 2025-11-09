import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  roles: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const { user, roles = [] } = action.payload;
      state.user = user;
      state.roles = Array.isArray(roles) ? roles : [];
    },
    logout(state) {
      state.user = null;
      state.roles = [];
    },
  },
});

export const { login, logout } = authSlice.actions;

export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export const selectRoles = (state) => state.auth.roles;
export const selectHasRole = (role) => (state) => state.auth.roles.includes(role);

export default authSlice.reducer;

