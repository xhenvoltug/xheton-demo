'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Upload, Save, Check, Sun, Moon, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function BusinessInfoPage() {
  const [formData, setFormData] = useState({
    companyName: 'XHETON Systems Ltd',
    tradingName: 'XHETON',
    email: 'info@xheton.com',
    phone: '+254 700 123 456',
    address: '123 Business Park, Nairobi, Kenya',
    currency: 'UGX',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    theme: 'auto',
    footerText: 'Powered by XHETON © 2025'
  });

  const [autoSaved, setAutoSaved] = useState(false);
  const [previewTheme, setPreviewTheme] = useState('light');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setAutoSaved(false);
    // Simulate auto-save
    setTimeout(() => setAutoSaved(true), 1000);
  };

  const handleSave = () => {
    toast.success('Business information saved successfully');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Business Information"
          subtitle="Configure your company details and preferences"
          actions={[
            autoSaved && (
              <Badge key="autosave" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Check className="h-3 w-3 mr-1" />
                Auto-saved
              </Badge>
            ),
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main Form */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            {/* Company Details */}
            <Card className="p-6 bg-white dark:bg-gray-900/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Company Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="tradingName">Trading Name</Label>
                  <Input
                    id="tradingName"
                    value={formData.tradingName}
                    onChange={(e) => handleChange('tradingName', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="mt-1.5"
                    rows={2}
                  />
                </div>
              </div>
            </Card>

            {/* Logo Upload */}
            <Card className="p-6 bg-white dark:bg-gray-900/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Logo</h3>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, SVG up to 2MB</p>
              </div>
            </Card>

            {/* Regional Settings */}
            <Card className="p-6 bg-white dark:bg-gray-900/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Regional Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
                    <SelectTrigger id="currency" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UGX">UGX - Uganda Shilling</SelectItem>
                      <SelectItem value="KES">UGX - Kenyan Shilling</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={formData.dateFormat} onValueChange={(value) => handleChange('dateFormat', value)}>
                    <SelectTrigger id="dateFormat" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select value={formData.timeFormat} onValueChange={(value) => handleChange('timeFormat', value)}>
                    <SelectTrigger id="timeFormat" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Footer Text */}
            <Card className="p-6 bg-white dark:bg-gray-900/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Footer Settings</h3>
              <div>
                <Label htmlFor="footerText">Footer Text</Label>
                <Input
                  id="footerText"
                  value={formData.footerText}
                  onChange={(e) => handleChange('footerText', e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </Card>
          </motion.div>

          {/* Theme Preview Sidebar */}
          <motion.div variants={itemVariants} className="space-y-6">
            <Card className="p-6 bg-white dark:bg-gray-900/50 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Theme Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Default Theme</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[
                      { value: 'light', icon: Sun, label: 'Light' },
                      { value: 'dark', icon: Moon, label: 'Dark' },
                      { value: 'auto', icon: Monitor, label: 'Auto' }
                    ].map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => {
                          handleChange('theme', theme.value);
                          setPreviewTheme(theme.value === 'auto' ? 'light' : theme.value);
                        }}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.theme === theme.value
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-emerald-400'
                        }`}
                      >
                        <theme.icon className={`h-5 w-5 mx-auto mb-1 ${
                          formData.theme === theme.value ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'
                        }`} />
                        <p className={`text-xs ${
                          formData.theme === theme.value ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-gray-600 dark:text-gray-400'
                        }`}>{theme.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t dark:border-gray-700">
                  <Label className="mb-3 block">Theme Preview</Label>
                  <div className={`rounded-lg p-4 border-2 ${
                    previewTheme === 'dark' 
                      ? 'bg-gray-900 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className={`space-y-3 ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-emerald-600"></div>
                        <div>
                          <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                          <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 w-16 bg-emerald-600 rounded"></div>
                        <div className={`h-6 w-16 ${
                          previewTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        } rounded`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
