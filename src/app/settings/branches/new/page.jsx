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
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewBranchPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    manager: '',
    status: 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Branch created successfully');
    setTimeout(() => router.push('/settings/branches/list'), 1000);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Add New Branch"
          subtitle="Create a new branch location for your business"
          actions={[
            <Button
              key="back"
              variant="outline"
              onClick={() => router.push('/settings/branches/list')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ]}
        />

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          <FormCard title="Branch Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Branch Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Westlands Branch"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g., Westlands, Nairobi"
                  required
                  className="mt-1.5"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Street Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Enter full street address"
                  className="mt-1.5"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="e.g., Nairobi"
                  className="mt-1.5"
                />
              </div>
            </div>
          </FormCard>

          <FormCard title="Contact Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+254 700 000 000"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="branch@company.com"
                  className="mt-1.5"
                />
              </div>
            </div>
          </FormCard>

          <FormCard title="Management">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manager">Branch Manager</Label>
                <Select value={formData.manager} onValueChange={(value) => handleChange('manager', value)}>
                  <SelectTrigger id="manager" className="mt-1.5">
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-kamau">John Kamau</SelectItem>
                    <SelectItem value="mary-wanjiru">Mary Wanjiru</SelectItem>
                    <SelectItem value="james-ochieng">James Ochieng</SelectItem>
                    <SelectItem value="sarah-akinyi">Sarah Akinyi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger id="status" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </FormCard>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push('/settings/branches/list')}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Create Branch
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
