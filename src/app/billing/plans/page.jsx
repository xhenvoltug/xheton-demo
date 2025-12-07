'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Crown, Zap, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 120000,
    description: 'Perfect for small businesses getting started',
    features: [
      '5 Users',
      '2 Branches',
      '10 Workflow Automations',
      '25 GB Storage',
      'Basic Reports',
      'Email Support',
      'Mobile App Access',
    ],
    color: 'from-blue-500 to-cyan-500',
    popular: false,
  },
  {
    id: 'business',
    name: 'Business',
    price: 350000,
    description: 'Best for growing businesses',
    features: [
      '25 Users',
      '10 Branches',
      '50 Workflow Automations',
      '100 GB Storage',
      'Advanced Reports & Analytics',
      'Priority Email & Phone Support',
      'Mobile App Access',
      'API Access',
      'Custom Integrations',
    ],
    color: 'from-purple-500 to-pink-500',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 900000,
    description: 'For large organizations with complex needs',
    features: [
      'Unlimited Users',
      'Unlimited Branches',
      'Unlimited Workflow Automations',
      '500 GB Storage',
      'Enterprise Reports & BI',
      '24/7 Dedicated Support',
      'Mobile App Access',
      'Full API Access',
      'Custom Integrations',
      'Dedicated Account Manager',
      'SLA Guarantee',
      'Custom Training',
    ],
    color: 'from-orange-500 to-red-500',
    popular: false,
  },
]

export default function BillingPlans() {
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [currentPlan, setCurrentPlan] = useState('business')

  const getPrice = (basePrice) => {
    if (billingCycle === 'annual') {
      return basePrice * 12 * 0.85 // 15% discount
    }
    return basePrice
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Pricing Plans" 
          description="Choose the perfect plan for your business"
        />

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center">
          <Card className="rounded-full p-1 inline-flex">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
              className={`rounded-full ${
                billingCycle === 'monthly' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === 'annual' ? 'default' : 'ghost'}
              className={`rounded-full ${
                billingCycle === 'annual' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''
              }`}
              onClick={() => setBillingCycle('annual')}
            >
              Annual
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                Save 15%
              </span>
            </Button>
          </Card>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {pricingPlans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}
              
              <Card className={`rounded-3xl p-8 h-full flex flex-col ${
                plan.popular ? 'border-2 border-purple-500 shadow-xl scale-105' : ''
              }`}>
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white mx-auto mb-4`}>
                    {plan.id === 'enterprise' ? <Crown className="w-8 h-8" /> : 
                     plan.id === 'business' ? <TrendingUp className="w-8 h-8" /> : 
                     <Zap className="w-8 h-8" />}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      UGX {getPrice(plan.price).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    per {billingCycle === 'monthly' ? 'month' : 'year'}
                  </p>
                  {billingCycle === 'annual' && (
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      Save UGX {(plan.price * 12 * 0.15).toLocaleString()} annually
                    </p>
                  )}
                </div>

                <div className="flex-1 mb-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIdx) => (
                      <motion.div
                        key={featureIdx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 + featureIdx * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Button
                  className={`w-full rounded-xl py-6 font-semibold ${
                    currentPlan === plan.id
                      ? 'bg-gray-200 text-gray-700 cursor-default'
                      : `bg-gradient-to-r ${plan.color} text-white hover:opacity-90`
                  }`}
                  disabled={currentPlan === plan.id}
                >
                  {currentPlan === plan.id ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <Card className="rounded-3xl p-8 bg-gradient-to-r from-blue-50 to-purple-50 max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-3">Need a Custom Plan?</h3>
            <p className="text-gray-600 mb-6">
              Contact our sales team for enterprise pricing and custom solutions tailored to your organization's needs.
            </p>
            <div className="flex gap-3 justify-center">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                Contact Sales
              </Button>
              <Button variant="outline" className="rounded-xl">
                View Feature Comparison
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
