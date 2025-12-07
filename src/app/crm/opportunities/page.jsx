'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, TrendingUp, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const stages = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost']

const mockOpportunities = {
  'New': [
    { id: 'OPP-101', company: 'Acme Corp', value: 15000000, probability: 10, contact: 'John Smith' },
    { id: 'OPP-102', company: 'TechStart', value: 8500000, probability: 15, contact: 'Mary Johnson' }
  ],
  'Qualified': [
    { id: 'OPP-103', company: 'Global Traders', value: 25000000, probability: 40, contact: 'David Okello' }
  ],
  'Proposal': [
    { id: 'OPP-104', company: 'BuildMax Ltd', value: 18000000, probability: 60, contact: 'Sarah Nambi' },
    { id: 'OPP-105', company: 'RetailHub', value: 12000000, probability: 55, contact: 'James Ouma' }
  ],
  'Negotiation': [
    { id: 'OPP-106', company: 'FoodCo Uganda', value: 32000000, probability: 80, contact: 'Grace Auma' }
  ],
  'Won': [
    { id: 'OPP-107', company: 'HealthPlus', value: 28000000, probability: 100, contact: 'Peter Mugisha' }
  ],
  'Lost': [
    { id: 'OPP-108', company: 'OldClient Inc', value: 9500000, probability: 0, contact: 'Alice Nakato' }
  ]
}

export default function Opportunities() {
  const [draggedCard, setDraggedCard] = useState(null)

  const totalValue = Object.values(mockOpportunities).flat().reduce((sum, opp) => sum + opp.value, 0)
  const weightedValue = Object.values(mockOpportunities).flat().reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Opportunities" description="Manage sales pipeline with visual kanban board" />

        <div className="flex items-center justify-between">
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
            <Plus className="w-4 h-4 mr-2" />
            New Opportunity
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
            <p className="text-xs opacity-90">Total Pipeline</p>
            <h3 className="text-2xl font-bold mt-1">UGX {(totalValue / 1000000).toFixed(1)}M</h3>
          </Card>
          <Card className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
            <p className="text-xs opacity-90">Weighted Value</p>
            <h3 className="text-2xl font-bold mt-1">UGX {(weightedValue / 1000000).toFixed(1)}M</h3>
          </Card>
          <Card className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <p className="text-xs opacity-90">Active Opportunities</p>
            <h3 className="text-2xl font-bold mt-1">{Object.values(mockOpportunities).flat().filter(o => o.probability > 0 && o.probability < 100).length}</h3>
          </Card>
          <Card className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white">
            <p className="text-xs opacity-90">Won This Month</p>
            <h3 className="text-2xl font-bold mt-1">UGX 28M</h3>
          </Card>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {stages.map((stage, stageIdx) => (
              <div key={stage} className="w-80 flex-shrink-0">
                <Card className="rounded-3xl p-4 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold">{stage}</h3>
                      <p className="text-xs text-gray-500">{mockOpportunities[stage]?.length || 0} opportunities</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="font-bold text-sm">
                        UGX {((mockOpportunities[stage]?.reduce((sum, o) => sum + o.value, 0) || 0) / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 min-h-[400px]">
                    {mockOpportunities[stage]?.map((opp, idx) => (
                      <motion.div
                        key={opp.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (stageIdx * 0.1) + (idx * 0.05) }}
                        className="p-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-400 transition-all cursor-move"
                        draggable
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-mono text-xs text-blue-600 font-bold">{opp.id}</span>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {opp.probability}%
                          </span>
                        </div>
                        <h4 className="font-bold mb-1">{opp.company}</h4>
                        <p className="text-sm text-gray-600 mb-2">{opp.contact}</p>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-xs text-gray-500">Value</span>
                          <span className="font-bold text-green-600">UGX {(opp.value / 1000000).toFixed(1)}M</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
