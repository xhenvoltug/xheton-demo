'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Code, Settings, Layers } from 'lucide-react';

export default function DocsPage() {
  const sections = [
    {
      title: 'Project Creation',
      description: 'How XHETON was built and set up',
      href: '/docs/creation',
      icon: Settings,
      color: 'bg-blue-500'
    },
    {
      title: 'Architecture',
      description: 'Tech stack, structure, and design patterns',
      href: '/docs/architecture',
      icon: Layers,
      color: 'bg-green-500'
    },
    {
      title: 'Modules',
      description: 'Business modules and features implemented',
      href: '/docs/modules',
      icon: BookOpen,
      color: 'bg-purple-500'
    },
    {
      title: 'Components',
      description: 'Reusable components and UI patterns',
      href: '/docs/components',
      icon: Code,
      color: 'bg-orange-500'
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
            XHETON Documentation
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Comprehensive documentation for the XHETON Sales & Inventory Management System
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary">Version 0.0.017</Badge>
            <Badge variant="outline">Next.js 16</Badge>
            <Badge variant="outline">React 19</Badge>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {sections.map((section, index) => (
            <Link key={section.title} href={section.href}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-0 shadow-md">
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {section.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Card className="max-w-4xl mx-auto border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">About XHETON</CardTitle>
            </CardHeader>
            <CardContent className="text-left">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                XHETON is a next-generation business management platform that combines sales, inventory,
                procurement, point-of-sale, warehouse management, expense tracking, and AI-powered analytics
                in one unified system.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Built with modern technologies including Next.js 16, React 19, Tailwind CSS v4, and
                ShadCN/UI components, XHETON provides a beautiful, responsive, and scalable solution
                for businesses of all sizes.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}