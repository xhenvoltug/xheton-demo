'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Plus, Send, Trash2, Archive, Star, Search, Paperclip, Download, Edit } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const mockEmails = {
  inbox: [
    { id: 'EMAIL-001', from: 'Sarah Nambi', subject: 'Q4 Sales Report Review', preview: 'Hi, I have reviewed the Q4 sales report and have some feedback...', date: '2025-12-20', isRead: false, isStarred: true, hasAttachment: true },
    { id: 'EMAIL-002', from: 'David Ochola', subject: 'Meeting Reschedule Request', preview: 'Can we move the Monday meeting to Tuesday afternoon?...', date: '2025-12-19', isRead: true, isStarred: false, hasAttachment: false },
    { id: 'EMAIL-003', from: 'Grace Akello', subject: 'Project Timeline Update', preview: 'The manufacturing project timeline has been updated...', date: '2025-12-18', isRead: true, isStarred: false, hasAttachment: true },
    { id: 'EMAIL-004', from: 'HR Department', subject: 'Annual Leave Reminder', preview: 'Please submit your annual leave requests for 2026...', date: '2025-12-17', isRead: false, isStarred: false, hasAttachment: false }
  ],
  sent: [
    { id: 'EMAIL-101', to: 'All Staff', subject: 'Year-End Office Hours', preview: 'Reminder about adjusted office hours during the holidays...', date: '2025-12-20' },
    { id: 'EMAIL-102', to: 'David Ochola', subject: 'Re: Meeting Reschedule Request', preview: 'Tuesday at 2 PM works perfectly. See you then...', date: '2025-12-19' }
  ]
}

export default function InternalEmail() {
  const [activeTab, setActiveTab] = useState('inbox')
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState(null)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Internal Email" description="Secure company email communication" />

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {[
              { key: 'inbox', label: 'Inbox', count: mockEmails.inbox.filter(e => !e.isRead).length },
              { key: 'sent', label: 'Sent', count: mockEmails.sent.length },
              { key: 'starred', label: 'Starred', count: mockEmails.inbox.filter(e => e.isStarred).length },
              { key: 'archived', label: 'Archived', count: 0 }
            ].map(tab => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'default' : 'outline'}
                className={`rounded-xl ${activeTab === tab.key ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.key ? 'bg-white/20' : 'bg-purple-100 text-purple-700'}`}>
                    {tab.count}
                  </span>
                )}
              </Button>
            ))}
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl" onClick={() => setShowComposeModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Compose
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Email List */}
          <Card className="md:col-span-1 rounded-3xl overflow-hidden h-[calc(100vh-300px)]">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search emails..." className="pl-10 rounded-xl" />
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-80px)]">
              {(activeTab === 'inbox' ? mockEmails.inbox : mockEmails.sent).map((email, idx) => (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    setSelectedEmail(email)
                    setShowViewModal(true)
                  }}
                  className={`p-4 border-b cursor-pointer hover:bg-purple-50 transition-colors ${!email.isRead && activeTab === 'inbox' ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className={`text-sm ${!email.isRead && activeTab === 'inbox' ? 'font-bold' : 'font-semibold'}`}>
                      {activeTab === 'inbox' ? email.from : email.to}
                    </span>
                    {activeTab === 'inbox' && email.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                  </div>
                  <h4 className={`text-sm mb-1 ${!email.isRead && activeTab === 'inbox' ? 'font-bold' : ''}`}>{email.subject}</h4>
                  <p className="text-xs text-gray-600 truncate">{email.preview}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{email.date}</span>
                    {email.hasAttachment && <Paperclip className="w-3 h-3 text-gray-400" />}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Email Preview */}
          <Card className="md:col-span-2 rounded-3xl overflow-hidden h-[calc(100vh-300px)] flex flex-col">
            {selectedEmail ? (
              <>
                <div className="p-6 border-b">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-2">{selectedEmail.subject}</h2>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {activeTab === 'inbox' ? selectedEmail.from[0] : selectedEmail.to[0]}
                        </div>
                        <div>
                          <p className="font-semibold">{activeTab === 'inbox' ? selectedEmail.from : selectedEmail.to}</p>
                          <p className="text-xs">to: {activeTab === 'inbox' ? 'me' : selectedEmail.to}</p>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{selectedEmail.date}</span>
                  </div>
                  <div className="flex gap-2">
                    {activeTab === 'inbox' && (
                      <>
                        <Button variant="outline" className="rounded-xl" onClick={() => setShowComposeModal(true)}>
                          <Send className="w-4 h-4 mr-2" />
                          Reply
                        </Button>
                        <Button variant="outline" className="rounded-xl">
                          <Star className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button variant="outline" className="rounded-xl">
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" className="rounded-xl text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700">{selectedEmail.preview}</p>
                    <p className="text-gray-700 mt-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                    </p>
                    <p className="text-gray-700 mt-4">
                      Best regards,<br/>
                      {activeTab === 'inbox' ? selectedEmail.from : 'You'}
                    </p>
                  </div>

                  {selectedEmail.hasAttachment && (
                    <Card className="rounded-2xl p-4 mt-6 bg-purple-50">
                      <h4 className="text-sm font-semibold mb-3">Attachments</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                          <div className="flex items-center gap-2">
                            <Paperclip className="w-4 h-4 text-purple-600" />
                            <div>
                              <p className="text-sm font-semibold">Q4-sales-report.pdf</p>
                              <p className="text-xs text-gray-500">2.4 MB</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="rounded-xl">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Mail className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Select an email to view</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Compose Modal */}
        {showComposeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowComposeModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Compose Email</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">To *</label>
                  <Input className="rounded-xl" placeholder="Select recipients..." />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <Input className="rounded-xl" placeholder="Email subject..." />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <textarea className="w-full px-4 py-2 border rounded-xl" rows={12} placeholder="Write your message here..."></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Attachments</label>
                  <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50">
                    <Paperclip className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                    <Send className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="flex-1">Save Draft</Button>
                  <Button variant="outline" onClick={() => setShowComposeModal(false)}>Cancel</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
