'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import FormCard from '@/components/shared/FormCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const mockProducts = [
  { id: 'P001', name: 'Laptop Pro 15"' },
  { id: 'P002', name: 'Wireless Mouse' },
  { id: 'P003', name: 'USB-C Cable' },
];

export default function NewAdjustmentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    product: '',
    type: '',
    quantity: '',
    reason: '',
    remarks: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.product || !formData.type || !formData.quantity || !formData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Stock adjustment created successfully!');
    setTimeout(() => router.push('/inventory/adjustments/list'), 1000);
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="New Stock Adjustment"
          subtitle="Adjust product inventory levels"
          actions={[
            <Button
              key="cancel"
              variant="outline"
              onClick={() => router.push('/inventory/adjustments/list')}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>,
          ]}
        />

        <form onSubmit={handleSubmit} className="max-w-3xl">
          <FormCard title="Adjustment Details">
            <div className="space-y-6">
              <div>
                <Label htmlFor="product">Product *</Label>
                <Select value={formData.product} onValueChange={(v) => setFormData({ ...formData, product: v })}>
                  <SelectTrigger id="product" className="mt-2">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProducts.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger id="type" className="mt-2">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increase">Increase Stock</SelectItem>
                      <SelectItem value="decrease">Decrease Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="0"
                    className="mt-2"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="reason">Reason *</Label>
                <Select value={formData.reason} onValueChange={(v) => setFormData({ ...formData, reason: v })}>
                  <SelectTrigger id="reason" className="mt-2">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stock_count">Stock Count Correction</SelectItem>
                    <SelectItem value="damaged">Damaged Items</SelectItem>
                    <SelectItem value="expired">Expired Items</SelectItem>
                    <SelectItem value="lost">Lost Items</SelectItem>
                    <SelectItem value="found">Found Items</SelectItem>
                    <SelectItem value="return">Customer Return</SelectItem>
                    <SelectItem value="transfer">Warehouse Transfer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Additional notes..."
                  className="mt-2"
                  rows={4}
                />
              </div>
            </div>
          </FormCard>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => router.push('/inventory/adjustments/list')}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600">
              <Save className="h-4 w-4 mr-2" />
              Create Adjustment
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
