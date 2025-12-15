'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Settings, Code, Layers, Database, Shield } from 'lucide-react';

export default function CreationPage() {
  const phases = [
    {
      title: 'Initial Setup',
      date: 'December 6, 2025',
      version: '0.0.001',
      icon: Settings,
      items: [
        'Next.js 16 project initialization with App Router',
        'React 19 and Tailwind CSS v4 configuration',
        'ShadCN/UI component library installation (14 components)',
        'Framer Motion for smooth animations',
        'Recharts for data visualization',
        'React Hook Form with Zod validation',
        'Zustand for state management',
        'React Hot Toast for notifications'
      ]
    },
    {
      title: 'Core Architecture',
      date: 'December 6-7, 2025',
      version: '0.0.003',
      icon: Layers,
      items: [
        'Dashboard layout with sidebar navigation',
        'Landing page with marketing content',
        '7 reusable shared components (DataTable, PageHeader, etc.)',
        'Sales and Inventory modules implementation',
        'Mobile-responsive design patterns',
        'Dark mode support throughout',
        'Authentication system with JWT',
        'Database integration with PostgreSQL'
      ]
    },
    {
      title: 'Business Logic',
      date: 'December 7-13, 2025',
      version: '0.0.012 to 0.0.017',
      icon: Database,
      items: [
        'Complete authentication flow (login/signup/onboarding)',
        'Subscription management system',
        'Multi-module business application',
        'API routes for all major features',
        'Database schema with 20+ tables',
        'Advanced features like audit trails, automation',
        'Comprehensive documentation system'
      ]
    }
  ];

  const technologies = [
    { name: 'Next.js 16', description: 'App Router, Server Components, Turbopack' },
    { name: 'React 19', description: 'Latest React features and hooks' },
    { name: 'Tailwind CSS v4', description: 'Utility-first styling with modern features' },
    { name: 'ShadCN/UI', description: 'Accessible, customizable component library' },
    { name: 'Framer Motion', description: 'Smooth animations and transitions' },
    { name: 'PostgreSQL', description: 'Robust relational database' },
    { name: 'JWT', description: 'Secure authentication tokens' },
    { name: 'Zustand', description: 'Lightweight state management' }
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
            Project Creation
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            The development journey of XHETON from initial setup to a comprehensive business management platform
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {phases.map((phase, index) => (
            <Card key={phase.title} className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <phase.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{phase.title}</CardTitle>
                    <CardDescription className="text-lg">
                      {phase.date} • Version {phase.version}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {phase.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
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
              <CardTitle className="text-2xl flex items-center gap-2">
                <Code className="w-6 h-6" />
                Core Technologies
              </CardTitle>
              <CardDescription>
                The technology stack that powers XHETON
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {technologies.map((tech, index) => (
                  <div key={tech.name} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <h3 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                      {tech.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {tech.description}
                    </p>
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
          className="mt-16"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Development Principles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-emerald-600 dark:text-emerald-400">
                    Design Philosophy
                  </h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li>• Modern, clean aesthetics with gradients and shadows</li>
                    <li>• Mobile-first responsive design</li>
                    <li>• Consistent spacing and visual hierarchy</li>
                    <li>• Smooth animations on all interactions</li>
                    <li>• Dark mode support throughout</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-emerald-600 dark:text-emerald-400">
                    Technical Standards
                  </h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li>• TypeScript-ready JavaScript codebase</li>
                    <li>• Component-based architecture</li>
                    <li>• Reusable shared components</li>
                    <li>• Proper error handling and validation</li>
                    <li>• Performance-optimized rendering</li>
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