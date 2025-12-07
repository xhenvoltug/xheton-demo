'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Star,
  Award,
  Target,
  BarChart3,
  FileText,
  Calendar
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockEvaluations = [
  {
    id: 'EVAL-001',
    supplierId: 'SUP-2501',
    supplierName: 'Global Tech Supplies Ltd.',
    date: '2025-12-01',
    evaluator: 'John Doe',
    overallScore: 92,
    criteria: {
      quality: 95,
      delivery: 90,
      pricing: 88,
      communication: 93,
      compliance: 94
    },
    riskScore: 'low',
    status: 'completed'
  },
  {
    id: 'EVAL-002',
    supplierId: 'SUP-2502',
    supplierName: 'Local Hardware Co.',
    date: '2025-11-28',
    evaluator: 'Jane Smith',
    overallScore: 85,
    criteria: {
      quality: 82,
      delivery: 88,
      pricing: 90,
      communication: 80,
      compliance: 85
    },
    riskScore: 'low',
    status: 'completed'
  },
  {
    id: 'EVAL-003',
    supplierId: 'SUP-2504',
    supplierName: 'Budget Supplies LLC',
    date: '2025-11-15',
    evaluator: 'Mike Johnson',
    overallScore: 65,
    criteria: {
      quality: 60,
      delivery: 70,
      pricing: 75,
      communication: 62,
      compliance: 58
    },
    riskScore: 'high',
    status: 'completed'
  },
  {
    id: 'EVAL-004',
    supplierId: 'SUP-2503',
    supplierName: 'Premium Materials Inc.',
    date: '2025-11-10',
    evaluator: 'Sarah Lee',
    overallScore: 96,
    criteria: {
      quality: 98,
      delivery: 95,
      pricing: 92,
      communication: 97,
      compliance: 98
    },
    riskScore: 'low',
    status: 'completed'
  }
]

const mockEvaluationHistory = [
  { quarter: 'Q1 2025', score: 88 },
  { quarter: 'Q2 2025', score: 90 },
  { quarter: 'Q3 2025', score: 92 },
  { quarter: 'Q4 2025', score: 94 }
]

const mockComparisonData = [
  { supplier: 'Global Tech', quality: 95, delivery: 90, pricing: 88, communication: 93, compliance: 94 },
  { supplier: 'Local Hardware', quality: 82, delivery: 88, pricing: 90, communication: 80, compliance: 85 },
  { supplier: 'Premium Materials', quality: 98, delivery: 95, pricing: 92, communication: 97, compliance: 98 },
  { supplier: 'Budget Supplies', quality: 60, delivery: 70, pricing: 75, communication: 62, compliance: 58 }
]

