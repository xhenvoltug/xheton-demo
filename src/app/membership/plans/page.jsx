'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Plus, Edit, Trash2, Check, X, TrendingUp, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const mockPlans = [
  { 
    id: 'PLAN-001', 
    name: 'Starter', 
    description: 'Perfect for individuals and small teams getting started', 
    price: 49000, 
    billingCycle: 'Monthly', 
    features: ['5 Users', '10GB Storage', 'Basic Support', 'Standard Analytics', 'Mobile App Access'],
    activeSubscribers: 12,
    status: 'active'
  },
  { 
    id: 'PLAN-002', 
    name: 'Professional', 
    description: 'Advanced features for growing businesses', 
    price: 149000, 
    billingCycle: 'Monthly', 
    features: ['20 Users', '50GB Storage', 'Priority Support', 'Advanced Analytics', 'Mobile App Access', 'Custom Integrations', 'API Access'],
    activeSubscribers: 28,
    status: 'active'
  },
  { 
    id: 'PLAN-003', 
    name: 'Enterprise', 
    description: 'Unlimited power for large organizations', 
    price: 299000, 
    billingCycle: 'Monthly', 
    features: ['Unlimited Users', '500GB Storage', '24/7 Premium Support', 'Advanced Analytics', 'Mobile App Access', 'Custom Integrations', 'API Access', 'Dedicated Account Manager', 'Custom Training'],
    activeSubscribers: 5,
    status: 'active'
  },
  { 
    id: 'PLAN-004', 
    name: 'Quarterly Starter', 
    description: 'Starter plan with quarterly billing (10% discount)', 
    price: 132300, 
    billingCycle: 'Quarterly', 
    features: ['5 Users', '10GB Storage', 'Basic Support', 'Standard Analytics', 'Mobile App Access'],
    activeSubscribers: 8,
    status: 'active'
  }
]

export default function MembershipPlans() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Membership Plans" description="Create and manage subscription tiers" />

        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <Card className="px-4 py-2 rounded-2xl inline-flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold">{mockPlans.length} Plans</span>
            </Card>
            <Card className="px-4 py-2 rounded-2xl inline-flex items-center gap-2">
              <Users className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold">{mockPlans.reduce((sum, p) => sum + p.activeSubscribers, 0)} Subscribers</span>
            </Card>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPlans.map((plan, idx) => (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className="rounded-3xl p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{plan.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">UGX {plan.price.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600">per {plan.billingCycle.toLowerCase()}</p>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-xl">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">{plan.activeSubscribers} active subscribers</span>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl"
                    onClick={() => {
                      setSelectedPlan(plan)
                      setShowEditModal(true)
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" className="rounded-xl text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Create Plan Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Create New Membership Plan</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Plan Name *</label>
                    <Input className="rounded-xl" placeholder="e.g., Professional" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Billing Cycle *</label>
                    <select className="w-full px-4 py-2 border rounded-xl">
                      <option>Monthly</option>
                      <option>Quarterly</option>
                      <option>Annual</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea className="w-full px-4 py-2 border rounded-xl" rows={2} placeholder="Brief plan description"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price (UGX) *</label>
                    <Input type="number" className="rounded-xl" placeholder="149000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Setup Fee (UGX)</label>
                    <Input type="number" className="rounded-xl" placeholder="0" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Features (one per line)</label>
                  <textarea className="w-full px-4 py-2 border rounded-xl" rows={6} placeholder="20 Users&#10;50GB Storage&#10;Priority Support"></textarea>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">Create Plan</Button>
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Plan Modal */}
        {showEditModal && selectedPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Edit Plan: {selectedPlan.name}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Plan Name *</label>
                    <Input className="rounded-xl" defaultValue={selectedPlan.name} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Billing Cycle *</label>
                    <select className="w-full px-4 py-2 border rounded-xl" defaultValue={selectedPlan.billingCycle}>
                      <option>Monthly</option>
                      <option>Quarterly</option>
                      <option>Annual</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea className="w-full px-4 py-2 border rounded-xl" rows={2} defaultValue={selectedPlan.description}></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price (UGX) *</label>
                  <Input type="number" className="rounded-xl" defaultValue={selectedPlan.price} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Features (one per line)</label>
                  <textarea className="w-full px-4 py-2 border rounded-xl" rows={6} defaultValue={selectedPlan.features.join('\n')}></textarea>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">Save Changes</Button>
                  <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
