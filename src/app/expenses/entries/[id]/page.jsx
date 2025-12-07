'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, Edit, Trash2, Receipt, CreditCard, Calendar, User } from 'lucide-react';

const mockExpenseDetails = {
  'EXP-045': {
    id: 'EXP-045',
    date: '2025-12-06',
    category: 'Office Supplies',
    categoryId: 'CAT-001',
    amount: 245.00,
    paymentMethod: 'Credit Card',
    notes: 'Printer paper and toner for Q4 operations',
    status: 'approved',
    submittedBy: 'John Smith',
    approvedBy: 'Sarah Manager',
    approvedDate: '2025-12-06',
    attachments: [
      { name: 'receipt.pdf', size: '245 KB', type: 'PDF' }
    ],
  },
};

export default function ExpenseDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const expense = mockExpenseDetails[id] || mockExpenseDetails['EXP-045'];

  const statusColors = {
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title={`Expense ${expense.id}`}
          subtitle={expense.category}
          actions={[
            <Button
              key="edit"
              variant="outline"
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>,
            <Button
              key="delete"
              variant="outline"
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>,
            <Button
              key="download"
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white dark:bg-gray-900/50 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <Receipt className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Expense Details</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ID: {expense.id}</p>
                  </div>
                </div>
                <Badge className={statusColors[expense.status] + ' text-sm px-3 py-1'}>
                  {expense.status}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(expense.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                    <p className="font-bold text-2xl text-amber-600 dark:text-amber-400">
                      ${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Category</p>
                    <button
                      onClick={() => router.push(`/expenses/categories/${expense.categoryId}`)}
                      className="font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      {expense.category}
                    </button>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment Method</p>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <p className="font-semibold text-gray-900 dark:text-white">{expense.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Notes</p>
                  <p className="text-gray-700 dark:text-gray-300">{expense.notes}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Submitted By</p>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <p className="font-medium text-gray-900 dark:text-white">{expense.submittedBy}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Approved By</p>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <p className="font-medium text-gray-900 dark:text-white">{expense.approvedBy}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Approved Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(expense.approvedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 bg-white dark:bg-gray-900/50">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Attachments</h3>
              {expense.attachments.length > 0 ? (
                <div className="space-y-2">
                  {expense.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    >
                      <FileText className="h-8 w-8 text-red-500" />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{file.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{file.size} • {file.type}</p>
                      </div>
                      <Download className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No attachments</p>
              )}
            </Card>

            <Card className="p-6 bg-white dark:bg-gray-900/50">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Expense
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Download className="h-4 w-4" />
                  Download Receipt
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Receipt className="h-4 w-4" />
                  Duplicate Expense
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
