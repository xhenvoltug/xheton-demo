'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Percent } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const mockTaxes = [
  { id: 'T001', name: 'VAT', percentage: 16, isDefault: true, type: 'Inclusive', description: 'Value Added Tax' },
  { id: 'T002', name: 'WHT', percentage: 5, isDefault: false, type: 'Exclusive', description: 'Withholding Tax' },
  { id: 'T003', name: 'Excise Duty', percentage: 10, isDefault: false, type: 'Exclusive', description: 'Excise Tax' },
];

export default function TaxesPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    percentage: '',
    description: '',
    isDefault: false,
    type: 'inclusive'
  });

  const handleOpenDialog = (tax = null) => {
    if (tax) {
      setEditingTax(tax);
      setFormData({
        name: tax.name,
        percentage: tax.percentage.toString(),
        description: tax.description,
        isDefault: tax.isDefault,
        type: tax.type.toLowerCase()
      });
    } else {
      setEditingTax(null);
      setFormData({ name: '', percentage: '', description: '', isDefault: false, type: 'inclusive' });
    }
    setShowDialog(true);
  };

  const handleSaveTax = () => {
    if (!formData.name || !formData.percentage) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success(editingTax ? 'Tax updated successfully' : 'Tax created successfully');
    setShowDialog(false);
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Tax Configuration"
          subtitle="Manage tax rates and rules"
          actions={[
            <Button
              key="add"
              onClick={() => handleOpenDialog()}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tax
            </Button>
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 bg-white dark:bg-gray-900/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tax Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTaxes.map((tax) => (
                  <TableRow key={tax.id}>
                    <TableCell className="font-medium">{tax.name}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{tax.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>{tax.percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{tax.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {tax.isDefault && (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          Default
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(tax)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Tax Preview */}
            <div className="mt-8 pt-6 border-t dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tax Calculation Preview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Inclusive Tax (VAT 16%)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Item Price:</span>
                      <span className="font-medium">UGX 1,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tax (16%):</span>
                      <span className="font-medium">UGX 137.93</span>
                    </div>
                    <div className="flex justify-between border-t dark:border-gray-700 pt-2">
                      <span className="font-semibold">Total:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">UGX 1,000.00</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Exclusive Tax (WHT 5%)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Item Price:</span>
                      <span className="font-medium">UGX 1,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tax (5%):</span>
                      <span className="font-medium">UGX 50.00</span>
                    </div>
                    <div className="flex justify-between border-t dark:border-gray-700 pt-2">
                      <span className="font-semibold">Total:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">UGX 1,050.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Add/Edit Tax Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTax ? 'Edit Tax' : 'Add New Tax'}</DialogTitle>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 py-4"
            >
              <div>
                <Label htmlFor="taxName">Tax Name *</Label>
                <Input
                  id="taxName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., VAT"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="taxDescription">Description</Label>
                <Input
                  id="taxDescription"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="taxPercentage">Tax Rate (%) *</Label>
                <Input
                  id="taxPercentage"
                  type="number"
                  step="0.01"
                  value={formData.percentage}
                  onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                  placeholder="16"
                  className="mt-1.5"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="taxInclusive"
                    checked={formData.type === 'inclusive'}
                    onCheckedChange={(checked) => setFormData({ ...formData, type: checked ? 'inclusive' : 'exclusive' })}
                  />
                  <label
                    htmlFor="taxInclusive"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Tax Inclusive (included in price)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="taxDefault"
                    checked={formData.isDefault}
                    onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
                  />
                  <label
                    htmlFor="taxDefault"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Set as default tax
                  </label>
                </div>
              </div>
            </motion.div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveTax}
                className="bg-gradient-to-r from-emerald-600 to-teal-600"
              >
                {editingTax ? 'Update' : 'Create'} Tax
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
