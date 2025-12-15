/**
 * =====================================================
 * XHETON v0.0.016 - Stock Management Utility
 * Module Architecture Integrity - Stock Validation & Movements
 * =====================================================
 * Enforces:
 * 1. Sales cannot happen if stock < quantity requested
 * 2. Purchase Orders do not affect stock until GRN is confirmed
 * 3. Stock movements must record: product, quantity, warehouse, type, date, reference
 */

import { query, getClient } from './db';

/**
 * Get current stock level for a product in a warehouse
 */
export async function getCurrentStock(productId, warehouseId) {
  try {
    const res = await query(
      `SELECT current_stock FROM products WHERE id = $1 AND deleted_at IS NULL`,
      [productId]
    );
    
    if (res.rowCount === 0) {
      return { error: 'Product not found', stock: 0 };
    }
    
    return { success: true, stock: parseInt(res.rows[0].current_stock) || 0 };
  } catch (err) {
    console.error('Error fetching current stock:', err.message);
    return { error: err.message, stock: 0 };
  }
}

/**
 * Validate if sale can proceed (stock >= quantity)
 */
export async function validateSaleQuantity(productId, requestedQuantity) {
  const stockResult = await getCurrentStock(productId);
  
  if (stockResult.error) {
    return { valid: false, error: stockResult.error };
  }
  
  if (stockResult.stock < requestedQuantity) {
    return { 
      valid: false, 
      error: `Insufficient stock. Available: ${stockResult.stock}, Requested: ${requestedQuantity}` 
    };
  }
  
  return { valid: true, availableStock: stockResult.stock };
}

/**
 * Record stock movement (in/out)
 * Types: 'purchase_grn', 'sales_order', 'inventory_adjustment', 'return', 'transfer'
 */
export async function recordStockMovement(data) {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    const {
      productId,
      quantity,
      warehouseId,
      type, // purchase_grn, sales_order, inventory_adjustment, return, transfer
      referenceId, // ID of GRN, SO, PO, etc.
      referenceTable, // goods_received_notes, sales_orders, purchase_orders, etc.
      notes,
      createdBy
    } = data;
    
    // Validate type
    const validTypes = ['purchase_grn', 'sales_order', 'inventory_adjustment', 'return', 'transfer'];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid movement type: ${type}`);
    }
    
    // Insert stock movement
    const res = await client.query(
      `INSERT INTO stock_movements 
       (product_id, warehouse_id, quantity, movement_type, reference_id, reference_table, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [productId, warehouseId, quantity, type, referenceId, referenceTable, notes, createdBy]
    );
    
    await client.query('COMMIT');
    
    return { success: true, movement: res.rows[0] };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error recording stock movement:', err.message);
    return { error: err.message };
  } finally {
    client.release();
  }
}

/**
 * Update product stock (used when GRN is confirmed or Sale is completed)
 * direction: 'in' (GRN) or 'out' (Sale)
 */
export async function updateProductStock(productId, quantity, direction) {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    if (direction === 'in') {
      // Increase stock for GRN
      await client.query(
        `UPDATE products 
         SET current_stock = current_stock + $1, updated_at = NOW()
         WHERE id = $2`,
        [quantity, productId]
      );
    } else if (direction === 'out') {
      // Decrease stock for Sale
      const checkRes = await client.query(
        `SELECT current_stock FROM products WHERE id = $1`,
        [productId]
      );
      
      if (checkRes.rowCount === 0) {
        throw new Error('Product not found');
      }
      
      const currentStock = parseInt(checkRes.rows[0].current_stock) || 0;
      if (currentStock < quantity) {
        throw new Error(`Insufficient stock. Available: ${currentStock}, Required: ${quantity}`);
      }
      
      await client.query(
        `UPDATE products 
         SET current_stock = current_stock - $1, updated_at = NOW()
         WHERE id = $2`,
        [quantity, productId]
      );
    } else {
      throw new Error(`Invalid direction: ${direction}`);
    }
    
    await client.query('COMMIT');
    
    return { success: true };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating product stock:', err.message);
    return { error: err.message };
  } finally {
    client.release();
  }
}

/**
 * Get price history for a product (for sales validation)
 */
export async function getPriceHistory(productId, limit = 10) {
  try {
    const res = await query(
      `SELECT id, price_type, old_price, new_price, effective_date, created_at
       FROM product_price_history
       WHERE product_id = $1
       ORDER BY effective_date DESC
       LIMIT $2`,
      [productId, limit]
    );
    
    return { success: true, history: res.rows };
  } catch (err) {
    console.error('Error fetching price history:', err.message);
    return { error: err.message, history: [] };
  }
}

/**
 * Get current selling price for a product
 */
export async function getCurrentPrice(productId) {
  try {
    const res = await query(
      `SELECT selling_price FROM products WHERE id = $1 AND deleted_at IS NULL`,
      [productId]
    );
    
    if (res.rowCount === 0) {
      return { error: 'Product not found', price: 0 };
    }
    
    return { success: true, price: parseFloat(res.rows[0].selling_price) || 0 };
  } catch (err) {
    console.error('Error fetching current price:', err.message);
    return { error: err.message, price: 0 };
  }
}

export const stockManager = {
  getCurrentStock,
  validateSaleQuantity,
  recordStockMovement,
  updateProductStock,
  getPriceHistory,
  getCurrentPrice
};
