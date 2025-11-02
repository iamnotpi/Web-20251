const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
  },
  size: {
    type: String,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    totalDiscountPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Tính toán tổng giá trị giỏ hàng
cartSchema.methods.calculateTotals = function () {
  this.totalItems = this.items.reduce((acc, item) => acc + item.quantity, 0);
  this.totalPrice = this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  this.totalDiscountPrice = this.items.reduce(
    (acc, item) => acc + (item.discountPrice || item.price) * item.quantity,
    0
  );
};

// Tự động tính toán tổng giá trị trước khi lưu
cartSchema.pre('save', function (next) {
  this.calculateTotals();
  next();
});

cartSchema.plugin(toJSON);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
