'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageSquare, Mail, Send, Save, Activity, Webhook } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const activityLogs = [
  { id: 1, service: 'Africa\'s Talking SMS', action: 'SMS Sent', status: 'Success', timestamp: '2025-12-07 10:45 AM', details: 'Sale confirmation to +254 700 123 456' },
  { id: 2, service: 'Email SMTP', action: 'Email Sent', status: 'Success', timestamp: '2025-12-07 10:30 AM', details: 'Invoice to customer@example.com' },
  { id: 3, service: 'Africa\'s Talking SMS', action: 'SMS Sent', status: 'Failed', timestamp: '2025-12-07 09:15 AM', details: 'Low stock alert - Invalid number' },
  { id: 4, service: 'Webhook', action: 'Sale Created', status: 'Success', timestamp: '2025-12-07 08:50 AM', details: 'Webhook triggered to https://api.example.com' },
];

export default function IntegrationsPage() {
  const [smsConfig, setSmsConfig] = useState({
    apiKey: 'sandbox_api_key_12345',
    username: 'sandbox',
    senderId: 'XHETON'
  });

  const [emailConfig, setEmailConfig] = useState({
    provider: 'smtp',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'info@xheton.com',
    smtpPassword: '••••••••'
  });

  const [webhooks, setWebhooks] = useState([
    { id: 1, event: 'sale.created', url: 'https://api.example.com/webhooks/sale', active: true },
    { id: 2, event: 'inventory.low_stock', url: 'https://api.example.com/webhooks/stock', active: true },
  ]);

  const handleTestSMS = () => {
    toast.success('Test SMS sent successfully');
  };

  const handleTestEmail = () => {
    toast.success('Test email sent successfully');
  };

  const handleSave = () => {
    toast.success('Integration settings saved successfully');
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Integrations"
          subtitle="Configure third-party services and API connections"
          actions={[
            <Button
              key="save"
              onClick={handleSave}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          ]}
        />

        <div className="space-y-6">
          <Tabs defaultValue="sms">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sms">
                <MessageSquare className="h-4 w-4 mr-2" />
                SMS
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="webhooks">
                <Webhook className="h-4 w-4 mr-2" />
                Webhooks
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Activity className="h-4 w-4 mr-2" />
                Activity Log
              </TabsTrigger>
            </TabsList>

            {/* SMS Configuration */}
            <TabsContent value="sms" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6 bg-white dark:bg-gray-900/50">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Africa's Talking SMS</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure SMS gateway for notifications</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Connected
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="smsApiKey">API Key *</Label>
                      <Input
                        id="smsApiKey"
                        type="password"
                        value={smsConfig.apiKey}
                        onChange={(e) => setSmsConfig({ ...smsConfig, apiKey: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="smsUsername">Username *</Label>
                        <Input
                          id="smsUsername"
                          value={smsConfig.username}
                          onChange={(e) => setSmsConfig({ ...smsConfig, username: e.target.value })}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="smsSenderId">Sender ID *</Label>
                        <Input
                          id="smsSenderId"
                          value={smsConfig.senderId}
                          onChange={(e) => setSmsConfig({ ...smsConfig, senderId: e.target.value })}
                          placeholder="e.g., XHETON"
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button onClick={handleTestSMS} variant="outline">
                        <Send className="h-4 w-4 mr-2" />
                        Send Test SMS
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Email Configuration */}
            <TabsContent value="email" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6 bg-white dark:bg-gray-900/50">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Provider (SMTP)</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure email server for notifications</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Connected
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="smtpHost">SMTP Host *</Label>
                        <Input
                          id="smtpHost"
                          value={emailConfig.smtpHost}
                          onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                          placeholder="smtp.gmail.com"
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="smtpPort">SMTP Port *</Label>
                        <Input
                          id="smtpPort"
                          value={emailConfig.smtpPort}
                          onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: e.target.value })}
                          placeholder="587"
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="smtpUser">SMTP Username *</Label>
                      <Input
                        id="smtpUser"
                        type="email"
                        value={emailConfig.smtpUser}
                        onChange={(e) => setEmailConfig({ ...emailConfig, smtpUser: e.target.value })}
                        placeholder="your-email@gmail.com"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpPassword">SMTP Password *</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        value={emailConfig.smtpPassword}
                        onChange={(e) => setEmailConfig({ ...emailConfig, smtpPassword: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div className="pt-4">
                      <Button onClick={handleTestEmail} variant="outline">
                        <Send className="h-4 w-4 mr-2" />
                        Send Test Email
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white dark:bg-gray-900/50 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">WhatsApp Integration</h3>
                  <div className="p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">WhatsApp Business API integration coming soon</p>
                    <Button variant="outline" disabled>
                      Configure WhatsApp
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Webhooks */}
            <TabsContent value="webhooks" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6 bg-white dark:bg-gray-900/50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Webhook Endpoints</h3>
                    <Button size="sm">Add Webhook</Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {webhooks.map((webhook) => (
                        <TableRow key={webhook.id}>
                          <TableCell className="font-medium">{webhook.event}</TableCell>
                          <TableCell className="font-mono text-sm text-gray-600 dark:text-gray-400">{webhook.url}</TableCell>
                          <TableCell>
                            <Badge className={webhook.active 
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                            }>
                              {webhook.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              Test
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Activity Log */}
            <TabsContent value="activity" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6 bg-white dark:bg-gray-900/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Integration Activity Log</h3>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.service}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>
                            <Badge className={log.status === 'Success'
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }>
                              {log.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600 dark:text-gray-400">{log.timestamp}</TableCell>
                          <TableCell className="text-sm text-gray-600 dark:text-gray-400">{log.details}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
