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
    name: '',
    sku: '',
    category: '',
    description: '',
    cost: '',
    price: '',
    initialStock: '',
    minStock: '',
    maxStock: '',
    unit: '',
    barcode: '',
    weight: '',
    dimensions: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sku || !formData.category || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Product created successfully!');
    setTimeout(() => router.push('/inventory/products/list'), 1000);
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
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter product name"
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    type="text"
                    value={formData.sku}
                    onChange={(e) => handleChange('sku', e.target.value)}
                    placeholder="e.g., LP-PRO-15"
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                    <SelectTrigger id="category" className="mt-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Office">Office Supplies</SelectItem>
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
                  />
                </div>
              </div>
            </FormCard>

            {/* Pricing */}
            <FormCard title="Pricing" description="Set cost and selling prices">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="cost">Cost Price</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => handleChange('cost', e.target.value)}
                    placeholder="0.00"
                    className="mt-2"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label htmlFor="price">Selling Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    placeholder="0.00"
                    className="mt-2"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {formData.cost && formData.price && (
                  <div className="md:col-span-2 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Profit Margin</span>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {(((formData.price - formData.cost) / formData.price) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </FormCard>

            {/* Inventory */}
            <FormCard title="Inventory" description="Stock levels and units">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="initialStock">Initial Stock</Label>
                  <Input
                    id="initialStock"
                    type="number"
                    value={formData.initialStock}
                    onChange={(e) => handleChange('initialStock', e.target.value)}
                    placeholder="0"
                    className="mt-2"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="minStock">Minimum Stock Alert</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => handleChange('minStock', e.target.value)}
                    placeholder="10"
                    className="mt-2"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="maxStock">Maximum Stock</Label>
                  <Input
                    id="maxStock"
                    type="number"
                    value={formData.maxStock}
                    onChange={(e) => handleChange('maxStock', e.target.value)}
                    placeholder="1000"
                    className="mt-2"
                    min="0"
                  />
                </div>

                <div className="md:col-span-3">
                  <Label htmlFor="unit">Unit of Measure</Label>
                  <Select value={formData.unit} onValueChange={(value) => handleChange('unit', value)}>
                    <SelectTrigger id="unit" className="mt-2">
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
              </div>
            </FormCard>

            {/* Additional Details */}
            <FormCard title="Additional Details" description="Barcode, weight, and dimensions">
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
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    placeholder="0.0"
                    className="mt-2"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="dimensions">Dimensions (L × W × H)</Label>
                  <Input
                    id="dimensions"
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => handleChange('dimensions', e.target.value)}
                    placeholder="e.g., 30 × 20 × 10 cm"
                    className="mt-2"
                  />
                </div>
              </div>
            </FormCard>

            {/* Image Upload */}
            <FormCard title="Product Image" description="Upload product photos">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
            </FormCard>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/inventory/products/list')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Create Product
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
