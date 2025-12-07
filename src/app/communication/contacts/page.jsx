'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, Search, Mail, Phone, MapPin, Building, Edit, Trash2, MessageSquare, Video } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockContacts = [
  { id: 'CONT-001', name: 'Sarah Nambi', position: 'Sales Manager', department: 'Sales', email: 'sarah.n@xheton.ug', phone: '+256 700 111 222', location: 'Kampala Office', avatar: 'SN', isOnline: true },
  { id: 'CONT-002', name: 'David Ochola', position: 'Marketing Lead', department: 'Marketing', email: 'david.o@xheton.ug', phone: '+256 700 333 444', location: 'Kampala Office', avatar: 'DO', isOnline: true },
  { id: 'CONT-003', name: 'Grace Akello', position: 'Operations Manager', department: 'Operations', email: 'grace.a@xheton.ug', phone: '+256 700 555 666', location: 'Entebbe Branch', avatar: 'GA', isOnline: false },
  { id: 'CONT-004', name: 'Mark Okello', position: 'IT Administrator', department: 'IT', email: 'mark.o@xheton.ug', phone: '+256 700 777 888', location: 'Kampala Office', avatar: 'MO', isOnline: true },
  { id: 'CONT-005', name: 'Patricia Nanteza', position: 'Finance Director', department: 'Finance', email: 'patricia.n@xheton.ug', phone: '+256 700 999 000', location: 'Kampala Office', avatar: 'PN', isOnline: false },
  { id: 'CONT-006', name: 'James Mugisha', position: 'HR Manager', department: 'HR', email: 'james.m@xheton.ug', phone: '+256 700 111 333', location: 'Kampala Office', avatar: 'JM', isOnline: true },
  { id: 'CONT-007', name: 'Linda Nakirya', position: 'Customer Support', department: 'Support', email: 'linda.n@xheton.ug', phone: '+256 700 444 555', location: 'Jinja Branch', avatar: 'LN', isOnline: false }
]

const departments = ['All', 'Sales', 'Marketing', 'Operations', 'IT', 'Finance', 'HR', 'Support']

export default function InternalContacts() {
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)

  const filteredContacts = selectedDepartment === 'All' 
    ? mockContacts 
    : mockContacts.filter(c => c.department === selectedDepartment)

  const columns = [
    { 
      header: 'Contact', 
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              {row.original.avatar}
            </div>
            {row.original.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <p className="font-semibold">{row.original.name}</p>
            <p className="text-xs text-gray-600">{row.original.position}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Department', 
      accessorKey: 'department',
      cell: ({ row }) => <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{row.original.department}</span>
    },
    { 
      header: 'Contact Info', 
      accessorKey: 'email',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs">
            <Mail className="w-3 h-3 text-gray-400" />
            {row.original.email}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Phone className="w-3 h-3 text-gray-400" />
            {row.original.phone}
          </div>
        </div>
      )
    },
    { 
      header: 'Location', 
      accessorKey: 'location',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm">
          <MapPin className="w-3 h-3 text-gray-400" />
          {row.original.location}
        </div>
      )
    },
    { 
      header: 'Actions', 
      accessorKey: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl"
            onClick={() => {
              setSelectedContact(row.original)
              setShowViewModal(true)
            }}
          >
            View
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl">
            <MessageSquare className="w-3 h-3" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Internal Contacts" description="Company directory and contact information" />

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search contacts..." className="pl-10 rounded-xl" />
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Contacts', value: mockContacts.length, icon: Users, gradient: 'from-purple-500 to-pink-500' },
            { label: 'Online Now', value: mockContacts.filter(c => c.isOnline).length, icon: Users, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Departments', value: departments.length - 1, icon: Building, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Locations', value: 3, icon: MapPin, gradient: 'from-orange-500 to-red-500' }
          ].map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
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

        <div className="flex gap-2 overflow-x-auto pb-2">
          {departments.map(dept => (
            <Button
              key={dept}
              variant={selectedDepartment === dept ? 'default' : 'outline'}
              className={`rounded-xl whitespace-nowrap ${selectedDepartment === dept ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}`}
              onClick={() => setSelectedDepartment(dept)}
            >
              {dept}
              <span className="ml-2 text-xs opacity-70">
                ({dept === 'All' ? mockContacts.length : mockContacts.filter(c => c.department === dept).length})
              </span>
            </Button>
          ))}
        </div>

        <Card className="rounded-3xl overflow-hidden">
          <DataTable columns={columns} data={filteredContacts} />
        </Card>

        {/* Add Contact Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Add New Contact</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input className="rounded-xl" placeholder="e.g., Sarah Nambi" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Position *</label>
                    <Input className="rounded-xl" placeholder="e.g., Sales Manager" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Department *</label>
                    <select className="w-full px-4 py-2 border rounded-xl">
                      <option>Sales</option>
                      <option>Marketing</option>
                      <option>Operations</option>
                      <option>IT</option>
                      <option>Finance</option>
                      <option>HR</option>
                      <option>Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location *</label>
                    <select className="w-full px-4 py-2 border rounded-xl">
                      <option>Kampala Office</option>
                      <option>Entebbe Branch</option>
                      <option>Jinja Branch</option>
                      <option>Remote</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input type="email" className="rounded-xl" placeholder="email@xheton.ug" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <Input className="rounded-xl" placeholder="+256 700 000 000" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">Add Contact</Button>
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* View Contact Modal */}
        {showViewModal && selectedContact && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowViewModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl">
                    {selectedContact.avatar}
                  </div>
                  {selectedContact.isOnline && (
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full" />
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-1">{selectedContact.name}</h2>
                <p className="text-gray-600">{selectedContact.position}</p>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mt-2">
                  {selectedContact.department}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="font-semibold">{selectedContact.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-600">Phone</p>
                    <p className="font-semibold">{selectedContact.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-600">Location</p>
                    <p className="font-semibold">{selectedContact.location}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </Button>
                <Button variant="outline" className="rounded-xl">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" className="rounded-xl">
                  <Video className="w-4 h-4 mr-2" />
                  Call
                </Button>
              </div>

              <Button variant="outline" className="w-full mt-4" onClick={() => setShowViewModal(false)}>Close</Button>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
