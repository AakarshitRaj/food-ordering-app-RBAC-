# 🏗️ Architecture & Design Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Database Design](#database-design)
5. [API Design](#api-design)
6. [RBAC Implementation](#rbac-implementation)
7. [Location-Based Filtering](#location-based-filtering)
8. [Security Architecture](#security-architecture)
9. [Data Flow](#data-flow)
10. [Scalability Considerations](#scalability-considerations)

---

## System Overview

The Food Ordering Application is a full-stack web application built with a modern architecture implementing:
- **Role-Based Access Control (RBAC)** with 3 distinct roles
- **Location-based data filtering** for multi-regional operations
- **RESTful API** design for clean separation of concerns
- **JWT authentication** for secure access

### Key Features
- Secure user authentication with JWT tokens
- Granular permission control based on user roles
- Geographic data isolation (India vs America)
- Real-time cart management
- Order placement and tracking
- Payment method selection

---

## Architecture Diagram

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │            Next.js 14 (React 18)                       │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │ │
│  │  │  Login   │  │Restaurant│  │   Cart & Orders  │   │ │
│  │  │  Screen  │  │  Browser │  │   Management     │   │ │
│  │  └──────────┘  └──────────┘  └──────────────────┘   │ │
│  │                                                        │ │
│  │  Tailwind CSS | Lucide Icons | Axios HTTP Client     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS/JSON
                          │ REST API
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                 Express.js Server                      │ │
│  │                                                        │ │
│  │    ┌──────────────────────────────────────────┐      │ │
│  │    │         Middleware Pipeline              │      │ │
│  │    │  1. CORS                                 │      │ │
│  │    │  2. JSON Body Parser                     │      │ │
│  │    │  3. Authentication (JWT)                 │      │ │
│  │    │  4. RBAC Authorization                   │      │ │
│  │    │  5. Location-Based Filter                │      │ │
│  │    └──────────────────────────────────────────┘      │ │
│  │                                                        │ │
│  │    ┌──────────────────────────────────────────┐      │ │
│  │    │           Route Handlers                 │      │ │
│  │    │  /api/auth/*                             │      │ │
│  │    │  /api/restaurants/*                      │      │ │
│  │    │  /api/orders/*                           │      │ │
│  │    │  /api/payment-methods/*                  │      │ │
│  │    └──────────────────────────────────────────┘      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   Controllers                          │ │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────────────┐    │ │
│  │  │   Auth   │  │Restaurant│  │  Order & Payment│    │ │
│  │  │Controller│  │Controller│  │   Controllers   │    │ │
│  │  └──────────┘  └──────────┘  └─────────────────┘    │ │
│  │                                                        │ │
│  │        Business Rules | Validation | Processing       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA ACCESS LAYER                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │               SQLite Database Adapter                  │ │
│  │                                                        │ │
│  │  PostgreSQL-style queries → SQLite translation        │ │
│  │  Parameter binding | Error handling                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                SQLite (foodapp.db)                     │ │
│  │                                                        │ │
│  │  Tables: users | restaurants | menu_items             │ │
│  │         orders | order_items | payment_methods        │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow Diagram

```
User Action
    │
    ├─→ Login
    │   ├─→ POST /api/auth/login
    │   ├─→ Validate credentials
    │   ├─→ Hash password comparison
    │   ├─→ Generate JWT token
    │   └─→ Return token + user data
    │
    ├─→ View Restaurants
    │   ├─→ GET /api/restaurants (with JWT)
    │   ├─→ Auth Middleware: Validate JWT
    │   ├─→ RBAC Middleware: Check permission
    │   ├─→ Location Filter: Apply country WHERE clause
    │   ├─→ Controller: Fetch filtered data
    │   └─→ Return restaurants
    │
    ├─→ Place Order
    │   ├─→ POST /api/orders (with JWT + data)
    │   ├─→ Auth Middleware: Validate JWT
    │   ├─→ RBAC Middleware: Check 'place_order' permission
    │   ├─→ Controller: Validate items
    │   ├─→ Database: Create order + order_items
    │   └─→ Return order confirmation
    │
    └─→ Cancel Order
        ├─→ DELETE /api/orders/:id (with JWT)
        ├─→ Auth Middleware: Validate JWT
        ├─→ RBAC Middleware: Check 'cancel_order' permission
        ├─→ Location Filter: Verify order country matches user
        ├─→ Controller: Delete order
        └─→ Return success
```

---

## Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.33 | React framework with SSR |
| React | 18.2.0 | UI library |
| Tailwind CSS | 3.3.6 | Utility-first CSS framework |
| Axios | 1.6.2 | HTTP client |
| Lucide React | 0.263.1 | Icon library |

**Why Next.js?**
- Server-side rendering for better SEO
- File-based routing
- Built-in optimization
- Easy deployment

**Why Tailwind CSS?**
- Rapid UI development
- Consistent design system
- Small production bundle
- Responsive design utilities

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express.js | 4.18.2 | Web framework |
| SQLite | better-sqlite3 | Database |
| JWT | jsonwebtoken 9.0.2 | Authentication |
| bcryptjs | 2.4.3 | Password hashing |
| CORS | 2.8.5 | Cross-origin requests |

**Why Express.js?**
- Minimal and flexible
- Large ecosystem
- Excellent middleware support
- Easy to learn and use

**Why SQLite?**
- Zero configuration
- Serverless
- Perfect for prototyping
- Easy to deploy
- Can be upgraded to PostgreSQL later

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ id (PK)         │
│ username        │◄──────┐
│ password_hash   │       │
│ name            │       │
│ role            │       │
│ country         │       │
│ created_at      │       │
└─────────────────┘       │
                          │
                          │ user_id (FK)
                          │
┌─────────────────┐       │
│   RESTAURANTS   │       │
├─────────────────┤       │
│ id (PK)         │       │
│ name            │       │
│ country         │       │
│ cuisine         │       │
│ created_at      │       │
└────────┬────────┘       │
         │                │
         │ restaurant_id  │
         │ (FK)           │
         │                │
         ↓                │
┌─────────────────┐       │
│   MENU_ITEMS    │       │
├─────────────────┤       │
│ id (PK)         │       │
│ restaurant_id   │       │
│ name            │       │
│ price           │       │
│ currency        │       │
│ description     │       │
│ created_at      │       │
└─────────────────┘       │
                          │
         ┌────────────────┘
         │
         ↓
┌─────────────────┐
│     ORDERS      │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ country         │
│ status          │
│ total           │
│ currency        │
│ payment_method  │
│ created_at      │
└────────┬────────┘
         │
         │ order_id (FK)
         │
         ↓
┌─────────────────┐
│  ORDER_ITEMS    │
├─────────────────┤
│ id (PK)         │
│ order_id (FK)   │
│ restaurant_id   │
│ restaurant_name │
│ item_name       │
│ quantity        │
│ price           │
└─────────────────┘

┌─────────────────┐
│ PAYMENT_METHODS │
├─────────────────┤
│ id (PK)         │
│ type            │
│ last4           │
│ brand           │
│ identifier      │
└─────────────────┘
```

### Table Schemas

#### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'MANAGER', 'MEMBER')),
  country TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- Primary key on `id`
- Unique constraint on `username`
- Check constraint on `role`

#### Restaurants Table
```sql
CREATE TABLE restaurants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  cuisine TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Menu Items Table
```sql
CREATE TABLE menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurant_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  currency TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);
```

#### Orders Table
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  country TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Confirmed',
  total REAL NOT NULL,
  currency TEXT NOT NULL,
  payment_method TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### Order Items Table
```sql
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  restaurant_id INTEGER NOT NULL,
  restaurant_name TEXT NOT NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);
```

---

## API Design

### RESTful API Principles

1. **Resource-Based URLs**
   - `/api/restaurants` - Collection
   - `/api/restaurants/:id` - Specific resource
   - `/api/restaurants/:id/menu` - Nested resource

2. **HTTP Methods**
   - `GET` - Retrieve data
   - `POST` - Create data
   - `PUT` - Update data
   - `DELETE` - Remove data

3. **Status Codes**
   - `200` - Success
   - `201` - Created
   - `400` - Bad Request
   - `401` - Unauthorized
   - `403` - Forbidden
   - `404` - Not Found
   - `500` - Server Error

### API Endpoints Structure

```
/api
├── /auth
│   ├── POST   /login          # Authenticate user
│   └── GET    /me             # Get current user
│
├── /restaurants
│   ├── GET    /               # List restaurants (filtered)
│   ├── GET    /:id            # Get restaurant
│   └── GET    /:id/menu       # Get menu items
│
├── /orders
│   ├── GET    /               # List orders (filtered)
│   ├── POST   /               # Create order (RBAC)
│   └── DELETE /:id            # Cancel order (RBAC)
│
└── /payment-methods
    └── GET    /               # List payments (Admin only)
```

### Request/Response Format

**Standard Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Standard Error Response:**
```json
{
  "success": false,
  "error": "Error message description"
}
```

---

## RBAC Implementation

### Permission Matrix

| Action | ADMIN | MANAGER | MEMBER |
|--------|-------|---------|--------|
| View Restaurants | ✅ | ✅ | ✅ |
| Create Order (Add to Cart) | ✅ | ✅ | ✅ |
| Place Order (Checkout) | ✅ | ✅ | ❌ |
| Cancel Order | ✅ | ✅ | ❌ |
| Update Payment Method | ✅ | ❌ | ❌ |

### RBAC Middleware Implementation

```javascript
// Permission definitions
const permissions = {
  'view_restaurants': ['ADMIN', 'MANAGER', 'MEMBER'],
  'create_order': ['ADMIN', 'MANAGER', 'MEMBER'],
  'place_order': ['ADMIN', 'MANAGER'],
  'cancel_order': ['ADMIN', 'MANAGER'],
  'update_payment': ['ADMIN']
};

// Middleware function
const checkPermission = (action) => {
  return (req, res, next) => {
    const { role } = req.user;
    
    if (!permissions[action]?.includes(role)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to perform this action'
      });
    }
    
    next();
  };
};

// Usage in routes
router.post('/orders', 
  authenticate,
  checkPermission('place_order'),
  createOrder
);
```

### Frontend Permission Check

```javascript
const hasPermission = (action) => {
  if (!currentUser) return false;
  
  const permissions = {
    'place_order': ['ADMIN', 'MANAGER'],
    'cancel_order': ['ADMIN', 'MANAGER'],
    'update_payment': ['ADMIN']
  };
  
  return permissions[action]?.includes(currentUser.role) || false;
};

// UI rendering
{hasPermission('place_order') && (
  <button onClick={placeOrder}>Place Order</button>
)}
```

---

## Location-Based Filtering

### Implementation Strategy

**1. Database Level**
```javascript
// SQL query with country filter
let query = 'SELECT * FROM restaurants WHERE country = ?';
const params = [user.country];
```

**2. Middleware Level**
```javascript
const filterByCountry = (req, res, next) => {
  const { role, country } = req.user;
  
  if (role === 'ADMIN') {
    req.countryFilter = null; // See all
  } else {
    req.countryFilter = country; // Limited to country
  }
  
  next();
};
```

**3. Controller Level**
```javascript
const getRestaurants = async (req, res) => {
  const { countryFilter } = req;
  
  let query = 'SELECT * FROM restaurants';
  let params = [];
  
  if (countryFilter) {
    query += ' WHERE country = ?';
    params.push(countryFilter);
  }
  
  const result = await pool.query(query, params);
  res.json({ success: true, data: result.rows });
};
```

### Access Rules

| User Role | Country | Can Access |
|-----------|---------|------------|
| ADMIN | null | All restaurants (India + America) |
| MANAGER | India | Only India restaurants |
| MANAGER | America | Only America restaurants |
| MEMBER | India | Only India restaurants |
| MEMBER | America | Only America restaurants |

---

## Security Architecture

### Authentication Flow

```
1. User submits credentials
2. Server validates username/password
3. Password compared with bcrypt hash
4. JWT token generated with user data
5. Token sent to client
6. Client stores token in localStorage
7. Token included in subsequent requests
8. Server validates token on each request
```

### JWT Token Structure

```javascript
{
  "id": 1,
  "username": "nick.fury",
  "name": "Nick Fury",
  "role": "ADMIN",
  "country": null,
  "iat": 1700000000,
  "exp": 1700086400
}
```

### Password Security

- **Hashing**: bcrypt with salt rounds (10)
- **Storage**: Only hashed passwords stored
- **Comparison**: bcrypt.compare() for validation
- **Never transmitted**: Passwords only in login request

### API Security Measures

1. **JWT Validation**: Every protected route
2. **Role Verification**: RBAC middleware
3. **Input Validation**: Request body validation
4. **SQL Injection Prevention**: Parameterized queries
5. **CORS Configuration**: Controlled origins
6. **Error Handling**: No sensitive data in errors

---

## Data Flow

### Login Flow

```
User Input → Frontend
    ↓
POST /api/auth/login
    ↓
Auth Controller
    ├─→ Fetch user from database
    ├─→ Compare password hash
    ├─→ Generate JWT token
    └─→ Return token + user data
        ↓
Frontend stores token
    ↓
Subsequent requests include token
```

### Order Placement Flow

```
User adds items → Cart State
    ↓
Click "Place Order"
    ↓
Check permission (frontend)
    ↓
POST /api/orders (with token)
    ↓
Auth Middleware → Validate JWT
    ↓
RBAC Middleware → Check 'place_order' permission
    ↓
Order Controller
    ├─→ Validate cart items
    ├─→ Calculate total
    ├─→ Create order record
    ├─→ Create order_items records
    └─→ Return order confirmation
        ↓
Frontend updates UI
    ├─→ Clear cart
    ├─→ Show success notification
    └─→ Refresh orders list
```

---

## Scalability Considerations

### Current Architecture (Single Server)

```
Client ←→ Express API ←→ SQLite
```

**Suitable for:**
- Development
- Small teams (< 100 users)
- Low traffic (< 1000 req/day)

### Phase 1: Database Upgrade

```
Client ←→ Express API ←→ PostgreSQL
```

**Benefits:**
- Better performance
- Concurrent connections
- Advanced features
- Data integrity

**Migration:** Replace SQLite adapter with pg module

### Phase 2: Horizontal Scaling

```
                     ┌→ Express API 1 ┐
Client ←→ Load Balancer ┼→ Express API 2 ┼→ PostgreSQL
                     └→ Express API 3 ┘
```

**Benefits:**
- Handle more traffic
- High availability
- Load distribution

**Requirements:**
- Session store (Redis)
- Shared database
- Stateless APIs

### Phase 3: Microservices

```
                   ┌→ Auth Service → User DB
Client ←→ API Gateway ┼→ Order Service → Order DB
                   ├→ Restaurant Service → Restaurant DB
                   └→ Payment Service → Payment DB
```

**Benefits:**
- Independent scaling
- Technology flexibility
- Fault isolation
- Team autonomy

### Phase 4: Cloud Native

```
Client ←→ CDN ←→ API Gateway
              ↓
        Kubernetes Cluster
              ├→ Auth Pods (3)
              ├→ Order Pods (5)
              ├→ Restaurant Pods (2)
              └→ Payment Pods (3)
              ↓
        Cloud Databases
              ├→ PostgreSQL (Primary + Read Replicas)
              ├→ Redis Cache
              └→ S3 Storage
```

**Benefits:**
- Auto-scaling
- Self-healing
- Global distribution
- Managed services

---

## Performance Optimization

### Database Optimizations

1. **Indexes**
   ```sql
   CREATE INDEX idx_restaurants_country ON restaurants(country);
   CREATE INDEX idx_orders_user_id ON orders(user_id);
   CREATE INDEX idx_orders_country ON orders(country);
   ```

2. **Query Optimization**
   - Use parameterized queries
   - Limit result sets
   - Avoid N+1 queries
   - Use joins appropriately

3. **Caching Strategy**
   - Cache restaurant list
   - Cache menu items
   - Cache user sessions
   - TTL: 5-15 minutes

### API Optimizations

1. **Response Compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Request Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100
   });
   app.use(limiter);
   ```

3. **Pagination**
   ```javascript
   const limit = req.query.limit || 10;
   const offset = req.query.offset || 0;
   ```

### Frontend Optimizations

1. **Code Splitting**
   - Lazy load components
   - Dynamic imports
   - Route-based splitting

2. **State Management**
   - Minimize re-renders
   - Use React.memo
   - Optimize useState usage

3. **Asset Optimization**
   - Image optimization
   - CSS purging (Tailwind)
   - Bundle size monitoring

---

## Monitoring & Logging

### Logging Strategy

```javascript
// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Error logging
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});
```

### Metrics to Monitor

1. **API Metrics**
   - Request count
   - Response times
   - Error rates
   - Endpoint usage

2. **Database Metrics**
   - Query execution time
   - Connection pool usage
   - Database size

3. **Business Metrics**
   - User registrations
   - Orders placed
   - Revenue
   - Active users

---

## Deployment Architecture

### Development Environment

```
localhost:3000 (Frontend)
localhost:5000 (Backend)
foodapp.db (Database)
```

### Production Environment

```
Vercel (Frontend)
    ↓ HTTPS
Railway/Render (Backend)
    ↓
PostgreSQL (Managed Database)
```

---

## Future Enhancements

1. **Real-time Features**
   - WebSocket integration
   - Live order tracking
   - Push notifications

2. **Advanced Features**
   - Restaurant reviews
   - Order history analytics
   - Loyalty programs
   - Multi-language support

3. **Mobile App**
   - React Native version
   - Offline mode
   - GPS integration

4. **Analytics Dashboard**
   - Sales reports
   - User behavior
   - Performance metrics

---

This architecture is designed to be:
- ✅ **Scalable** - Can grow from prototype to production
- ✅ **Secure** - Multiple layers of security
- ✅ **Maintainable** - Clean separation of concerns
- ✅ **Testable** - Modular components
- ✅ **Flexible** - Easy to extend and modify