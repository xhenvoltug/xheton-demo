'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Phone, Video, CheckSquare, Calendar, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockActivities = {
  calls: [
    { id: 'CALL-501', contact: 'John Smith', company: 'Acme Corp', duration: '15 min', outcome: 'Scheduled meeting', date: '2025-12-06 10:30', status: 'completed' },
    { id: 'CALL-502', contact: 'Mary Johnson', company: 'TechStart', duration: 'Planned', outcome: 'Follow-up needed', date: '2025-12-08 14:00', status: 'scheduled' }
  ],
  meetings: [
    { id: 'MEET-301', title: 'Product Demo', attendees: 'John Smith, Sarah Lee', location: 'Office', date: '2025-12-10 11:00', duration: '1 hour', status: 'scheduled' },
    { id: 'MEET-302', title: 'Contract Discussion', attendees: 'David Okello', location: 'Client Site', date: '2025-12-05 15:00', duration: '2 hours', status: 'completed' }
  ],
  tasks: [
    { id: 'TASK-701', title: 'Prepare proposal for Acme', assignedTo: 'Sales Team', dueDate: '2025-12-09', priority: 'high', status: 'in-progress' },
    { id: 'TASK-702', title: 'Send contract to TechStart', assignedTo: 'Legal Team', dueDate: '2025-12-12', priority: 'medium', status: 'pending' },
    { id: 'TASK-703', title: 'Follow up with Global Traders', assignedTo: 'John Doe', dueDate: '2025-12-07', priority: 'high', status: 'completed' }
  ]
}

export default function Activities() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [activityType, setActivityType] = useState('call')

  const getStatusBadge = (status) => {
    const styles = {
      'completed': 'bg-green-100 text-green-700',
      'scheduled': 'bg-blue-100 text-blue-700',
      'in-progress': 'bg-yellow-100 text-yellow-700',
      'pending': 'bg-gray-100 text-gray-700'
    }
    return <span className={`px-3 py-1 ${styles[status]} rounded-full text-xs font-medium`}>{status}</span>
  }

  const getPriorityBadge = (priority) => {
    const styles = {
      'high': 'bg-red-100 text-red-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'low': 'bg-blue-100 text-blue-700'
    }
    return <span className={`px-3 py-1 ${styles[priority]} rounded-full text-xs font-medium`}>{priority}</span>
  }

  const callColumns = [
    { header: 'Call ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono font-bold text-blue-600">{row.original.id}</span> },
    { header: 'Contact', accessorKey: 'contact' },
    { header: 'Company', accessorKey: 'company' },
    { header: 'Date & Time', accessorKey: 'date' },
    { header: 'Duration', accessorKey: 'duration' },
    { header: 'Outcome', accessorKey: 'outcome' },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) }
  ]

  const meetingColumns = [
    { header: 'Meeting ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono font-bold text-blue-600">{row.original.id}</span> },
    { header: 'Title', accessorKey: 'title', cell: ({ row }) => <span className="font-medium">{row.original.title}</span> },
    { header: 'Attendees', accessorKey: 'attendees' },
    { header: 'Location', accessorKey: 'location' },
    { header: 'Date & Time', accessorKey: 'date' },
    { header: 'Duration', accessorKey: 'duration' },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) }
  ]

  const taskColumns = [
    { header: 'Task ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono font-bold text-blue-600">{row.original.id}</span> },
    { header: 'Title', accessorKey: 'title', cell: ({ row }) => <span className="font-medium">{row.original.title}</span> },
    { header: 'Assigned To', accessorKey: 'assignedTo' },
    { header: 'Due Date', accessorKey: 'dueDate' },
    { header: 'Priority', accessorKey: 'priority', cell: ({ row }) => getPriorityBadge(row.original.priority) },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Activities" description="Manage calls, meetings, and tasks" />

        <div className="flex items-center justify-between">
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Activity
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Calls Today', value: '12', icon: Phone, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Meetings Scheduled', value: '5', icon: Video, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Tasks Pending', value: '8', icon: CheckSquare, gradient: 'from-yellow-500 to-amber-500' },
            { label: 'Follow-ups Due', value: '3', icon: Clock, gradient: 'from-red-500 to-orange-500' }
          ].map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 opacity-80" />
                </div>
                <p className="text-xs opacity-90">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="calls" className="space-y-4">
          <TabsList className="bg-gray-100 p-1 rounded-2xl">
            <TabsTrigger value="calls" className="rounded-xl data-[state=active]:bg-white">Calls</TabsTrigger>
            <TabsTrigger value="meetings" className="rounded-xl data-[state=active]:bg-white">Meetings</TabsTrigger>
            <TabsTrigger value="tasks" className="rounded-xl data-[state=active]:bg-white">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="calls">
            <Card className="rounded-3xl overflow-hidden">
              <DataTable columns={callColumns} data={mockActivities.calls} />
            </Card>
          </TabsContent>

          <TabsContent value="meetings">
            <Card className="rounded-3xl overflow-hidden">
              <DataTable columns={meetingColumns} data={mockActivities.meetings} />
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card className="rounded-3xl overflow-hidden">
              <DataTable columns={taskColumns} data={mockActivities.tasks} />
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Activity Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 max-w-2xl w-full">
              <h3 className="text-xl font-bold mb-4">Schedule Activity</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Activity Type</label>
                  <select className="w-full px-4 py-2 border rounded-xl" value={activityType} onChange={(e) => setActivityType(e.target.value)}>
                    <option value="call">Call</option>
                    <option value="meeting">Meeting</option>
                    <option value="task">Task</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Related Contact/Company</label>
                    <Input className="rounded-xl" placeholder="Select or type..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Due Date</label>
                    <Input type="datetime-local" className="rounded-xl" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Title/Subject</label>
                  <Input className="rounded-xl" placeholder="e.g., Follow-up call regarding proposal" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <Textarea className="rounded-xl" rows={3} placeholder="Additional details..." />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600">Schedule Activity</Button>
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
