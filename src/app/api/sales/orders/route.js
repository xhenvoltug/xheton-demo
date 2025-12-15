import { NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';
import { stockManager } from '@/lib/stock-manager';

/**
 * POST /api/sales/orders
 * Create a new sales order with stock validation
 */
export async function POST(request) {
  let client;
  try {
    const body = await request.json();
    const {
      customer_id,
      order_date,
      items, // Array of { product_id, quantity, unit_price }
      salesperson_id,
      notes,
      delivery_address
    } = body;

    if (!customer_id || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'customer_id and items are required' },
        { status: 400 }
      );
    }

    client = await getClient();
    await client.query('BEGIN');

    // Validate stock for all items
    for (const item of items) {
      const stockCheck = await stockManager.validateSaleQuantity(item.product_id, item.quantity);
      if (!stockCheck.valid) {
        await client.query('ROLLBACK');
        client.release();
        return NextResponse.json(
          { success: false, error: stockCheck.error },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    let subtotal = 0;
    let tax_amount = 0;
    
    for (const item of items) {
      const lineTotal = item.quantity * item.unit_price;
      subtotal += lineTotal;
      
      // Get product tax rate
      const prodRes = await client.query(
        'SELECT tax_rate FROM products WHERE id = $1',
        [item.product_id]
      );
      
      if (prodRes.rowCount > 0) {
        const taxRate = parseFloat(prodRes.rows[0].tax_rate) || 0;
        tax_amount += lineTotal * (taxRate / 100);
      }
    }

    const total_amount = subtotal + tax_amount;

    // Create sales order
    const orderRes = await client.query(
      `INSERT INTO sales_orders 
       (customer_id, order_date, subtotal, tax_amount, total_amount, salesperson_id, delivery_address, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [customer_id, order_date, subtotal, tax_amount, total_amount, salesperson_id || null, delivery_address, notes, null]
    );

    const orderId = orderRes.rows[0].id;

    // Insert order items and update stock
    for (const item of items) {
      // Insert line item
      await client.query(
        `INSERT INTO sales_order_items 
         (order_id, product_id, quantity, unit_price, line_total)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.product_id, item.quantity, item.unit_price, item.quantity * item.unit_price]
      );

      // Decrease stock
      await client.query(
        `UPDATE products 
         SET current_stock = current_stock - $1, updated_at = NOW()
         WHERE id = $2`,
        [item.quantity, item.product_id]
      );

      // Record stock movement
      await client.query(
        `INSERT INTO stock_movements 
         (product_id, quantity, movement_type, reference_id, reference_table, created_by)
         VALUES ($1, $2, 'sales_order', $3, 'sales_orders', $4)`,
        [item.product_id, item.quantity, orderId, user.id]
      );
    }

    await client.query('COMMIT');
    
    return NextResponse.json(
      { success: true, order: orderRes.rows[0] },
      { status: 201 }
    );
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK');
      client.release();
    }
    console.error('POST /api/sales/orders error:', err.message);
    return NextResponse.json(
      { success: false, error: 'Failed to create sales order', message: err.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
