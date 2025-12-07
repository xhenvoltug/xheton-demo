'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Users, Calendar, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import DashboardLayout from '@/components/DashboardLayout'

export default function CreateRFQ() {
  const router = useRouter()
  const [items, setItems] = useState([
    { id: 1, description: '', quantity: '', unit: '', specifications: '' }
  ])
  const [selectedSuppliers, setSelectedSuppliers] = useState([])
  const [showSupplierModal, setShowSupplierModal] = useState(false)

  const addItem = () => {
    setItems([...items, { id: items.length + 1, description: '', quantity: '', unit: '', specifications: '' }])
  }

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const mockAvailableSuppliers = [
    { id: 'SUP-2501', name: 'Global Tech Supplies Ltd.', category: 'Electronics' },
    { id: 'SUP-2502', name: 'Local Hardware Co.', category: 'Hardware' },
    { id: 'SUP-2503', name: 'Premium Materials Inc.', category: 'Raw Materials' },
    { id: 'SUP-2505', name: 'Overseas Manufacturing', category: 'Manufacturing' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create Request for Quotation</h1>
              <p className="text-gray-600">Send RFQ to multiple suppliers and compare offers</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="p-6 rounded-3xl">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <Label>RFQ Title</Label>
                  <Input className="mt-2 rounded-xl" placeholder="e.g., Office Equipment Purchase Q1 2026" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>RFQ Number</Label>
                    <Input className="mt-2 rounded-xl" value="RFQ-2506" disabled />
                  </div>
                  <div>
                    <Label>Response Deadline</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 mt-1" />
                      <Input type="date" className="mt-2 rounded-xl pl-10" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Description & Requirements</Label>
                  <Textarea
                    className="mt-2 rounded-xl"
                    rows={4}
                    placeholder="Enter detailed requirements, specifications, and terms..."
                  />
                </div>
              </div>
            </Card>

            {/* Items */}
            <Card className="p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">RFQ Items</h3>
                <Button size="sm" onClick={addItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 bg-gray-50 rounded-2xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-2">
                            <Label className="text-xs">Item Description</Label>
                            <Input
                              className="mt-1 rounded-xl"
                              placeholder="e.g., Laptop Computer X1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Quantity</Label>
                            <Input
                              type="number"
                              className="mt-1 rounded-xl"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Specifications</Label>
                          <Textarea
                            className="mt-1 rounded-xl"
                            rows={2}
                            placeholder="Enter detailed specifications..."
                          />
                        </div>
                      </div>
                      {items.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Terms & Conditions */}
            <Card className="p-6 rounded-3xl">
              <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Payment Terms</Label>
                    <Input className="mt-2 rounded-xl" placeholder="e.g., Net 30" />
                  </div>
                  <div>
                    <Label>Delivery Terms</Label>
                    <Input className="mt-2 rounded-xl" placeholder="e.g., FOB Destination" />
                  </div>
                </div>

                <div>
                  <Label>Additional Terms</Label>
                  <Textarea
                    className="mt-2 rounded-xl"
                    rows={3}
                    placeholder="Enter any additional terms and conditions..."
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Suppliers */}
            <Card className="p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold">Suppliers</h3>
                </div>
                <Button size="sm" variant="outline" onClick={() => setShowSupplierModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>

              {selectedSuppliers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No suppliers selected</p>
                  <p className="text-xs mt-1">Click "Add" to select suppliers</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedSuppliers.map((supplier) => (
                    <div key={supplier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-sm">{supplier.name}</p>
                        <p className="text-xs text-gray-500">{supplier.id}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedSuppliers(selectedSuppliers.filter(s => s.id !== supplier.id))}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Summary */}
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50">
              <h3 className="font-semibold mb-4">RFQ Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Items</span>
                  <span className="font-bold">{items.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Suppliers Invited</span>
                  <span className="font-bold">{selectedSuppliers.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Draft
                  </span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600" size="lg">
                <FileText className="w-4 h-4 mr-2" />
                Send RFQ
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Save as Draft
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </div>
        </div>

        {/* Supplier Selection Modal */}
        {showSupplierModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Select Suppliers</h3>
                <Button variant="ghost" onClick={() => setShowSupplierModal(false)}>✕</Button>
              </div>

              <div className="space-y-2">
                {mockAvailableSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedSuppliers.find(s => s.id === supplier.id)
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => {
                      if (selectedSuppliers.find(s => s.id === supplier.id)) {
                        setSelectedSuppliers(selectedSuppliers.filter(s => s.id !== supplier.id))
                      } else {
                        setSelectedSuppliers([...selectedSuppliers, supplier])
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{supplier.name}</p>
                        <p className="text-sm text-gray-600">{supplier.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{supplier.id}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600"
                  onClick={() => setShowSupplierModal(false)}
                >
                  Confirm Selection ({selectedSuppliers.length})
                </Button>
                <Button variant="outline" onClick={() => setShowSupplierModal(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
