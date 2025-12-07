'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Send, Paperclip, Clock, User, CheckCircle, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const mockTicket = {
  id: 'TKT-001',
  title: 'Cannot access payroll module',
  customer: 'Sarah Nambi',
  email: 'sarah.n@email.ug',
  priority: 'high',
  status: 'open',
  assignedTo: 'IT Support',
  created: '2025-12-07 14:23',
  sla: '2h remaining',
  description: 'I am unable to access the payroll processing module. When I click on Payroll → Processing, I get an error message saying "Access Denied". I need to process December salaries urgently.',
  conversation: [
    { id: 1, sender: 'Sarah Nambi', message: 'I am unable to access the payroll processing module. Getting Access Denied error.', time: '2025-12-07 14:23', isCustomer: true },
    { id: 2, sender: 'IT Support', message: 'Hi Sarah, thank you for reaching out. Let me check your account permissions.', time: '2025-12-07 14:25', isCustomer: false },
    { id: 3, sender: 'IT Support', message: 'I can see your user role was recently updated. I am restoring your payroll access now.', time: '2025-12-07 14:28', isCustomer: false },
    { id: 4, sender: 'Sarah Nambi', message: 'Thank you! I can see the module now. However, the UGX amounts are showing incorrectly.', time: '2025-12-07 14:32', isCustomer: true }
  ],
  timeline: [
    { event: 'Ticket created', user: 'Sarah Nambi', time: '2025-12-07 14:23' },
    { event: 'Assigned to IT Support', user: 'System', time: '2025-12-07 14:24' },
    { event: 'Status changed to In Progress', user: 'IT Support', time: '2025-12-07 14:25' },
    { event: 'Internal note added', user: 'IT Support', time: '2025-12-07 14:28' }
  ]
}

export default function TicketDetails() {
  const [newMessage, setNewMessage] = useState('')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title={`Ticket ${mockTicket.id}`} description={mockTicket.title} />

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Ticket Info */}
            <Card className="rounded-3xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{mockTicket.title}</h2>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${mockTicket.priority === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                      {mockTicket.priority}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {mockTicket.status}
                    </span>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="text-gray-600">SLA</p>
                  <p className="font-bold text-orange-600">{mockTicket.sla}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl mb-6">
                <p className="text-gray-700">{mockTicket.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Customer</p>
                  <p className="font-semibold">{mockTicket.customer}</p>
                  <p className="text-xs text-gray-600">{mockTicket.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Assigned To</p>
                  <p className="font-semibold">{mockTicket.assignedTo}</p>
                </div>
                <div>
                  <p className="text-gray-600">Created</p>
                  <p className="font-semibold">{mockTicket.created}</p>
                </div>
                <div>
                  <p className="text-gray-600">Ticket ID</p>
                  <p className="font-semibold font-mono">{mockTicket.id}</p>
                </div>
              </div>
            </Card>

            {/* Conversation */}
            <Card className="rounded-3xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Conversation
              </h3>
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                {mockTicket.conversation.map((msg, idx) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex ${msg.isCustomer ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${msg.isCustomer ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-gray-100'} rounded-2xl p-4`}>
                      <p className="text-xs opacity-80 mb-1">{msg.sender}</p>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-2">{msg.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t">
                <Button variant="outline" className="rounded-xl">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input 
                  placeholder="Type your response..." 
                  className="flex-1 rounded-xl"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="rounded-3xl p-4">
              <h3 className="font-bold mb-4">Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full rounded-xl justify-start">
                  Change Status
                </Button>
                <Button variant="outline" className="w-full rounded-xl justify-start">
                  Change Priority
                </Button>
                <Button variant="outline" className="w-full rounded-xl justify-start">
                  Reassign Ticket
                </Button>
                <Button variant="outline" className="w-full rounded-xl justify-start">
                  Merge Tickets
                </Button>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                  Resolve Ticket
                </Button>
              </div>
            </Card>

            {/* Timeline */}
            <Card className="rounded-3xl p-4">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                Activity Timeline
              </h3>
              <div className="space-y-4">
                {mockTicket.timeline.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex gap-3"
                  >
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.event}</p>
                      <p className="text-xs text-gray-600">{item.user}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
