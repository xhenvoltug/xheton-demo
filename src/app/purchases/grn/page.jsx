'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusBadge from '@/components/core/StatusBadge';
import { Plus, FileText, Package, Truck, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function GRNPage() {
  const router = useRouter();
  const [grns, setGrns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [savingId, setSavingId] = useState(null);

  // Fetch GRNs on mount
  useEffect(() => {
    const fetchGRNs = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/purchases/grn-list');
        const data = await res.json();
        if (data.success) {
          setGrns(data.data || []);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGRNs();
  }, []);

  const filteredGRNs = grns.filter(grn => {
    const matchesSearch = 
      (grn.grn_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (grn.supplier_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (grn.warehouse_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (grn.status || '') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalGRNs = grns.length;
  const draftGRNs = grns.filter(g => g.status === 'draft').length;
  const approvedGRNs = grns.filter(g => g.status === 'approved').length;

  const startEdit = (grn) => {
    setEditingId(grn.id);
    setEditValues({
      supplier_id: grn.supplier_id,
      warehouse_id: grn.warehouse_id,
      po_reference: grn.po_reference || '',
      grn_date: grn.grn_date ? grn.grn_date.split('T')[0] : new Date().toISOString().split('T')[0],
      notes: grn.notes || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const approveGRN = async (grnId) => {
    if (!confirm('Approve this GRN? This will create stock movements and make stock available.')) return;

    setSavingId(grnId);
    try {
      const res = await fetch('/api/purchases/grn-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grn_id: grnId,
          approved_by_id: 'current-user-id', // Replace with actual user from auth
          notes: 'Approved via UI'
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('GRN approved! Stock movements created.');
        setGrns(grns.map(g => g.id === grnId ? { ...g, status: 'approved' } : g));
      } else {
        toast.error(data.error || 'Failed to approve GRN');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const deleteGRN = async (grnId) => {
    if (!confirm('Delete this GRN? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/purchases/grn/${grnId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success('GRN deleted successfully');
        setGrns(grns.filter(g => g.id !== grnId));
      } else {
        toast.error('Failed to delete GRN');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-600">Loading GRNs...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Goods Received Notes (GRN)"
          subtitle="GRN is the ONLY entry point for creating stock. Approval creates stock movements."
          actions={[
            <Button
              key="opening-stock"
              onClick={() => router.push('/inventory/opening-stock')}
              className="rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600"
            >
              <Package className="h-4 w-4 mr-2" />
              Opening Stock
            </Button>,
            <Button
              key="new"
              onClick={() => router.push('/purchases/grn/new')}
              className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              New GRN
            </Button>
          ]}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { label: 'Total GRNs', value: totalGRNs, icon: FileText, color: 'from-blue-500 to-cyan-500' },
            { label: 'Draft', value: draftGRNs, icon: Clock, color: 'from-yellow-500 to-orange-500' },
            { label: 'Approved', value: approvedGRNs, icon: CheckCircle, color: 'from-green-500 to-emerald-500' }
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
          <div className="flex gap-4">
            <Input
              placeholder="Search GRN, Supplier, Warehouse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg dark:bg-gray-800"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </Card>

        {/* GRNs Table */}
        <Card className="rounded-3xl shadow-lg border-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">GRN #</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Supplier</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Warehouse</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Items</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGRNs.map((grn) => (
                  <tr key={grn.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-semibold">{grn.grn_number}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{grn.supplier_name || '-'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{grn.warehouse_name || '-'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium">{grn.item_count || 0} items</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{grn.grn_date ? new Date(grn.grn_date).toLocaleDateString() : '-'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge variant={grn.status === 'approved' ? 'success' : 'pending'}>
                        {grn.status}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => router.push(`/purchases/grn/${grn.id}`)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        View
                      </Button>
                      {grn.status === 'draft' && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => approveGRN(grn.id)}
                            disabled={savingId === grn.id}
                            className="text-green-600 hover:bg-green-50"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteGRN(grn.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredGRNs.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No GRNs found. Create one to start receiving stock.</p>
            </div>
          )}
        </Card>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
