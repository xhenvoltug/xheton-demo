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

export default function NewSupplierPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    taxId: '',
    paymentTerms: '',
    creditLimit: '',
    notes: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Supplier added successfully!');
    setTimeout(() => router.push('/purchases/suppliers/list'), 1000);
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="New Supplier"
          subtitle="Add a new supplier to the database"
          actions={[
            <Button
              key="cancel"
              variant="outline"
              onClick={() => router.push('/purchases/suppliers/list')}
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
              <div className="md:col-span-2">
                <Label htmlFor="name">Supplier Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Tech Supplies Co"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="supplier@example.com"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="mt-2"
                  required
                />
              </div>
            </div>
          </FormCard>

          <FormCard title="Address Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="123 Business Street"
                  className="mt-2"
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
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  placeholder="United States"
                  className="mt-2"
                />
              </div>
            </div>
          </FormCard>

          <FormCard title="Business Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleChange('taxId', e.target.value)}
                  placeholder="XX-XXXXXXX"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Select value={formData.paymentTerms} onValueChange={(value) => handleChange('paymentTerms', value)}>
                  <SelectTrigger id="paymentTerms" className="mt-2">
                    <SelectValue placeholder="Select terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net-7">Net 7 Days</SelectItem>
                    <SelectItem value="net-15">Net 15 Days</SelectItem>
                    <SelectItem value="net-30">Net 30 Days</SelectItem>
                    <SelectItem value="net-45">Net 45 Days</SelectItem>
                    <SelectItem value="net-60">Net 60 Days</SelectItem>
                    <SelectItem value="immediate">Immediate Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="creditLimit">Credit Limit ($)</Label>
                <Input
                  id="creditLimit"
                  type="number"
                  value={formData.creditLimit}
                  onChange={(e) => handleChange('creditLimit', e.target.value)}
                  placeholder="0.00"
                  className="mt-2"
                  step="0.01"
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
                placeholder="Any additional information about this supplier..."
                className="mt-2"
                rows={4}
              />
            </div>
          </FormCard>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/purchases/suppliers/list')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2"
            >
              <Save className="h-4 w-4" />
              Save Supplier
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
