import { query } from '@/lib/db';

/**
 * Check if a role has permission for a given module and action
 * @param {string} roleId
 * @param {string} moduleName - e.g., 'inventory', 'purchases', 'sales'
 * @param {string} action - 'create'|'read'|'update'|'delete'
 * @returns {Promise<boolean>}
 */
export async function hasPermission(roleId, moduleName, action) {
  if (!roleId) return false;

  // Admin role bypass: if role has role_code = 'admin' allow everything
  try {
    const roleRes = await query('SELECT role_code FROM roles WHERE id = $1', [roleId]);
    if (roleRes.rowCount > 0 && roleRes.rows[0].role_code === 'admin') {
      return true;
    }

    // Find permission ids matching module
    const permRes = await query('SELECT id FROM permissions WHERE module = $1', [moduleName]);
    if (permRes.rowCount === 0) return false;

    const permIds = permRes.rows.map(r => r.id);
    // Map action -> column
    const actionCol = {
      create: 'can_create',
      read: 'can_read',
      update: 'can_update',
      delete: 'can_delete'
    }[action];

    if (!actionCol) return false;

    const sql = `SELECT 1 FROM role_permissions WHERE role_id = $1 AND permission_id = ANY($2::uuid[]) AND ${actionCol} = true LIMIT 1`;
    const res = await query(sql, [roleId, permIds]);
    return res.rowCount > 0;
  } catch (err) {
    console.error('Permission check error:', err.message);
    return false;
  }
}

export default { hasPermission };
