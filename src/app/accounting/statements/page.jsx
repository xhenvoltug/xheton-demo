'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import { FileText, Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react'

const balanceSheetData = {
  assets: {
    current: [
      { account: 'Cash', amount: 125000 },
      { account: 'Accounts Receivable', amount: 85000 },
      { account: 'Inventory', amount: 250000 }
    ],
    fixed: [
      { account: 'Equipment', amount: 450000 },
      { account: 'Buildings', amount: 800000 }
    ]
  },
  liabilities: {
    current: [
      { account: 'Accounts Payable', amount: 65000 },
      { account: 'Short-term Loans', amount: 50000 }
    ],
    longTerm: [
      { account: 'Long-term Debt', amount: 200000 }
    ]
  },
  equity: [
    { account: 'Owner\'s Equity', amount: 500000 },
    { account: 'Retained Earnings', amount: 895000 }
  ]
}

const incomeStatementData = {
  revenue: [
    { account: 'Sales Revenue', amount: 850000 },
    { account: 'Service Revenue', amount: 125000 }
  ],
  cogs: [
    { account: 'Cost of Goods Sold', amount: 320000 }
  ],
  expenses: {
    operating: [
      { account: 'Salaries & Wages', amount: 180000 },
      { account: 'Rent', amount: 45000 },
      { account: 'Utilities', amount: 12000 }
    ],
    other: [
      { account: 'Interest Expense', amount: 8000 },
      { account: 'Depreciation', amount: 35000 }
    ]
  }
}

