const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Thêm sản phẩm vào wishlist
wishlistSchema.methods.addProduct = function (productId) {
  const existingProduct = this.products.find((item) => item.product.toString() === productId.toString());
  
  if (!existingProduct) {
    this.products.push({ product: productId });
  }
  
  return this.save();
};

// Xóa sản phẩm khỏi wishlist
wishlistSchema.methods.removeProduct = function (productId) {
  this.products = this.products.filter((item) => item.product.toString() !== productId.toString());
  return this.save();
};

// Kiểm tra sản phẩm có trong wishlist không
wishlistSchema.methods.hasProduct = function (productId) {
  return this.products.some((item) => item.product.toString() === productId.toString());
};

wishlistSchema.plugin(toJSON);
wishlistSchema.plugin(paginate);

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