export default function SupplierEvaluations() {
  const [showEvaluationForm, setShowEvaluationForm] = useState(false)
  const [selectedEvaluation, setSelectedEvaluation] = useState(null)

  const getRiskBadge = (risk) => {
    const badges = {
      low: { color: 'bg-green-100 text-green-700', label: 'Low Risk' },
      medium: { color: 'bg-yellow-100 text-yellow-700', label: 'Medium Risk' },
      high: { color: 'bg-red-100 text-red-700', label: 'High Risk' }
    }
    return badges[risk] || badges.low
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score) => {
    if (score >= 90) return 'from-green-500 to-emerald-500'
    if (score >= 75) return 'from-yellow-500 to-amber-500'
    return 'from-red-500 to-orange-500'
  }

  const columns = [
    {
      header: 'Evaluation ID',
      accessorKey: 'id',
      cell: ({ row }) => (
        <span className="font-mono text-blue-600 font-semibold">{row.original.id}</span>
      )
    },
    {
      header: 'Supplier',
      accessorKey: 'supplierName',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold">{row.original.supplierName}</p>
          <p className="text-xs text-gray-500">{row.original.supplierId}</p>
        </div>
      )
    },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Evaluator', accessorKey: 'evaluator' },
    {
      header: 'Overall Score',
      accessorKey: 'overallScore',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${getScoreColor(row.original.overallScore)}`}>
            {row.original.overallScore}
          </span>
          <span className="text-gray-400">/100</span>
        </div>
      )
    },
    {
      header: 'Risk Score',
      accessorKey: 'riskScore',
      cell: ({ row }) => {
        const badge = getRiskBadge(row.original.riskScore)
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
            {badge.label}
          </span>
        )
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          {row.original.status}
        </span>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Supplier Evaluations"
          description="Assess and track supplier performance with comprehensive evaluation metrics"
        />

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              className="bg-gradient-to-r from-blue-600 to-cyan-600"
              onClick={() => setShowEvaluationForm(!showEvaluationForm)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Evaluation
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Evaluation Form Modal */}
        {showEvaluationForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">New Supplier Evaluation</h3>
                <Button variant="ghost" onClick={() => setShowEvaluationForm(false)}>
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Supplier</Label>
                  <Input className="mt-2 rounded-xl" placeholder="Select supplier..." />
                </div>

                <div>
                  <Label>Evaluation Date</Label>
                  <Input type="date" className="mt-2 rounded-xl" />
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-semibold mb-4">Evaluation Criteria (0-100)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label>Quality Score</Label>
                      <Input type="number" min="0" max="100" className="mt-2 rounded-xl" placeholder="0-100" />
                    </div>
                    <div>
                      <Label>Delivery Performance</Label>
                      <Input type="number" min="0" max="100" className="mt-2 rounded-xl" placeholder="0-100" />
                    </div>
                    <div>
                      <Label>Pricing Competitiveness</Label>
                      <Input type="number" min="0" max="100" className="mt-2 rounded-xl" placeholder="0-100" />
                    </div>
                    <div>
                      <Label>Communication</Label>
                      <Input type="number" min="0" max="100" className="mt-2 rounded-xl" placeholder="0-100" />
                    </div>
                    <div>
                      <Label>Compliance</Label>
                      <Input type="number" min="0" max="100" className="mt-2 rounded-xl" placeholder="0-100" />
                    </div>
                    <div>
                      <Label>Innovation</Label>
                      <Input type="number" min="0" max="100" className="mt-2 rounded-xl" placeholder="0-100" />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label>Comments & Recommendations</Label>
                  <Textarea className="mt-2 rounded-xl" rows={4} placeholder="Enter evaluation notes..." />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowEvaluationForm(false)}>
                  Cancel
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
                  Submit Evaluation
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Evaluations</p>
                  <h3 className="text-4xl font-bold mt-2">{mockEvaluations.length}</h3>
                </div>
                <FileText className="w-12 h-12 opacity-80" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Average Score</p>
                  <h3 className="text-4xl font-bold mt-2">
                    {Math.round(mockEvaluations.reduce((sum, e) => sum + e.overallScore, 0) / mockEvaluations.length)}
                  </h3>
                </div>
                <Award className="w-12 h-12 opacity-80" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Low Risk Suppliers</p>
                  <h3 className="text-4xl font-bold mt-2">
                    {mockEvaluations.filter(e => e.riskScore === 'low').length}
                  </h3>
                </div>
                <CheckCircle className="w-12 h-12 opacity-80" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">High Risk Suppliers</p>
                  <h3 className="text-4xl font-bold mt-2">
                    {mockEvaluations.filter(e => e.riskScore === 'high').length}
                  </h3>
                </div>
                <AlertTriangle className="w-12 h-12 opacity-80" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Evaluation History Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 rounded-3xl">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Evaluation History Timeline</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockEvaluationHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="quarter" stroke="#666" />
                  <YAxis stroke="#666" domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Supplier Comparison Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 rounded-3xl">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Supplier Performance Comparison</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="supplier" stroke="#666" />
                  <YAxis stroke="#666" domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="quality" fill="#3b82f6" />
                  <Bar dataKey="delivery" fill="#10b981" />
                  <Bar dataKey="pricing" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Risk Score Meters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6 rounded-3xl">
            <h3 className="text-lg font-semibold mb-6">Risk Score Meters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockEvaluations.map((evaluation, idx) => (
                <motion.div
                  key={evaluation.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${getScoreBgColor(evaluation.overallScore)} flex items-center justify-center`}>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">{evaluation.overallScore}</p>
                      <p className="text-xs text-white opacity-90">Score</p>
                    </div>
                  </div>
                  <p className="font-semibold mt-3">{evaluation.supplierName.split(' ')[0]}</p>
                  <p className={`text-xs mt-1 px-3 py-1 rounded-full inline-block ${getRiskBadge(evaluation.riskScore).color}`}>
                    {getRiskBadge(evaluation.riskScore).label}
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Evaluations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="rounded-3xl overflow-hidden">
            <DataTable columns={columns} data={mockEvaluations} />
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
