'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, CheckCircle, AlertCircle, Package, Truck, DollarSign, Zap, Settings, Search, Filter, Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const mockNotifications = [
  { id: 'NOT-001', type: 'system', icon: AlertCircle, title: 'System Update Available', description: 'XHETON v0.0.014 is ready to install', timestamp: '2 min ago', read: false, color: 'blue' },
  { id: 'NOT-002', type: 'sales', icon: DollarSign, title: 'New Sale Completed', description: 'Invoice INV-2025-456 - UGX 2,450,000 received from Sarah Nambi', timestamp: '15 min ago', read: false, color: 'green' },
  { id: 'NOT-003', type: 'inventory', icon: Package, title: 'Low Stock Alert', description: '5 products below reorder level. Action required.', timestamp: '1 hour ago', read: false, color: 'orange' },
  { id: 'NOT-004', type: 'deliveries', icon: Truck, title: 'Delivery Completed', description: 'Order #ORD-789 delivered successfully to Kampala', timestamp: '2 hours ago', read: true, color: 'purple' },
  { id: 'NOT-005', type: 'finance', icon: DollarSign, title: 'Payment Overdue', description: 'Invoice INV-2025-123 is 5 days overdue - UGX 1,200,000', timestamp: '3 hours ago', read: false, color: 'red' },
  { id: 'NOT-006', type: 'workflow', icon: Zap, title: 'Workflow Automation Triggered', description: 'Daily Sales Summary automation completed successfully', timestamp: '5 hours ago', read: true, color: 'pink' },
  { id: 'NOT-007', type: 'system', icon: CheckCircle, title: 'Backup Completed', description: 'Database backup completed at 02:00 AM', timestamp: '8 hours ago', read: true, color: 'blue' },
  { id: 'NOT-008', type: 'sales', icon: DollarSign, title: 'Quote Expiring Soon', description: 'Quote #QT-456 expires in 2 days - UGX 3,500,000', timestamp: '1 day ago', read: true, color: 'green' },
]

const tabs = [
  { id: 'all', label: 'All', count: 8 },
  { id: 'system', label: 'System', count: 2 },
  { id: 'sales', label: 'Sales', count: 2 },
  { id: 'inventory', label: 'Inventory', count: 1 },
  { id: 'deliveries', label: 'Deliveries', count: 1 },
  { id: 'finance', label: 'Finance', count: 1 },
  { id: 'workflow', label: 'Workflow Automations', count: 1 },
]

export default function NotificationCenter() {
  const [selectedTab, setSelectedTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState(mockNotifications)

  const filteredNotifications = notifications.filter(notif => {
    const matchesTab = selectedTab === 'all' || notif.type === selectedTab
    const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         notif.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 border-blue-500',
      green: 'bg-green-100 text-green-700 border-green-500',
      orange: 'bg-orange-100 text-orange-700 border-orange-500',
      purple: 'bg-purple-100 text-purple-700 border-purple-500',
      red: 'bg-red-100 text-red-700 border-red-500',
      pink: 'bg-pink-100 text-pink-700 border-pink-500',
    }
    return colors[color] || colors.blue
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Notification Center" 
          description={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
        />

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search notifications..." 
              className="pl-10 rounded-xl" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="rounded-xl"
              onClick={() => window.location.href = '/notifications/settings'}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant={selectedTab === tab.id ? 'default' : 'outline'}
              className={`rounded-xl whitespace-nowrap ${
                selectedTab === tab.id ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''
              }`}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                selectedTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {tab.count}
              </span>
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="rounded-3xl p-12">
              <div className="text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-600">You're all caught up!</p>
              </div>
            </Card>
          ) : (
            filteredNotifications.map((notif, idx) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className={`rounded-3xl p-6 ${!notif.read ? 'border-l-4' : ''} ${
                  !notif.read ? getColorClasses(notif.color) : 'bg-white'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
                      notif.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                      notif.color === 'green' ? 'from-green-500 to-emerald-500' :
                      notif.color === 'orange' ? 'from-orange-500 to-red-500' :
                      notif.color === 'purple' ? 'from-purple-500 to-pink-500' :
                      notif.color === 'red' ? 'from-red-500 to-pink-500' :
                      'from-pink-500 to-purple-500'
                    } flex items-center justify-center text-white flex-shrink-0`}>
                      <notif.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{notif.title}</h4>
                        {!notif.read && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full whitespace-nowrap">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{notif.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{notif.timestamp}</span>
                        {!notif.read && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-xl"
                            onClick={() => markAsRead(notif.id)}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="text-center">
            <Button variant="outline" className="rounded-xl">
              Load More Notifications
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
