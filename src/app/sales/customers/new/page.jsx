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

export default function NewCustomerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    taxId: '',
    creditLimit: '',
    paymentTerms: '',
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

    toast.success('Customer created successfully!');
    setTimeout(() => router.push('/sales/customers/list'), 1000);
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="New Customer"
          subtitle="Add a new customer to your database"
          actions={[
            <Button
              key="cancel"
              variant="outline"
              onClick={() => router.push('/sales/customers/list')}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>,
          ]}
        />

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="space-y-6">
            {/* Basic Information */}
            <FormCard title="Basic Information" description="Enter customer's primary contact details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="name">Full Name / Business Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="John Doe / Acme Corporation"
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
                    placeholder="contact@example.com"
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
                    placeholder="+1 (555) 123-4567"
                    className="mt-2"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="company">Company Name (Optional)</Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder="Company name if different from customer name"
                    className="mt-2"
                  />
                </div>
              </div>
            </FormCard>

            {/* Address Information */}
            <FormCard title="Address Information" description="Customer's billing and shipping address">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="123 Main Street, Suite 100"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="New York"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State / Province</Label>
                  <Input
                    id="state"
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    placeholder="NY"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                  <Input
                    id="zipCode"
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleChange('zipCode', e.target.value)}
                    placeholder="10001"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    placeholder="United States"
                    className="mt-2"
                  />
                </div>
              </div>
            </FormCard>

            {/* Business Information */}
            <FormCard title="Business Information" description="Tax and payment terms">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                  <Input
                    id="taxId"
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => handleChange('taxId', e.target.value)}
                    placeholder="XX-XXXXXXX"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="creditLimit">Credit Limit</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    value={formData.creditLimit}
                    onChange={(e) => handleChange('creditLimit', e.target.value)}
                    placeholder="10000"
                    className="mt-2"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Select value={formData.paymentTerms} onValueChange={(value) => handleChange('paymentTerms', value)}>
                    <SelectTrigger id="paymentTerms" className="mt-2">
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="net7">Net 7 Days</SelectItem>
                      <SelectItem value="net15">Net 15 Days</SelectItem>
                      <SelectItem value="net30">Net 30 Days</SelectItem>
                      <SelectItem value="net60">Net 60 Days</SelectItem>
                      <SelectItem value="net90">Net 90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </FormCard>

            {/* Additional Notes */}
            <FormCard title="Additional Notes" description="Any special instructions or remarks">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Enter any additional information about this customer..."
                  className="mt-2"
                  rows={4}
                />
              </div>
            </FormCard>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/sales/customers/list')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Create Customer
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
