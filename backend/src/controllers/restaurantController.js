const pool = require('../config/db');

const getRestaurants = async (req, res) => {
  try {
    const { countryFilter } = req;

    let query = 'SELECT * FROM restaurants';
    let params = [];

    if (countryFilter) {
      query += ' WHERE country = $1';
      params.push(countryFilter);
    }

    query += ' ORDER BY id';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const { countryFilter } = req;

    let query = 'SELECT * FROM restaurants WHERE id = $1';
    let params = [id];

    if (countryFilter) {
      query += ' AND country = $2';
      params.push(countryFilter);
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found or access denied'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const getMenuItems = async (req, res) => {
  try {
    const { id } = req.params;
    const { countryFilter } = req;

    // First check if restaurant exists and user has access
    let restaurantQuery = 'SELECT * FROM restaurants WHERE id = $1';
    let restaurantParams = [id];

    if (countryFilter) {
      restaurantQuery += ' AND country = $2';
      restaurantParams.push(countryFilter);
    }

    const restaurantResult = await pool.query(restaurantQuery, restaurantParams);

    if (restaurantResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found or access denied'
      });
    }

    // Get menu items
    const menuResult = await pool.query(
      'SELECT * FROM menu_items WHERE restaurant_id = $1 ORDER BY id',
      [id]
    );

    res.json({
      success: true,
      data: menuResult.rows
    });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

module.exports = { getRestaurants, getRestaurantById, getMenuItems };