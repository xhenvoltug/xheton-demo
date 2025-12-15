'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import FilterBar from '@/components/shared/FilterBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusBadge from '@/components/core/StatusBadge';
import { Plus, Download, Warehouse, Package, MapPin, Check, X, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function WarehousesPage() {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [savingId, setSavingId] = useState(null);

  // Fetch warehouses on mount
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await fetch('/api/inventory/warehouses');
        const data = await res.json();
        if (data.success) {
          setWarehouses(data.warehouses || []);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  const filteredWarehouses = warehouses.filter(wh => {
    const matchesSearch = wh.warehouse_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (wh.city && wh.city.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || (wh.is_active && statusFilter === 'active') || (!wh.is_active && statusFilter === 'inactive');
    return matchesSearch && matchesStatus;
  });

  const totalWarehouses = warehouses.length;
  const activeWarehouses = warehouses.filter(w => w.is_active).length;
  const totalCapacity = warehouses.reduce((sum, w) => sum + (w.capacity || 0), 0);
  const totalOccupied = warehouses.reduce((sum, w) => sum + (w.occupied || 0), 0);

  const handleDelete = async (warehouseId) => {
    if (!confirm('Are you sure you want to delete this warehouse?')) return;

    try {
      const res = await fetch(`/api/inventory/warehouses/${warehouseId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        toast.success('Warehouse deleted successfully');
        setWarehouses(warehouses.filter(w => w.id !== warehouseId));
      } else {
        toast.error('Failed to delete warehouse');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const startEdit = (warehouse) => {
    setEditingId(warehouse.id);
    setEditValues({
      warehouse_name: warehouse.warehouse_name,
      city: warehouse.city || '',
      address: warehouse.address || '',
      capacity: warehouse.capacity || '',
      warehouse_type: warehouse.warehouse_type || 'main'
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = async (warehouseId) => {
    if (!editValues.warehouse_name) {
      toast.error('Warehouse name is required');
      return;
    }

    setSavingId(warehouseId);
    try {
      const updateData = {
        warehouse_name: editValues.warehouse_name,
        city: editValues.city,
        address: editValues.address,
        capacity: editValues.capacity ? parseFloat(editValues.capacity) : null,
        warehouse_type: editValues.warehouse_type
      };

      const res = await fetch(`/api/inventory/warehouses/${warehouseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Warehouse updated successfully!');
        setWarehouses(warehouses.map(w => w.id === warehouseId ? data.warehouse : w));
        setEditingId(null);
        setEditValues({});
      } else {
        toast.error(data.error || 'Failed to update warehouse');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const createNewWarehouse = () => {
    setEditingId('new');
    setEditValues({
      warehouse_name: '',
      warehouse_code: '',
      city: '',
      address: '',
      capacity: '',
      warehouse_type: 'main'
    });
  };

  const saveNewWarehouse = async () => {
    if (!editValues.warehouse_name || !editValues.warehouse_code) {
      toast.error('Warehouse name and code are required');
      return;
    }

    setSavingId('new');
    try {
      const createData = {
        warehouse_name: editValues.warehouse_name,
        warehouse_code: editValues.warehouse_code,
        city: editValues.city,
        address: editValues.address,
        capacity: editValues.capacity ? parseFloat(editValues.capacity) : null,
        warehouse_type: editValues.warehouse_type
      };

      const res = await fetch('/api/inventory/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Warehouse created successfully!');
        setWarehouses([...warehouses, data.warehouse]);
        setEditingId(null);
        setEditValues({});
      } else {
        toast.error(data.error || 'Failed to create warehouse');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const columns = [];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Warehouses"
          subtitle="Manage warehouse locations and capacity"
          actions={[
            <Button
              key="export"
              variant="outline"
              className="rounded-2xl"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>,
            <Button
              key="new"
              onClick={createNewWarehouse}
              className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Warehouse
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Warehouses', value: totalWarehouses, color: 'from-blue-500 to-cyan-500', icon: Warehouse },
            { label: 'Active', value: activeWarehouses, color: 'from-emerald-500 to-teal-500', icon: Warehouse },
            { label: 'Total Capacity', value: totalCapacity.toLocaleString(), color: 'from-purple-500 to-pink-500', icon: Package },
            { label: 'Occupied', value: totalOccupied.toLocaleString(), color: 'from-amber-500 to-orange-500', icon: Package }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-8 w-8 opacity-80" />
                </div>
                <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rounded-3xl shadow-lg border-0">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search by name or location..."
              filters={[
                {
                  label: 'Status',
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: [
                    { value: 'all', label: 'All Status' },
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' }
                  ]
                }
              ]}
            />

            {/* Warehouses Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Capacity</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* New Warehouse Row (when creating) */}
                  {editingId === 'new' && (
                    <tr className="border-b bg-blue-50 dark:bg-blue-900/20">
                      <td className="px-4 py-3">
                        <Input
                          value={editValues.warehouse_name}
                          onChange={(e) => setEditValues({ ...editValues, warehouse_name: e.target.value })}
                          placeholder="Warehouse name"
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={editValues.warehouse_code}
                          onChange={(e) => setEditValues({ ...editValues, warehouse_code: e.target.value })}
                          placeholder="Code"
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={editValues.city}
                          onChange={(e) => setEditValues({ ...editValues, city: e.target.value })}
                          placeholder="City"
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={editValues.warehouse_type}
                          onChange={(e) => setEditValues({ ...editValues, warehouse_type: e.target.value })}
                          className="h-8 text-sm border rounded px-2 dark:bg-gray-800"
                        >
                          <option value="main">Main</option>
                          <option value="satellite">Satellite</option>
                          <option value="distribution">Distribution</option>
                          <option value="cold_storage">Cold Storage</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          value={editValues.capacity}
                          onChange={(e) => setEditValues({ ...editValues, capacity: e.target.value })}
                          placeholder="Capacity"
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm">New</span>
                      </td>
                      <td className="px-4 py-3 flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={saveNewWarehouse}
                          disabled={savingId === 'new'}
                          className="h-7 w-7 p-0 text-green-600 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={cancelEdit}
                          disabled={savingId === 'new'}
                          className="h-7 w-7 p-0 text-gray-600 hover:bg-gray-100"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  )}

                  {/* Existing Warehouses */}
                  {filteredWarehouses.map((warehouse) => (
                    <tr key={warehouse.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      {editingId === warehouse.id ? (
                        <>
                          <td className="px-4 py-3">
                            <Input
                              value={editValues.warehouse_name}
                              onChange={(e) => setEditValues({ ...editValues, warehouse_name: e.target.value })}
                              className="h-8 text-sm"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-mono">{warehouse.warehouse_code}</span>
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={editValues.city}
                              onChange={(e) => setEditValues({ ...editValues, city: e.target.value })}
                              className="h-8 text-sm"
                              placeholder="City"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={editValues.warehouse_type}
                              onChange={(e) => setEditValues({ ...editValues, warehouse_type: e.target.value })}
                              className="h-8 text-sm border rounded px-2 dark:bg-gray-800"
                            >
                              <option value="main">Main</option>
                              <option value="satellite">Satellite</option>
                              <option value="distribution">Distribution</option>
                              <option value="cold_storage">Cold Storage</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              value={editValues.capacity}
                              onChange={(e) => setEditValues({ ...editValues, capacity: e.target.value })}
                              className="h-8 text-sm"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge variant={warehouse.is_active ? 'success' : 'default'}>
                              {warehouse.is_active ? 'Active' : 'Inactive'}
                            </StatusBadge>
                          </td>
                          <td className="px-4 py-3 flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => saveEdit(warehouse.id)}
                              disabled={savingId === warehouse.id}
                              className="h-7 w-7 p-0 text-green-600 hover:bg-green-50"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={cancelEdit}
                              disabled={savingId === warehouse.id}
                              className="h-7 w-7 p-0 text-gray-600 hover:bg-gray-100"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-gray-900 dark:text-white">{warehouse.warehouse_name}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{warehouse.warehouse_code}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{warehouse.city || warehouse.address || '-'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium capitalize">{warehouse.warehouse_type || 'main'}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm">{warehouse.capacity ? warehouse.capacity.toLocaleString() : '-'}</span>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge variant={warehouse.is_active ? 'success' : 'default'}>
                              {warehouse.is_active ? 'Active' : 'Inactive'}
                            </StatusBadge>
                          </td>
                          <td className="px-4 py-3 flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEdit(warehouse)}
                              className="h-7 w-7 p-0 text-blue-600 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(warehouse.id)}
                              className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}

                  {filteredWarehouses.length === 0 && editingId !== 'new' && (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                        No warehouses found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
