const express = require('express');
const router = express.Router();
const { getPaymentMethods } = require('../controllers/paymentController');
const authenticate = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');

router.get('/', authenticate, checkPermission('update_payment'), getPaymentMethods);

module.exports = router;