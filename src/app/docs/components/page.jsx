'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  Layout,
  BarChart3,
  FileText,
  CreditCard,
  CheckCircle,
  Smartphone,
  Eye,
  Code,
  Palette,
  Zap
} from 'lucide-react';

export default function ComponentsPage() {
  const sharedComponents = [
    {
      name: 'DataTable',
      icon: Table,
      description: 'Advanced table with sorting, selection, and mobile cards',
      features: ['Row selection', 'Staggered animations', 'Multiple variants', 'Empty states'],
      usage: 'Used in all list pages for data display'
    },
    {
      name: 'PageHeader',
      icon: Layout,
      description: 'Consistent page headers with title, subtitle, and actions',
      features: ['Flexible actions', 'Responsive layout', 'Fade animations', 'Breadcrumb support'],
      usage: 'Standard header for all major pages'
    },
    {
      name: 'FilterBar',
      icon: BarChart3,
      description: 'Search and filter controls with mobile sheet',
      features: ['Search input', 'Multiple filters', 'Mobile sheet', 'Active count badge'],
      usage: 'Data filtering across list pages'
    },
    {
      name: 'FormCard',
      icon: FileText,
      description: 'Structured form sections with validation',
      features: ['Title/description', 'Bordered sections', 'Footer slots', 'Consistent padding'],
      usage: 'Form organization and layout'
    },
    {
      name: 'StatCard',
      icon: CreditCard,
      description: 'KPI cards with icons and trend indicators',
      features: ['Gradient icons', 'Value display', 'Trend arrows', 'Hover effects'],
      usage: 'Dashboard metrics and statistics'
    },
    {
      name: 'ConfirmDialog',
      icon: CheckCircle,
      description: 'Modal confirmations with multiple variants',
      features: ['4 variants', 'Icon variants', 'Scale animations', 'Loading states'],
      usage: 'User confirmations and actions'
    },
    {
      name: 'MobileCard',
      icon: Smartphone,
      description: 'Mobile-optimized card view for tables',
      features: ['Label-value pairs', 'Chevron icons', 'Tap animations', 'Responsive design'],
      usage: 'Mobile table replacement'
    }
  ];

  const uiComponents = [
    { name: 'Button', description: 'Customizable button component' },
    { name: 'Card', description: 'Content containers with variants' },
    { name: 'Input', description: 'Form input fields' },
    { name: 'Label', description: 'Form field labels' },
    { name: 'Select', description: 'Dropdown selection component' },
    { name: 'Dialog', description: 'Modal dialogs and popovers' },
    { name: 'Dropdown Menu', description: 'Context menus and actions' },
    { name: 'Avatar', description: 'User profile images' },
    { name: 'Badge', description: 'Status and label indicators' },
    { name: 'Separator', description: 'Visual content dividers' },
    { name: 'Sheet', description: 'Slide-out panels' },
    { name: 'Sidebar', description: 'Navigation sidebars' },
    { name: 'Tabs', description: 'Tabbed content navigation' },
    { name: 'Table', description: 'Data table structures' },
    { name: 'Tooltip', description: 'Help text on hover' },
    { name: 'Skeleton', description: 'Loading state placeholders' }
  ];

  const coreComponents = [
    {
      name: 'AnimatedCard',
      description: 'Cards with entrance animations'
    },
    {
      name: 'ConfirmDialog',
      description: 'Enhanced confirmation dialogs'
    },
    {
      name: 'EmptyState',
      description: 'Empty state illustrations and messages'
    },
    {
      name: 'FileUpload',
      description: 'Drag-and-drop file upload component'
    },
    {
      name: 'Skeletons',
      description: 'Loading skeleton components'
    },
    {
      name: 'StatusBadge',
      description: 'Status indicators with colors'
    }
  ];

  const designPatterns = [
    {
      title: 'Component Architecture',
      icon: Code,
      patterns: [
        'Atomic design principles',
        'Composition over inheritance',
        'Props-based customization',
        'Consistent API design',
        'TypeScript-ready interfaces'
      ]
    },
    {
      title: 'Styling Approach',
      icon: Palette,
      patterns: [
        'Tailwind CSS utilities',
        'Custom CSS variables',
        'Dark mode support',
        'Responsive design system',
        'Consistent spacing scale'
      ]
    },
    {
      title: 'Animation System',
      icon: Zap,
      patterns: [
        'Framer Motion integration',
        'Staggered list animations',
        'Page transition effects',
        'Micro-interactions',
        'Performance-optimized animations'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Component Library
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Reusable components and design patterns powering the XHETON interface
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Eye className="w-6 h-6" />
                Shared Components
              </CardTitle>
              <CardDescription>
                Core reusable components used across all modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sharedComponents.map((component, index) => (
                  <Card key={component.name} className="border border-slate-200 dark:border-slate-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                          <component.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{component.name}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {component.description}
                      </p>
                      <div className="mb-3">
                        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {component.features.map((feature, featureIndex) => (
                            <Badge key={featureIndex} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        <strong>Usage:</strong> {component.usage}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">UI Components</CardTitle>
              <CardDescription>
                ShadCN/UI component library (16 components)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {uiComponents.map((component, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">{component.name}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{component.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Core Components</CardTitle>
              <CardDescription>
                Business-specific components (6 components)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {coreComponents.map((component, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">{component.name}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{component.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Design Patterns</CardTitle>
              <CardDescription>
                Consistent patterns and principles used throughout the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {designPatterns.map((pattern, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <pattern.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="font-semibold text-lg">{pattern.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {pattern.patterns.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}