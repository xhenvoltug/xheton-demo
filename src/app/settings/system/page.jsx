'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, Loader2, Building2, DollarSign, Bell, Layout } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SystemSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState([]);
  const [settingsMap, setSettingsMap] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();

      if (data.success) {
        setSettings(data.settings);
        
        // Create a map for easier access
        const map = {};
        data.settings.forEach(setting => {
          map[setting.key] = setting.value;
        });
        setSettingsMap(map);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const settingsArray = Object.entries(settingsMap).map(([key, value]) => ({
        key,
        value,
      }));

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: settingsArray }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Settings updated successfully');
      } else {
        toast.error(data.error || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setSettingsMap(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleBooleanChange = (key, checked) => {
    setSettingsMap(prev => ({
      ...prev,
      [key]: checked.toString(),
    }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="h-8 w-8 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              System Settings
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Configure system-wide settings and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="branding" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="branding">
                <Building2 className="h-4 w-4 mr-2" />
                Branding
              </TabsTrigger>
              <TabsTrigger value="financial">
                <DollarSign className="h-4 w-4 mr-2" />
                Financial
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="landing">
                <Layout className="h-4 w-4 mr-2" />
                Landing Page
              </TabsTrigger>
            </TabsList>

            {/* Branding Settings */}
            <TabsContent value="branding">
              <Card>
                <CardHeader>
                  <CardTitle>Branding & Company Info</CardTitle>
                  <CardDescription>
                    Customize your company's branding and identity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={settingsMap.company_name || ''}
                      onChange={(e) => handleChange('company_name', e.target.value)}
                      placeholder="XHETON"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_tagline">Company Tagline</Label>
                    <Input
                      id="company_tagline"
                      value={settingsMap.company_tagline || ''}
                      onChange={(e) => handleChange('company_tagline', e.target.value)}
                      placeholder="Modern Business Management"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financial Settings */}
            <TabsContent value="financial">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Settings</CardTitle>
                  <CardDescription>
                    Configure currency and financial preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="default_currency">Default Currency</Label>
                    <Input
                      id="default_currency"
                      value={settingsMap.default_currency || 'UGX'}
                      onChange={(e) => handleChange('default_currency', e.target.value)}
                      placeholder="UGX"
                      maxLength={3}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ISO currency code (e.g., UGX, USD, EUR)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency_symbol">Currency Symbol</Label>
                    <Input
                      id="currency_symbol"
                      value={settingsMap.currency_symbol || 'UGX'}
                      onChange={(e) => handleChange('currency_symbol', e.target.value)}
                      placeholder="UGX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="low_stock_threshold">Low Stock Alert Threshold</Label>
                    <Input
                      id="low_stock_threshold"
                      type="number"
                      value={settingsMap.low_stock_threshold || '10'}
                      onChange={(e) => handleChange('low_stock_threshold', e.target.value)}
                      placeholder="10"
                      min="1"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Alert when stock falls below this quantity
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Notifications</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive system notifications
                      </p>
                    </div>
                    <Switch
                      checked={settingsMap.enable_notifications === 'true'}
                      onCheckedChange={(checked) => handleBooleanChange('enable_notifications', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notification_email">Notification Email</Label>
                    <Input
                      id="notification_email"
                      type="email"
                      value={settingsMap.notification_email || ''}
                      onChange={(e) => handleChange('notification_email', e.target.value)}
                      placeholder="notifications@company.com"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Email address for receiving system alerts
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Alerts</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Send important alerts via email
                      </p>
                    </div>
                    <Switch
                      checked={settingsMap.enable_email_alerts === 'true'}
                      onCheckedChange={(checked) => handleBooleanChange('enable_email_alerts', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Landing Page Settings */}
            <TabsContent value="landing">
              <Card>
                <CardHeader>
                  <CardTitle>Landing Page Configuration</CardTitle>
                  <CardDescription>
                    Control what appears on your landing page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Landing Page</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Show public landing page
                      </p>
                    </div>
                    <Switch
                      checked={settingsMap.enable_landing_page === 'true'}
                      onCheckedChange={(checked) => handleBooleanChange('enable_landing_page', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Pricing</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Display pricing table on landing page
                      </p>
                    </div>
                    <Switch
                      checked={settingsMap.show_pricing === 'true'}
                      onCheckedChange={(checked) => handleBooleanChange('show_pricing', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Testimonials</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Display customer testimonials
                      </p>
                    </div>
                    <Switch
                      checked={settingsMap.show_testimonials === 'true'}
                      onCheckedChange={(checked) => handleBooleanChange('show_testimonials', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 mt-6">
            <Button
              type="submit"
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save All Settings
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
}
