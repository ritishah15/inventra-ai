-- Seed initial demo data
INSERT INTO categories (name) VALUES ('Raw Materials'), ('Hardware'), ('Electrical');
INSERT INTO warehouses (name, location) VALUES ('Main Warehouse', 'Zone A'), ('Assembly Store', 'Zone B');
INSERT INTO locations (warehouse_id, rack_name) VALUES (1, 'Rack A1'), (1, 'Rack A2'), (2, 'Rack B1');

INSERT INTO products (name, sku, category_id, unit, reorder_level) VALUES
('Steel Rod', 'SR-1001', 1, 'kg', 50),
('Copper Wire', 'CW-2002', 3, 'meters', 100),
('Plywood', 'PL-3003', 1, 'sheets', 20),
('Aluminum Sheet', 'AS-4004', 1, 'sheets', 40);

INSERT INTO inventory (product_id, location_id, quantity) VALUES
(1, 1, 150),
(2, 2, 500),
(3, 3, 40),
(4, 1, 80);

-- Insert some historical ledger for AI prediction / Charts
INSERT INTO stock_ledger (product_id, location_id, operation_type, quantity_change, created_at) VALUES 
(1, 1, 'RECEIPT', 150, datetime('now', '-10 days')),
(2, 2, 'RECEIPT', 500, datetime('now', '-5 days')),
(1, 1, 'DELIVERY', -10, datetime('now', '-2 days')),
(3, 3, 'RECEIPT', 40, datetime('now', '-15 days'));
