'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import FilterBar from '@/components/shared/FilterBar';
import DataTable from '@/components/shared/DataTable';
import MobileCard from '@/components/shared/MobileCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, AlertTriangle } from 'lucide-react';

const mockProducts = [
  {
    id: 'P001',
    image: '💻',
    sku: 'LP-PRO-15',
    name: 'Laptop Pro 15"',
    category: 'Electronics',
    stock: 45,
    cost: 899.99,
    price: 1299.99,
    status: 'active',
  },
  {
    id: 'P002',
    image: '🖱️',
    sku: 'MS-WL-01',
    name: 'Wireless Mouse',
    price: 29.99,
    cost: 12.99,
    category: 'Accessories',
    stock: 120,
    status: 'active',
  },
  {
    id: 'P003',
    image: '🔌',
    sku: 'CB-USBC-2M',
    name: 'USB-C Cable 2M',
    category: 'Accessories',
    stock: 8,
    cost: 5.99,
    price: 15.99,
    status: 'active',
  },
  {
    id: 'P004',
    image: '🖥️',
    sku: 'MON-27-4K',
    name: 'Monitor 27" 4K',
    category: 'Electronics',
    stock: 30,
    cost: 249.99,
    price: 349.99,
    status: 'active',
  },
  {
    id: 'P005',
    image: '⌨️',
    sku: 'KB-MECH-RGB',
    name: 'Mechanical Keyboard RGB',
    category: 'Accessories',
    stock: 0,
    cost: 45.99,
    price: 89.99,
    status: 'out_of_stock',
  },
  {
    id: 'P006',
    image: '🪑',
    sku: 'CH-ERG-BLK',
    name: 'Ergonomic Office Chair',
    category: 'Furniture',
    stock: 15,
    cost: 149.99,
    price: 249.99,
    status: 'active',
  },
];

const stockLevels = {
  out_of_stock: { label: 'Out of Stock', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  low: { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  normal: { label: 'In Stock', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
};

const getStockLevel = (stock) => {
  if (stock === 0) return 'out_of_stock';
  if (stock < 20) return 'low';
  return 'normal';
};

export default function ProductsListPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const columns = [
    {
      header: 'Product',
      accessor: 'product',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="text-3xl flex-shrink-0">{row.image}</div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{row.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {row.sku}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => (
        <span className="text-gray-700 dark:text-gray-300">{row.category}</span>
      ),
    },
    {
      header: 'Stock',
      accessor: 'stock',
      render: (row) => {
        const level = getStockLevel(row.stock);
        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white">{row.stock}</span>
            {level !== 'normal' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
          </div>
        );
      },
    },
    {
      header: 'Cost',
      accessor: 'cost',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          UGX {row.cost.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Price',
      accessor: 'price',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          UGX {row.price.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const level = getStockLevel(row.stock);
        const stockInfo = stockLevels[level];
        return (
          <Badge className={stockInfo.color}>
            {stockInfo.label}
          </Badge>
        );
      },
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/inventory/products/${row.id}`)}
          className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      ),
    },
  ];

  const filters = [
    {
      label: 'Category',
      value: categoryFilter,
      options: [
        { label: 'Electronics', value: 'Electronics' },
        { label: 'Accessories', value: 'Accessories' },
        { label: 'Furniture', value: 'Furniture' },
        { label: 'Office', value: 'Office' },
      ],
      onChange: setCategoryFilter,
    },
    {
      label: 'Stock Level',
      value: stockFilter,
      options: [
        { label: 'In Stock', value: 'normal' },
        { label: 'Low Stock', value: 'low' },
        { label: 'Out of Stock', value: 'out_of_stock' },
      ],
      onChange: setStockFilter,
    },
  ];

  const filteredData = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchValue.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const level = getStockLevel(product.stock);
    const matchesStock = stockFilter === 'all' || level === stockFilter;
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Products"
          subtitle="Manage your product catalog and inventory levels"
          actions={[
            <Button
              key="new"
              onClick={() => router.push('/inventory/products/new')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              New Product
            </Button>
          ]}
        />

        <FilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filters}
          onClearFilters={() => {
            setSearchValue('');
            setCategoryFilter('all');
            setStockFilter('all');
          }}
        />

        {/* Desktop Table */}
        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={filteredData}
          />
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredData.map((product) => {
            const level = getStockLevel(product.stock);
            const stockInfo = stockLevels[level];
            
            return (
              <MobileCard
                key={product.id}
                onClick={() => router.push(`/inventory/products/${product.id}`)}
                data={[
                  { label: 'Product', value: `${product.image} ${product.name}` },
                  { label: 'SKU', value: product.sku },
                  { label: 'Stock', value: product.stock },
                  { label: 'Price', value: `$${product.price.toFixed(2)}` },
                  {
                    label: 'Status',
                    value: <Badge className={stockInfo.color}>{stockInfo.label}</Badge>
                  },
                ]}
              />
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
