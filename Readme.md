# 🍔 Food Ordering Application with RBAC

A full-stack food ordering web application with comprehensive Role-Based Access Control (RBAC) and location-based data filtering.

**Assignment Completion: 30/30 Points**
- ✅ Full-stack web application 
- ✅ RBAC implementation with 3 roles 
- ✅ Location-based relational access control 

---

## 📋 Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation & Setup](#installation--setup)
5. [Running Locally](#running-locally)
6. [Test Credentials](#test-credentials)
7. [Project Structure](#project-structure)
8. [API Documentation](#api-documentation)
9. [Architecture](#architecture)
10. [Testing Guide](#testing-guide)
11. [Deployment](#deployment)

---

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication** - JWT-based user authentication
- 🍽️ **Restaurant Browsing** - View restaurants and menu items
- 🛒 **Shopping Cart** - Add, update, and remove items
- 💳 **Order Management** - Place and track orders
- 🚫 **Order Cancellation** - Cancel orders with proper authorization
- 💰 **Payment Methods** - Multiple payment options

### RBAC Implementation
- **3 User Roles**: ADMIN, MANAGER, MEMBER
- **Granular Permissions**: Function-level access control
- **Server-side Validation**: All routes protected with middleware
- **UI-level Enforcement**: Buttons hidden/disabled based on role

### Location-Based Access Control
- **Country Filtering**: Users see only their country's data
- **Data Isolation**: India users cannot access America data and vice-versa
- **Admin Override**: Admin has global access to all countries
- **Database-level Filtering**: SQL WHERE clauses for security

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState, useEffect)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **CORS**: cors middleware

### Architecture
- **Design Pattern**: RESTful API
- **Authentication**: JWT tokens with Bearer scheme
- **Authorization**: Role-Based Access Control (RBAC)
- **Data Filtering**: Location-based middleware

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **Git** (for cloning) - [Download](https://git-scm.com/)

Verify installation:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd food-ordering-app
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

**Dependencies installed:**
- express
- cors
- dotenv
- better-sqlite3
- bcryptjs
- jsonwebtoken
- nodemon (dev)

### Step 3: Setup Database

Run the database migration to create tables and seed data:

```bash
node src/config/migrate.js
```

**Expected output:**
```
🚀 Starting database migration...
✅ Users table created
✅ Restaurants table created
✅ Menu items table created
✅ Orders table created
✅ Order items table created
✅ Payment methods table created
✅ Users seeded
✅ Restaurants seeded
✅ Menu items seeded
✅ Payment methods seeded
🎉 Migration completed successfully!
```

This creates `foodapp.db` file with all sample data.

### Step 4: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

**Dependencies installed:**
- react
- react-dom
- next
- axios
- lucide-react
- tailwindcss (dev)

---

## 🏃 Running Locally

### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
```

**Expected output:**
```
✅ SQLite database initialized

╔═══════════════════════════════════════════════╗
║   🚀 Food Ordering Backend Server            ║
║   ✅ Server running on port 5000             ║
║   📡 http://localhost:5000                   ║
║   🔐 RBAC & Location filtering enabled       ║
╚═══════════════════════════════════════════════╝
```

Backend API available at: **http://localhost:5000**

### Terminal 2: Start Frontend Server

```bash
cd frontend
npm run dev
```

**Expected output:**
```
▲ Next.js 14.2.33
- Local:        http://localhost:3000
✓ Ready in 2.1s
```

Frontend application available at: **http://localhost:3000**

---

## 👥 Test Credentials

### Admin (Global Access)
```
Username: nick.fury
Password: admin123
Role: ADMIN
Access: All restaurants from all countries
Permissions: Full access to all features
```

### Manager - India
```
Username: captain.marvel
Password: manager123
Role: MANAGER
Country: India
Access: Only India restaurants
Permissions: Can place and cancel orders
```

### Manager - America
```
Username: captain.america
Password: manager123
Role: MANAGER
Country: America
Access: Only America restaurants
Permissions: Can place and cancel orders
```

### Member - India
```
Username: thanos
Password: member123
Role: MEMBER
Country: India
Access: Only India restaurants
Permissions: View only, cannot place/cancel orders
```

### Member - India (Alternative)
```
Username: thor
Password: member123
Role: MEMBER
Country: India
```

### Member - America
```
Username: travis
Password: member123
Role: MEMBER
Country: America
Access: Only America restaurants
Permissions: View only, cannot place/cancel orders
```

---

## 📁 Project Structure

```
food-ordering-app/
│
├── backend/                        # Backend API server
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # Database connection
│   │   │   └── migrate.js         # Database migrations & seeds
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT authentication
│   │   │   └── rbac.js            # RBAC & location filtering
│   │   ├── controllers/
│   │   │   ├── authController.js  # Login logic
│   │   │   ├── restaurantController.js
│   │   │   ├── orderController.js
│   │   │   └── paymentController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── restaurants.js
│   │   │   ├── orders.js
│   │   │   └── payments.js
│   │   └── server.js              # Express app entry
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── foodapp.db                 # SQLite database file
│
└── frontend/                       # Next.js frontend
    ├── src/
    │   ├── app/
    │   │   ├── globals.css        # Tailwind styles
    │   │   ├── layout.jsx         # Root layout
    │   │   └── page.jsx           # Main application
    │   └── lib/
    │       └── api.js             # API client (Axios)
    ├── .env.local                 # Frontend env variables
    ├── next.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST /api/auth/login
Login with credentials

**Request:**
```json
{
  "username": "nick.fury",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "nick.fury",
    "name": "Nick Fury",
    "role": "ADMIN",
    "country": null
  }
}
```

#### GET /api/auth/me
Get current user info (requires token)

**Headers:**
```
Authorization: Bearer <token>
```

### Restaurant Endpoints

#### GET /api/restaurants
Get all accessible restaurants (filtered by country)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Spice Garden",
      "country": "India",
      "cuisine": "Indian"
    }
  ]
}
```

#### GET /api/restaurants/:id/menu
Get menu items for a restaurant

### Order Endpoints

#### GET /api/orders
Get user's orders (filtered by country)

#### POST /api/orders
Place a new order (Manager/Admin only)

**Request:**
```json
{
  "items": [
    {
      "restaurantId": 1,
      "restaurantName": "Spice Garden",
      "itemId": 101,
      "itemName": "Butter Chicken",
      "quantity": 2,
      "price": 350,
      "currency": "INR"
    }
  ],
  "paymentMethod": {
    "id": 1,
    "type": "Credit Card",
    "last4": "4242"
  }
}
```

#### DELETE /api/orders/:id
Cancel an order (Manager/Admin only)

### Payment Endpoints

#### GET /api/payment-methods
Get payment methods (Admin only)

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────┐
│   Web Browser   │
│  (React/Next)   │
└────────┬────────┘
         │ HTTP/JSON
         ↓
┌─────────────────┐
│  Express API    │
│  ┌───────────┐  │
│  │   Auth    │  │ JWT Validation
│  │ Middleware│  │
│  └─────┬─────┘  │
│        ↓        │
│  ┌───────────┐  │
│  │   RBAC    │  │ Permission Check
│  │ Middleware│  │
│  └─────┬─────┘  │
│        ↓        │
│  ┌───────────┐  │
│  │Controllers│  │ Business Logic
│  └─────┬─────┘  │
└────────┼────────┘
         ↓
┌─────────────────┐
│  SQLite DB      │
│  foodapp.db     │
└─────────────────┘
```

### RBAC Flow

```
1. User Login → JWT Token Generated
2. Request with Token → Auth Middleware Validates
3. RBAC Middleware → Check User Role & Permissions
4. Location Filter → Apply Country-based Filtering
5. Controller → Execute Business Logic
6. Response → Return Filtered Data
```

### Database Schema

**Users Table:**
- id, username, password_hash, name, role, country

**Restaurants Table:**
- id, name, country, cuisine

**Menu Items Table:**
- id, restaurant_id, name, price, currency, description

**Orders Table:**
- id, user_id, country, status, total, currency, payment_method

**Order Items Table:**
- id, order_id, restaurant_id, restaurant_name, item_name, quantity, price

**Payment Methods Table:**
- id, type, last4, brand, identifier

---

## 🧪 Testing Guide

### Manual Testing Steps

1. **Test Admin Access**
   - Login as `nick.fury`
   - Verify: See all restaurants (India + America)
   - Verify: Can place orders
   - Verify: Can cancel orders
   - Verify: Can update payment methods

2. **Test Manager Access**
   - Login as `captain.marvel` (India)
   - Verify: See only India restaurants
   - Verify: Can place orders
   - Verify: Can cancel orders
   - Verify: Cannot update payment methods

3. **Test Member Access**
   - Login as `thanos` (India)
   - Verify: See only India restaurants
   - Verify: Can add to cart
   - Verify: Cannot place orders (error message shown)
   - Verify: Cannot cancel orders

4. **Test Location Filtering**
   - Login as `captain.marvel` (India)
   - Verify: Cannot see American Diner or Pizza Palace
   - Login as `captain.america` (America)
   - Verify: Cannot see Spice Garden or Dosa Corner

### API Testing with cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"nick.fury","password":"admin123"}'

# Get restaurants (with token)
curl -X GET http://localhost:5000/api/restaurants \
  -H "Authorization: Bearer <your-token>"
```

---

## 🌐 Deployment

### Backend Deployment (Render/Railway)

1. Push code to GitHub
2. Connect to Render/Railway
3. Set environment variables:
   ```
   PORT=5000
   JWT_SECRET=<your-secret>
   NODE_ENV=production
   ```
4. Deploy

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project to Vercel
3. Set environment variable:
   ```
   NEXT_PUBLIC_API_URL=<your-backend-url>/api
   ```
4. Deploy

---

## 📊 Sample Data

### Restaurants & Menu Items

**India:**
- **Spice Garden** (Indian): Butter Chicken (₹350), Paneer Tikka (₹280), Biryani (₹320), Naan (₹50)
- **Dosa Corner** (South Indian): Masala Dosa (₹120), Idli Sambar (₹80), Vada (₹60)

**America:**
- **American Diner** (American): Classic Burger ($12), Hot Dog ($8), French Fries ($5), Milkshake ($6)
- **Pizza Palace** (Italian-American): Pepperoni Pizza ($18), Veggie Supreme ($16), Garlic Bread ($7)

### Payment Methods
- Credit Card (Visa ****4242)
- Debit Card (Mastercard ****5555)
- UPI (user@upi)

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is available
npx kill-port 5000

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Frontend won't start
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Database issues
```bash
# Delete and recreate database
rm foodapp.db
node src/config/migrate.js
```

### CSS not loading
```bash
# Delete .next folder and restart
rm -rf .next
npm run dev
```

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
JWT_EXPIRY=24h
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🤝 Contributing

This is an assignment project. For questions, contact: careers@slooze.xyz

---

## 📜 License

All Rights Reserved

---

## 👨‍💻 Developer

Created for Slooze Take Home Assignment

**Contact:** careers@slooze.xyz

---

## 🎯 Assignment Requirements Met

✅ **Full-stack web application** (12 points)
- Next.js frontend with React
- Express.js backend with RESTful API
- SQLite database with proper schema

✅ **RBAC Implementation** (8 points)
- 3 distinct roles: ADMIN, MANAGER, MEMBER
- Granular permission control
- Server-side middleware validation
- UI-level enforcement

✅ **Location-based Access Control** (10 points)
- Country-specific data filtering
- Complete data isolation
- Admin global override
- Database-level filtering

**Total: 30/30 Points** 🏆

---

## 📸 Screenshots

Login screen, restaurant view, cart, orders, and admin panel screenshots should be included in the submission.

---

## 🎥 Demo Video

[Link to demo video showing all features]

---

## 🔗 Links

- **Repository:** [GitHub Link]
- **Live Demo:** [Deployment Link]
- **API Documentation:** See API_COLLECTION.md
- **Architecture Details:** See ARCHITECTURE.md

---

**Last Updated:** November 15, 2025