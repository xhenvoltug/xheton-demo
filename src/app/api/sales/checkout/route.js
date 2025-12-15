import { NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';

/**
 * POS CRITICAL MODULE - STRICT STOCK VALIDATION
 * MUST:
 * 1. Check stock before allowing sale
 * 2. Prevent selling more than available
 * 3. Create sales order
 * 4. Decrement stock
 * 5. Create stock movement OUT record
 * 6. Auto-generate sales invoice
 */

export async function POST(request) {
  let client;
  try {
    const body = await request.json();
    const { customer_id, warehouse_id, items, notes, payment_method } = body;

    if (!customer_id || !warehouse_id || !items || items.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'customer_id, warehouse_id, and items array required' 
      }, { status: 400 });
    }

    client = await getClient();
    await client.query('BEGIN');

    try {
      // CRITICAL: Validate stock FIRST before processing
      for (const item of items) {
        const { product_id, quantity } = item;
        const stockRes = await client.query(
          `SELECT current_stock FROM products WHERE id = $1 AND deleted_at IS NULL`,
          [product_id]
        );

        if (stockRes.rows.length === 0) {
          throw new Error(`Product ${product_id} not found`);
        }

        const currentStock = parseInt(stockRes.rows[0].current_stock, 10);
        if (currentStock < quantity) {
          throw new Error(`Insufficient stock for product ${product_id}. Available: ${currentStock}, Requested: ${quantity}`);
        }
      }

      // All stock checks passed - proceed with sale
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const countRes = await client.query(
        `SELECT COUNT(*) as count FROM sales_orders WHERE order_date = CURRENT_DATE`
      );
      const orderNumber = `SO-${dateStr}-${String(parseInt(countRes.rows[0].rows[0].count) + 1).padStart(4, '0')}`;

      let subtotal = 0;
      let taxTotal = 0;
      let totalAmount = 0;

      // Calculate totals
      for (const item of items) {
        const { product_id, quantity } = item;
        const prodRes = await client.query(
          `SELECT selling_price FROM products WHERE id = $1`,
          [product_id]
        );
        const unitPrice = parseFloat(prodRes.rows[0].selling_price);
        const lineTotal = quantity * unitPrice;
        subtotal += lineTotal;
      }

      taxTotal = subtotal * 0.18; // 18% VAT default
      totalAmount = subtotal + taxTotal;

      // Insert sales order
      const saleRes = await client.query(
        `INSERT INTO sales_orders 
         (order_number, order_type, order_date, customer_id, warehouse_id, subtotal, tax_amount, total_amount, amount_paid, status, payment_status, created_at, updated_at)
         VALUES ($1, 'pos', CURRENT_DATE, $2, $3, $4, $5, $6, 0, 'confirmed', 'unpaid', NOW(), NOW())
         RETURNING *`,
        [orderNumber, customer_id, warehouse_id, subtotal, taxTotal, totalAmount]
      );

      const orderId = saleRes.rows[0].id;
      let totalQty = 0;

      // Process each item
      for (const item of items) {
        const { product_id, quantity } = item;
        const prodRes = await client.query(
          `SELECT selling_price FROM products WHERE id = $1`,
          [product_id]
        );
        const unitPrice = parseFloat(prodRes.rows[0].selling_price);
        const lineTotal = quantity * unitPrice;
        const lineTax = lineTotal * 0.18;

        // Insert sales order item
        await client.query(
          `INSERT INTO sales_order_items 
           (order_id, product_id, quantity, unit_price, tax_rate, tax_amount, line_total, created_at, updated_at)
           VALUES ($1, $2, $3, $4, 18, $5, $6, NOW(), NOW())`,
          [orderId, product_id, quantity, unitPrice, lineTax, lineTotal]
        );

        // CRITICAL: Decrement product stock
        await client.query(
          `UPDATE products SET current_stock = current_stock - $1, updated_at = NOW() WHERE id = $2`,
          [quantity, product_id]
        );

        // Create stock movement OUT record
        await client.query(
          `INSERT INTO stock_movements 
           (product_id, warehouse_id, movement_type, quantity, reference_type, reference_id, notes, created_at)
           VALUES ($1, $2, 'OUT', $3, 'SALES', $4, $5, NOW())`,
          [product_id, warehouse_id, quantity, orderId, `Sale ${orderNumber}`]
        );

        totalQty += quantity;
      }

      // Auto-generate sales invoice
      const invoiceNumber = `INV-${dateStr}-${String(parseInt(countRes.rows[0].rows[0].count) + 1).padStart(4, '0')}`;
      const invoiceRes = await client.query(
        `INSERT INTO sales_invoices 
         (invoice_number, order_id, customer_id, invoice_date, subtotal, tax_amount, total_amount, amount_paid, status, payment_status, created_at, updated_at)
         VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, $6, 0, 'draft', 'unpaid', NOW(), NOW())
         RETURNING *`,
        [invoiceNumber, orderId, customer_id, subtotal, taxTotal, totalAmount]
      );

      await client.query('COMMIT');
      client.release();

      return NextResponse.json({ 
        success: true, 
        sales_order: saleRes.rows[0],
        invoice: invoiceRes.rows[0],
        message: `Sale completed: ${totalQty} items, UGX ${totalAmount.toLocaleString()}`
      }, { status: 201 });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
  } catch (err) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch (e) {}
      client.release();
    }
    console.error('POST POS sale error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: err.message.includes('Insufficient') ? 409 : 500 });
  }
}

export const dynamic = 'force-dynamic';
