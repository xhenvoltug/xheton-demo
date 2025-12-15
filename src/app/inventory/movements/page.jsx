'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusBadge from '@/components/core/StatusBadge';
import { Download, TrendingUp, TrendingDown, ArrowRightLeft, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const MOVEMENT_TYPES = {
  'receipt': { label: 'Receipt (IN)', icon: TrendingUp, color: 'success' },
  'issue': { label: 'Issue (OUT)', icon: TrendingDown, color: 'error' },
  'transfer_in': { label: 'Transfer (IN)', icon: ArrowRightLeft, color: 'info' },
  'transfer_out': { label: 'Transfer (OUT)', icon: ArrowRightLeft, color: 'warning' },
  'in': { label: 'In', icon: TrendingUp, color: 'success' },
  'out': { label: 'Out', icon: TrendingDown, color: 'error' }
};

export default function StockMovementsPage() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        setLoading(true);
        let url = `/api/inventory/stock-movements/list?page=${page}&limit=50`;
        
        if (typeFilter !== 'all') {
          url += `&movement_type=${typeFilter}`;
        }

        if (searchTerm) {
          url += `&search=${encodeURIComponent(searchTerm)}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (data.success) {
          setMovements(data.data || []);
          setPagination(data.pagination || { total: 0, pages: 1 });
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, [page, typeFilter, searchTerm]);

  const totalReceipts = movements.filter(m => m.movement_type === 'receipt' || m.movement_type === 'in').length;
  const totalIssues = movements.filter(m => m.movement_type === 'issue' || m.movement_type === 'out').length;
  const totalTransfers = movements.filter(m => m.movement_type?.includes('transfer')).length;

  const getMoveIcon = (type) => {
    const moveInfo = MOVEMENT_TYPES[type] || { icon: ArrowRightLeft, color: 'default' };
    const Icon = moveInfo.icon;
    return <Icon className="h-4 w-4" />;
  };

  const getMoveLabel = (type) => {
    return MOVEMENT_TYPES[type]?.label || type;
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Stock Movements Ledger"
          subtitle="Read-only audit trail of all inventory movements. Prevent manual editing for integrity."
          actions={[
            <Button key="export" variant="outline" className="rounded-2xl">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          ]}
        />

        {/* Info Banner */}
        <Card className="rounded-2xl shadow-lg border-0 mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 p-4">
          <div className="flex gap-3">
            <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                This is a permanent audit trail. Stock movements are created ONLY by:
              </p>
              <ul className="mt-1 text-sm text-blue-800 dark:text-blue-200 list-disc list-inside">
                <li>GRN Approval → Receipt movements</li>
                <li>Sales Orders → Issue movements</li>
                <li>Internal Transfers → Transfer movements</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { label: 'Total Receipts', value: totalReceipts, icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
            { label: 'Total Issues', value: totalIssues, icon: TrendingDown, color: 'from-red-500 to-pink-500' },
            { label: 'Transfers', value: totalTransfers, icon: ArrowRightLeft, color: 'from-blue-500 to-cyan-500' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </div>
                  <stat.icon className="h-8 w-8 opacity-50" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card className="rounded-3xl shadow-lg border-0 mb-6 p-4">
          <div className="flex gap-4 flex-wrap">
            <Input
              placeholder="Search by movement #, product, warehouse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-60"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg dark:bg-gray-800 min-w-40"
            >
              <option value="all">All Types</option>
              <option value="receipt">Receipt (IN)</option>
              <option value="issue">Issue (OUT)</option>
              <option value="transfer_in">Transfer In</option>
              <option value="transfer_out">Transfer Out</option>
            </select>
          </div>
        </Card>

        {/* Movements Table */}
        <Card className="rounded-3xl shadow-lg border-0 overflow-hidden">
          {loading ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <p>Loading movements...</p>
            </div>
          ) : error ? (
            <div className="px-6 py-6 text-red-600">
              <AlertCircle className="h-5 w-5 inline mr-2" />
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Movement #</th>
                    <th className="px-4 py-3 text-left font-semibold">Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Product</th>
                    <th className="px-4 py-3 text-left font-semibold">From Location</th>
                    <th className="px-4 py-3 text-left font-semibold">To Location</th>
                    <th className="px-4 py-3 text-right font-semibold">Qty</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((mov) => (
                    <tr key={mov.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">{mov.movement_number}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getMoveIcon(mov.movement_type)}
                          <span className="text-xs font-medium">{getMoveLabel(mov.movement_type)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{mov.product_name}</p>
                          <p className="text-xs text-gray-500">{mov.product_code}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {mov.from_warehouse_name ? (
                          <div>
                            <p className="text-sm">{mov.from_warehouse_name}</p>
                            <p className="text-xs text-gray-500">{mov.from_bin_code || '-'}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">External</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {mov.to_warehouse_name ? (
                          <div>
                            <p className="text-sm">{mov.to_warehouse_name}</p>
                            <p className="text-xs text-gray-500">{mov.to_bin_code || '-'}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">External</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{parseFloat(mov.quantity).toFixed(2)}</td>
                      <td className="px-4 py-3 text-xs">
                        {new Date(mov.movement_date || mov.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <StatusBadge variant="default">
                          {mov.reference_type || '-'}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && movements.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-500">
              <p>No stock movements found.</p>
            </div>
          )}
        </Card>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <Button
                key={p}
                variant={page === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
