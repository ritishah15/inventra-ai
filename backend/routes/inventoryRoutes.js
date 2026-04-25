const express = require('express');
const { getProducts, createProduct } = require('../controllers/productController');
const { createReceipt, createDelivery, createTransfer, getDashboardData } = require('../controllers/inventoryController');
const { authenticateToken, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken); // Protect all routes in inventory

// Products
router.get('/products', getProducts);
router.post('/products', createProduct);

// Inventory Operations
router.post('/receipts', createReceipt);
router.post('/deliveries', createDelivery);
router.post('/transfers', createTransfer);

// Dashboards
router.get('/dashboard', getDashboardData);

// Admin Only routes
router.get('/admin/logs', checkRole('admin'), (req, res) => {
    // Return ledger or suspicious activity
    res.json({ message: 'Admin Data' });
});

module.exports = router;
