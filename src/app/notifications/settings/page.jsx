'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Mail, Smartphone, Monitor, Clock, Save, TestTube2, Volume2, VolumeX } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const notificationChannels = [
  { id: 'email', label: 'Email Notifications', icon: Mail, enabled: true },
  { id: 'sms', label: 'SMS Notifications', icon: Smartphone, enabled: false },
  { id: 'inApp', label: 'In-App Notifications', icon: Bell, enabled: true },
  { id: 'push', label: 'Push Notifications', icon: Monitor, enabled: true },
]

const categories = [
  { id: 'sales', label: 'Sales & Invoices', description: 'New sales, payments, quotes', email: true, sms: false, inApp: true, push: true },
  { id: 'inventory', label: 'Inventory & Stock', description: 'Low stock alerts, stock movements', email: true, sms: true, inApp: true, push: true },
  { id: 'payments', label: 'Payments & Finance', description: 'Payment received, overdue invoices', email: true, sms: false, inApp: true, push: false },
  { id: 'workflows', label: 'Workflow Automations', description: 'Automation triggers, completions', email: false, sms: false, inApp: true, push: false },
  { id: 'deliveries', label: 'Deliveries & Logistics', description: 'Delivery updates, tracking', email: true, sms: true, inApp: true, push: true },
  { id: 'hrm', label: 'HR & Payroll', description: 'Leave requests, attendance', email: true, sms: false, inApp: true, push: false },
  { id: 'system', label: 'System Updates', description: 'Security alerts, system maintenance', email: true, sms: false, inApp: true, push: true },
]

export default function NotificationSettings() {
  const [channels, setChannels] = useState(notificationChannels)
  const [categoryPrefs, setCategoryPrefs] = useState(categories)
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false)
  const [quietStart, setQuietStart] = useState('22:00')
  const [quietEnd, setQuietEnd] = useState('07:00')
  const [saved, setSaved] = useState(false)

  const toggleChannel = (id) => {
    setChannels(channels.map(ch => ch.id === id ? { ...ch, enabled: !ch.enabled } : ch))
  }

  const toggleCategoryChannel = (categoryId, channel) => {
    setCategoryPrefs(categoryPrefs.map(cat => 
      cat.id === categoryId ? { ...cat, [channel]: !cat[channel] } : cat
    ))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const testNotification = () => {
    alert('Test notification sent! Check your devices.')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Notification Preferences" 
          description="Manage how and when you receive notifications"
        />

        {/* Notification Channels */}
        <Card className="rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-6">Notification Channels</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {channels.map((channel, idx) => (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between p-4 rounded-2xl border"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    channel.enabled ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <channel.icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">{channel.label}</span>
                </div>
                <Switch 
                  checked={channel.enabled} 
                  onCheckedChange={() => toggleChannel(channel.id)}
                />
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Category Preferences */}
        <Card className="rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-6">Category Preferences</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">SMS</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">In-App</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Push</th>
                </tr>
              </thead>
              <tbody>
                {categoryPrefs.map((cat, idx) => (
                  <motion.tr
                    key={cat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-semibold text-gray-900">{cat.label}</div>
                        <div className="text-xs text-gray-500">{cat.description}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Switch 
                        checked={cat.email} 
                        onCheckedChange={() => toggleCategoryChannel(cat.id, 'email')}
                      />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Switch 
                        checked={cat.sms} 
                        onCheckedChange={() => toggleCategoryChannel(cat.id, 'sms')}
                      />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Switch 
                        checked={cat.inApp} 
                        onCheckedChange={() => toggleCategoryChannel(cat.id, 'inApp')}
                      />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Switch 
                        checked={cat.push} 
                        onCheckedChange={() => toggleCategoryChannel(cat.id, 'push')}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quiet Hours */}
        <Card className="rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                {quietHoursEnabled ? <VolumeX className="w-5 h-5 text-purple-600" /> : <Volume2 className="w-5 h-5 text-gray-400" />}
                Quiet Hours
              </h3>
              <p className="text-sm text-gray-600 mt-1">Mute non-critical notifications during specific times</p>
            </div>
            <Switch 
              checked={quietHoursEnabled} 
              onCheckedChange={setQuietHoursEnabled}
            />
          </div>

          {quietHoursEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid md:grid-cols-2 gap-4"
            >
              <div>
                <Label className="mb-2 block">Start Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="time"
                    value={quietStart}
                    onChange={(e) => setQuietStart(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div>
                <Label className="mb-2 block">End Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="time"
                    value={quietEnd}
                    onChange={(e) => setQuietEnd(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </Card>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-3 justify-between">
          <Button 
            variant="outline" 
            className="rounded-xl"
            onClick={testNotification}
          >
            <TestTube2 className="w-4 h-4 mr-2" />
            Send Test Notification
          </Button>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" />
            {saved ? 'Settings Saved!' : 'Save Settings'}
          </Button>
        </div>

        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-100 border border-green-500 rounded-2xl text-green-700 text-center"
          >
            ✓ Your notification preferences have been saved successfully
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
