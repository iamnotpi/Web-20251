# Sơ đồ quan hệ Database (ERD)

## Database Schema Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER MANAGEMENT                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│     User     │────1:N──│    Token     │         │   Picture    │
│              │         │              │         │              │
│ • email      │         │ • token      │         │ • filename   │
│ • password   │         │ • type       │         │ • url        │
│ • role       │         │ • expires    │         │ • mimetype   │
│ • authType   │         │ • user (FK)  │         │ • uploadedBy │
│ • phone      │         └──────────────┘         │ • relatedTo  │
│ • address    │                                  └──────────────┘
│ • avatar     │
└──────┬───────┘
       │
       │
┌─────────────────────────────────────────────────────────────────┐
│                      PRODUCT MANAGEMENT                          │
└─────────────────────────────────────────────────────────────────┘

       │
       │ 1:1
       ├────────────┐
       │            │
       ▼            ▼
┌──────────────┐  ┌──────────────┐         ┌──────────────┐
│     Cart     │  │   Wishlist   │         │   Category   │
│              │  │              │         │              │
│ • user (FK)  │  │ • user (FK)  │    ┌────│ • name       │
│ • items[]    │  │ • products[] │    │    │ • slug       │
│ • totalPrice │  │              │    │    │ • parent (FK)│
└──────────────┘  └──────────────┘    │    │ • level      │
                                       │    │ • order      │
       │                               │    └──────────────┘
       │ 1:N                           │           │
       │                               │           │ 1:N
       ▼                               │           │
┌──────────────┐                       │           ▼
│    Order     │                       │    ┌──────────────┐
│              │                       │    │   Product    │
│ • orderNum   │                       │    │              │
│ • user (FK)  │                       └─N:1│ • name       │
│ • items[]    │                            │ • slug       │
│ • address    │                       ┌────│ • category(FK)│
│ • payment    │                       │    │ • price      │
│ • status     │                       │    │ • discount   │
│ • totalPrice │                       │    │ • stock      │
│ • history[]  │                       │    │ • rating     │
└──────────────┘                       │    │ • soldCount  │
                                       │    └──────────────┘
       │                               │           │
       │ 1:N                           │           │ 1:N
       │                               │           │
       ▼                               │           ▼
┌──────────────┐                       │    ┌──────────────┐
│ OrderItem    │                       │    │    Review    │
│ (embedded)   │                       │    │              │
│              │                       └─N:1│ • product(FK)│
│ • product(FK)│────────────────────────────│ • user (FK)  │
│ • name       │                            │ • order (FK) │
│ • quantity   │                            │ • rating     │
│ • price      │                            │ • comment    │
│ • color      │                            │ • images[]   │
│ • size       │                            │ • likes      │
└──────────────┘                            │ • adminReply │
                                            └──────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          ANALYTICS                               │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────┐              ┌────────────────────┐
│  SalesAnalytics    │              │ VisitorAnalytics   │
│                    │              │                    │
│ • date             │              │ • date             │
│ • period           │              │ • period           │
│ • totalOrders      │              │ • totalVisitors    │
│ • totalRevenue     │              │ • pageViews        │
│ • topProducts[]    │              │ • bounceRate       │
│ • topCategories[]  │              │ • trafficSources   │
│ • ordersByStatus   │              │ • deviceTypes      │
│ • paymentMethods   │              │ • conversionRate   │
└────────────────────┘              └────────────────────┘
```

## Relationships Detail

### One-to-One (1:1)
- **User ↔ Cart**: Mỗi user có 1 giỏ hàng
- **User ↔ Wishlist**: Mỗi user có 1 danh sách yêu thích

### One-to-Many (1:N)
- **User → Order**: 1 user có nhiều đơn hàng
- **User → Review**: 1 user có nhiều đánh giá
- **User → Token**: 1 user có nhiều tokens
- **Category → Product**: 1 danh mục có nhiều sản phẩm
- **Category → Category**: 1 danh mục cha có nhiều danh mục con
- **Product → Review**: 1 sản phẩm có nhiều đánh giá
- **Order → OrderItem**: 1 đơn hàng có nhiều sản phẩm (embedded)

### Many-to-Many (N:M)
- **Product ↔ Cart**: Nhiều sản phẩm trong nhiều giỏ hàng (through `items`)
- **Product ↔ Wishlist**: Nhiều sản phẩm trong nhiều wishlist (through `products`)
- **Product ↔ Order**: Nhiều sản phẩm trong nhiều đơn hàng (through `orderItems`)

## Index Strategy

### Primary Indexes
```javascript
// Unique indexes
User: email (unique)
Product: slug (unique)
Category: name (unique), slug (unique)
Order: orderNumber (unique)
Cart: user (unique)
Wishlist: user (unique)
Review: (product, user) composite unique

