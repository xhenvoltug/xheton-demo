'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Package, DollarSign, TrendingUp, Warehouse, Loader2 } from 'lucide-react';

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/inventory/products/${id}`);
        if (!response.ok) throw new Error('Failed to load product');
        const data = await response.json();
        setProduct(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
          <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !product) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-red-600">
          <p className="font-semibold mb-2">Error loading product</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{error || 'Product not found'}</p>
          <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  const profitMargin = ((product.selling_price - product.cost_price) / product.selling_price * 100).toFixed(1);
  const totalValue = product.quantity * product.cost_price;

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title={product.product_name}
          subtitle={`SKU: ${mockProduct.sku} • Category: ${mockProduct.category}`}
          actions={[
            <Button
              key="edit"
              variant="outline"
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Product
            </Button>,
          ]}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Current Stock"
            value={mockProduct.stock}
            icon={Package}
          />
          <StatCard
            title="Stock Value"
            value={`$UGX {totalValue.toLocaleString()}`}
            icon={DollarSign}
          />
          <StatCard
            title="Selling Price"
            value={`$UGX {mockProduct.price}`}
            icon={TrendingUp}
          />
          <StatCard
            title="Profit Margin"
            value={`${profitMargin}%`}
            change={{ value: 2.5, isPositive: true }}
            icon={TrendingUp}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Details */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="text-center mb-6">
                <div className="text-8xl mb-4">{mockProduct.image}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {mockProduct.name}
                </h3>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  In Stock
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                  <p className="text-gray-900 dark:text-white mt-1">{mockProduct.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cost Price</p>
                    <p className="font-semibold text-gray-900 dark:text-white">UGX {mockProduct.cost}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Selling Price</p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">UGX {mockProduct.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Unit</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">{mockProduct.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Min Stock</p>
                    <p className="font-medium text-gray-900 dark:text-white">{mockProduct.minStock}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Weight</p>
                    <p className="font-medium text-gray-900 dark:text-white">{mockProduct.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Barcode</p>
                    <p className="font-medium text-gray-900 dark:text-white text-xs">{mockProduct.barcode}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Dimensions</p>
                  <p className="font-medium text-gray-900 dark:text-white">{mockProduct.dimensions}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* History & Warehouse */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-sm">
              <Tabs defaultValue="warehouse" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="warehouse">Stock by Warehouse</TabsTrigger>
                  <TabsTrigger value="sales">Sales History</TabsTrigger>
                  <TabsTrigger value="purchases">Purchase History</TabsTrigger>
                </TabsList>

                <TabsContent value="warehouse">
                  <DataTable
                    columns={[
                      {
                        header: 'Warehouse',
                        accessor: 'warehouse',
                        render: (row) => (
                          <div className="flex items-center gap-2">
                            <Warehouse className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-semibold text-gray-900 dark:text-white">{row.warehouse}</span>
                          </div>
                        ),
                      },
                      {
                        header: 'Location',
                        accessor: 'location',
                        render: (row) => <span className="text-gray-600 dark:text-gray-400">{row.location}</span>,
                      },
                      {
                        header: 'Quantity',
                        accessor: 'quantity',
                        render: (row) => (
                          <span className="font-semibold text-gray-900 dark:text-white">{row.quantity} units</span>
                        ),
                      },
                    ]}
                    data={stockByWarehouse}
                    variant="compact"
                  />
                </TabsContent>

                <TabsContent value="sales">
                  <DataTable
                    columns={[
                      {
                        header: 'Invoice',
                        accessor: 'id',
                        render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.id}</span>,
                      },
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
                        header: 'Customer',
                        accessor: 'customer',
                        render: (row) => <span className="text-gray-700 dark:text-gray-300">{row.customer}</span>,
                      },
                      {
                        header: 'Quantity',
                        accessor: 'quantity',
                        render: (row) => <span className="text-gray-900 dark:text-white">{row.quantity}</span>,
                      },
                      {
                        header: 'Total',
                        accessor: 'total',
                        render: (row) => (
                          <span className="font-semibold text-gray-900 dark:text-white">UGX {row.total.toFixed(2)}</span>
                        ),
                      },
                    ]}
                    data={salesHistory}
                    variant="compact"
                  />
                </TabsContent>

                <TabsContent value="purchases">
                  <DataTable
                    columns={[
                      {
                        header: 'PO Number',
                        accessor: 'id',
                        render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.id}</span>,
                      },
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
                        header: 'Supplier',
                        accessor: 'supplier',
                        render: (row) => <span className="text-gray-700 dark:text-gray-300">{row.supplier}</span>,
                      },
                      {
                        header: 'Quantity',
                        accessor: 'quantity',
                        render: (row) => <span className="text-gray-900 dark:text-white">{row.quantity}</span>,
                      },
                      {
                        header: 'Cost',
                        accessor: 'cost',
                        render: (row) => (
                          <span className="font-semibold text-gray-900 dark:text-white">UGX {row.cost.toLocaleString()}</span>
                        ),
                      },
                    ]}
                    data={purchaseHistory}
                    variant="compact"
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
