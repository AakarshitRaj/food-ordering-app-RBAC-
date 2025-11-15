const express = require('express');
const router = express.Router();
const { getRestaurants, getRestaurantById, getMenuItems } = require('../controllers/restaurantController');
const authenticate = require('../middleware/auth');
const { checkPermission, filterByCountry } = require('../middleware/rbac');

router.get('/', authenticate, checkPermission('view_restaurants'), filterByCountry, getRestaurants);
router.get('/:id', authenticate, checkPermission('view_restaurants'), filterByCountry, getRestaurantById);
router.get('/:id/menu', authenticate, checkPermission('view_restaurants'), filterByCountry, getMenuItems);

module.exports = router;