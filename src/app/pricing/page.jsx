'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Check, X, ArrowRight, Users, Building2, Database, Headphones, Code, FileText, Calculator, Shield } from 'lucide-react';
import XhetonLogo from '@/components/XhetonLogo';

const pricingPlans = [
  {
    name: 'Free Trial',
    price: 0,
    period: '14 days',
    description: 'Evaluate XHETON with full access to all features',
    popular: false,
    features: {
      users: '2 users',
      branches: '1 location',
      storage: '500 MB',
      modules: 'All modules',
      support: 'Email support',
      reports: 'Basic reports',
      api: false,
      accounting: 'Basic ledgers',
      customization: false,
    },
    cta: 'Start Free Trial',
    highlight: false
  },
  {
    name: 'Starter',
    price: 49000,
    period: 'per month',
    description: 'Essential tools for small businesses and startups',
    popular: false,
    features: {
      users: 'Up to 5 users',
      branches: '1 location',
      storage: '10 GB',
      modules: 'Core modules',
      support: 'Email support',
      reports: 'Standard reports',
      api: 'Basic API access',
      accounting: 'Standard accounting',
      customization: false,
    },
    cta: 'Get Started',
    highlight: false
  },
  {
    name: 'Professional',
    price: 149000,
    period: 'per month',
    description: 'Advanced features for growing businesses',
    popular: true,
    features: {
      users: 'Up to 25 users',
      branches: 'Up to 5 locations',
      storage: '100 GB',
      modules: 'All modules',
      support: 'Priority support',
      reports: 'Advanced analytics',
      api: 'Full API access',
      accounting: 'Complete accounting suite',
      customization: 'Custom fields',
    },
    cta: 'Get Started',
    highlight: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact sales',
    description: 'Tailored solutions for large organizations',
    popular: false,
    features: {
      users: 'Unlimited users',
      branches: 'Unlimited locations',
      storage: 'Unlimited',
      modules: 'All modules + Custom',
      support: 'Dedicated account manager',
      reports: 'Custom reports & BI',
      api: 'Advanced API + Webhooks',
      accounting: 'Multi-currency accounting',
      customization: 'Full customization',
    },
    cta: 'Contact Sales',
    highlight: false
  }
];

