'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import FormCard from '@/components/shared/FormCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Save, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewGoodsReceivedPage() {
  const router = useRouter();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loadingPos, setLoadingPos] = useState(true);
  const [poNumber, setPoNumber] = useState('');
  const [selectedPO, setSelectedPO] = useState(null);
  const [receivedItems, setReceivedItems] = useState([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchPOs = async () => {
      try {
        setLoadingPos(true);
        const res = await fetch('/api/purchases/orders/list');
        if (!res.ok) throw new Error('Failed to load POs');
        const json = await res.json();
        setPurchaseOrders(json.data || json || []);
      } catch (err) {
        toast.error('Failed to load purchase orders');
      } finally {
        setLoadingPos(false);
      }
    };
    fetchPOs();
  }, []);

  const handlePOSelect = (value) => {
    setPoNumber(value);
    const po = purchaseOrders.find(p => p.id === value);
    setSelectedPO(po);
    setReceivedItems(po ? (po.items || []).map(item => ({
      ...item,
      receivedQty: 0,
      damaged: 0,
      remarks: '',
    })) : []);
  };

  const updateReceivedQty = (index, value) => {
    const newItems = [...receivedItems];
    const qty = parseInt(value) || 0;
    newItems[index].receivedQty = Math.min(qty, newItems[index].ordered);
    setReceivedItems(newItems);
  };

  const updateDamagedQty = (index, value) => {
    const newItems = [...receivedItems];
    const qty = parseInt(value) || 0;
    newItems[index].damaged = Math.min(qty, newItems[index].receivedQty);
    setReceivedItems(newItems);
  };

  const updateRemarks = (index, value) => {
    const newItems = [...receivedItems];
    newItems[index].remarks = value;
    setReceivedItems(newItems);
  };

  const handleSave = () => {
    if (!poNumber) {
      toast.error('Please select a purchase order');
      return;
    }
    
    const totalReceived = receivedItems.reduce((sum, item) => sum + item.receivedQty, 0);
    if (totalReceived === 0) {
      toast.error('Please enter received quantities');
      return;
    }
    
    toast.success('Goods received note created successfully!');
    setTimeout(() => router.push('/purchases/goods-received/list'), 1000);
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="New Goods Received Note"
          subtitle="Record incoming goods from purchase order"
          actions={[
            <Button
              key="cancel"
              variant="outline"
              onClick={() => router.push('/purchases/goods-received/list')}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>,
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FormCard title="Purchase Order">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="poNumber">Select Purchase Order *</Label>
                  <Select value={poNumber} onValueChange={handlePOSelect} disabled={loadingPos}>
                    <SelectTrigger id="poNumber" className="mt-2">
                      <SelectValue placeholder={loadingPos ? "Loading POs..." : "Choose PO to receive"} />
                    </SelectTrigger>
                    <SelectContent>
                      {purchaseOrders.map((po) => (
                        <SelectItem key={po.id} value={po.id}>
                          {po.po_number || po.id} - {po.supplier_name || po.supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedPO && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">
                          {selectedPO.supplier}
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Total items in order: {selectedPO.items.length}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </FormCard>

            {receivedItems.length > 0 && (
              <FormCard title="Items to Receive">
                <div className="space-y-4">
                  <AnimatePresence>
                    {receivedItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="p-4 bg-gray-50 dark:bg-gray-800/50">
                          <div className="space-y-4">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {item.sku}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label className="text-xs">Ordered Quantity</Label>
                                <div className="mt-1 h-10 flex items-center">
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {item.ordered} units
                                  </span>
                                </div>
                              </div>

                              <div>
                                <Label htmlFor={`received-${item.id}`} className="text-xs">Received Quantity *</Label>
                                <Input
                                  id={`received-${item.id}`}
                                  type="number"
                                  value={item.receivedQty || ''}
                                  onChange={(e) => updateReceivedQty(index, e.target.value)}
                                  placeholder="0"
                                  className="mt-1"
                                  min="0"
                                  max={item.ordered}
                                />
                              </div>

                              <div>
                                <Label htmlFor={`damaged-${item.id}`} className="text-xs">Damaged/Defective</Label>
                                <Input
                                  id={`damaged-${item.id}`}
                                  type="number"
                                  value={item.damaged || ''}
                                  onChange={(e) => updateDamagedQty(index, e.target.value)}
                                  placeholder="0"
                                  className="mt-1"
                                  min="0"
                                  max={item.receivedQty}
                                />
                              </div>
                            </div>

                            {item.receivedQty > 0 && (
                              <div className="flex justify-between text-sm p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <span className="text-emerald-700 dark:text-emerald-300">
                                  Good: {item.receivedQty - item.damaged} units
                                </span>
                                {item.damaged > 0 && (
                                  <span className="text-red-600 dark:text-red-400">
                                    Damaged: {item.damaged} units
                                  </span>
                                )}
                              </div>
                            )}

                            <div>
                              <Label htmlFor={`remarks-${item.id}`} className="text-xs">Remarks (Optional)</Label>
                              <Textarea
                                id={`remarks-${item.id}`}
                                value={item.remarks}
                                onChange={(e) => updateRemarks(index, e.target.value)}
                                placeholder="Any issues or notes..."
                                className="mt-1"
                                rows={2}
                              />
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </FormCard>
            )}

            {receivedItems.length > 0 && (
              <FormCard title="Additional Information">
                <div>
                  <Label htmlFor="notes">General Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Overall condition, delivery notes..."
                    className="mt-2"
                    rows={4}
                  />
                </div>
              </FormCard>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="p-6 bg-white dark:bg-gray-900/50 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Receiving Summary
                </h3>

                {receivedItems.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Total Items</span>
                        <span className="font-medium">{receivedItems.length}</span>
                      </div>

                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Total Ordered</span>
                        <span className="font-medium">
                          {receivedItems.reduce((sum, item) => sum + item.ordered, 0)} units
                        </span>
                      </div>

                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>Total Received</span>
                        <span className="font-semibold">
                          {receivedItems.reduce((sum, item) => sum + item.receivedQty, 0)} units
                        </span>
                      </div>

                      {receivedItems.some(item => item.damaged > 0) && (
                        <div className="flex justify-between text-red-600 dark:text-red-400">
                          <span>Total Damaged</span>
                          <span className="font-semibold">
                            {receivedItems.reduce((sum, item) => sum + item.damaged, 0)} units
                          </span>
                        </div>
                      )}

                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900 dark:text-white">Good Stock</span>
                          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {receivedItems.reduce((sum, item) => sum + (item.receivedQty - item.damaged), 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleSave}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      size="lg"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save GRN
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p className="text-sm">Select a purchase order to start</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
