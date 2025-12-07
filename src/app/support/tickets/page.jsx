'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Ticket, Plus, Search, Filter, AlertCircle, Clock, CheckCircle, User } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockTickets = [
  { id: 'TKT-001', title: 'Cannot access payroll module', customer: 'Sarah Nambi', priority: 'high', status: 'open', assignedTo: 'IT Support', created: '2025-12-07 14:23', sla: '2h remaining' },
  { id: 'TKT-002', title: 'Invoice total showing wrong UGX amount', customer: 'David Ochola', priority: 'critical', status: 'escalated', assignedTo: 'Finance Team', created: '2025-12-07 13:15', sla: 'Overdue' },
  { id: 'TKT-003', title: 'How to generate monthly reports?', customer: 'Grace Akello', priority: 'low', status: 'pending', assignedTo: 'Support Team', created: '2025-12-07 11:45', sla: '6h remaining' },
  { id: 'TKT-004', title: 'Stock levels not updating automatically', customer: 'Mark Okello', priority: 'high', status: 'open', assignedTo: 'Development', created: '2025-12-07 09:30', sla: '1h remaining' },
  { id: 'TKT-005', title: 'Need training on CRM module', customer: 'Patricia Nanteza', priority: 'medium', status: 'resolved', assignedTo: 'Training Team', created: '2025-12-06 16:20', sla: 'Met' },
  { id: 'TKT-006', title: 'Mobile app login issues', customer: 'James Mugisha', priority: 'high', status: 'open', assignedTo: 'Mobile Team', created: '2025-12-07 08:15', sla: '3h remaining' }
]

export default function TicketDashboard() {
  const [selectedFilter, setSelectedFilter] = useState('all')

  const getPriorityBadge = (priority) => {
    const styles = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-blue-100 text-blue-700 border-blue-300'
    }
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[priority]}`}>{priority}</span>
  }

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
      resolved: 'bg-green-100 text-green-700',
      escalated: 'bg-red-100 text-red-700'
    }
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{status}</span>
  }

  const columns = [
    { header: 'Ticket ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono text-xs text-blue-600">{row.original.id}</span> },
    { header: 'Title', accessorKey: 'title', cell: ({ row }) => <span className="font-semibold">{row.original.title}</span> },
    { header: 'Customer', accessorKey: 'customer' },
    { header: 'Priority', accessorKey: 'priority', cell: ({ row }) => getPriorityBadge(row.original.priority) },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) },
    { header: 'Assigned To', accessorKey: 'assignedTo' },
    { header: 'SLA', accessorKey: 'sla', cell: ({ row }) => (
      <span className={`text-xs font-semibold ${row.original.sla === 'Overdue' ? 'text-red-600' : row.original.sla === 'Met' ? 'text-green-600' : ''}`}>
        {row.original.sla}
      </span>
    )},
    { 
      header: 'Actions', 
      accessorKey: 'actions',
      cell: ({ row }) => (
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-xl"
          onClick={() => window.location.href = '/support/ticket-details'}
        >
          View
        </Button>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Support Tickets" description="Manage customer support and helpdesk tickets" />

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search tickets..." className="pl-10 rounded-xl" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: 'Total Tickets', value: mockTickets.length, icon: Ticket, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Open', value: mockTickets.filter(t => t.status === 'open').length, icon: AlertCircle, gradient: 'from-orange-500 to-red-500' },
            { label: 'Pending', value: mockTickets.filter(t => t.status === 'pending').length, icon: Clock, gradient: 'from-yellow-500 to-orange-500' },
            { label: 'Resolved', value: mockTickets.filter(t => t.status === 'resolved').length, icon: CheckCircle, gradient: 'from-green-500 to-emerald-500' }
          ].map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white`}>
                <stat.icon className="w-5 h-5 opacity-80 mb-2" />
                <p className="text-xs opacity-90">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2">
          {['all', 'assigned to me', 'open', 'pending', 'resolved', 'escalated'].map(filter => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? 'default' : 'outline'}
              className={`rounded-xl capitalize ${selectedFilter === filter ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>

        <Card className="rounded-3xl overflow-hidden">
          <DataTable columns={columns} data={mockTickets} />
        </Card>
      </div>
    </DashboardLayout>
  )
}