const comparisonFeatures = [
  { category: 'User Access', items: [
    { name: 'User Accounts', free: '2', starter: '5', pro: '25', enterprise: 'Unlimited' },
    { name: 'Role-Based Permissions', free: true, starter: true, pro: true, enterprise: true },
    { name: 'Multi-Branch Access', free: false, starter: false, pro: true, enterprise: true },
  ]},
  { category: 'Core Features', items: [
    { name: 'Sales Management', free: true, starter: true, pro: true, enterprise: true },
    { name: 'Inventory Control', free: true, starter: true, pro: true, enterprise: true },
    { name: 'Purchase Management', free: true, starter: true, pro: true, enterprise: true },
    { name: 'Point of Sale', free: true, starter: true, pro: true, enterprise: true },
    { name: 'Expense Tracking', free: true, starter: true, pro: true, enterprise: true },
  ]},
  { category: 'Advanced Features', items: [
    { name: 'Warehouse Management', free: false, starter: true, pro: true, enterprise: true },
    { name: 'Advanced Analytics', free: false, starter: false, pro: true, enterprise: true },
    { name: 'Forecasting Tools', free: false, starter: false, pro: true, enterprise: true },
    { name: 'Custom Dashboards', free: false, starter: false, pro: true, enterprise: true },
  ]},
  { category: 'Accounting', items: [
    { name: 'Basic Ledgers', free: true, starter: true, pro: true, enterprise: true },
    { name: 'Trial Balance & P&L', free: false, starter: true, pro: true, enterprise: true },
    { name: 'Balance Sheet', free: false, starter: true, pro: true, enterprise: true },
    { name: 'Multi-Currency', free: false, starter: false, pro: false, enterprise: true },
  ]},
  { category: 'Support & Services', items: [
    { name: 'Email Support', free: true, starter: true, pro: true, enterprise: true },
    { name: 'Priority Support', free: false, starter: false, pro: true, enterprise: true },
    { name: 'Phone Support', free: false, starter: false, pro: true, enterprise: true },
    { name: 'Dedicated Account Manager', free: false, starter: false, pro: false, enterprise: true },
    { name: 'Onboarding Assistance', free: false, starter: false, pro: true, enterprise: true },
  ]},
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-50 via-slate-50 to-gray-100 dark:bg-gradient-to-bl dark:from-gray-950 dark:via-black dark:to-emerald-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-black/70 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <XhetonLogo className="w-10 h-10" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                XHETON
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Features</Link>
              <Link href="/#about" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">About</Link>
              <Link href="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-semibold">Pricing</Link>
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
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Transparent Pricing for
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Every Business Size
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the plan that fits your business needs. All plans include core features 
              with no hidden fees. Upgrade or downgrade at any time.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={plan.highlight ? 'lg:-mt-4' : ''}
              >
                <Card className={`h-full flex flex-col ${
                  plan.highlight 
                    ? 'border-4 border-emerald-500 dark:border-emerald-400 shadow-2xl' 
                    : 'border-2 hover:border-emerald-300 dark:hover:border-emerald-600'
                } transition-all duration-300`}>
                  <CardHeader className="text-center pb-8">
                    {plan.popular && (
                      <Badge className="mb-4 bg-emerald-600 text-white">Most Popular</Badge>
                    )}
                    <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                    <CardDescription className="text-sm">{plan.description}</CardDescription>
                    <div className="mt-6">
                      {typeof plan.price === 'number' ? (
                        <>
                          <div className="text-5xl font-bold text-gray-900 dark:text-white">
                            UGX {plan.price.toLocaleString()}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 mt-1">
                            {plan.period}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-4xl font-bold text-gray-900 dark:text-white">
                            {plan.price}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 mt-1">
                            {plan.period}
                          </div>
                        </>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 mb-8 flex-1">
                      <li className="flex items-start">
                        <Users className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{plan.features.users}</span>
                      </li>
                      <li className="flex items-start">
                        <Building2 className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{plan.features.branches}</span>
                      </li>
                      <li className="flex items-start">
                        <Database className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{plan.features.storage} storage</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{plan.features.modules}</span>
                      </li>
                      <li className="flex items-start">
                        <Headphones className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{plan.features.support}</span>
                      </li>
                      <li className="flex items-start">
                        <FileText className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{plan.features.reports}</span>
                      </li>
                      <li className="flex items-start">
                        {plan.features.api ? (
                          <Code className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                        )}
                        <span className={plan.features.api ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 line-through'}>
                          {plan.features.api || 'API access'}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Calculator className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{plan.features.accounting}</span>
                      </li>
                      {plan.features.customization && (
                        <li className="flex items-start">
                          <Shield className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{plan.features.customization}</span>
                        </li>
                      )}
                    </ul>
                    <Button 
                      className={`w-full ${
                        plan.highlight 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg' 
                          : 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900'
                      }`}
                      size="lg"
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32"
          >
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Detailed Feature Comparison
            </h2>
            <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12">
              Compare features across all pricing tiers
            </p>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Feature
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                        Free Trial
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                        Starter
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white bg-emerald-50 dark:bg-emerald-950">
                        Professional
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {comparisonFeatures.map((category, catIndex) => (
                      <>
                        <tr key={`cat-${catIndex}`} className="bg-gray-100 dark:bg-gray-800">
                          <td colSpan={5} className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-white">
                            {category.category}
                          </td>
                        </tr>
                        {category.items.map((item, itemIndex) => (
                          <tr key={`item-${catIndex}-${itemIndex}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {typeof item.free === 'boolean' ? (
                                item.free ? (
                                  <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                                ) : (
                                  <X className="w-5 h-5 text-gray-400 mx-auto" />
                                )
                              ) : (
                                <span className="text-sm text-gray-700 dark:text-gray-300">{item.free}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {typeof item.starter === 'boolean' ? (
                                item.starter ? (
                                  <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                                ) : (
                                  <X className="w-5 h-5 text-gray-400 mx-auto" />
                                )
                              ) : (
                                <span className="text-sm text-gray-700 dark:text-gray-300">{item.starter}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center bg-emerald-50 dark:bg-emerald-950/30">
                              {typeof item.pro === 'boolean' ? (
                                item.pro ? (
                                  <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                                ) : (
                                  <X className="w-5 h-5 text-gray-400 mx-auto" />
                                )
                              ) : (
                                <span className="text-sm text-gray-700 dark:text-gray-300">{item.pro}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {typeof item.enterprise === 'boolean' ? (
                                item.enterprise ? (
                                  <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                                ) : (
                                  <X className="w-5 h-5 text-gray-400 mx-auto" />
                                )
                              ) : (
                                <span className="text-sm text-gray-700 dark:text-gray-300">{item.enterprise}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32"
          >
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  q: 'Can I change plans later?',
                  a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.'
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards, debit cards, and bank transfers for annual plans. Enterprise customers can arrange custom payment terms.'
                },
                {
                  q: 'Is my data secure?',
                  a: 'Absolutely. We use bank-grade encryption, regular security audits, and comply with industry standards for data protection.'
                },
                {
                  q: 'Can I cancel anytime?',
                  a: 'Yes, there are no long-term contracts. You can cancel your subscription at any time with no penalties.'
                },
                {
                  q: 'Do you offer training?',
                  a: 'Professional and Enterprise plans include onboarding assistance. We also provide documentation, video tutorials, and ongoing support.'
                },
                {
                  q: 'What happens after the free trial?',
                  a: 'After 14 days, you can choose a paid plan to continue using XHETON. Your data is preserved for 30 days if you need more time to decide.'
                },
              ].map((faq, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.a}
                  </p>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 sm:p-16 text-center shadow-2xl"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-emerald-50 mb-10 max-w-2xl mx-auto">
              Start your 14-day free trial today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-6 shadow-xl">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white/10">
                  View Live Demo
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
                Modern business management for forward-thinking companies.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/#features" className="hover:text-emerald-400 transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-emerald-400 transition-colors">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/#about" className="hover:text-emerald-400 transition-colors">About</Link></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact Support</a></li>
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
