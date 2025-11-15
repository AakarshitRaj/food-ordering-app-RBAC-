# 📊 Datasets Documentation

Complete documentation of all sample data used in the Food Ordering Application.

---

## Table of Contents
1. [Users Dataset](#users-dataset)
2. [Restaurants Dataset](#restaurants-dataset)
3. [Menu Items Dataset](#menu-items-dataset)
4. [Payment Methods Dataset](#payment-methods-dataset)
5. [Sample Orders](#sample-orders)
6. [Data Generation Script](#data-generation-script)

---

## Users Dataset

### Overview
6 pre-configured users representing different roles and countries for comprehensive RBAC testing.

### User Records

| ID | Username | Password | Name | Role | Country | Purpose |
|----|----------|----------|------|------|---------|---------|
| 1 | nick.fury | admin123 | Nick Fury | ADMIN | null | Global admin access |
| 2 | captain.marvel | manager123 | Captain Marvel | MANAGER | India | India manager |
| 3 | captain.america | manager123 | Captain America | MANAGER | America | America manager |
| 4 | thanos | member123 | Thanos | MEMBER | India | India team member |
| 5 | thor | member123 | Thor | MEMBER | India | India team member |
| 6 | travis | member123 | Travis | MEMBER | America | America team member |

### Password Hashing
All passwords are hashed using bcrypt with 10 salt rounds before storage.

**Example:**
```javascript
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash('admin123', 10);
// Stored: $2a$10$... (60 characters)
```

### User Testing Matrix

| User | Can View | Can Order | Can Cancel | Can Update Payment | Global Access |
|------|----------|-----------|------------|-------------------|---------------|
| nick.fury | ✅ All | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| captain.marvel | ✅ India | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| captain.america | ✅ America | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| thanos | ✅ India | ❌ No | ❌ No | ❌ No | ❌ No |
| thor | ✅ India | ❌ No | ❌ No | ❌ No | ❌ No |
| travis | ✅ America | ❌ No | ❌ No | ❌ No | ❌ No |

---

## Restaurants Dataset

### Overview
4 restaurants distributed across 2 countries (India and America) for location-based filtering testing.

### Restaurant Records

#### India Restaurants

**1. Spice Garden**
```json
{
  "id": 1,
  "name": "Spice Garden",
  "country": "India",
  "cuisine": "Indian",
  "description": "Authentic North Indian cuisine with a modern twist"
}
```

**2. Dosa Corner**
```json
{
  "id": 2,
  "name": "Dosa Corner",
  "country": "India",
  "cuisine": "South Indian",
  "description": "Traditional South Indian dishes and crispy dosas"
}
```

#### America Restaurants

**3. American Diner**
```json
{
  "id": 3,
  "name": "American Diner",
  "country": "America",
  "cuisine": "American",
  "description": "Classic American comfort food"
}
```

**4. Pizza Palace**
```json
{
  "id": 4,
  "name": "Pizza Palace",
  "country": "America",
  "cuisine": "Italian-American",
  "description": "Fresh pizzas and Italian specialties"
}
```

### Geographic Distribution

```
India (2 restaurants)
├── Spice Garden (Indian)
└── Dosa Corner (South Indian)

America (2 restaurants)
├── American Diner (American)
└── Pizza Palace (Italian-American)
```

---

## Menu Items Dataset

### Overview
14 menu items distributed across 4 restaurants with varied pricing and cuisines.

### Spice Garden Menu (India)

| ID | Item Name | Price | Currency | Category | Vegetarian | Description |
|----|-----------|-------|----------|----------|------------|-------------|
| 1 | Butter Chicken | ₹350 | INR | Main Course | No | Creamy tomato curry with tender chicken |
| 2 | Paneer Tikka | ₹280 | INR | Appetizer | Yes | Grilled cottage cheese with spices |
| 3 | Biryani | ₹320 | INR | Main Course | No | Aromatic basmati rice with spices |
| 4 | Naan | ₹50 | INR | Bread | Yes | Traditional Indian bread |

**Total Items:** 4  
**Price Range:** ₹50 - ₹350  
**Average Price:** ₹250

### Dosa Corner Menu (India)

| ID | Item Name | Price | Currency | Category | Vegetarian | Description |
|----|-----------|-------|----------|----------|------------|-------------|
| 5 | Masala Dosa | ₹120 | INR | Main Course | Yes | Crispy rice crepe with potato filling |
| 6 | Idli Sambar | ₹80 | INR | Breakfast | Yes | Steamed rice cakes with lentil soup |
| 7 | Vada | ₹60 | INR | Snack | Yes | Fried lentil donuts |

**Total Items:** 3  
**Price Range:** ₹60 - ₹120  
**Average Price:** ₹87

### American Diner Menu (America)

| ID | Item Name | Price | Currency | Category | Vegetarian | Description |
|----|-----------|-------|----------|----------|------------|-------------|
| 8 | Classic Burger | $12 | USD | Main Course | No | Beef patty with cheese and lettuce |
| 9 | Hot Dog | $8 | USD | Main Course | No | Grilled sausage in a bun |
| 10 | French Fries | $5 | USD | Side | Yes | Crispy golden fries |
| 11 | Milkshake | $6 | USD | Beverage | Yes | Creamy vanilla shake |

**Total Items:** 4  
**Price Range:** $5 - $12  
**Average Price:** $7.75

### Pizza Palace Menu (America)

| ID | Item Name | Price | Currency | Category | Vegetarian | Description |
|----|-----------|-------|----------|----------|------------|-------------|
| 12 | Pepperoni Pizza | $18 | USD | Main Course | No | Classic pepperoni with mozzarella |
| 13 | Veggie Supreme | $16 | USD | Main Course | Yes | Loaded with fresh vegetables |
| 14 | Garlic Bread | $7 | USD | Side | Yes | Toasted bread with garlic butter |

**Total Items:** 3  
**Price Range:** $7 - $18  
**Average Price:** $13.67

### Menu Statistics

| Country | Restaurants | Total Items | Avg Price |
|---------|------------|-------------|-----------|
| India | 2 | 7 | ₹165 |
| America | 2 | 7 | $10.29 |

### Currency Breakdown

- **INR Items:** 7 (50%)
- **USD Items:** 7 (50%)

### Category Distribution

| Category | Count | Percentage |
|----------|-------|------------|
| Main Course | 8 | 57% |
| Appetizer | 1 | 7% |
| Snack | 1 | 7% |
| Side | 2 | 14% |
| Beverage | 1 | 7% |
| Bread | 1 | 7% |

---

## Payment Methods Dataset

### Overview
3 payment methods representing different payment types.

### Payment Method Records

**1. Credit Card (Visa)**
```json
{
  "id": 1,
  "type": "Credit Card",
  "last4": "4242",
  "brand": "Visa",
  "identifier": null
}
```

**2. Debit Card (Mastercard)**
```json
{
  "id": 2,
  "type": "Debit Card",
  "last4": "5555",
  "brand": "Mastercard",
  "identifier": null
}
```

**3. UPI**
```json
{
  "id": 3,
  "type": "UPI",
  "last4": null,
  "brand": null,
  "identifier": "user@upi"
}
```

### Payment Method Usage

| Type | Suitable For | Countries |
|------|-------------|-----------|
| Credit Card | International | India, America |
| Debit Card | Domestic/International | India, America |
| UPI | Domestic only | India |

---

## Sample Orders

### Example Order Structure

```json
{
  "id": 1,
  "user_id": 2,
  "country": "India",
  "status": "Confirmed",
  "total": 850,
  "currency": "INR",
  "payment_method": {
    "id": 1,
    "type": "Credit Card",
    "last4": "4242",
    "brand": "Visa"
  },
  "items": [
    {
      "restaurant_id": 1,
      "restaurant_name": "Spice Garden",
      "item_name": "Butter Chicken",
      "quantity": 2,
      "price": 350
    },
    {
      "restaurant_id": 1,
      "restaurant_name": "Spice Garden",
      "item_name": "Naan",
      "quantity": 3,
      "price": 50
    }
  ],
  "created_at": "2025-11-15T10:30:00.000Z"
}
```

### Sample Order Scenarios

#### Scenario 1: India Manager Order
```
User: captain.marvel (MANAGER, India)
Restaurant: Spice Garden
Items:
  - Butter Chicken x 2 (₹700)
  - Paneer Tikka x 1 (₹280)
  - Naan x 4 (₹200)
Total: ₹1,180
Payment: Credit Card ****4242
Status: Confirmed
```

#### Scenario 2: America Manager Order
```
User: captain.america (MANAGER, America)
Restaurant: American Diner
Items:
  - Classic Burger x 3 ($36)
  - French Fries x 3 ($15)
  - Milkshake x 2 ($12)
Total: $63
Payment: Debit Card ****5555
Status: Confirmed
```

#### Scenario 3: Admin Multi-Restaurant Order
```
User: nick.fury (ADMIN, Global)
Restaurants: Spice Garden + Pizza Palace
Items:
  - Butter Chicken x 1 (₹350)
  - Pepperoni Pizza x 1 ($18)
Total: Mixed currency (₹350 + $18)
Note: In production, would need currency conversion
Status: Confirmed
```

---

## Data Generation Script

### Database Seeding Code

The migration script (`src/config/migrate.js`) automatically seeds all data:

```javascript
// User seeding
const users = [
  { username: 'nick.fury', password: 'admin123', name: 'Nick Fury', role: 'ADMIN', country: null },
  { username: 'captain.marvel', password: 'manager123', name: 'Captain Marvel', role: 'MANAGER', country: 'India' },
  // ... more users
];

for (const user of users) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  await db.query(
    'INSERT INTO users (username, password_hash, name, role, country) VALUES (?, ?, ?, ?, ?)',
    [user.username, hashedPassword, user.name, user.role, user.country]
  );
}

// Restaurant seeding
const restaurants = [
  { name: 'Spice Garden', country: 'India', cuisine: 'Indian' },
  { name: 'Dosa Corner', country: 'India', cuisine: 'South Indian' },
  // ... more restaurants
];

for (const restaurant of restaurants) {
  await db.query(
    'INSERT INTO restaurants (name, country, cuisine) VALUES (?, ?, ?)',
    [restaurant.name, restaurant.country, restaurant.cuisine]
  );
}

// Menu items seeding
const menuItems = [
  { restaurant_id: 1, name: 'Butter Chicken', price: 350, currency: 'INR', description: '...' },
  // ... more items
];

for (const item of menuItems) {
  await db.query(
    'INSERT INTO menu_items (restaurant_id, name, price, currency, description) VALUES (?, ?, ?, ?, ?)',
    [item.restaurant_id, item.name, item.price, item.currency, item.description]
  );
}
```

### Running the Seed Script

```bash
cd backend
node src/config/migrate.js
```

**Output:**
```
🚀 Starting database migration...
✅ Users table created
✅ Restaurants table created
✅ Menu items table created
✅ Orders table created
✅ Order items table created
✅ Payment methods table created
✅ Users seeded (6 users)
✅ Restaurants seeded (4 restaurants)
✅ Menu items seeded (14 items)
✅ Payment methods seeded (3 methods)
🎉 Migration completed successfully!
```

---

## Data Validation Rules

### User Data
- Username: Unique, 3-50 characters
- Password: Minimum 6 characters (hashed)
- Role: Must be ADMIN, MANAGER, or MEMBER
- Country: Required for MANAGER and MEMBER, null for ADMIN

### Restaurant Data
- Name: Required, 1-100 characters
- Country: Required, India or America
- Cuisine: Required, descriptive string

### Menu Item Data
- Name: Required, 1-100 characters
- Price: Required, positive number
- Currency: Required, INR or USD
- Description: Optional, max 500 characters

### Order Data
- User ID: Must exist in users table
- Country: Must match user's country (except ADMIN)
- Total: Calculated from items
- Status: Confirmed, Pending, or Cancelled

---

## Data Export Formats

### JSON Export

```json
{
  "users": [...],
  "restaurants": [...],
  "menu_items": [...],
  "payment_methods": [...]
}
```

### CSV Export (Users)

```csv
id,username,name,role,country
1,nick.fury,Nick Fury,ADMIN,
2,captain.marvel,Captain Marvel,MANAGER,India
3,captain.america,Captain America,MANAGER,America
```

### CSV Export (Menu Items)

```csv
id,restaurant_id,name,price,currency,description
1,1,Butter Chicken,350,INR,Creamy tomato curry with tender chicken
2,1,Paneer Tikka,280,INR,Grilled cottage cheese with spices
```

---

## Data Relationships

### User → Orders (One-to-Many)
```
User (id: 2, captain.marvel)
  └─→ Order (id: 1, total: ₹850)
  └─→ Order (id: 2, total: ₹320)
  └─→ Order (id: 3, total: ₹600)
```

### Restaurant → Menu Items (One-to-Many)
```
Restaurant (id: 1, Spice Garden)
  └─→ Menu Item (id: 1, Butter Chicken)
  └─→ Menu Item (id: 2, Paneer Tikka)
  └─→ Menu Item (id: 3, Biryani)
  └─→ Menu Item (id: 4, Naan)
```

### Order → Order Items (One-to-Many)
```
Order (id: 1)
  └─→ Order Item (Butter Chicken x 2)
  └─→ Order Item (Naan x 3)
```

---

## Data Statistics Summary

| Entity | Total Records | India | America | Global |
|--------|--------------|-------|---------|--------|
| Users | 6 | 3 | 1 | 1 |
| Restaurants | 4 | 2 | 2 | - |
| Menu Items | 14 | 7 | 7 | - |
| Payment Methods | 3 | - | - | 3 |

### Price Statistics

**India (INR):**
- Min: ₹50
- Max: ₹350
- Average: ₹165

**America (USD):**
- Min: $5
- Max: $18
- Average: $10.29

---

## Testing Recommendations

1. **Test with each user type** to verify access controls
2. **Test cross-country restrictions** (India user cannot see America data)
3. **Test order placement** with different roles
4. **Test payment methods** selection
5. **Verify data integrity** after operations

---

## Data Reset

To reset the database and reseed:

```bash
cd backend
rm foodapp.db
node src/config/migrate.js
```

This will:
1. Delete existing database
2. Create fresh tables
3. Seed all sample data
4. Ready for testing

---

**Last Updated:** November 15, 2025  
**Database File:** `backend/foodapp.db`  
**Total Records:** 27 (6 users + 4 restaurants + 14 menu items + 3 payment methods)