'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Smartphone, Plus, Trash2, Check, Building2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const mockPaymentMethods = [
  { 
    id: 1, 
    type: 'mobile_money', 
    provider: 'MTN Mobile Money', 
    number: '0774 123 456', 
    default: true,
    logo: '🟡',
  },
  { 
    id: 2, 
    type: 'mobile_money', 
    provider: 'Airtel Money', 
    number: '0754 789 012', 
    default: false,
    logo: '🔴',
  },
  { 
    id: 3, 
    type: 'bank', 
    provider: 'Stanbic Bank', 
    number: 'Account ending in 1234', 
    default: false,
    logo: '🏦',
  },
]

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(null)
  const [selectedType, setSelectedType] = useState('mobile_money')

  const setDefaultMethod = (id) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      default: method.id === id
    })))
  }

  const deleteMethod = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id))
    setShowDeleteModal(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Payment Methods" 
          description="Manage your payment options for subscriptions"
        />

        <div className="flex justify-end">
          <Button 
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </div>

        {/* Payment Methods List */}
        <div className="grid md:grid-cols-2 gap-4">
          {paymentMethods.map((method, idx) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className={`rounded-3xl p-6 ${
                method.default ? 'border-2 border-purple-500' : ''
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{method.logo}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{method.provider}</h4>
                      <p className="text-sm text-gray-500">{method.number}</p>
                    </div>
                  </div>
                  {method.default && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      Default
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {!method.default && (
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-xl"
                      onClick={() => setDefaultMethod(method.id)}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Set as Default
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="rounded-xl text-red-600 hover:bg-red-50"
                    onClick={() => setShowDeleteModal(method.id)}
                    disabled={method.default}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Add Payment Method Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold mb-6">Add Payment Method</h3>

              <div className="space-y-4">
                {/* Type Selection */}
                <div>
                  <Label className="mb-3 block">Payment Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedType('mobile_money')}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        selectedType === 'mobile_money'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Smartphone className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                      <p className="text-sm font-semibold">Mobile Money</p>
                    </button>
                    <button
                      onClick={() => setSelectedType('bank')}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        selectedType === 'bank'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Building2 className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                      <p className="text-sm font-semibold">Bank Account</p>
                    </button>
                  </div>
                </div>

                {selectedType === 'mobile_money' ? (
                  <>
                    <div>
                      <Label>Provider</Label>
                      <select className="w-full mt-2 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>MTN Mobile Money</option>
                        <option>Airtel Money</option>
                      </select>
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input 
                        placeholder="0774 123 456" 
                        className="mt-2 rounded-xl"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label>Bank Name</Label>
                      <select className="w-full mt-2 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>Stanbic Bank</option>
                        <option>Centenary Bank</option>
                        <option>DFCU Bank</option>
                        <option>Equity Bank</option>
                      </select>
                    </div>
                    <div>
                      <Label>Account Number</Label>
                      <Input 
                        placeholder="1234567890" 
                        className="mt-2 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label>Account Name</Label>
                      <Input 
                        placeholder="Your Business Name" 
                        className="mt-2 rounded-xl"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-xl"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl"
                  onClick={() => setShowAddModal(false)}
                >
                  Add Method
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Delete Payment Method?</h3>
                <p className="text-gray-600">
                  This action cannot be undone. Are you sure you want to remove this payment method?
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-xl"
                  onClick={() => setShowDeleteModal(null)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl text-white"
                  onClick={() => deleteMethod(showDeleteModal)}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Info Card */}
        <Card className="rounded-3xl p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <h4 className="font-semibold mb-2">💡 Payment Security</h4>
          <p className="text-sm text-gray-700">
            All payment information is encrypted and securely stored. We never store your full card or account details. 
            Payments are processed through secure payment gateways compliant with industry standards.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  )
}
