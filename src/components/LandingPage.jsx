'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import XhetonLogo from '@/components/XhetonLogo';
import { 
  TrendingUp, Package, CreditCard, ShoppingBag, Users, UserCheck, 
  Receipt, Warehouse, Calculator, Building2, BarChart3, Brain,
  ArrowRight, CheckCircle, Zap, Shield, Globe
} from 'lucide-react';
import Link from 'next/link';

const iconMap = {
  TrendingUp, Package, CreditCard, ShoppingBag, Users, UserCheck,
  Receipt, Warehouse, Calculator, Building2, BarChart3, Brain
};

const features = [
  {
    title: "Sales Management",
    description: "Streamline your entire sales cycle from quotation to payment collection. Manage invoices, track customer interactions, and monitor sales performance with real-time reporting that supports strategic decision-making.",
    icon: "TrendingUp"
  },
  {
    title: "Inventory Control",
    description: "Maintain optimal stock levels with intelligent tracking across multiple locations. Automated alerts, batch management, and real-time visibility help reduce carrying costs while preventing stockouts.",
    icon: "Package"
  },
  {
    title: "Point of Sale",
    description: "Process transactions efficiently with a modern, touch-optimized interface. Support multiple payment methods, quick product lookup, and seamless integration with inventory and accounting modules.",
    icon: "CreditCard"
  },
  {
    title: "Purchase Management",
    description: "Control procurement from requisition to receipt. Create purchase orders, track supplier performance, manage approvals, and maintain accurate cost records for better financial control.",
    icon: "ShoppingBag"
  },
  {
    title: "Supplier Relations",
    description: "Centralize supplier information, payment terms, and transaction history. Monitor delivery performance, manage contracts, and maintain healthy vendor relationships with systematic record-keeping.",
    icon: "Users"
  },
  {
    title: "Customer Accounts",
    description: "Maintain comprehensive customer profiles with purchase history, credit limits, and payment terms. Track receivables, manage credit notes, and deliver consistent service across all touchpoints.",
    icon: "UserCheck"
  },
  {
    title: "Expense Management",
    description: "Record and categorize business expenses systematically. Track payment obligations, monitor budget adherence, and generate detailed expense reports for accurate financial planning.",
    icon: "Receipt"
  },
  {
    title: "Warehouse Management",
    description: "Organize inventory across multiple warehouses with bin-level accuracy. Track stock movements, manage transfers between locations, and optimize storage utilization with detailed reporting.",
    icon: "Warehouse"
  },
  {
    title: "Financial Accounting",
    description: "Maintain accurate books with integrated accounting features. Generate trial balances, profit & loss statements, and balance sheets while ensuring compliance with accounting standards.",
    icon: "Calculator"
  },
  {
    title: "Multi-Branch Operations",
    description: "Centralize control across multiple business locations. Standardize processes, consolidate reporting, and maintain consistency while allowing branch-level flexibility where needed.",
    icon: "Building2"
  },
  {
    title: "Business Analytics",
    description: "Access comprehensive dashboards and customizable reports for informed decision-making. Analyze trends, identify patterns, and measure performance across all business metrics.",
    icon: "BarChart3"
  },
  {
    title: "Intelligent Forecasting",
    description: "Leverage data-driven insights for demand planning and inventory optimization. Advanced algorithms help predict seasonal trends and support proactive business planning.",
    icon: "Brain"
  }
];

const benefits = [
  { icon: Zap, title: "Lightning Fast", description: "Built for performance with Next.js 16" },
  { icon: Shield, title: "Enterprise Security", description: "Bank-grade data protection" },
  { icon: Globe, title: "Multi-Location", description: "Unlimited stores, one system" },
  { icon: CheckCircle, title: "Always Updated", description: "Continuous improvements" }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-50 via-slate-50 to-gray-100 dark:bg-gradient-to-bl dark:from-gray-950 dark:via-black dark:to-emerald-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-black/70 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <XhetonLogo className="w-10 h-10" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                XHETON
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Features</a>
              <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">About</a>
              <Link href="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Pricing</Link>
              <Link href="/dashboard">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <XhetonLogo className="w-24 h-24 sm:w-32 sm:h-32" />
            </motion.div>
            
            <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Modern Business Management
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Built for the Next Decade
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              XHETON is a comprehensive business management platform designed for growing companies. 
              A modern alternative to traditional systems like Tally, QuickBooks, and Odoo—built with tomorrow's technology, today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-6 shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950">
                Book a Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 mb-4">
                  <benefit.icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything Your Business Needs
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Powerful features designed to streamline operations, increase profitability, 
              and give you complete control of your business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-emerald-500 dark:hover:border-emerald-400">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 sm:py-32 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose XHETON?
                <br />
                <span className="text-emerald-600">A Modern Approach</span>
              </h2>
              <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  XHETON represents a new generation of business management software. 
                  While traditional systems continue to iterate on legacy architectures, 
                  we've built our platform from the ground up using modern web technologies 
                  and contemporary design principles.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">Our commitment is clear:</strong> 
                  provide businesses with tools that eliminate unnecessary complexity. 
                  Every feature is designed to reduce manual effort, improve data accuracy, 
                  and support informed decision-making.
                </p>
                <p>
                  Whether you're managing a single location or coordinating across multiple branches, 
                  XHETON adapts to your workflow. Our flexible architecture supports growth 
                  while maintaining the responsiveness and clarity that makes it practical for daily use.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 shadow-2xl">
                <div className="h-full flex flex-col justify-between text-white">
                  <div>
                    <h3 className="text-3xl font-bold mb-4">Key Differentiators</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
                        <span className="text-lg">Modern web-based architecture for accessibility</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
                        <span className="text-lg">Data-driven insights for better planning</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
                        <span className="text-lg">Intuitive interface designed for user adoption</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
                        <span className="text-lg">Flexible deployment for diverse business needs</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
                        <span className="text-lg">Regular updates and feature enhancements</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 sm:p-16 text-center shadow-2xl"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Modernize Your Business Operations?
            </h2>
            <p className="text-xl text-emerald-50 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join forward-thinking businesses that have chosen XHETON for comprehensive 
              business management. Start your journey toward operational excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/pricing">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-6 shadow-xl">
                  View Pricing
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white/10">
                  Try Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <XhetonLogo className="w-8 h-8" />
                <span className="text-xl font-bold">XHETON</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The future of business management, today.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-emerald-400 transition-colors">Features</a></li>
                <li><Link href="/pricing" className="hover:text-emerald-400 transition-colors">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-emerald-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Xhenvolt Technologies. All rights reserved. Version 0.0.001</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
