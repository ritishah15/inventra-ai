const pool = require('../db/database');

const createReceipt = async (req, res) => {
  try {
    const { supplier, items, location_id } = req.body; // items: [{product_id, quantity}]
    
    // Using transaction
    await pool.query('BEGIN');
    
    // Add receipt record
    const receiptRes = await pool.query('INSERT INTO receipts (supplier) VALUES ($1) RETURNING id', [supplier]);
    
    for (const item of items) {
      // Upsert inventory
      await pool.query(`
        INSERT INTO inventory (product_id, location_id, quantity) 
        VALUES ($1, $2, $3)
        ON CONFLICT (product_id, location_id) DO UPDATE SET quantity = inventory.quantity + EXCLUDED.quantity
      `, [item.product_id, location_id, item.quantity]);
      
      // Stock ledger
      await pool.query(
        'INSERT INTO stock_ledger (product_id, location_id, operation_type, quantity_change, user_id) VALUES ($1, $2, $3, $4, $5)',
        [item.product_id, location_id, 'RECEIPT', item.quantity, req.user.id]
      );
    }
    
    await pool.query('COMMIT');
    req.app.get('io').emit('inventoryUpdated'); // Real-time
    res.json({ message: 'Receipt completed' });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
};

const createDelivery = async (req, res) => {
  try {
    const { customer, items, location_id } = req.body;
    
    await pool.query('BEGIN');
    await pool.query('INSERT INTO deliveries (customer) VALUES ($1)', [customer]);
    
    for (const item of items) {
      // Check stock before delivery
      const stockRes = await pool.query('SELECT quantity FROM inventory WHERE product_id = $1 AND location_id = $2', [item.product_id, location_id]);
      const currentStock = stockRes.rows.length > 0 ? stockRes.rows[0].quantity : 0;
      
      if (currentStock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.product_id}`);
      }
      
      // Update inventory (transaction ensures safe concurrent modification if lock was applied, but we leave simple for demo)
      await pool.query('UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2 AND location_id = $3', [item.quantity, item.product_id, location_id]);
      
      // Stock Ledger
      await pool.query(
        'INSERT INTO stock_ledger (product_id, location_id, operation_type, quantity_change, user_id) VALUES ($1, $2, $3, $4, $5)',
        [item.product_id, location_id, 'DELIVERY', -item.quantity, req.user.id]
      );
    }
    
    await pool.query('COMMIT');
    req.app.get('io').emit('inventoryUpdated');
    res.json({ message: 'Delivery completed' });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(400).json({ error: error.message });
  }
};

const createTransfer = async (req, res) => {
  try {
    const { source_location, destination_location, items } = req.body;
    
    await pool.query('BEGIN');
    await pool.query('INSERT INTO transfers (source_location, destination_location) VALUES ($1, $2)', [source_location, destination_location]);
    
    for (const item of items) {
      const stockRes = await pool.query('SELECT quantity FROM inventory WHERE product_id = $1 AND location_id = $2', [item.product_id, source_location]);
      const currentStock = stockRes.rows.length > 0 ? stockRes.rows[0].quantity : 0;
      if (currentStock < item.quantity) {
        throw new Error('Insufficient stock at source location');
      }
      
      // Decrement source
      await pool.query('UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2 AND location_id = $3', [item.quantity, item.product_id, source_location]);
      // Upsert destination
      await pool.query(`
        INSERT INTO inventory (product_id, location_id, quantity) VALUES ($1, $2, $3)
        ON CONFLICT (product_id, location_id) DO UPDATE SET quantity = inventory.quantity + EXCLUDED.quantity
      `, [item.product_id, destination_location, item.quantity]);
      
      // Ledger out
      await pool.query('INSERT INTO stock_ledger (product_id, location_id, operation_type, quantity_change, user_id) VALUES ($1, $2, $3, $4, $5)', [item.product_id, source_location, 'TRANSFER', -item.quantity, req.user.id]);
      // Ledger in
      await pool.query('INSERT INTO stock_ledger (product_id, location_id, operation_type, quantity_change, user_id) VALUES ($1, $2, $3, $4, $5)', [item.product_id, destination_location, 'TRANSFER', item.quantity, req.user.id]);
    }
    
    await pool.query('COMMIT');
    req.app.get('io').emit('inventoryUpdated');
    res.json({ message: 'Transfer completed' });
  } catch(error) {
    await pool.query('ROLLBACK');
    res.status(400).json({ error: error.message });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const stockRes = await pool.query('SELECT COALESCE(SUM(quantity), 0) as total FROM inventory');
    const totalStock = stockRes.rows[0].total;
    
    const lowStockRes = await pool.query(`
      SELECT p.name, p.reorder_level, COALESCE(SUM(i.quantity), 0) as current
      FROM products p
      LEFT JOIN inventory i ON p.id = i.product_id
      GROUP BY p.id
      HAVING COALESCE(SUM(i.quantity), 0) < p.reorder_level
    `);
    
    // Smart AI Predictions (Average 30 day usage)
    const usageRes = await pool.query(`
      SELECT l.product_id, p.name, p.reorder_level, sum(abs(l.quantity_change)) as usages
      FROM stock_ledger l
      JOIN products p ON p.id = l.product_id
      WHERE l.operation_type = 'DELIVERY' AND l.created_at >= datetime('now', '-30 days')
      GROUP BY l.product_id, p.name, p.reorder_level
    `);
    
    // Calculate AI prediction
    const aiPredictions = usageRes.rows.map(item => {
      const avgDaily = item.usages / 30;
      // get current stock for this item
      // simplified calculation to illustrate AI feature
      return { 
        name: item.name, 
        avgDaily: Number(avgDaily.toFixed(2)),
        recommendedOrder: Math.ceil(avgDaily * 30),
      };
    });
    
    res.json({ totalStock, lowStockItems: lowStockRes.rows, aiPredictions });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createReceipt, createDelivery, createTransfer, getDashboardData };
