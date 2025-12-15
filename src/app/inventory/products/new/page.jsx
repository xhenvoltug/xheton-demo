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
import { Save, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    product_name: '',
    product_code: '',
    category_id: '',
    description: '',
    cost_price: '',
    selling_price: '',
    tax_rate: '',
    unit_of_measure: '',
    barcode: '',
    product_type: 'physical',
    is_active: true,
    is_taxable: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.product_name || !formData.product_code || !formData.selling_price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        product_code: formData.product_code,
        product_name: formData.product_name,
        barcode: formData.barcode,
        category_id: formData.category_id || null,
        description: formData.description,
        product_type: formData.product_type,
        unit_of_measure: formData.unit_of_measure || 'piece',
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : 0,
        selling_price: parseFloat(formData.selling_price),
        tax_rate: formData.tax_rate ? parseFloat(formData.tax_rate) : 0,
        is_active: formData.is_active,
        is_taxable: formData.is_taxable,
        track_inventory: true,
      };
      
      console.log('Sending product payload:', payload);
      
      const res = await fetch('/api/inventory/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log('API Response:', data);

      if (!res.ok) {
        const errorMsg = data.error || data.message || 'Failed to create product';
        console.error('API Error:', errorMsg);
        toast.error(errorMsg);
        setLoading(false);
        return;
      }

      if (data.success) {
        toast.success('Product created successfully!');
        setTimeout(() => router.push('/inventory/products/list'), 1000);
      } else {
        toast.error(data.error || 'Product creation failed');
      }
    } catch (err) {
      console.error('Product creation error:', err);
      toast.error(err.message || 'Failed to create product');
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="New Product"
          subtitle="Add a new product to your inventory"
          actions={[
            <Button
              key="cancel"
              variant="outline"
              onClick={() => router.push('/inventory/products/list')}
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
            <FormCard title="Basic Information" description="Essential product details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="product_name">Product Name *</Label>
                  <Input
                    id="product_name"
                    type="text"
                    value={formData.product_name}
                    onChange={(e) => handleChange('product_name', e.target.value)}
                    placeholder="Enter product name"
                    className="mt-2"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="product_code">Product Code *</Label>
                  <Input
                    id="product_code"
                    type="text"
                    value={formData.product_code}
                    onChange={(e) => handleChange('product_code', e.target.value)}
                    placeholder="e.g., PROD-001"
                    className="mt-2"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="category_id">Category</Label>
                  <Select value={formData.category_id || "none"} onValueChange={(value) => handleChange('category_id', value === "none" ? null : value)}>
                    <SelectTrigger id="category_id" className="mt-2" disabled={loading}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="office">Office Supplies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe the product..."
                    className="mt-2"
                    rows={4}
                    disabled={loading}
                  />
                </div>
              </div>
            </FormCard>

            {/* Pricing */}
            <FormCard title="Pricing" description="Set cost and selling prices">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="cost_price">Cost Price</Label>
                  <Input
                    id="cost_price"
                    type="number"
                    value={formData.cost_price}
                    onChange={(e) => handleChange('cost_price', e.target.value)}
                    placeholder="0.00"
                    className="mt-2"
                    min="0"
                    step="0.01"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="selling_price">Selling Price *</Label>
                  <Input
                    id="selling_price"
                    type="number"
                    value={formData.selling_price}
                    onChange={(e) => handleChange('selling_price', e.target.value)}
                    placeholder="0.00"
                    className="mt-2"
                    min="0"
                    step="0.01"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                  <Input
                    id="tax_rate"
                    type="number"
                    value={formData.tax_rate}
                    onChange={(e) => handleChange('tax_rate', e.target.value)}
                    placeholder="0"
                    className="mt-2"
                    min="0"
                    step="0.01"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="product_type">Product Type</Label>
                  <Select value={formData.product_type} onValueChange={(value) => handleChange('product_type', value)}>
                    <SelectTrigger id="product_type" className="mt-2" disabled={loading}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physical">Physical</SelectItem>
                      <SelectItem value="digital">Digital</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.cost_price && formData.selling_price && (
                  <div className="md:col-span-2 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Profit Margin</span>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {(((formData.selling_price - formData.cost_price) / formData.selling_price) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </FormCard>

            {/* Additional Details */}
            <FormCard title="Additional Details" description="Barcode, unit of measure, and status">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="barcode">Barcode / EAN</Label>
                  <Input
                    id="barcode"
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => handleChange('barcode', e.target.value)}
                    placeholder="Enter barcode number"
                    className="mt-2"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="unit_of_measure">Unit of Measure</Label>
                  <Select value={formData.unit_of_measure} onValueChange={(value) => handleChange('unit_of_measure', value)}>
                    <SelectTrigger id="unit_of_measure" className="mt-2" disabled={loading}>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="kg">Kilogram</SelectItem>
                      <SelectItem value="liter">Liter</SelectItem>
                      <SelectItem value="meter">Meter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="is_taxable" className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      id="is_taxable"
                      type="checkbox"
                      checked={formData.is_taxable}
                      onChange={(e) => handleChange('is_taxable', e.target.checked)}
                      disabled={loading}
                      className="rounded"
                    />
                    <span>This product is taxable</span>
                  </Label>
                </div>

                <div>
                  <Label htmlFor="is_active" className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      id="is_active"
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => handleChange('is_active', e.target.checked)}
                      disabled={loading}
                      className="rounded"
                    />
                    <span>Product is active</span>
                  </Label>
                </div>
              </div>
            </FormCard>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/inventory/products/list')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                disabled={loading}
              >
                {loading ? 'Creating...' : (<><Save className="h-4 w-4 mr-2" />Create Product</>)}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
