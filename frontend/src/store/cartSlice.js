import { createSlice } from '@reduxjs/toolkit';

const calculateTotals = (items) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return { subtotal, itemCount };
};

const initialState = {
  items: [],
  coupon: null,
  subtotal: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }

      const totals = calculateTotals(state.items);
      state.subtotal = totals.subtotal;
      state.itemCount = totals.itemCount;
    },
    updateItemQuantity(state, action) {
      const { productId, quantity } = action.payload;
      state.items = state.items
        .map((item) => (item.id === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0);

      const totals = calculateTotals(state.items);
      state.subtotal = totals.subtotal;
      state.itemCount = totals.itemCount;
    },
    removeItem(state, action) {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);

      const totals = calculateTotals(state.items);
      state.subtotal = totals.subtotal;
      state.itemCount = totals.itemCount;
    },
    clearCart(state) {
      state.items = [];
      state.subtotal = 0;
      state.itemCount = 0;
    },
    applyCoupon(state, action) {
      state.coupon = action.payload;
    },
    removeCoupon(state) {
      state.coupon = null;
    },
  },
});

export const {
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
  applyCoupon,
  removeCoupon,
} = cartSlice.actions;

export default cartSlice.reducer;

