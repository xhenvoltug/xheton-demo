'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import FilterBar from '@/components/shared/FilterBar';
import DataTable from '@/components/shared/DataTable';
import MobileCard from '@/components/shared/MobileCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Eye, Edit2, Trash2, AlertTriangle, Loader2, Package, 
  Download, FileText, CheckSquare, Square, MoreVertical, Printer,
  RefreshCw, Trash2 as TrashIcon
} from 'lucide-react';

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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [bulkLoading, setBulkLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('[ProductsList] Fetching products...');
        const response = await fetch('/api/inventory/products/list');
        console.log('[ProductsList] Response OK:', response.ok, 'Status:', response.status);
        if (!response.ok) throw new Error('Failed to load products');
        const data = await response.json();
        console.log('[ProductsList] Data received:', {
          count: data.data?.length || 0,
          total: data.total,
          sample: data.data?.[0]
        });
        setProducts(data.data || []);
      } catch (err) {
        console.error('[ProductsList] Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Toggle row selection
  const toggleRowSelection = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Select/Deselect all
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map(p => p.id)));
    }
  };

  // Delete single product
  const handleDeleteProduct = async (id, productName) => {
    if (!window.confirm(`Delete "${productName}"? This action cannot be undone.`)) return;
    
    try {
      setDeletingId(id);
      const res = await fetch(`/api/inventory/products/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Delete failed');

      setProducts(products.filter(p => p.id !== id));
      setSelectedIds(new Set([...selectedIds].filter(sid => sid !== id)));
      toast.success('Product deleted');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  // Update product
  const handleUpdateProduct = async (id) => {
    try {
      setBulkLoading(true);
      const res = await fetch(`/api/inventory/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData[id] || {})
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Update failed');

      setProducts(products.map(p => p.id === id ? { ...p, ...editData[id] } : p));
      setEditingId(null);
      setEditData({});
      toast.success('Product updated');
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err.message || 'Failed to update product');
    } finally {
      setBulkLoading(false);
    }
  };

  // Bulk delete
  const handleBulkDelete = async (type) => {
    let message = '';
    if (type === 'selected' && selectedIds.size === 0) {
      toast.error('No products selected');
      return;
    }
    
    if (type === 'selected') message = `Delete ${selectedIds.size} selected product(s)?`;
    else if (type === 'unselected') message = `Delete ${filteredData.length - selectedIds.size} unselected product(s)?`;
    else if (type === 'all') message = `Delete ALL ${filteredData.length} product(s)? This cannot be undone.`;

    if (!window.confirm(message)) return;

    try {
      setBulkLoading(true);
      const res = await fetch('/api/inventory/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: `delete_${type}`,
          ids: type === 'all' ? null : Array.from(selectedIds)
        })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Bulk delete failed');

      // Refresh products list
      const response = await fetch('/api/inventory/products/list');
      const newData = await response.json();
      setProducts(newData.data || []);
      setSelectedIds(new Set());
      toast.success(data.message || 'Products deleted');
    } catch (err) {
      console.error('Bulk delete error:', err);
      toast.error(err.message || 'Failed to delete products');
    } finally {
      setBulkLoading(false);
    }
  };

  // Export products
  const handleExport = async (format) => {
    try {
      setBulkLoading(true);
      const res = await fetch('/api/inventory/products/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format,
          filterSearch: searchValue,
          filterCategory: categoryFilter,
          filterStock: stockFilter,
          selectedIds: selectedIds.size > 0 ? Array.from(selectedIds) : null
        })
      });

      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Export successful');
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Export failed');
    } finally {
      setBulkLoading(false);
    }
  };

  // Print products
  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Products List</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
          h1 { color: #10b981; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #10b981; color: white; padding: 12px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          tr:nth-child(even) { background: #f9f9f9; }
          .summary { margin-top: 30px; font-size: 14px; }
        </style>
      </head>
      <body>
        <h1>XHETON - Products List</h1>
        <p>Exported: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>Product Code</th>
              <th>Product Name</th>
              <th>Stock</th>
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData.map(p => `
              <tr>
                <td>${p.product_code}</td>
                <td>${p.product_name}</td>
                <td>${p.current_stock}</td>
                <td>UGX ${(p.cost_price || 0).toLocaleString()}</td>
                <td>UGX ${(p.selling_price || 0).toLocaleString()}</td>
                <td>${p.is_active ? 'Active' : 'Inactive'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="summary">
          <p><strong>Total Products:</strong> ${filteredData.length}</p>
          <p><strong>Total Value:</strong> UGX ${filteredData.reduce((sum, p) => sum + (p.selling_price || 0) * (p.current_stock || 0), 0).toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  const columns = [
    {
      header: () => (
        <button onClick={toggleSelectAll} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
          {selectedIds.size === filteredData.length && filteredData.length > 0 ? (
            <CheckSquare className="h-5 w-5 text-emerald-600" />
          ) : (
            <Square className="h-5 w-5 text-gray-400" />
          )}
        </button>
      ),
      accessor: 'select',
      render: (row) => (
        <button onClick={() => toggleRowSelection(row.id)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
          {selectedIds.has(row.id) ? (
            <CheckSquare className="h-5 w-5 text-emerald-600" />
          ) : (
            <Square className="h-5 w-5 text-gray-400" />
          )}
        </button>
      ),
    },
    {
      header: 'Product',
      accessor: 'product',
      render: (row) => {
        const isEditing = editingId === row.id;
        return isEditing ? (
          <input
            type="text"
            value={editData[row.id]?.product_name || row.product_name}
            onChange={(e) => setEditData({ ...editData, [row.id]: { ...editData[row.id], product_name: e.target.value } })}
            className="w-full px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
            placeholder="Product name"
          />
        ) : (
          <div className="flex items-center gap-3">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{row.product_name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Code: {row.product_code}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Stock',
      accessor: 'current_stock',
      render: (row) => {
        const level = getStockLevel(row.current_stock || 0);
        const isEditing = editingId === row.id;
        return isEditing ? (
          <input
            type="number"
            value={editData[row.id]?.current_stock !== undefined ? editData[row.id].current_stock : row.current_stock}
            onChange={(e) => setEditData({ ...editData, [row.id]: { ...editData[row.id], current_stock: parseInt(e.target.value) || 0 } })}
            className="w-20 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
          />
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white">{row.current_stock}</span>
            {level !== 'normal' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
          </div>
        );
      },
    },
    {
      header: 'Cost',
      accessor: 'cost_price',
      render: (row) => {
        const isEditing = editingId === row.id;
        return isEditing ? (
          <input
            type="number"
            value={editData[row.id]?.cost_price !== undefined ? editData[row.id].cost_price : row.cost_price}
            onChange={(e) => setEditData({ ...editData, [row.id]: { ...editData[row.id], cost_price: parseFloat(e.target.value) || 0 } })}
            className="w-24 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
          />
        ) : (
          <span className="text-gray-600 dark:text-gray-400">
            UGX {(row.cost_price || 0).toLocaleString()}
          </span>
        );
      },
    },
    {
      header: 'Price',
      accessor: 'selling_price',
      render: (row) => {
        const isEditing = editingId === row.id;
        return isEditing ? (
          <input
            type="number"
            value={editData[row.id]?.selling_price !== undefined ? editData[row.id].selling_price : row.selling_price}
            onChange={(e) => setEditData({ ...editData, [row.id]: { ...editData[row.id], selling_price: parseFloat(e.target.value) || 0 } })}
            className="w-24 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
          />
        ) : (
          <span className="font-semibold text-gray-900 dark:text-white">
            UGX {(row.selling_price || 0).toLocaleString()}
          </span>
        );
      },
    },
    {
      header: 'Status',
      accessor: 'is_active',
      render: (row) => {
        const level = getStockLevel(row.current_stock || 0);
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
      render: (row) => {
        const isEditing = editingId === row.id;
        return (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleUpdateProduct(row.id)}
                  disabled={bulkLoading}
                  className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingId(null);
                    setEditData({});
                  }}
                  className="text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingId(row.id);
                    setEditData({ [row.id]: {} });
                  }}
                  className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteProduct(row.id, row.product_name)}
                  disabled={deletingId === row.id}
                  className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        );
      },
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

  const filteredData = products.filter((product) => {
    const matchesSearch = (product.product_name || '').toLowerCase().includes(searchValue.toLowerCase()) ||
                         (product.product_code || '').toLowerCase().includes(searchValue.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || (product.category_id === categoryFilter);
    const level = getStockLevel(product.current_stock || 0);
    const matchesStock = stockFilter === 'all' || level === stockFilter;
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Products"
          subtitle={`Manage your product catalog and inventory levels${selectedIds.size > 0 ? ` (${selectedIds.size} selected)` : ''}`}
          actions={[
            ...(selectedIds.size > 0 ? [
              <Button
                key="delete-selected"
                variant="destructive"
                onClick={() => handleBulkDelete('selected')}
                disabled={bulkLoading}
                className="gap-2 bg-red-600 hover:bg-red-700"
              >
                <TrashIcon className="h-4 w-4" />
                Delete Selected
              </Button>,
              <Button
                key="delete-unselected"
                variant="outline"
                onClick={() => handleBulkDelete('unselected')}
                disabled={bulkLoading}
                className="gap-2"
              >
                <TrashIcon className="h-4 w-4" />
                Delete Unselected
              </Button>,
            ] : []),
            <Button
              key="delete-all"
              variant="outline"
              onClick={() => handleBulkDelete('all')}
              disabled={bulkLoading || filteredData.length === 0}
              className="gap-2"
            >
              <TrashIcon className="h-4 w-4" />
              Delete All
            </Button>,
            <div key="export-group" className="flex gap-2">
              <Button
                onClick={() => handleExport('csv')}
                disabled={bulkLoading}
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                CSV
              </Button>
              <Button
                onClick={() => handleExport('json')}
                disabled={bulkLoading}
                variant="outline"
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                JSON
              </Button>
              <Button
                onClick={handlePrint}
                disabled={bulkLoading || filteredData.length === 0}
                variant="outline"
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>,
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-600">
              <p className="font-semibold mb-2">Error loading products</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-3" />
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No products found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Create your first product to get started</p>
              <Button onClick={() => router.push('/inventory/products/new')} className="gap-2">
                <Plus className="h-4 w-4" />
                Create First Product
              </Button>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredData}
            />
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-600">
              <p className="font-semibold mb-2">Error loading products</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-3" />
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No products found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Create your first product to get started</p>
              <Button onClick={() => router.push('/inventory/products/new')} className="gap-2">
                <Plus className="h-4 w-4" />
                Create First Product
              </Button>
            </div>
          ) : (
            filteredData.map((product) => {
              const level = getStockLevel(product.current_stock || 0);
              const stockInfo = stockLevels[level];
              
              return (
                <MobileCard
                  key={product.id}
                  onClick={() => router.push(`/inventory/products/${product.id}`)}
                  data={[
                    { label: 'Product', value: product.product_name },
                    { label: 'Code', value: product.product_code },
                    { label: 'Stock', value: product.current_stock },
                    { label: 'Price', value: `UGX ${product.selling_price.toLocaleString()}` },
                    {
                      label: 'Status',
                      value: <Badge className={stockInfo.color}>{stockInfo.label}</Badge>
                    },
                  ]}
                />
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
