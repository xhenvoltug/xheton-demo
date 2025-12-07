'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import FormCard from '@/components/shared/FormCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const mockWarehouses = [
  { id: 'WH-001', name: 'Main Warehouse' },
  { id: 'WH-002', name: 'West Coast Distribution' },
  { id: 'WH-003', name: 'East Coast Hub' },
];

export default function NewBinPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    binId: '',
    warehouse: '',
    zone: '',
    aisle: '',
    level: '',
    capacity: '',
    notes: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.binId || !formData.warehouse || !formData.zone || !formData.aisle || !formData.level) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Bin created successfully!');
    setTimeout(() => router.push('/warehouse/bins/list'), 1000);
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="New Bin Location"
          subtitle="Add a new storage bin to the warehouse"
          actions={[
            <Button
              key="cancel"
              variant="outline"
              onClick={() => router.push('/warehouse/bins/list')}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>,
          ]}
        />

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          <FormCard title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="binId">Bin ID *</Label>
                <Input
                  id="binId"
                  value={formData.binId}
                  onChange={(e) => handleChange('binId', e.target.value)}
                  placeholder="e.g., BIN-A-001"
                  className="mt-2 font-mono"
                  required
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Unique identifier for this bin location
                </p>
              </div>

              <div>
                <Label htmlFor="warehouse">Warehouse *</Label>
                <Select value={formData.warehouse} onValueChange={(value) => handleChange('warehouse', value)}>
                  <SelectTrigger id="warehouse" className="mt-2">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockWarehouses.map((wh) => (
                      <SelectItem key={wh.id} value={wh.id}>{wh.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="capacity">Capacity (units)</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleChange('capacity', e.target.value)}
                  placeholder="e.g., 100"
                  className="mt-2"
                  min="1"
                />
              </div>
            </div>
          </FormCard>

          <FormCard title="Location Details">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="zone">Zone *</Label>
                <Input
                  id="zone"
                  value={formData.zone}
                  onChange={(e) => handleChange('zone', e.target.value)}
                  placeholder="e.g., A"
                  className="mt-2"
                  required
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Warehouse zone or section
                </p>
              </div>

              <div>
                <Label htmlFor="aisle">Aisle *</Label>
                <Input
                  id="aisle"
                  value={formData.aisle}
                  onChange={(e) => handleChange('aisle', e.target.value)}
                  placeholder="e.g., 1"
                  className="mt-2"
                  required
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Aisle number
                </p>
              </div>

              <div>
                <Label htmlFor="level">Level/Shelf *</Label>
                <Input
                  id="level"
                  value={formData.level}
                  onChange={(e) => handleChange('level', e.target.value)}
                  placeholder="e.g., 1"
                  className="mt-2"
                  required
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Shelf or level number
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-purple-900 dark:text-purple-100">
                <strong>Location Preview:</strong> Zone {formData.zone || '___'} • Aisle {formData.aisle || '___'} • Level {formData.level || '___'}
              </p>
            </div>
          </FormCard>

          <FormCard title="Additional Notes">
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Any special instructions or details about this bin..."
                className="mt-2"
                rows={4}
              />
            </div>
          </FormCard>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/warehouse/bins/list')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 gap-2"
            >
              <Save className="h-4 w-4" />
              Create Bin
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
