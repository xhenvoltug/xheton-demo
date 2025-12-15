import { query } from '@/lib/db';

/**
 * Record a stock movement. Expects a client or uses query for simple insert.
 * @param {object} client - optional PG client with .query
 * @param {object} data - movement data
 */
export async function recordStockMovement(client, data) {
  const {
    movement_number,
    movement_type,
    product_id,
    batch_id = null,
    from_warehouse_id = null,
    to_warehouse_id = null,
    from_bin_id = null,
    to_bin_id = null,
    quantity,
    unit_cost = 0,
    movement_date = new Date(),
    reference_type = null,
    reference_id = null,
    notes = null,
    created_by = null
  } = data;

    const sql = `INSERT INTO stock_movements (
      movement_number, movement_type, product_id, batch_id, from_warehouse_id, to_warehouse_id,
      from_bin_id, to_bin_id, quantity, unit_cost, movement_date, reference_type, reference_id, notes, created_by, created_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,NOW()) RETURNING *`;

  const params = [
    movement_number,
    movement_type,
    product_id,
    batch_id,
    from_warehouse_id,
    to_warehouse_id,
    from_bin_id,
    to_bin_id,
    quantity,
    unit_cost,
    movement_date,
    reference_type,
    reference_id,
    notes,
    created_by
  ];

  if (client && client.query) {
    const res = await client.query(sql, params);
    return res.rows[0];
  }

  const res = await query(sql, params);
  return res.rows[0];
}

/**
 * Get stock balance for a product in a given warehouse (sums in/out movements)
 * If warehouseId is omitted, returns overall stock
 */
export async function getStockBalance(productId, warehouseId = null) {
  try {
    if (warehouseId) {
      const inRes = await query(
        `SELECT COALESCE(SUM(quantity),0) AS total_in FROM stock_movements WHERE product_id = $1 AND to_warehouse_id = $2`,
        [productId, warehouseId]
      );

      const outRes = await query(
        `SELECT COALESCE(SUM(quantity),0) AS total_out FROM stock_movements WHERE product_id = $1 AND from_warehouse_id = $2`,
        [productId, warehouseId]
      );

      const totalIn = parseFloat(inRes.rows[0].total_in || 0);
      const totalOut = parseFloat(outRes.rows[0].total_out || 0);
      return totalIn - totalOut;
    }

    // overall
    const res = await query(`SELECT COALESCE(SUM(CASE WHEN to_warehouse_id IS NOT NULL THEN quantity ELSE 0 END),0) AS total_in,
                                     COALESCE(SUM(CASE WHEN from_warehouse_id IS NOT NULL THEN quantity ELSE 0 END),0) AS total_out
                              FROM stock_movements WHERE product_id = $1`, [productId]);

    const totalIn = parseFloat(res.rows[0].total_in || 0);
    const totalOut = parseFloat(res.rows[0].total_out || 0);
    return totalIn - totalOut;
  } catch (err) {
    console.error('getStockBalance error:', err.message);
    throw err;
  }
}

export default { recordStockMovement, getStockBalance };
