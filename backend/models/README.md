# Hệ thống Models cho Website Bán Hàng

## Tổng quan

Hệ thống cơ sở dữ liệu được thiết kế dựa trên các use case diagrams bao gồm:
- **Quản lý tài khoản**: Đăng ký, đăng nhập, quản lý hồ sơ
- **Quản lý sản phẩm**: Xem, tìm kiếm, sắp xếp danh sách sản phẩm (User & Admin)
- **Quản lý đơn hàng**: Xem, tạo, hủy đơn hàng, theo dõi vận chuyển

## Danh sách Models

### 1. **User Model** (`user.model.js`)
Quản lý thông tin người dùng và xác thực.

**Chức năng:**
- Đăng ký/Đăng nhập (email/password hoặc Google)
- Xác thực email với OTP
- Đặt lại mật khẩu
- Quản lý hồ sơ cá nhân (avatar, địa chỉ, số điện thoại)
- Phân quyền (user/admin)

**Các trường chính:**
- `name`, `email`, `password` (hashed)
- `role` (user/admin)
- `authType` (local/google)
- `isEmailVerified`
- `phone`, `address`, `avatar`
- `resetPasswordCode`, `verifyEmailCode` (bảo mật)

### 2. **Product Model** (`product.model.js`)
Quản lý sản phẩm với đầy đủ thông tin.

**Chức năng:**
- CRUD sản phẩm (Admin)
- Tự động tạo slug từ tên
- Quản lý giá và giảm giá
- Quản lý kho (stock, threshold)
- SEO optimization
- Phân loại (featured, new arrival, best seller)

**Các trường chính:**
- `name`, `slug`, `description`
- `price`, `discountPrice`, `hasDiscount`
- `category`, `tagCategory`
- `images`, `mainImage`
- `brand`, `tags`, `colors`, `sizes`
- `stock`, `lowStockThreshold`
- `rating`, `numReviews`
- `soldCount`

**Virtual Fields:**
- `discountPercentage`: Tính % giảm giá
- `stockStatus`: Trạng thái kho hàng
- `revenue`: Doanh thu từ sản phẩm

### 3. **Category Model** (`category.model.js`)
Quản lý danh mục sản phẩm theo cấu trúc cây.

**Chức năng:**
- Hỗ trợ danh mục đa cấp (parent/children)
- Tự động tạo slug
- SEO cho từng danh mục
- Sắp xếp thứ tự hiển thị

**Các trường chính:**
- `name`, `slug`, `description`, `image`
- `parent` (danh mục cha)
- `level` (cấp độ)
- `isActive`, `order`
- `seoTitle`, `seoDescription`, `seoKeywords`

**Virtual Fields:**
- `children`: Danh mục con
- `productCount`: Số sản phẩm trong danh mục

### 4. **Order Model** (`order.model.js`)
Quản lý đơn hàng và theo dõi trạng thái.

**Chức năng:**
- Tạo đơn hàng tự động (mã đơn hàng unique)
- Theo dõi trạng thái (pending → delivered)
- Lịch sử thay đổi trạng thái
- Quản lý thanh toán và vận chuyển
- Hỗ trợ hủy đơn và hoàn tiền

**Các trường chính:**
- `orderNumber` (tự động tạo)
- `user`, `orderItems[]`
- `shippingAddress` (đầy đủ thông tin giao hàng)
- `paymentMethod` (COD, card, banking, momo, zalopay)
- `status` (pending, confirmed, processing, shipping, delivered, cancelled, refunded)
- `totalPrice`, `shippingPrice`, `taxPrice`
- `isPaid`, `paidAt`, `isDelivered`, `deliveredAt`
- `statusHistory[]` (lịch sử thay đổi)

### 5. **Cart Model** (`cart.model.js`)
Quản lý giỏ hàng của người dùng.

**Chức năng:**
- Thêm/xóa/cập nhật sản phẩm
- Tự động tính tổng giá trị
- Lưu thông tin màu sắc, kích thước

**Các trường chính:**
- `user` (unique - 1 user 1 giỏ hàng)
- `items[]` (product, quantity, price, color, size)
- `totalItems`, `totalPrice`, `totalDiscountPrice`

**Methods:**
- `calculateTotals()`: Tính toán tổng giá trị tự động

### 6. **Wishlist Model** (`wishlist.model.js`)
Quản lý danh sách yêu thích.

**Chức năng:**
- Thêm/xóa sản phẩm yêu thích
- Kiểm tra sản phẩm đã có trong wishlist

**Các trường chính:**
- `user` (unique)
- `products[]` (product, addedAt)

**Methods:**
- `addProduct()`, `removeProduct()`, `hasProduct()`

### 7. **Review Model** (`review.model.js`)
Quản lý đánh giá sản phẩm.

**Chức năng:**
- Đánh giá sản phẩm (1-5 sao)
- Xác nhận mua hàng (verified purchase)
- Like/dislike đánh giá
- Admin có thể trả lời
- Tự động cập nhật rating của sản phẩm

**Các trường chính:**
- `product`, `user`, `order`
- `rating`, `title`, `comment`
- `images[]`, `pros`, `cons`
- `isVerifiedPurchase`, `isApproved`
- `likes`, `dislikes`
- `adminReply`

**Static Methods:**
- `updateProductRating()`: Cập nhật rating trung bình của sản phẩm

### 8. **Token Model** (`token.model.js`)
Quản lý JWT tokens và xác thực.