export default function FinancialStatements() {
  const [period, setPeriod] = useState('2025-Q4')

  const totalAssets = [...balanceSheetData.assets.current, ...balanceSheetData.assets.fixed].reduce((s, a) => s + a.amount, 0)
  const totalLiabilities = [...balanceSheetData.liabilities.current, ...balanceSheetData.liabilities.longTerm].reduce((s, a) => s + a.amount, 0)
  const totalEquity = balanceSheetData.equity.reduce((s, a) => s + a.amount, 0)

  const totalRevenue = incomeStatementData.revenue.reduce((s, r) => s + r.amount, 0)
  const totalCOGS = incomeStatementData.cogs.reduce((s, c) => s + c.amount, 0)
  const grossProfit = totalRevenue - totalCOGS
  const totalExpenses = [...incomeStatementData.expenses.operating, ...incomeStatementData.expenses.other].reduce((s, e) => s + e.amount, 0)
  const netIncome = grossProfit - totalExpenses

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Financial Statements" description="Comprehensive financial reporting" />

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <select className="px-4 py-2 border rounded-xl" value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="2025-Q4">2025 Q4</option>
              <option value="2025-Q3">2025 Q3</option>
              <option value="2025-Q2">2025 Q2</option>
              <option value="2025-Q1">2025 Q1</option>
            </select>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Custom Date Range
            </Button>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>

        <Tabs defaultValue="balance-sheet" className="space-y-4">
          <TabsList className="bg-gray-100 p-1 rounded-2xl">
            <TabsTrigger value="balance-sheet" className="rounded-xl data-[state=active]:bg-white">Balance Sheet</TabsTrigger>
            <TabsTrigger value="income-statement" className="rounded-xl data-[state=active]:bg-white">Income Statement</TabsTrigger>
            <TabsTrigger value="cash-flow" className="rounded-xl data-[state=active]:bg-white">Cash Flow</TabsTrigger>
          </TabsList>

          <TabsContent value="balance-sheet">
            <Card className="rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Balance Sheet</h2>
                <p className="text-sm text-gray-600">As of December 31, 2025</p>
              </div>

              <div className="space-y-6">
                {/* Assets */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-blue-600">ASSETS</h3>
                  
                  <div className="ml-4 space-y-3">
                    <p className="font-semibold text-gray-700">Current Assets</p>
                    {balanceSheetData.assets.current.map(item => (
                      <div key={item.account} className="flex justify-between ml-4 py-2 border-b">
                        <span className="text-gray-600">{item.account}</span>
                        <span className="font-medium">${item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between ml-4 py-2 font-semibold">
                      <span>Total Current Assets</span>
                      <span>${balanceSheetData.assets.current.reduce((s, a) => s + a.amount, 0).toLocaleString()}</span>
                    </div>

                    <p className="font-semibold text-gray-700 pt-4">Fixed Assets</p>
                    {balanceSheetData.assets.fixed.map(item => (
                      <div key={item.account} className="flex justify-between ml-4 py-2 border-b">
                        <span className="text-gray-600">{item.account}</span>
                        <span className="font-medium">${item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between ml-4 py-2 font-semibold">
                      <span>Total Fixed Assets</span>
                      <span>${balanceSheetData.assets.fixed.reduce((s, a) => s + a.amount, 0).toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between py-3 border-t-2 border-blue-600 font-bold text-lg text-blue-600">
                      <span>TOTAL ASSETS</span>
                      <span>${totalAssets.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Liabilities */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-red-600">LIABILITIES</h3>
                  
                  <div className="ml-4 space-y-3">
                    <p className="font-semibold text-gray-700">Current Liabilities</p>
                    {balanceSheetData.liabilities.current.map(item => (
                      <div key={item.account} className="flex justify-between ml-4 py-2 border-b">
                        <span className="text-gray-600">{item.account}</span>
                        <span className="font-medium">${item.amount.toLocaleString()}</span>
                      </div>
                    ))}

                    <p className="font-semibold text-gray-700 pt-4">Long-term Liabilities</p>
                    {balanceSheetData.liabilities.longTerm.map(item => (
                      <div key={item.account} className="flex justify-between ml-4 py-2 border-b">
                        <span className="text-gray-600">{item.account}</span>
                        <span className="font-medium">${item.amount.toLocaleString()}</span>
                      </div>
                    ))}

                    <div className="flex justify-between py-3 border-t-2 border-red-600 font-bold text-lg text-red-600">
                      <span>TOTAL LIABILITIES</span>
                      <span>${totalLiabilities.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Equity */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-purple-600">EQUITY</h3>
                  
                  <div className="ml-4 space-y-3">
                    {balanceSheetData.equity.map(item => (
                      <div key={item.account} className="flex justify-between ml-4 py-2 border-b">
                        <span className="text-gray-600">{item.account}</span>
                        <span className="font-medium">${item.amount.toLocaleString()}</span>
                      </div>
                    ))}

                    <div className="flex justify-between py-3 border-t-2 border-purple-600 font-bold text-lg text-purple-600">
                      <span>TOTAL EQUITY</span>
                      <span>${totalEquity.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Accounting Equation Verification */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Liabilities + Equity</span>
                    <span className="font-bold text-lg">${(totalLiabilities + totalEquity).toLocaleString()}</span>
                  </div>
                  <div className="text-center text-sm text-gray-600 mt-2">
                    {totalAssets === totalLiabilities + totalEquity ? (
                      <span className="text-green-600 font-medium">✓ Balanced</span>
                    ) : (
                      <span className="text-red-600 font-medium">✗ Not Balanced</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="income-statement">
            <Card className="rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Income Statement (P&L)</h2>
                <p className="text-sm text-gray-600">For the period ending December 31, 2025</p>
              </div>

              <div className="space-y-6">
                {/* Revenue */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-green-600">REVENUE</h3>
                  <div className="ml-4 space-y-3">
                    {incomeStatementData.revenue.map(item => (
                      <div key={item.account} className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{item.account}</span>
                        <span className="font-medium">${item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-3 font-bold text-green-600">
                      <span>Total Revenue</span>
                      <span>${totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* COGS */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-orange-600">COST OF GOODS SOLD</h3>
                  <div className="ml-4 space-y-3">
                    {incomeStatementData.cogs.map(item => (
                      <div key={item.account} className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{item.account}</span>
                        <span className="font-medium">${item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-700">GROSS PROFIT</span>
                    <span className="font-bold text-xl text-blue-700">${grossProfit.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Margin: {((grossProfit / totalRevenue) * 100).toFixed(1)}%
                  </div>
                </div>

                {/* Expenses */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-red-600">EXPENSES</h3>
                  
                  <div className="ml-4 space-y-3">
                    <p className="font-semibold text-gray-700">Operating Expenses</p>
                    {incomeStatementData.expenses.operating.map(item => (
                      <div key={item.account} className="flex justify-between ml-4 py-2 border-b">
                        <span className="text-gray-600">{item.account}</span>
                        <span className="font-medium">${item.amount.toLocaleString()}</span>
                      </div>
                    ))}

                    <p className="font-semibold text-gray-700 pt-4">Other Expenses</p>
                    {incomeStatementData.expenses.other.map(item => (
                      <div key={item.account} className="flex justify-between ml-4 py-2 border-b">
                        <span className="text-gray-600">{item.account}</span>
                        <span className="font-medium">${item.amount.toLocaleString()}</span>
                      </div>
                    ))}

                    <div className="flex justify-between py-3 font-bold text-red-600">
                      <span>Total Expenses</span>
                      <span>${totalExpenses.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Net Income */}
                <div className={`bg-gradient-to-r ${netIncome >= 0 ? 'from-green-500 to-emerald-500' : 'from-red-500 to-orange-500'} p-6 rounded-2xl text-white`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm opacity-90">NET INCOME</p>
                      <h3 className="text-3xl font-bold mt-1">${netIncome.toLocaleString()}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-90">Profit Margin</p>
                      <p className="text-2xl font-bold">{((netIncome / totalRevenue) * 100).toFixed(1)}%</p>
                      {netIncome >= 0 ? <TrendingUp className="w-8 h-8 ml-auto mt-2" /> : <TrendingDown className="w-8 h-8 ml-auto mt-2" />}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="cash-flow">
            <Card className="rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Cash Flow Statement</h2>
                <p className="text-sm text-gray-600">For the period ending December 31, 2025</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-4 text-blue-600">OPERATING ACTIVITIES</h3>
                  <div className="ml-4 space-y-2">
                    <div className="flex justify-between py-2 border-b"><span className="text-gray-600">Net Income</span><span className="font-medium">${netIncome.toLocaleString()}</span></div>
                    <div className="flex justify-between py-2 border-b"><span className="text-gray-600">Depreciation</span><span className="font-medium">UGX 35,000</span></div>
                    <div className="flex justify-between py-2 border-b"><span className="text-gray-600">Change in Receivables</span><span className="font-medium text-red-600">-UGX 12,000</span></div>
                    <div className="flex justify-between py-2 border-b"><span className="text-gray-600">Change in Inventory</span><span className="font-medium text-red-600">-UGX 25,000</span></div>
                    <div className="flex justify-between py-3 font-bold text-blue-600 border-t-2"><span>Cash from Operating</span><span>${(netIncome + 35000 - 12000 - 25000).toLocaleString()}</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4 text-purple-600">INVESTING ACTIVITIES</h3>
                  <div className="ml-4 space-y-2">
                    <div className="flex justify-between py-2 border-b"><span className="text-gray-600">Equipment Purchase</span><span className="font-medium text-red-600">-UGX 85,000</span></div>
                    <div className="flex justify-between py-3 font-bold text-purple-600 border-t-2"><span>Cash from Investing</span><span>-UGX 85,000</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4 text-green-600">FINANCING ACTIVITIES</h3>
                  <div className="ml-4 space-y-2">
                    <div className="flex justify-between py-2 border-b"><span className="text-gray-600">Loan Proceeds</span><span className="font-medium text-green-600">UGX 50,000</span></div>
                    <div className="flex justify-between py-2 border-b"><span className="text-gray-600">Loan Repayments</span><span className="font-medium text-red-600">-UGX 20,000</span></div>
                    <div className="flex justify-between py-3 font-bold text-green-600 border-t-2"><span>Cash from Financing</span><span>UGX 30,000</span></div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-2xl text-white">
                  <div className="flex justify-between items-center">
                    <div><p className="text-sm opacity-90">NET INCREASE IN CASH</p><h3 className="text-3xl font-bold mt-1">UGX 295,000</h3></div>
                    <TrendingUp className="w-12 h-12 opacity-80" />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
