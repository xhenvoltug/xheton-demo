'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, MessageSquare, Save, Eye, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const emailTemplates = [
  { id: 'sale-complete', name: 'Sale Completed', subject: 'Sale Receipt #{saleId}', body: 'Dear {customerName},\n\nThank you for your purchase. Your sale has been completed successfully.\n\nSale ID: {saleId}\nAmount: {amount}\nDate: {date}\n\nBest regards,\n{companyName}' },
  { id: 'low-stock', name: 'Low Stock Alert', subject: 'Low Stock Alert: {productName}', body: 'Alert: Product "{productName}" is running low.\n\nCurrent Stock: {currentStock}\nReorder Level: {reorderLevel}\n\nPlease restock immediately.' },
  { id: 'invoice', name: 'Invoice Notification', subject: 'Invoice #{invoiceId}', body: 'Dear {customerName},\n\nPlease find attached invoice #{invoiceId}.\n\nAmount Due: {amount}\nDue Date: {dueDate}\n\nThank you,\n{companyName}' },
];

const smsTemplates = [
  { id: 'sale-sms', name: 'Sale Confirmation SMS', body: 'Thank you for shopping at {companyName}. Sale ID: {saleId}, Amount: {amount}. Visit us again!' },
  { id: 'low-stock-sms', name: 'Low Stock SMS', body: 'ALERT: {productName} stock is low ({currentStock} remaining). Restock needed.' },
];

const notificationEvents = [
  { id: 'sale-completed', label: 'Sale Completed', email: true, sms: true },
  { id: 'low-stock-alert', label: 'Low Stock Alert', email: true, sms: true },
  { id: 'invoice-created', label: 'Invoice Created', email: true, sms: false },
  { id: 'payment-received', label: 'Payment Received', email: true, sms: false },
  { id: 'purchase-order-approved', label: 'Purchase Order Approved', email: true, sms: false },
  { id: 'expense-submitted', label: 'Expense Submitted for Approval', email: true, sms: false },
];

export default function NotificationsPage() {
  const [activeTemplate, setActiveTemplate] = useState(emailTemplates[0]);
  const [showPreview, setShowPreview] = useState(false);
  const [events, setEvents] = useState(notificationEvents);

  const toggleEvent = (eventId, channel) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId
        ? { ...event, [channel]: !event[channel] }
        : event
    ));
  };

  const handleSave = () => {
    toast.success('Notification settings saved successfully');
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Notifications"
          subtitle="Configure email and SMS notification templates"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Templates */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="email">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Templates
                </TabsTrigger>
                <TabsTrigger value="sms">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  SMS Templates
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="mt-6 space-y-4">
                {emailTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="p-6 bg-white dark:bg-gray-900/50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setActiveTemplate(template);
                            setShowPreview(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label>Subject</Label>
                          <Input value={template.subject} className="mt-1.5" />
                        </div>
                        <div>
                          <Label>Body</Label>
                          <Textarea value={template.body} rows={6} className="mt-1.5 font-mono text-sm" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {['{customerName}', '{saleId}', '{amount}', '{date}', '{companyName}'].map((placeholder) => (
                            <Badge key={placeholder} variant="outline" className="text-xs">
                              {placeholder}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="sms" className="mt-6 space-y-4">
                {smsTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="p-6 bg-white dark:bg-gray-900/50">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{template.name}</h3>
                      <div className="space-y-3">
                        <div>
                          <Label>Message (160 characters max)</Label>
                          <Textarea value={template.body} rows={4} className="mt-1.5 font-mono text-sm" />
                          <p className="text-xs text-gray-500 mt-1">{template.body.length}/160 characters</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {['{companyName}', '{saleId}', '{amount}', '{productName}', '{currentStock}'].map((placeholder) => (
                            <Badge key={placeholder} variant="outline" className="text-xs">
                              {placeholder}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Event Triggers */}
          <div>
            <Card className="p-6 bg-white dark:bg-gray-900/50 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Bell className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Event Triggers
              </h3>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="pb-4 border-b dark:border-gray-700 last:border-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">{event.label}</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${event.id}-email`}
                          checked={event.email}
                          onCheckedChange={() => toggleEvent(event.id, 'email')}
                        />
                        <label
                          htmlFor={`${event.id}-email`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                        >
                          <Mail className="h-3 w-3" />
                          Email
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${event.id}-sms`}
                          checked={event.sms}
                          onCheckedChange={() => toggleEvent(event.id, 'sms')}
                        />
                        <label
                          htmlFor={`${event.id}-sms`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                        >
                          <MessageSquare className="h-3 w-3" />
                          SMS
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Email Preview: {activeTemplate?.name}</DialogTitle>
            </DialogHeader>
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="mb-4 pb-4 border-b dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Subject:</p>
                <p className="font-medium text-gray-900 dark:text-white">{activeTemplate?.subject}</p>
              </div>
              <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                {activeTemplate?.body}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
