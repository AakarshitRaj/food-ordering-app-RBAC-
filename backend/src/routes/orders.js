const express = require('express');
const router = express.Router();
const { getOrders, createOrder, cancelOrder } = require('../controllers/orderController');
const authenticate = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');

router.get('/', authenticate, getOrders);
router.post('/', authenticate, checkPermission('place_order'), createOrder);
router.delete('/:id', authenticate, checkPermission('cancel_order'), cancelOrder);

module.exports = router;