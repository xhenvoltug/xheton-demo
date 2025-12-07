'use client'

import { useState } from 'react'
import { ArrowLeft, Search, MapPin, User, Truck, Package, Calendar, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import { useRouter } from 'next/navigation'

const mockOrders = [
  { id: 'ORD-8910', customer: 'Safaricom Ltd', items: 5, weight: '45kg', destination: 'Westlands Plaza, Nairobi' },
  { id: 'ORD-8911', customer: 'KCB Bank', items: 3, weight: '28kg', destination: 'Karen Road, Nairobi' },
  { id: 'ORD-8912', customer: 'Equity Bank', items: 8, weight: '62kg', destination: 'Parklands Avenue, Nairobi' }
]

const mockDrivers = [
  { id: 'DRV-001', name: 'John Kamau', vehicle: 'KBZ 123A - Toyota Hilux', status: 'available', rating: 4.8 },
  { id: 'DRV-002', name: 'Mary Wanjiku', vehicle: 'KCA 456B - Isuzu D-Max', status: 'available', rating: 4.9 },
  { id: 'DRV-003', name: 'Peter Omondi', vehicle: 'KBX 789C - Nissan NP300', status: 'on-delivery', rating: 4.7 }
]

export default function CreateDelivery() {
  const router = useRouter()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showDriverModal, setShowDriverModal] = useState(false)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <PageHeader title="Create Delivery Order" description="Set up a new delivery assignment" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Select Order */}
            <Card className="rounded-3xl p-6">
              <h3 className="font-bold mb-4">1. Select Order</h3>
              <div className="space-y-4">
                {selectedOrder ? (
                  <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-blue-600">{selectedOrder.id}</span>
                      <Button variant="outline" size="sm" onClick={() => setShowOrderModal(true)}>Change</Button>
                    </div>
                    <p className="text-sm text-gray-700"><strong>Customer:</strong> {selectedOrder.customer}</p>
                    <p className="text-sm text-gray-700"><strong>Items:</strong> {selectedOrder.items} • <strong>Weight:</strong> {selectedOrder.weight}</p>
                    <p className="text-sm text-gray-700 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {selectedOrder.destination}
                    </p>
                  </div>
                ) : (
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600" onClick={() => setShowOrderModal(true)}>
                    <Search className="w-4 h-4 mr-2" />
                    Select Order
                  </Button>
                )}
              </div>
            </Card>

            {/* Delivery Details */}
            <Card className="rounded-3xl p-6">
              <h3 className="font-bold mb-4">2. Delivery Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Delivery Date</Label>
                    <Input type="date" className="mt-2 rounded-xl" defaultValue="2025-12-06" />
                  </div>
                  <div>
                    <Label>Preferred Time</Label>
                    <Input type="time" className="mt-2 rounded-xl" defaultValue="14:00" />
                  </div>
                </div>
                <div>
                  <Label>Delivery Address</Label>
                  <Textarea className="mt-2 rounded-xl" placeholder="Enter full delivery address..." rows={2} defaultValue={selectedOrder?.destination || ''} />
                </div>
                <div>
                  <Label>Contact Person</Label>
                  <Input className="mt-2 rounded-xl" placeholder="Name" />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input className="mt-2 rounded-xl" placeholder="+254 700 000 000" />
                </div>
                <div>
                  <Label>Special Instructions</Label>
                  <Textarea className="mt-2 rounded-xl" placeholder="Any special delivery instructions..." rows={3} />
                </div>
              </div>
            </Card>

            {/* Assign Driver */}
            <Card className="rounded-3xl p-6">
              <h3 className="font-bold mb-4">3. Assign Driver & Vehicle</h3>
              <div className="space-y-4">
                {selectedDriver ? (
                  <div className="p-4 bg-green-50 rounded-2xl border-2 border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                          {selectedDriver.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-green-700">{selectedDriver.name}</p>
                          <p className="text-xs text-gray-600">Rating: {selectedDriver.rating} ⭐</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setShowDriverModal(true)}>Change</Button>
                    </div>
                    <p className="text-sm text-gray-700 flex items-center gap-1 mt-2">
                      <Truck className="w-3 h-3" />
                      {selectedDriver.vehicle}
                    </p>
                  </div>
                ) : (
                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600" onClick={() => setShowDriverModal(true)}>
                    <User className="w-4 h-4 mr-2" />
                    Assign Driver
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-4">
            <Card className="rounded-3xl p-6 sticky top-6">
              <h3 className="font-bold mb-4">Delivery Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono font-bold">{selectedOrder?.id || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Customer</span>
                  <span className="font-medium">{selectedOrder?.customer || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items</span>
                  <span className="font-medium">{selectedOrder?.items || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-medium">{selectedOrder?.weight || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Driver</span>
                  <span className="font-medium">{selectedDriver?.name || 'Not assigned'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vehicle</span>
                  <span className="font-medium text-xs">{selectedDriver?.vehicle.split(' - ')[0] || '-'}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600" disabled={!selectedOrder || !selectedDriver}>
                  Create Delivery Order
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Order Selection Modal */}
        {showOrderModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Select Order</h3>
              <div className="space-y-3">
                {mockOrders.map(order => (
                  <div 
                    key={order.id}
                    onClick={() => { setSelectedOrder(order); setShowOrderModal(false) }}
                    className="p-4 border-2 rounded-2xl hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-blue-600">{order.id}</span>
                      <span className="text-sm text-gray-600">{order.items} items • {order.weight}</span>
                    </div>
                    <p className="text-sm font-medium">{order.customer}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {order.destination}
                    </p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => setShowOrderModal(false)}>Cancel</Button>
            </Card>
          </div>
        )}

        {/* Driver Selection Modal */}
        {showDriverModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Assign Driver</h3>
              <div className="space-y-3">
                {mockDrivers.map(driver => (
                  <div 
                    key={driver.id}
                    onClick={() => { 
                      if (driver.status === 'available') {
                        setSelectedDriver(driver); 
                        setShowDriverModal(false)
                      }
                    }}
                    className={`p-4 border-2 rounded-2xl transition-all ${
                      driver.status === 'available' 
                        ? 'hover:border-green-400 hover:bg-green-50 cursor-pointer' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold">{driver.name}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            driver.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>{driver.status}</span>
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Truck className="w-3 h-3" />
                          {driver.vehicle}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Rating: {driver.rating} ⭐</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => setShowDriverModal(false)}>Cancel</Button>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
