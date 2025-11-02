const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const visitorAnalyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    period: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly'],
      required: true,
    },
    totalVisitors: {
      type: Number,
      default: 0,
    },
    uniqueVisitors: {
      type: Number,
      default: 0,
    },
    pageViews: {
      type: Number,
      default: 0,
    },
    averageSessionDuration: {
      type: Number,
      default: 0, // in seconds
    },
    bounceRate: {
      type: Number,
      default: 0, // percentage
    },
    topPages: [
      {
        page: { type: String },
        views: { type: Number },
        uniqueViews: { type: Number },
      },
    ],
    topProducts: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        views: { type: Number },
        uniqueViews: { type: Number },
      },
    ],
    trafficSources: {
      direct: { type: Number, default: 0 },
      organic: { type: Number, default: 0 },
      social: { type: Number, default: 0 },
      referral: { type: Number, default: 0 },
      paid: { type: Number, default: 0 },
    },
    deviceTypes: {
      desktop: { type: Number, default: 0 },
      mobile: { type: Number, default: 0 },
      tablet: { type: Number, default: 0 },
    },
    browsers: [
      {
        name: { type: String },
        count: { type: Number },
      },
    ],
    locations: [
      {
        country: { type: String },
        city: { type: String },
        count: { type: Number },
      },
    ],
    conversionRate: {
      type: Number,
      default: 0, // percentage
    },
    addToCartRate: {
      type: Number,
      default: 0, // percentage
    },
  },
  {
    timestamps: true,
  }
);

// Index để tìm kiếm nhanh hơn
visitorAnalyticsSchema.index({ date: 1, period: 1 }, { unique: true });

visitorAnalyticsSchema.plugin(toJSON);

const VisitorAnalytics = mongoose.model('VisitorAnalytics', visitorAnalyticsSchema);

module.exports = VisitorAnalytics;
