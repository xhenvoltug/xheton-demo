'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const mockPriceHistory = [
  { id: 'P-001', product: 'Product A', currentPrice: 1500, avgCost: 1200, lastChange: '2025-12-01', changePercent: 5.2 },
  { id: 'P-002', product: 'Product B', currentPrice: 2500, avgCost: 2200, lastChange: '2025-12-03', changePercent: -3.5 },
  { id: 'P-003', product: 'Product C', currentPrice: 800, avgCost: 750, lastChange: '2025-12-05', changePercent: 8.1 },
  { id: 'P-004', product: 'Product D', currentPrice: 3200, avgCost: 3100, lastChange: '2025-12-02', changePercent: 2.3 },
  { id: 'P-005', product: 'Product E', currentPrice: 1800, avgCost: 1900, lastChange: '2025-12-04', changePercent: -4.2 }
];

const mockChartData = [
  { month: 'Jul', productA: 1400, productB: 2600, productC: 750 },
  { month: 'Aug', productA: 1380, productB: 2550, productC: 770 },
  { month: 'Sep', productA: 1420, productB: 2500, productC: 760 },
  { month: 'Oct', productA: 1450, productB: 2480, productC: 780 },
  { month: 'Nov', productA: 1480, productB: 2510, productC: 790 },
  { month: 'Dec', productA: 1500, productB: 2500, productC: 800 }
];

export default function PriceHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = mockPriceHistory.filter(item => 
    item.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgChangePercent = (mockPriceHistory.reduce((sum, p) => sum + p.changePercent, 0) / mockPriceHistory.length).toFixed(1);
  const increasedPrices = mockPriceHistory.filter(p => p.changePercent > 0).length;
  const decreasedPrices = mockPriceHistory.filter(p => p.changePercent < 0).length;

  const columns = [
    { 
      header: 'Product', 
      accessor: 'product',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.product}</span>
    },
    { 
      header: 'Current Price', 
      accessor: 'currentPrice',
      render: (row) => <span className="font-bold">UGX {row.currentPrice.toLocaleString()}</span>
    },
    { 
      header: 'Average Cost', 
      accessor: 'avgCost',
      render: (row) => <span className="text-gray-600">UGX {row.avgCost.toLocaleString()}</span>
    },
    { 
      header: 'Margin', 
      accessor: 'margin',
      render: (row) => {
        const margin = ((row.currentPrice - row.avgCost) / row.currentPrice * 100).toFixed(1);
        return <span className="font-semibold text-emerald-600">{margin}%</span>;
      }
    },
    { 
      header: 'Last Change', 
      accessor: 'lastChange',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{row.lastChange}</span>
        </div>
      )
    },
    { 
      header: 'Change %', 
      accessor: 'changePercent',
      render: (row) => {
        const Icon = row.changePercent > 0 ? TrendingUp : TrendingDown;
        const color = row.changePercent > 0 ? 'text-emerald-600' : 'text-red-600';
        return (
          <div className={`flex items-center gap-1 ${color} font-semibold`}>
            <Icon className="h-4 w-4" />
            {Math.abs(row.changePercent)}%
          </div>
        );
      }
    }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Price History & Cost Tracking"
          subtitle="Monitor product pricing trends and cost analysis"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Tracked Products', value: mockPriceHistory.length, color: 'from-blue-500 to-cyan-500', icon: DollarSign },
            { label: 'Avg Change %', value: `${avgChangePercent}%`, color: 'from-purple-500 to-pink-500', icon: TrendingUp },
            { label: 'Price Increased', value: increasedPrices, color: 'from-emerald-500 to-teal-500', icon: TrendingUp },
            { label: 'Price Decreased', value: decreasedPrices, color: 'from-red-500 to-rose-500', icon: TrendingDown }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-8 w-8 opacity-80" />
                </div>
                <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rounded-3xl shadow-lg border-0 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price Trends (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="productA" stroke="#3b82f6" strokeWidth={2} name="Product A" />
                <Line type="monotone" dataKey="productB" stroke="#8b5cf6" strokeWidth={2} name="Product B" />
                <Line type="monotone" dataKey="productC" stroke="#10b981" strokeWidth={2} name="Product C" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="rounded-3xl shadow-lg border-0">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search by product..."
            />
            <DataTable columns={columns} data={filteredHistory} />
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
