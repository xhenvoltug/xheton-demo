import { NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';
import { recordStockMovement, getStockBalance } from '@/lib/inventory';

export async function POST(request) {
  let client;
  try {
    const body = await request.json();
    const { customer_id, sale_number, sale_date, warehouse_id, items, notes, payment_method } = body;

    if (!customer_id || !sale_number || !warehouse_id || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    client = await getClient();
    await client.query('BEGIN');

    // Verify stock availability for all items first
    for (const item of items) {
      const { product_id, quantity } = item;
      const balanceRes = await client.query(
        `SELECT COALESCE(SUM(CASE WHEN movement_type = 'IN' THEN quantity ELSE -quantity END), 0) as balance
         FROM stock_movements WHERE product_id = $1 AND to_warehouse_id = $2`,
        [product_id, warehouse_id]
      );
      const balance = parseInt(balanceRes.rows[0].balance, 10);
      if (balance < quantity) {
        await client.query('ROLLBACK');
        client.release();
        return NextResponse.json({ success: false, error: `Insufficient stock for product ${product_id}. Available: ${balance}, Required: ${quantity}` }, { status: 400 });
      }
    }

    // Create sales order
    const soRes = await client.query(
      `INSERT INTO sales_orders (customer_id, sale_number, sale_date, warehouse_id, status, total_amount, notes, created_by, created_at)
       VALUES ($1, $2, $3, $4, 'completed', 0, $5, $6, NOW()) RETURNING *`,
      [customer_id, sale_number, sale_date || new Date(), warehouse_id, notes || null, user.id || null]
    );
    const saleId = soRes.rows[0].id;
    let totalAmount = 0;

    // Process items: record movement, create sale_order_items, record invoice
    for (const item of items) {
      const { product_id, quantity, batch_id } = item;

      // Get current selling price
      const priceRes = await client.query(
        `SELECT selling_price FROM products WHERE id = $1`,
        [product_id]
      );
      const unit_price = priceRes.rows[0]?.selling_price || 0;
      const line_total = unit_price * quantity;
      totalAmount += line_total;

      // Insert sale order item
      await client.query(
        `INSERT INTO sales_order_items (sales_order_id, product_id, quantity, unit_price, line_total, created_by, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [saleId, product_id, quantity, unit_price, line_total, user.id || null]
      );

      // Record stock movement OUT
      await recordStockMovement(client, {
        movement_number: `SALE-${sale_number}-${product_id}`,
        movement_type: 'OUT',
        product_id,
        batch_id: batch_id || null,
        from_warehouse_id: warehouse_id,
        quantity,
        unit_cost: 0,
        reference_type: 'SALE',
        reference_id: saleId,
        notes: `Sale ${sale_number}`,
        created_by: user.id || null
      });
    }

    // Update sale total
    await client.query(
      `UPDATE sales_orders SET total_amount = $1 WHERE id = $2`,
      [totalAmount, saleId]
    );

    // Create invoice automatically
    const invoiceRes = await client.query(
      `INSERT INTO sales_invoices (sales_order_id, invoice_number, invoice_date, amount_due, status, created_by, created_at)
       VALUES ($1, $2, NOW(), $3, 'pending', $4, NOW()) RETURNING *`,
      [saleId, sale_number, totalAmount, user.id || null]
    );

    // Record payment if payment_method provided
    if (payment_method && payment_method.toLowerCase() !== 'credit') {
      await client.query(
        `INSERT INTO sales_invoice_payments (invoice_id, amount_paid, payment_method, payment_date, created_by, created_at)
         VALUES ($1, $2, $3, NOW(), $4, NOW())`,
        [invoiceRes.rows[0].id, totalAmount, payment_method, user.id || null]
      );

      // Update invoice status to paid
      await client.query(
        `UPDATE sales_invoices SET status = 'paid', amount_due = 0 WHERE id = $1`,
        [invoiceRes.rows[0].id]
      );
    } else {
      // For credit sales, update customer balance
      await client.query(
        `UPDATE customers SET current_balance = current_balance + $1 WHERE id = $2`,
        [totalAmount, customer_id]
      );
    }

    await client.query('COMMIT');
    client.release();

    return NextResponse.json({ 
      success: true, 
      sale: soRes.rows[0], 
      sale_id: saleId, 
      invoice: invoiceRes.rows[0],
      total_amount: totalAmount
    }, { status: 201 });
  } catch (err) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch (e) {}
      client.release();
    }
    console.error('POST sale error:', err.message);
    if (err.code === '23505') return NextResponse.json({ success: false, error: 'Sale number already exists' }, { status: 409 });
    return NextResponse.json({ success: false, error: 'Failed to create sale', message: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
