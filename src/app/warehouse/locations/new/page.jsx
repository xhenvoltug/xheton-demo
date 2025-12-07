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

export default function NewWarehousePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    capacity: '',
    manager: '',
    email: '',
    phone: '',
    notes: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Warehouse added successfully!');
    setTimeout(() => router.push('/warehouse/locations/list'), 1000);
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="New Warehouse"
          subtitle="Add a new warehouse location"
          actions={[
            <Button
              key="cancel"
              variant="outline"
              onClick={() => router.push('/warehouse/locations/list')}
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
                <Label htmlFor="name">Warehouse Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Main Warehouse"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                  <SelectTrigger id="type" className="mt-2">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Warehouse</SelectItem>
                    <SelectItem value="distribution">Distribution Center</SelectItem>
                    <SelectItem value="hub">Hub</SelectItem>
                    <SelectItem value="branch">Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="capacity">Capacity (sqft)</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleChange('capacity', e.target.value)}
                  placeholder="e.g., 10000"
                  className="mt-2"
                />
              </div>
            </div>
          </FormCard>

          <FormCard title="Location Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="123 Warehouse Street"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="New York"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="NY"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleChange('zipCode', e.target.value)}
                  placeholder="10001"
                  className="mt-2"
                />
              </div>
            </div>
          </FormCard>

          <FormCard title="Manager Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="manager">Manager Name</Label>
                <Input
                  id="manager"
                  value={formData.manager}
                  onChange={(e) => handleChange('manager', e.target.value)}
                  placeholder="John Smith"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="manager@example.com"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="mt-2"
                />
              </div>
            </div>
          </FormCard>

          <FormCard title="Additional Notes">
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Any additional information..."
                className="mt-2"
                rows={4}
              />
            </div>
          </FormCard>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/warehouse/locations/list')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 gap-2"
            >
              <Save className="h-4 w-4" />
              Save Warehouse
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
