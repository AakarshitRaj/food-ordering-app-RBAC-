const pool = require('../config/db');

const getOrders = async (req, res) => {
  try {
    const { role, country, id: userId } = req.user;

    let query = 'SELECT * FROM orders';
    let params = [];

    if (role === 'ADMIN') {
      // Admin can see all orders
      query += ' ORDER BY created_at DESC';
    } else {
      // Others see only their country's orders
      query += ' WHERE user_id = ? AND country = ? ORDER BY created_at DESC';
      params = [userId, country];
    }

    const ordersResult = await pool.query(query, params);
    
    // Fetch order items for each order
    const ordersWithItems = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await pool.query(
          'SELECT * FROM order_items WHERE order_id = ?',
          [order.id]
        );
        return {
          ...order,
          items: itemsResult.rows
        };
      })
    );

    res.json({
      success: true,
      data: ordersWithItems
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    const { id: userId, country } = req.user;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty'
      });
    }

    // Calculate total
    let total = 0;
    let currency = items[0].currency;

    items.forEach(item => {
      total += item.price * item.quantity;
    });

    // Create order
    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, country, status, total, currency, payment_method) VALUES (?, ?, ?, ?, ?, ?) RETURNING *',
      [userId, country, 'Confirmed', total, currency, JSON.stringify(paymentMethod)]
    );

    const order = orderResult.rows[0];

    // Create order items
    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, restaurant_id, restaurant_name, item_name, quantity, price) VALUES (?, ?, ?, ?, ?, ?)',
        [order.id, item.restaurantId, item.restaurantName, item.itemName, item.quantity, item.price]
      );
    }

    // Fetch complete order with items
    const itemsResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order.id]
    );

    const completeOrder = {
      ...order,
      items: itemsResult.rows
    };

    res.status(201).json({
      success: true,
      data: completeOrder,
      message: 'Order placed successfully'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, country, id: userId } = req.user;

    // Check if order exists and user has access
    let query = 'SELECT * FROM orders WHERE id = ?';
    let params = [id];

    if (role !== 'ADMIN') {
      query = 'SELECT * FROM orders WHERE id = ? AND user_id = ? AND country = ?';
      params = [id, userId, country];
    }

    const orderResult = await pool.query(query, params);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found or access denied'
      });
    }

    // Delete order (cascade will delete order_items)
    await pool.query('DELETE FROM orders WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel order'
    });
  }
};

module.exports = { getOrders, createOrder, cancelOrder };