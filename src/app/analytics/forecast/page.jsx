'use client';

import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertCircle, Sparkles } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const salesForecastData = [
  { month: 'Dec', actual: 25600, forecast: 25600, aiPrediction: 25600 },
  { month: 'Jan', actual: null, forecast: 27800, aiPrediction: 28200 },
  { month: 'Feb', actual: null, forecast: 29200, aiPrediction: 30100 },
  { month: 'Mar', actual: null, forecast: 31500, aiPrediction: 32800 },
  { month: 'Apr', actual: null, forecast: 33800, aiPrediction: 35600 },
  { month: 'May', actual: null, forecast: 36200, aiPrediction: 38400 },
];

const inventoryForecastData = [
  { month: 'Dec', current: 580, predicted: 580 },
  { month: 'Jan', current: null, predicted: 620 },
  { month: 'Feb', current: null, predicted: 650 },
  { month: 'Mar', current: null, predicted: 680 },
  { month: 'Apr', current: null, predicted: 710 },
  { month: 'May', current: null, predicted: 740 },
];

const insights = [
  {
    type: 'positive',
    title: 'Sales Growth Predicted',
    description: 'AI forecasts 42% sales increase over next 6 months based on seasonal trends and market analysis.',
    confidence: 94
  },
  {
    type: 'warning',
    title: 'Inventory Alert',
    description: 'Stock levels for top 5 products will reach critical by March. Recommend reorder by January 15.',
    confidence: 87
  },
  {
    type: 'positive',
    title: 'Profit Margin Improvement',
    description: 'Current pricing strategy showing 8% margin improvement trend. Continue current approach.',
    confidence: 91
  },
  {
    type: 'neutral',
    title: 'Seasonal Pattern Detected',
    description: 'February typically shows 15% dip. Plan promotions to offset expected decline.',
    confidence: 82
  }
];

export default function ForecastPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="AI-Powered Forecasting"
          subtitle="Predictive analytics and intelligent business insights"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* AI Insights Cards */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {insights.map((insight, index) => (
                <Card key={index} className="p-6 bg-white dark:bg-gray-900/50">
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      insight.type === 'positive' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                      insight.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' :
                      'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      {insight.type === 'positive' ? (
                        <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      ) : insight.type === 'warning' ? (
                        <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      ) : (
                        <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{insight.title}</h3>
                        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                          {insight.confidence}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{insight.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Forecast Charts */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="sales" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sales">Sales Forecast</TabsTrigger>
                <TabsTrigger value="inventory">Inventory Forecast</TabsTrigger>
              </TabsList>

              <TabsContent value="sales" className="mt-6">
                <Card className="p-6 bg-white dark:bg-gray-900/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">6-Month Sales Forecast</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered predictions vs traditional forecasting</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">AI Enhanced</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={salesForecastData}>
                      <defs>
                        <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                      <Legend />
                      <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="Actual Sales" dot={{ r: 6 }} />
                      <Line type="monotone" dataKey="forecast" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Traditional Forecast" />
                      <Line type="monotone" dataKey="aiPrediction" stroke="#8b5cf6" strokeWidth={3} name="AI Prediction" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </TabsContent>

              <TabsContent value="inventory" className="mt-6">
                <Card className="p-6 bg-white dark:bg-gray-900/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Inventory Requirements Forecast</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Predicted stock levels based on sales trends</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">AI Enhanced</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={inventoryForecastData}>
                      <defs>
                        <linearGradient id="inventoryGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                      <Legend />
                      <Area type="monotone" dataKey="current" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Current Stock" />
                      <Area type="monotone" dataKey="predicted" stroke="#3b82f6" fill="url(#inventoryGradient)" name="Predicted Requirement" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Recommendation Cards */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-600 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">AI Recommendations</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Increase inventory for Electronics category by 25% before February to meet predicted demand spike
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Launch promotional campaign in mid-February to counter seasonal sales dip
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Current pricing strategy is optimal - maintain for next quarter
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
