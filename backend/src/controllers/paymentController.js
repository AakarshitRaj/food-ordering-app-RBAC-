const pool = require('../config/db');

const getPaymentMethods = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payment_methods ORDER BY id');

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

module.exports = { getPaymentMethods };