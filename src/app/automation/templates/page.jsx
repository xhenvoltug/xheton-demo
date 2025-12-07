'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, Search, Copy, Eye, Star } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const mockTemplates = [
  { 
    id: 'TEMP-001', 
    name: 'Low Stock Alerts', 
    description: 'Automatically notify procurement team when inventory falls below threshold',
    category: 'Inventory',
    trigger: 'Inventory below threshold',
    actions: ['Send Email', 'Send SMS', 'Create Task'],
    usage: 145,
    rating: 4.8
  },
  { 
    id: 'TEMP-002', 
    name: 'Invoice Overdue Reminder', 
    description: 'Send automated reminders for overdue invoices with UGX amounts',
    category: 'Finance',
    trigger: 'Payment due date passed',
    actions: ['Send Email', 'Update Record'],
    usage: 89,
    rating: 4.9
  },
  { 
    id: 'TEMP-003', 
    name: 'Daily Sales Summary (UGX)', 
    description: 'Daily sales report showing total revenue in UGX sent to management',
    category: 'Sales',
    trigger: 'Scheduled daily at 6 PM',
    actions: ['Generate PDF', 'Send Email', 'Push Notification', 'Update Dashboard'],
    usage: 234,
    rating: 5.0
  },
  { 
    id: 'TEMP-004', 
    name: 'New Customer Welcome', 
    description: 'Welcome email and SMS when a new customer is added to the system',
    category: 'CRM',
    trigger: 'Customer created',
    actions: ['Send Email', 'Send SMS'],
    usage: 178,
    rating: 4.7
  },
  { 
    id: 'TEMP-005', 
    name: 'Payment Confirmation', 
    description: 'Instant confirmation when payment is received with UGX amount',
    category: 'Finance',
    trigger: 'Payment received',
    actions: ['Send Email', 'Send SMS', 'Update Record'],
    usage: 312,
    rating: 4.9
  },
  { 
    id: 'TEMP-006', 
    name: 'Order Fulfillment Workflow', 
    description: 'Complete workflow from sale to delivery with inventory updates',
    category: 'Operations',
    trigger: 'Sale completed',
    actions: ['Create Delivery Order', 'Update Inventory', 'Send Email', 'Create Task', 'Push Notification'],
    usage: 203,
    rating: 4.8
  },
  { 
    id: 'TEMP-007', 
    name: 'Employee Leave Approval', 
    description: 'Automated leave approval process with manager notifications',
    category: 'HR',
    trigger: 'Leave request submitted',
    actions: ['Send Email', 'Push Notification', 'Create Task'],
    usage: 67,
    rating: 4.6
  },
  { 
    id: 'TEMP-008', 
    name: 'Expense Approval Chain', 
    description: 'Multi-level approval for expenses above UGX threshold',
    category: 'Finance',
    trigger: 'Expense exceeds UGX 500,000',
    actions: ['Send Email', 'Create Task', 'Push Notification', 'Update Record'],
    usage: 91,
    rating: 4.7
  }
]

const categories = ['All', 'Inventory', 'Finance', 'Sales', 'CRM', 'Operations', 'HR']

export default function TemplatesLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const filteredTemplates = selectedCategory === 'All' 
    ? mockTemplates 
    : mockTemplates.filter(t => t.category === selectedCategory)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Automation Templates" description="Pre-built workflows ready to use" />

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search templates..." className="pl-10 rounded-xl" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className={`rounded-xl whitespace-nowrap ${selectedCategory === category ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, idx) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="rounded-3xl p-6 hover:shadow-xl transition-shadow h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="w-5 h-5 text-purple-600" />
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{template.category}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4 flex-1">
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <p className="text-xs text-purple-600 font-semibold mb-1">TRIGGER</p>
                    <p className="text-sm">{template.trigger}</p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-600 font-semibold mb-2">ACTIONS ({template.actions.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {template.actions.map((action, i) => (
                        <span key={i} className="px-2 py-1 bg-white border rounded-lg text-xs">{action}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{template.rating}</span>
                  </div>
                  <span>{template.usage} uses</span>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl"
                    onClick={() => {
                      setSelectedTemplate(template)
                      setShowPreviewModal(true)
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                    <Copy className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Preview Modal */}
        {showPreviewModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPreviewModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedTemplate.name}</h2>
                  <p className="text-gray-600">{selectedTemplate.description}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{selectedTemplate.category}</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">1</div>
                    <p className="text-xs text-purple-700 font-semibold">TRIGGER</p>
                  </div>
                  <p className="font-semibold">{selectedTemplate.trigger}</p>
                </div>

                {selectedTemplate.actions.map((action, idx) => (
                  <div key={idx} className="p-6 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gray-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">{idx + 2}</div>
                      <p className="text-xs text-gray-700 font-semibold">ACTION</p>
                    </div>
                    <p className="font-semibold">{action}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{selectedTemplate.rating} / 5.0</span>
                </div>
                <span className="text-sm text-gray-600">{selectedTemplate.usage} companies using this</span>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                  <Copy className="w-4 h-4 mr-2" />
                  Clone & Customize
                </Button>
                <Button variant="outline" onClick={() => setShowPreviewModal(false)}>Close</Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
