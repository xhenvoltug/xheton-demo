'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Package,
  Calculator,
  BarChart3,
  Users,
  Truck,
  DollarSign,
  Settings,
  Shield,
  MessageSquare,
  CreditCard,
  Briefcase,
  Factory,
  UserCheck,
  FileText,
  Bell,
  MapPin,
  Wrench,
  Receipt,
  PieChart,
  Building
} from 'lucide-react';

export default function ModulesPage() {
  const modules = [
    {
      name: 'Sales Management',
      icon: ShoppingCart,
      status: 'Complete',
      description: 'Complete sales workflow from quotes to invoices',
      features: [
        'Sales orders and quotations',
        'Customer management',
        'Invoice generation',
        'Payment processing',
        'Sales analytics and reporting'
      ]
    },
    {
      name: 'Inventory Management',
      icon: Package,
      status: 'Complete',
      description: 'Comprehensive stock tracking and warehouse management',
      features: [
        'Product catalog management',
        'Stock level monitoring',
        'Warehouse transfers',
        'Batch and serial tracking',
        'Low stock alerts'
      ]
    },
    {
      name: 'Accounting',
      icon: Calculator,
      status: 'Active',
      description: 'Financial management and bookkeeping',
      features: [
        'Chart of accounts',
        'Journal entries',
        'Financial statements',
        'Budgeting and forecasting',
        'Tax calculations'
      ]
    },
    {
      name: 'Analytics & Reporting',
      icon: BarChart3,
      status: 'Active',
      description: 'Business intelligence and data visualization',
      features: [
        'Dashboard analytics',
        'Sales performance metrics',
        'Financial reports',
        'AI-powered forecasting',
        'Custom report builder'
      ]
    },
    {
      name: 'Customer Relationship Management',
      icon: Users,
      status: 'Active',
      description: 'Customer data and interaction management',
      features: [
        'Customer profiles',
        'Contact management',
        'Lead tracking',
        'Communication history',
        'Customer segmentation'
      ]
    },
    {
      name: 'Procurement',
      icon: Truck,
      status: 'Active',
      description: 'Purchase orders and supplier management',
      features: [
        'Supplier database',
        'Purchase requisitions',
        'Purchase orders',
        'Goods receipt notes',
        'Supplier performance tracking'
      ]
    },
    {
      name: 'Financial Management',
      icon: DollarSign,
      status: 'Active',
      description: 'Expense tracking and financial operations',
      features: [
        'Expense management',
        'Payment processing',
        'Bank reconciliation',
        'Currency management',
        'Financial planning'
      ]
    },
    {
      name: 'Point of Sale',
      icon: Receipt,
      status: 'Active',
      description: 'Retail sales and transaction processing',
      features: [
        'POS interface',
        'Cash register management',
        'Receipt printing',
        'Returns processing',
        'Sales reporting'
      ]
    },
    {
      name: 'Human Resources',
      icon: UserCheck,
      status: 'Active',
      description: 'Employee management and HR operations',
      features: [
        'Employee records',
        'Attendance tracking',
        'Leave management',
        'Payroll processing',
        'Performance reviews'
      ]
    },
    {
      name: 'Manufacturing',
      icon: Factory,
      status: 'Active',
      description: 'Production planning and manufacturing operations',
      features: [
        'Bill of materials',
        'Production planning',
        'Work orders',
        'Quality control',
        'Machine maintenance'
      ]
    },
    {
      name: 'Warehouse Management',
      icon: Building,
      status: 'Active',
      description: 'Advanced warehouse and logistics operations',
      features: [
        'Multi-location management',
        'Inventory optimization',
        'Picking and packing',
        'Shipping integration',
        'Warehouse analytics'
      ]
    },
    {
      name: 'Project Management',
      icon: Briefcase,
      status: 'Active',
      description: 'Project planning and resource allocation',
      features: [
        'Project creation',
        'Task management',
        'Resource allocation',
        'Time tracking',
        'Project reporting'
      ]
    },
    {
      name: 'Communication',
      icon: MessageSquare,
      status: 'Active',
      description: 'Internal communication and notifications',
      features: [
        'Announcements',
        'Chat system',
        'Email integration',
        'Notification center',
        'Contact management'
      ]
    },
    {
      name: 'Audit & Security',
      icon: Shield,
      status: 'Active',
      description: 'System security and audit trails',
      features: [
        'Audit logging',
        'Security monitoring',
        'Access control',
        'Session management',
        'Compliance reporting'
      ]
    },
    {
      name: 'Document Management',
      icon: FileText,
      status: 'Active',
      description: 'Document storage and collaboration',
      features: [
        'Document library',
        'Version control',
        'Permission management',
        'Document viewer',
        'Collaboration tools'
      ]
    },
    {
      name: 'Membership & Billing',
      icon: CreditCard,
      status: 'Active',
      description: 'Subscription and billing management',
      features: [
        'Subscription plans',
        'Billing cycles',
        'Payment processing',
        'Usage tracking',
        'Invoice generation'
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Business Modules
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Comprehensive suite of business management modules in XHETON
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Active</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {modules.map((module, index) => (
            <Card key={module.name} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <module.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <Badge className={getStatusColor(module.status)}>
                    {module.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{module.name}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {module.features.slice(0, 3).map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {module.features.length > 3 && (
                    <li className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      +{module.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Module Architecture</CardTitle>
              <CardDescription>
                How modules are organized and integrated within the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-emerald-600 dark:text-emerald-400">
                    Core Integration
                  </h3>
                  <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <span>Shared database schema with relationships</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <span>Unified authentication and user management</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <span>Consistent UI components across modules</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <span>Centralized state management</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-emerald-600 dark:text-emerald-400">
                    Development Approach
                  </h3>
                  <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <span>Modular architecture for scalability</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <span>API-first design for integrations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <span>Reusable components and patterns</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <span>Progressive enhancement approach</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}