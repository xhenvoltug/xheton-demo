'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Building2, Users, Shield, Palette, Bell, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Configure your system and preferences
          </p>
        </motion.div>

        {/* Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="business" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 lg:w-auto">
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            <TabsContent value="business" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-emerald-600" />
                    <div>
                      <CardTitle>Business Profile</CardTitle>
                      <CardDescription>Manage your business information</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Business Name</Label>
                      <Input defaultValue="XHETON Demo Store" />
                    </div>
                    <div className="space-y-2">
                      <Label>Tax ID</Label>
                      <Input defaultValue="12-3456789" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" defaultValue="contact@xheton.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input defaultValue="+1 (555) 123-4567" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input defaultValue="123 Business St, New York, NY 10001" />
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-emerald-600" />
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Manage team members and permissions</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      Add New User
                    </Button>
                    <div className="border rounded-lg p-4 space-y-3">
                      {[
                        { name: 'Admin User', role: 'Administrator', email: 'admin@xheton.com' },
                        { name: 'Sales Manager', role: 'Manager', email: 'sales@xheton.com' },
                        { name: 'Staff Member', role: 'Staff', email: 'staff@xheton.com' },
                      ].map((user, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-emerald-600">{user.role}</span>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-emerald-600" />
                    <div>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>Manage security and access control</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Session Timeout</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Auto-logout after inactivity</p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">IP Whitelist</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Restrict access by IP address</p>
                      </div>
                      <Button variant="outline">Manage</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Palette className="h-6 w-6 text-emerald-600" />
                    <div>
                      <CardTitle>Appearance</CardTitle>
                      <CardDescription>Customize the look and feel</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="cursor-pointer hover:border-emerald-500 transition-all">
                        <CardContent className="p-4 text-center">
                          <div className="h-20 bg-white rounded-lg mb-2 border"></div>
                          <p className="text-sm font-medium">Light</p>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:border-emerald-500 transition-all">
                        <CardContent className="p-4 text-center">
                          <div className="h-20 bg-gray-900 rounded-lg mb-2"></div>
                          <p className="text-sm font-medium">Dark</p>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:border-emerald-500 transition-all">
                        <CardContent className="p-4 text-center">
                          <div className="h-20 bg-gradient-to-br from-white to-gray-900 rounded-lg mb-2"></div>
                          <p className="text-sm font-medium">Auto</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Bell className="h-6 w-6 text-emerald-600" />
                    <div>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Manage how you receive alerts</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Low Stock Alerts', description: 'Get notified when inventory is low' },
                    { label: 'Sales Notifications', description: 'Receive updates on new sales' },
                    { label: 'Payment Reminders', description: 'Reminders for pending payments' },
                    { label: 'System Updates', description: 'Important system announcements' },
                  ].map((notif, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{notif.label}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{notif.description}</p>
                      </div>
                      <input type="checkbox" className="h-5 w-5 text-emerald-600" defaultChecked />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Database className="h-6 w-6 text-emerald-600" />
                    <div>
                      <CardTitle>System Information</CardTitle>
                      <CardDescription>View system details and version info</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Version</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">0.0.001</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">2025-12-06</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Database Status</p>
                      <p className="text-lg font-semibold text-emerald-600">Connected</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Storage Used</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">2.4 GB / 10 GB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
