const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, '../../foodapp.db');
const db = new Database(dbPath);

async function migrate() {
  try {
    console.log('🚀 Starting database migration...');

    // Drop existing tables
    db.exec(`
      DROP TABLE IF EXISTS order_items;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS menu_items;
      DROP TABLE IF EXISTS restaurants;
      DROP TABLE IF EXISTS payment_methods;
      DROP TABLE IF EXISTS users;
    `);

    // Create users table
    db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('ADMIN', 'MANAGER', 'MEMBER')),
        country TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Create restaurants table
    db.exec(`
      CREATE TABLE restaurants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        country TEXT NOT NULL,
        cuisine TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Restaurants table created');

    // Create menu_items table
    db.exec(`
      CREATE TABLE menu_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        restaurant_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        currency TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Menu items table created');

    // Create orders table
    db.exec(`
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
      )
    `);
    console.log('✅ Orders table created');

    // Create order_items table
    db.exec(`
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
      )
    `);
    console.log('✅ Order items table created');

    // Create payment_methods table
    db.exec(`
      CREATE TABLE payment_methods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        last4 TEXT,
        brand TEXT,
        identifier TEXT
      )
    `);
    console.log('✅ Payment methods table created');

    // Insert users
    const users = [
      { username: 'nick.fury', password: 'admin123', name: 'Nick Fury', role: 'ADMIN', country: null },
      { username: 'captain.marvel', password: 'manager123', name: 'Captain Marvel', role: 'MANAGER', country: 'India' },
      { username: 'captain.america', password: 'manager123', name: 'Captain America', role: 'MANAGER', country: 'America' },
      { username: 'thanos', password: 'member123', name: 'Thanos', role: 'MEMBER', country: 'India' },
      { username: 'thor', password: 'member123', name: 'Thor', role: 'MEMBER', country: 'India' },
      { username: 'travis', password: 'member123', name: 'Travis', role: 'MEMBER', country: 'America' }
    ];

    const insertUser = db.prepare('INSERT INTO users (username, password_hash, name, role, country) VALUES (?, ?, ?, ?, ?)');
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      insertUser.run(user.username, hashedPassword, user.name, user.role, user.country);
    }
    console.log('✅ Users seeded');

    // Insert restaurants
    const restaurants = [
      { name: 'Spice Garden', country: 'India', cuisine: 'Indian' },
      { name: 'Dosa Corner', country: 'India', cuisine: 'South Indian' },
      { name: 'American Diner', country: 'America', cuisine: 'American' },
      { name: 'Pizza Palace', country: 'America', cuisine: 'Italian-American' }
    ];

    const insertRestaurant = db.prepare('INSERT INTO restaurants (name, country, cuisine) VALUES (?, ?, ?)');
    for (const restaurant of restaurants) {
      insertRestaurant.run(restaurant.name, restaurant.country, restaurant.cuisine);
    }
    console.log('✅ Restaurants seeded');

    // Insert menu items
    const menuItems = [
      { restaurant_id: 1, name: 'Butter Chicken', price: 350, currency: 'INR', description: 'Creamy tomato curry with tender chicken' },
      { restaurant_id: 1, name: 'Paneer Tikka', price: 280, currency: 'INR', description: 'Grilled cottage cheese with spices' },
      { restaurant_id: 1, name: 'Biryani', price: 320, currency: 'INR', description: 'Aromatic basmati rice with spices' },
      { restaurant_id: 1, name: 'Naan', price: 50, currency: 'INR', description: 'Traditional Indian bread' },
      { restaurant_id: 2, name: 'Masala Dosa', price: 120, currency: 'INR', description: 'Crispy rice crepe with potato filling' },
      { restaurant_id: 2, name: 'Idli Sambar', price: 80, currency: 'INR', description: 'Steamed rice cakes with lentil soup' },
      { restaurant_id: 2, name: 'Vada', price: 60, currency: 'INR', description: 'Fried lentil donuts' },
      { restaurant_id: 3, name: 'Classic Burger', price: 12, currency: 'USD', description: 'Beef patty with cheese and lettuce' },
      { restaurant_id: 3, name: 'Hot Dog', price: 8, currency: 'USD', description: 'Grilled sausage in a bun' },
      { restaurant_id: 3, name: 'French Fries', price: 5, currency: 'USD', description: 'Crispy golden fries' },
      { restaurant_id: 3, name: 'Milkshake', price: 6, currency: 'USD', description: 'Creamy vanilla shake' },
      { restaurant_id: 4, name: 'Pepperoni Pizza', price: 18, currency: 'USD', description: 'Classic pepperoni with mozzarella' },
      { restaurant_id: 4, name: 'Veggie Supreme', price: 16, currency: 'USD', description: 'Loaded with fresh vegetables' },
      { restaurant_id: 4, name: 'Garlic Bread', price: 7, currency: 'USD', description: 'Toasted bread with garlic butter' }
    ];

    const insertMenuItem = db.prepare('INSERT INTO menu_items (restaurant_id, name, price, currency, description) VALUES (?, ?, ?, ?, ?)');
    for (const item of menuItems) {
      insertMenuItem.run(item.restaurant_id, item.name, item.price, item.currency, item.description);
    }
    console.log('✅ Menu items seeded');

    // Insert payment methods
    const paymentMethods = [
      { type: 'Credit Card', last4: '4242', brand: 'Visa', identifier: null },
      { type: 'Debit Card', last4: '5555', brand: 'Mastercard', identifier: null },
      { type: 'UPI', last4: null, brand: null, identifier: 'user@upi' }
    ];

    const insertPayment = db.prepare('INSERT INTO payment_methods (type, last4, brand, identifier) VALUES (?, ?, ?, ?)');
    for (const method of paymentMethods) {
      insertPayment.run(method.type, method.last4, method.brand, method.identifier);
    }
    console.log('✅ Payment methods seeded');

    console.log('🎉 Migration completed successfully!');
    console.log(`📁 Database file created at: ${dbPath}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();