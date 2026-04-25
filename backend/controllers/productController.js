const pool = require('../db/database');

const getProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name, COALESCE(SUM(i.quantity), 0) as total_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN inventory i ON p.id = i.product_id
      GROUP BY p.id, c.name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, sku, category_id, unit, reorder_level } = req.body;
    const result = await pool.query(
      'INSERT INTO products (name, sku, category_id, unit, reorder_level) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, sku, category_id, unit, reorder_level]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProducts, createProduct };
