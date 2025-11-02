const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const salesAnalyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: true,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    totalProfit: {
      type: Number,
      default: 0,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    averageOrderValue: {
      type: Number,
      default: 0,
    },
    newCustomers: {
      type: Number,
      default: 0,
    },
    returningCustomers: {
      type: Number,
      default: 0,
    },
    cancelledOrders: {
      type: Number,
      default: 0,
    },
    refundedOrders: {
      type: Number,
      default: 0,
    },
    topProducts: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: { type: Number },
        revenue: { type: Number },
      },
    ],
    topCategories: [
      {
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Category',
        },
        quantity: { type: Number },
        revenue: { type: Number },
      },
    ],
    ordersByStatus: {
      pending: { type: Number, default: 0 },
      confirmed: { type: Number, default: 0 },
      processing: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      delivered: { type: Number, default: 0 },
      cancelled: { type: Number, default: 0 },
      refunded: { type: Number, default: 0 },
    },
    paymentMethods: {
      COD: { type: Number, default: 0 },
      card: { type: Number, default: 0 },
      banking: { type: Number, default: 0 },
      momo: { type: Number, default: 0 },
      zalopay: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Index để tìm kiếm nhanh hơn
salesAnalyticsSchema.index({ date: 1, period: 1 }, { unique: true });

salesAnalyticsSchema.plugin(toJSON);

const SalesAnalytics = mongoose.model('SalesAnalytics', salesAnalyticsSchema);

module.exports = SalesAnalytics;
