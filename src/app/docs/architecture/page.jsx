'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, Database, Shield, Smartphone, Palette, Zap } from 'lucide-react';

export default function ArchitecturePage() {
  const techStack = {
    frontend: [
      { name: 'Next.js 16', description: 'App Router, Server Components, API Routes' },
      { name: 'React 19', description: 'Latest React with concurrent features' },
      { name: 'Tailwind CSS v4', description: 'Utility-first CSS with modern features' },
      { name: 'Framer Motion', description: 'Animation library for smooth transitions' }
    ],
    ui: [
      { name: 'ShadCN/UI', description: 'Accessible component library' },
      { name: 'Radix UI', description: 'Unstyled, accessible UI primitives' },
      { name: 'Lucide React', description: 'Beautiful icon library' },
      { name: 'React Hot Toast', description: 'Notification system' }
    ],
    state: [
      { name: 'Zustand', description: 'Lightweight global state management' },
      { name: 'TanStack Query', description: 'Server state management' },
      { name: 'React Hook Form', description: 'Performant form handling' },
      { name: 'Zod', description: 'TypeScript-first schema validation' }
    ],
    backend: [
      { name: 'PostgreSQL', description: 'Primary relational database' },
      { name: 'JWT', description: 'Authentication tokens' },
      { name: 'bcrypt', description: 'Password hashing' },
      { name: 'pg', description: 'PostgreSQL client' }
    ]
  };

  const architecture = [
    {
      title: 'Frontend Architecture',
      icon: Layers,
      description: 'Modern React application with Next.js App Router',
      features: [
        'Server Components for optimal performance',
        'Client Components for interactivity',
        'API Routes for backend functionality',
        'File-based routing system',
        'Middleware for authentication',
        'Path aliases (@/ for src/)'
      ]
    },
    {
      title: 'Database Design',
      icon: Database,
      description: 'PostgreSQL with comprehensive business schema',
      features: [
        '20+ interconnected tables',
        'User management and authentication',
        'Business and branch management',
        'Product and inventory tracking',
        'Sales and purchase transactions',
        'Subscription and billing system',
        'Audit trails and logging'
      ]
    },
    {
      title: 'Security Architecture',
      icon: Shield,
      description: 'Enterprise-grade security implementation',
      features: [
        'JWT tokens in HTTP-only cookies',
        'bcrypt password hashing (12 rounds)',
        'SQL injection prevention',
        'XSS protection',
        'CSRF protection with SameSite cookies',
        'Input validation and sanitization',
        'Role-based access control'
      ]
    },
    {
      title: 'Responsive Design',
      icon: Smartphone,
      description: 'Mobile-first approach with adaptive layouts',
      features: [
        'Tailwind CSS responsive utilities',
        'Mobile-optimized navigation',
        'Touch-friendly interactions',
        'Adaptive component rendering',
        'Progressive enhancement',
        'Cross-device compatibility'
      ]
    },
    {
      title: 'Design System',
      icon: Palette,
      description: 'Consistent visual language and components',
      features: [
        'ShadCN/UI component library',
        'Custom design tokens',
        'Consistent spacing and typography',
        'Dark/light theme support',
        'Accessible color contrasts',
        'Reusable component patterns'
      ]
    },
    {
      title: 'Performance Optimization',
      icon: Zap,
      description: 'Fast, efficient application performance',
      features: [
        'Next.js App Router optimization',
        'Server Components for reduced bundle',
        'Image optimization',
        'Code splitting and lazy loading',
        'Efficient re-renders with React 19',
        'Database connection pooling'
      ]
    }
  ];

  const fileStructure = `
xheton/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (modules)/         # Business modules
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   └── docs/              # Documentation pages
│   ├── components/
│   │   ├── shared/            # Reusable components
│   │   ├── ui/                # ShadCN components
│   │   └── core/              # Core business components
│   └── lib/
│       ├── auth.js            # Authentication utilities
│       ├── store.js           # Zustand store
│       └── utils.js           # Helper functions
├── database/                  # SQL schemas and migrations
├── Documentation/             # Project documentation
└── public/                    # Static assets
`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            System Architecture
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Technical foundation and design patterns of the XHETON platform
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          {Object.entries(techStack).map(([category, technologies]) => (
            <Card key={category} className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="capitalize text-xl">{category} Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {technologies.map((tech, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {tech.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {tech.description}
                        </p>
                      </div>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {architecture.map((item, index) => (
            <Card key={item.title} className="border-0 shadow-lg h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <item.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {item.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Project Structure</CardTitle>
              <CardDescription>
                Organized file structure for maintainability and scalability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-900 text-slate-100 p-6 rounded-lg overflow-x-auto text-sm">
                <code>{fileStructure}</code>
              </pre>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}