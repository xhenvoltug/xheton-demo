'use client';

import { use, useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Package, TrendingDown, Calendar, AlertTriangle, Loader2 } from 'lucide-react';

export default function BatchDetailPage({ params }) {
  const { id } = use(params);
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/inventory/batches/${id}`);
        if (!res.ok) throw new Error('Batch not found');
        const json = await res.json();
        setBatch(json.data || json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBatch();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading batch...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !batch) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
          <p className="text-red-600 dark:text-red-400">{error || 'Batch not found'}</p>
        </div>
      </DashboardLayout>
    );
  }

  const daysUntilExpiry = Math.floor(
    (new Date(batch.expiry_date || batch.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title={`Batch ${mockBatch.batchNumber}`}
          subtitle={mockBatch.product}
          actions={[
            <Button key="edit" variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>,
          ]}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Quantity"
            value={mockBatch.quantity}
            icon={Package}
          />
          <StatCard
            title="Remaining"
            value={mockBatch.remaining}
            icon={TrendingDown}
          />
          <StatCard
            title="Days Until Expiry"
            value={daysUntilExpiry}
            icon={Calendar}
          />
          <StatCard
            title="Status"
            value={mockBatch.status}
            icon={AlertTriangle}
          />
        </div>

        {/* Batch Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Batch Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Batch Number</p>
                <p className="font-semibold text-gray-900 dark:text-white">{mockBatch.batchNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Supplier</p>
                <p className="font-medium text-gray-900 dark:text-white">{mockBatch.supplier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manufacture Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(mockBatch.manufactureDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Expiry Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(mockBatch.expiryDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 mt-1">
                  {mockBatch.status}
                </Badge>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-2">
            <Card className="p-6 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Movement History
              </h3>
              <DataTable
                columns={[
                  {
                    header: 'Date',
                    accessor: 'date',
                    render: (row) => (
                      <span className="text-gray-600 dark:text-gray-400">
                        {new Date(row.date).toLocaleDateString()}
                      </span>
                    ),
                  },
                  {
                    header: 'Type',
                    accessor: 'type',
                    render: (row) => (
                      <span className="font-medium text-gray-900 dark:text-white">{row.type}</span>
                    ),
                  },
                  {
                    header: 'Reference',
                    accessor: 'reference',
                    render: (row) => (
                      <span className="text-gray-700 dark:text-gray-300">{row.reference}</span>
                    ),
                  },
                  {
                    header: 'Quantity',
                    accessor: 'quantity',
                    render: (row) => (
                      <span className="text-gray-900 dark:text-white">{row.quantity}</span>
                    ),
                  },
                  {
                    header: 'Balance',
                    accessor: 'balance',
                    render: (row) => (
                      <span className="font-semibold text-gray-900 dark:text-white">{row.balance}</span>
                    ),
                  },
                ]}
                data={movementHistory}
                variant="compact"
              />
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
