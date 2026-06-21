# API Integration Guide

## Authentication

### Register
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response:
{
  "user": { "id": "...", "email": "...", "role": "BUYER" },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": "15m"
}
```

### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

### Refresh Token
```bash
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

## Products

### Get All Products
```bash
GET /api/v1/products?skip=0&take=20&search=bitcoin&categoryId=cat-001
Authorization: Bearer <accessToken>
```

### Create Product (Seller)
```bash
POST /api/v1/products
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "storeId": "store-001",
  "categoryId": "cat-001",
  "title": "Bitcoin Hardware Wallet",
  "description": "Secure hardware wallet",
  "price": 99.99,
  "quantity": 100,
  "isDraft": false
}
```

## Orders

### Create Order
```bash
POST /api/v1/orders
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "storeId": "store-001",
  "items": [
    {
      "productId": "prod-001",
      "variantId": "var-001",
      "quantity": 2
    }
  ],
  "shippingAddressId": "addr-001",
  "total": 199.98
}
```

### Get My Orders
```bash
GET /api/v1/orders/my-orders
Authorization: Bearer <accessToken>
```

## Bitcoin Payments

### Initiate Bitcoin Payment
```bash
POST /api/v1/payments/bitcoin/initiate
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "orderId": "order-001",
  "amountUSD": 100.00
}

Response:
{
  "id": "txn-001",
  "paymentAddress": "1DarkBlade...",
  "amountBTC": "0.00250000",
  "amountUSD": 100.00,
  "expiresAt": "2024-01-21T12:00:00Z"
}
```

### Check Payment Status
```bash
GET /api/v1/payments/txn-001/status
Authorization: Bearer <accessToken>
```

### Verify Payment
```bash
POST /api/v1/payments/txn-001/verify
Authorization: Bearer <accessToken>
```

## Chat

### Get Conversations
```bash
GET /api/v1/chat/conversations
Authorization: Bearer <accessToken>
```

### Create/Get Conversation
```bash
POST /api/v1/chat/conversations
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "otherUserId": "user-002"
}
```

### Send Message
```bash
POST /api/v1/chat/chat-001/messages
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "content": "Hi, I'm interested in this product"
}
```

### Get Messages
```bash
GET /api/v1/chat/chat-001/messages?skip=0&take=50
Authorization: Bearer <accessToken>
```

## Notifications

### Get Notifications
```bash
GET /api/v1/notifications?skip=0&take=20
Authorization: Bearer <accessToken>
```

### Get Unread Count
```bash
GET /api/v1/notifications/unread-count
Authorization: Bearer <accessToken>
```

### Mark as Read
```bash
POST /api/v1/notifications/notif-001/read
Authorization: Bearer <accessToken>
```

## Admin

### Dashboard Stats
```bash
GET /api/v1/admin/dashboard
Authorization: Bearer <adminToken>
```

### Get All Users
```bash
GET /api/v1/admin/users?skip=0&take=20
Authorization: Bearer <adminToken>
```

### Suspend User
```bash
PATCH /api/v1/admin/users/user-001/suspend
Authorization: Bearer <adminToken>
```

### Get Reports
```bash
GET /api/v1/admin/reports?skip=0&take=20
Authorization: Bearer <adminToken>
```

## Subscriptions

### Create Subscription
```bash
POST /api/v1/subscriptions
Authorization: Bearer <sellerToken>

Response:
{
  "id": "sub-001",
  "status": "ACTIVE",
  "priceUSD": 50,
  "startDate": "2024-01-20",
  "endDate": "2024-02-20",
  "renewalDate": "2024-02-20"
}
```

### Check Subscription Status
```bash
GET /api/v1/subscriptions/status
Authorization: Bearer <sellerToken>
```

## Error Handling

All errors follow this format:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "BadRequest"
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Server Error

## Rate Limiting

API endpoints are rate-limited. Headers include:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705790400
```

## WebSocket (Future)

Real-time features (chat, notifications) will use WebSocket:
```javascript
const socket = io('http://localhost:3001');

// Listen for new messages
socket.on('message:new', (message) => {
  console.log('New message:', message);
});

// Send message
socket.emit('message:send', { chatId, content: 'Hello' });
```
