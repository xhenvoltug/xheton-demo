'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Plus, Edit, Trash2, Pin, Calendar, Users, Eye, Paperclip, Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockAnnouncements = [
  { id: 'ANN-001', title: 'Year-End Holiday Schedule', content: 'Office will be closed from Dec 24-26, 2025 for the holidays. Emergency contacts will remain available.', author: 'HR Department', date: '2025-12-20', department: 'All Staff', isPinned: true, views: 152, hasAttachment: true, status: 'published' },
  { id: 'ANN-002', title: 'Q4 Performance Reviews', content: 'All department heads should submit Q4 performance reviews by December 31st. Template available in shared drive.', author: 'Management', date: '2025-12-18', department: 'Managers', isPinned: true, views: 89, hasAttachment: false, status: 'published' },
  { id: 'ANN-003', title: 'New CRM System Training', content: 'Mandatory training sessions for the new CRM system will be held next week. Check your calendar for assigned time slot.', author: 'IT Department', date: '2025-12-15', department: 'Sales', isPinned: false, views: 67, hasAttachment: true, status: 'published' },
  { id: 'ANN-004', title: 'Office Renovation Notice', content: 'The 3rd floor will undergo minor renovations starting January 15th. Temporary workspace arrangements will be communicated.', author: 'Facilities', date: '2025-12-10', department: 'All Staff', isPinned: false, views: 124, hasAttachment: false, status: 'published' },
  { id: 'ANN-005', title: 'Team Building Event - January', content: 'Save the date! Annual team building retreat scheduled for January 20-21 at Lake Victoria Resort.', author: 'HR Department', date: '2025-12-05', department: 'All Staff', isPinned: false, views: 198, hasAttachment: true, status: 'scheduled' }
]

export default function Announcements() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)

  const columns = [
    { 
      header: 'Title', 
      accessorKey: 'title',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.isPinned && <Pin className="w-4 h-4 text-purple-600" />}
          <span className="font-semibold">{row.original.title}</span>
        </div>
      )
    },
    { header: 'Author', accessorKey: 'author' },
    { header: 'Department', accessorKey: 'department', cell: ({ row }) => <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{row.original.department}</span> },
    { header: 'Date', accessorKey: 'date' },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: ({ row }) => {
        const styles = row.original.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles}`}>{row.original.status}</span>
      }
    },
    { 
      header: 'Engagement', 
      accessorKey: 'views',
      cell: ({ row }) => (
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {row.original.views}
          </span>
          {row.original.hasAttachment && <Paperclip className="w-3 h-3 text-purple-600" />}
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
              setSelectedAnnouncement(row.original)
              setShowViewModal(true)
            }}
          >
            <Eye className="w-3 h-3" />
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl">
            <Edit className="w-3 h-3" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Announcements" description="Company-wide and department announcements" />

        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            {[
              { label: 'All', count: mockAnnouncements.length },
              { label: 'Pinned', count: mockAnnouncements.filter(a => a.isPinned).length },
              { label: 'Published', count: mockAnnouncements.filter(a => a.status === 'published').length },
              { label: 'Scheduled', count: mockAnnouncements.filter(a => a.status === 'scheduled').length }
            ].map(tab => (
              <Card key={tab.label} className="px-4 py-2 rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
                <div className="text-sm">
                  <span className="font-semibold">{tab.label}</span>
                  <span className="ml-2 text-gray-500">({tab.count})</span>
                </div>
              </Card>
            ))}
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        </div>

        {/* Pinned Announcements */}
        {mockAnnouncements.filter(a => a.isPinned).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-600 uppercase flex items-center gap-2">
              <Pin className="w-4 h-4" />
              Pinned Announcements
            </h3>
            {mockAnnouncements.filter(a => a.isPinned).map((announcement, idx) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="rounded-3xl p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-600">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Megaphone className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-bold">{announcement.title}</h3>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{announcement.content}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {announcement.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {announcement.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {announcement.views} views
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" className="rounded-xl ml-4">View Full</Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <Card className="rounded-3xl overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-bold">All Announcements</h3>
          </div>
          <DataTable columns={columns} data={mockAnnouncements} />
        </Card>

        {/* Create Announcement Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Create New Announcement</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <Input className="rounded-xl" placeholder="e.g., Year-End Holiday Schedule" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Content *</label>
                  <textarea className="w-full px-4 py-2 border rounded-xl" rows={6} placeholder="Write your announcement here..."></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Department *</label>
                    <select className="w-full px-4 py-2 border rounded-xl">
                      <option>All Staff</option>
                      <option>Sales</option>
                      <option>Marketing</option>
                      <option>IT</option>
                      <option>HR</option>
                      <option>Finance</option>
                      <option>Operations</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Publish Date</label>
                    <Input type="date" className="rounded-xl" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Attachments</label>
                  <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50">
                    <Paperclip className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="pin" className="rounded" />
                  <label htmlFor="pin" className="text-sm">Pin this announcement to the top</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">Publish Now</Button>
                  <Button variant="outline" className="flex-1">Schedule</Button>
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* View Announcement Modal */}
        {showViewModal && selectedAnnouncement && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowViewModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{selectedAnnouncement.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{selectedAnnouncement.author}</span>
                    <span>•</span>
                    <span>{selectedAnnouncement.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {selectedAnnouncement.views} views
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  {selectedAnnouncement.department}
                </span>
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700">{selectedAnnouncement.content}</p>
              </div>

              {selectedAnnouncement.hasAttachment && (
                <Card className="rounded-2xl p-4 mb-6 bg-purple-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-semibold">holiday-schedule-2025.pdf</span>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </Card>
              )}

              <Button variant="outline" className="w-full" onClick={() => setShowViewModal(false)}>Close</Button>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