**Chức năng:**
- Lưu refresh tokens
- Token đặt lại mật khẩu
- Token xác thực email
- Blacklist tokens

**Các trường chính:**
- `token`, `user`
- `type` (refresh, resetPassword, verifyEmail)
- `expires`, `blacklisted`

### 9. **Picture Model** (`picture.model.js`)
Quản lý hình ảnh tải lên.

**Chức năng:**
- Lưu trữ thông tin file ảnh
- Liên kết với các model khác
- Quản lý metadata (kích thước, tags)

**Các trường chính:**
- `filename`, `originalName`, `path`, `url`
- `mimetype`, `size`, `width`, `height`
- `uploadedBy`, `relatedTo` (model + id)
- `alt`, `tags`, `isPublic`

### 10. **SalesAnalytics Model** (`salesAnalytics.model.js`)
Phân tích doanh thu và bán hàng.

**Chức năng:**
- Thống kê theo thời gian (daily, weekly, monthly, yearly)
- Top sản phẩm/danh mục bán chạy
- Phân tích đơn hàng theo trạng thái
- Phân tích phương thức thanh toán

**Các trường chính:**
- `date`, `period`
- `totalOrders`, `totalRevenue`, `totalProfit`
- `averageOrderValue`
- `newCustomers`, `returningCustomers`
- `topProducts[]`, `topCategories[]`
- `ordersByStatus`, `paymentMethods`

### 11. **VisitorAnalytics Model** (`visitorAnalytics.model.js`)
Phân tích lượng truy cập và hành vi người dùng.

**Chức năng:**
- Thống kê lượt truy cập
- Phân tích nguồn traffic
- Theo dõi thiết bị/trình duyệt
- Tỷ lệ chuyển đổi

**Các trường chính:**
- `date`, `period`
- `totalVisitors`, `uniqueVisitors`, `pageViews`
- `averageSessionDuration`, `bounceRate`
- `topPages[]`, `topProducts[]`
- `trafficSources`, `deviceTypes`
- `conversionRate`, `addToCartRate`

## Mối quan hệ giữa các Models

```
User ──┬── (1:1) Cart
       ├── (1:1) Wishlist
       ├── (1:N) Order
       ├── (1:N) Review
       └── (1:N) Token

Product ──┬── (N:1) Category
          ├── (1:N) Review
          ├── (N:M) Cart (through items)
          ├── (N:M) Wishlist (through products)
          └── (N:M) Order (through orderItems)

Order ──┬── (N:1) User
        └── (1:N) OrderItems (embedded)

Category ──┬── (1:N) Product
           └── (N:1) Category (parent)

Review ──┬── (N:1) Product
         ├── (N:1) User
         └── (N:1) Order (optional)
```

## Plugins được sử dụng

### `toJSON` Plugin
- Tự động loại bỏ các trường `private`
- Chuyển đổi `_id` thành `id`
- Loại bỏ `__v`

### `paginate` Plugin
- Hỗ trợ phân trang
- Sắp xếp động
- Populate relationships
- Trả về metadata (totalPages, totalResults)

## Cài đặt Dependencies

```bash
cd backend
npm install mongoose mongoose-paginate-v2 validator bcrypt slugify
```

## Sử dụng Models

```javascript
const { User, Product, Order } = require('./models');

// Tìm kiếm với phân trang
const products = await Product.paginate(
  { isActive: true },
  { page: 1, limit: 10, sortBy: 'createdAt:desc', populate: 'category' }
);

// Tạo đơn hàng
const order = await Order.create({
  user: userId,
  orderItems: cartItems,
  shippingAddress: address,
  totalPrice: total
});

// Kiểm tra email đã tồn tại
const isTaken = await User.isEmailTaken('user@example.com');
```

## Best Practices

1. **Indexes**: Các trường thường xuyên query đã được đánh index
2. **Validation**: Sử dụng mongoose validators và custom validators
3. **Middleware**: Pre/post hooks để tự động xử lý logic
4. **Virtual Fields**: Tính toán động không lưu vào DB
5. **Security**: Password được hash, các trường nhạy cảm có `private: true` hoặc `select: false`

## Mapping với Use Cases

### Use Case: Quản lý đơn hàng
- ✅ Xem danh sách đơn hàng → `Order.paginate()`
- ✅ Sắp xếp danh sách đơn hàng → `sortBy` option
- ✅ Xem thông tin đơn hàng → `Order.findById().populate()`
- ✅ Xem thông tin vận chuyển → `Order.trackingNumber`, `statusHistory`
- ✅ Hủy đơn hàng → `Order.update({ status: 'cancelled' })`

### Use Case: Quản lý sản phẩm
- ✅ Xem danh sách sản phẩm → `Product.paginate()`
- ✅ Tìm kiếm sản phẩm theo tên → `Product.find({ name: regex })`
- ✅ Xem thông tin sản phẩm → `Product.findById()`
- ✅ Thêm/Sửa/Xóa sản phẩm (Admin) → CRUD operations

### Use Case: Quản lý tài khoản
- ✅ Đăng ký → `User.create()`
- ✅ Đăng nhập → `User.isPasswordMatch()`
- ✅ Đăng nhập bằng Gmail → OAuth flow với `authType: 'google'`
- ✅ Xác thực email → `verifyEmailCode`
- ✅ Xác thực token → `Token.findOne()`
- ✅ Đặt lại mật khẩu → `resetPasswordCode`
- ✅ Xem hồ sơ → `User.findById()`
- ✅ Chỉnh sửa hồ sơ/avatar → `User.update()`