// Regular indexes
Token: token, user
Picture: uploadedBy, relatedTo
SalesAnalytics: (date, period) composite
VisitorAnalytics: (date, period) composite
```

### Query Optimization Indexes
```javascript
Product: 
  - category (for filtering by category)
  - isFeatured, isNewArrival, isBestSeller (for filtering)
  - createdAt (for sorting)

Order:
  - user (for user's orders)
  - status (for filtering by status)
  - createdAt (for sorting)

Review:
  - product (for product's reviews)
  - isApproved (for filtering)
```

## Data Flow Examples

### 1. User Registration Flow
```
User Input → User.create()
           → User.pre('save') → hash password
           → Generate verifyEmailCode
           → Save to DB
           → Create Token (refresh token)
           → Send verification email
```

### 2. Create Order Flow
```
Cart Items → Order.create()
          → Order.pre('save') → generate orderNumber
          → Save orderItems (embedded)
          → Calculate totals
          → Update Product.stock
          → Update Product.soldCount
          → Clear Cart
          → Create statusHistory entry
```

### 3. Product Review Flow
```
Review.create() → Save review
                → Review.post('save')
                → Calculate avg rating
                → Update Product.rating
                → Update Product.numReviews
```

### 4. Analytics Update Flow
```
Order Status Change → Trigger analytics update
                    → SalesAnalytics.findOneAndUpdate()
                    → Update metrics by period
                    → Update topProducts[]
                    → Update ordersByStatus

Page Visit → VisitorAnalytics.findOneAndUpdate()
           → Increment pageViews
           → Update topPages[]
           → Update trafficSources
```

## Field Type Conventions

### Naming Conventions
- **Boolean fields**: `is*`, `has*` (e.g., `isActive`, `hasDiscount`)
- **Timestamps**: `*At` (e.g., `createdAt`, `paidAt`, `deliveredAt`)
- **Counts**: `num*`, `total*` (e.g., `numReviews`, `totalPrice`)
- **Foreign Keys**: Reference model name in camelCase (e.g., `user`, `product`, `category`)
- **Arrays**: Plural form (e.g., `items`, `products`, `images`)

### Common Field Patterns
```javascript
// Timestamps
createdAt: { type: Date, default: Date.now }
updatedAt: { type: Date, default: Date.now }

// Foreign Keys
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

// Status Enums
status: { type: String, enum: ['active', 'inactive'], default: 'active' }

// Strings with validation
email: { type: String, required: true, unique: true, lowercase: true, trim: true }

// Security fields
password: { type: String, private: true, minlength: 8 }
resetCode: { type: String, select: false }
```

## Virtual Fields

### Product Virtuals
- `discountPercentage`: Calculated percentage discount
- `stockStatus`: Human-readable stock status
- `revenue`: Total revenue from this product

### Category Virtuals
- `children`: Sub-categories
- `productCount`: Number of products in category

## Middleware Hooks

### Pre-save Hooks
```javascript
User.pre('save')        → Hash password
Product.pre('save')     → Generate slug, update discount
Category.pre('save')    → Generate slug
Order.pre('save')       → Generate orderNumber, update statusHistory
```

### Post-save Hooks
```javascript
Review.post('save')     → Update product rating
Review.post('remove')   → Update product rating
```

### Pre-update Hooks
```javascript
Product.pre('findOneAndUpdate') → Update updatedAt, handle discount
```

## Validation Rules

### User
- Email: Valid email format, unique
- Password: Min 8 chars, must contain letter + number
- Role: Must be 'user' or 'admin'

### Product
- Name: Required
- Price: Required, must be positive number
- Stock: Cannot be negative

### Order
- OrderNumber: Auto-generated, unique
- OrderItems: Must have at least 1 item
- TotalPrice: Must match calculated total

### Review
- Rating: Required, 1-5 range
- Product + User: Unique combination (one review per user per product)

## Security Considerations

### Password Security
- Hashed using bcrypt (salt rounds: 8)
- Never returned in API responses (private: true)

### Sensitive Data
- Password reset codes: `select: false`
- Email verification codes: `select: false`
- Token blacklisting supported

### Data Privacy
- User addresses: Structured for privacy
- Payment info: Minimal storage, sensitive data excluded
- Reviews: Must be approved before showing

## Performance Tips

1. **Use lean() for read-only queries**: Faster than full documents
2. **Select only needed fields**: Reduce data transfer
3. **Use indexes**: Already configured on frequently queried fields
4. **Paginate large results**: All list endpoints support pagination
5. **Populate selectively**: Only populate when needed
6. **Use aggregation for analytics**: More efficient for calculations
