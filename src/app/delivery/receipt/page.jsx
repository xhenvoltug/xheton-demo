'use client'

import { useState } from 'react'
import { ArrowLeft, CheckCircle, Printer, Mail, MessageSquare, Download, Upload, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import { useRouter } from 'next/navigation'

export default function DeliveryReceipt() {
  const router = useRouter()
  const [signature, setSignature] = useState(false)
  const [feedback, setFeedback] = useState({ rating: 5, comments: '' })
  const [issueReport, setIssueReport] = useState({ type: 'none', description: '' })

  const deliveryData = {
    id: 'DEL-2450',
    orderId: 'ORD-8901',
    customer: 'Safaricom Ltd',
    deliveryDate: '2025-12-06',
    deliveryTime: '14:45 PM',
    driver: 'John Kamau',
    vehicle: 'KBZ 123A',
    items: [
      { name: 'HP Laptop ProBook 450', sku: 'LAP-001', qty: 3, received: 3 },
      { name: 'Dell Monitor 24"', sku: 'MON-024', qty: 5, received: 5 },
      { name: 'Logitech Keyboard', sku: 'KEY-010', qty: 5, received: 5 }
    ]
  }

  const handleConfirmDelivery = () => {
    alert('Delivery confirmed! Receipt generated successfully.')
    router.push('/delivery/dashboard')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <PageHeader title="Delivery Receipt & Confirmation" description="Confirm delivery and generate receipt" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Details */}
            <Card className="rounded-3xl p-6">
              <h3 className="font-bold mb-4">Delivery Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Delivery ID</p>
                  <p className="font-mono font-bold text-blue-600">{deliveryData.id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Order ID</p>
                  <p className="font-mono font-bold">{deliveryData.orderId}</p>
                </div>
                <div>
                  <p className="text-gray-600">Customer</p>
                  <p className="font-medium">{deliveryData.customer}</p>
                </div>
                <div>
                  <p className="text-gray-600">Delivery Date & Time</p>
                  <p className="font-medium">{deliveryData.deliveryDate} at {deliveryData.deliveryTime}</p>
                </div>
                <div>
                  <p className="text-gray-600">Driver</p>
                  <p className="font-medium">{deliveryData.driver}</p>
                </div>
                <div>
                  <p className="text-gray-600">Vehicle</p>
                  <p className="font-medium">{deliveryData.vehicle}</p>
                </div>
              </div>
            </Card>

            {/* Items Verification */}
            <Card className="rounded-3xl p-6">
              <h3 className="font-bold mb-4">Items Delivered</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">Item</th>
                      <th className="text-left p-3 text-sm font-medium">SKU</th>
                      <th className="text-center p-3 text-sm font-medium">Ordered</th>
                      <th className="text-center p-3 text-sm font-medium">Received</th>
                      <th className="text-center p-3 text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryData.items.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-3 font-medium">{item.name}</td>
                        <td className="p-3 font-mono text-sm text-gray-600">{item.sku}</td>
                        <td className="p-3 text-center">{item.qty}</td>
                        <td className="p-3 text-center font-bold">{item.received}</td>
                        <td className="p-3 text-center">
                          {item.qty === item.received ? (
                            <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Signature Capture */}
            <Card className="rounded-3xl p-6">
              <h3 className="font-bold mb-4">Customer Signature</h3>
              <div className="space-y-4">
                {signature ? (
                  <div className="border-2 border-green-200 rounded-2xl p-8 bg-green-50 text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="font-bold text-green-700">Signature Captured</p>
                    <p className="text-sm text-gray-600 mt-1">Signed on {deliveryData.deliveryDate} at {deliveryData.deliveryTime}</p>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-3">Sign here to confirm receipt</p>
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600" onClick={() => setSignature(true)}>
                      Capture Signature
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Issue Reporting */}
            <Card className="rounded-3xl p-6">
              <h3 className="font-bold mb-4">Report Issues (Optional)</h3>
              <div className="space-y-4">
                <div>
                  <Label>Issue Type</Label>
                  <select 
                    className="w-full mt-2 px-4 py-2 border rounded-xl"
                    value={issueReport.type}
                    onChange={(e) => setIssueReport({ ...issueReport, type: e.target.value })}
                  >
                    <option value="none">No issues</option>
                    <option value="damaged">Damaged items</option>
                    <option value="missing">Missing items</option>
                    <option value="wrong">Wrong items</option>
                    <option value="late">Late delivery</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {issueReport.type !== 'none' && (
                  <div>
                    <Label>Description</Label>
                    <Textarea 
                      className="mt-2 rounded-xl" 
                      placeholder="Describe the issue in detail..."
                      rows={3}
                      value={issueReport.description}
                      onChange={(e) => setIssueReport({ ...issueReport, description: e.target.value })}
                    />
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Delivery Feedback */}
            <Card className="rounded-3xl p-6">
              <h3 className="font-bold mb-4">Rate Delivery</h3>
              <div className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedback({ ...feedback, rating: star })}
                        className={`text-2xl ${star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Comments</Label>
                  <Textarea 
                    className="mt-2 rounded-xl" 
                    placeholder="Optional feedback..."
                    rows={3}
                    value={feedback.comments}
                    onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                  />
                </div>
              </div>
            </Card>

            {/* Receipt Actions */}
            <Card className="rounded-3xl p-6">
              <h3 className="font-bold mb-4">Receipt Options</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Receipt
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Receipt
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  SMS Receipt
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </Card>

            {/* Confirm Button */}
            <Card className="rounded-3xl p-6">
              <h3 className="font-bold mb-4">Confirmation</h3>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                  disabled={!signature}
                  onClick={handleConfirmDelivery}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Delivery
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  By confirming, you acknowledge receipt of all items in good condition
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
