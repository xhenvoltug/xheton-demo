'use client'

import { useState } from 'react'
import { Search, MapPin, Truck, Package, Clock, CheckCircle, Phone, User, Navigation } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const mockTrackingData = {
  'DEL-2450': {
    id: 'DEL-2450',
    orderId: 'ORD-8901',
    customer: 'Safaricom Ltd',
    driver: 'John Kamau',
    vehicle: 'KBZ 123A',
    phone: '+254 712 345 678',
    status: 'in-transit',
    currentLocation: 'Westlands Roundabout',
    destination: 'Westlands Plaza, Nairobi',
    eta: '14:30',
    progress: 65,
    timeline: [
      { status: 'created', time: '09:15 AM', date: '2025-12-06', completed: true },
      { status: 'loaded', time: '10:30 AM', date: '2025-12-06', completed: true },
      { status: 'departed', time: '11:00 AM', date: '2025-12-06', completed: true },
      { status: 'in-transit', time: '13:45 PM', date: '2025-12-06', completed: true },
      { status: 'delivered', time: 'Expected 14:30 PM', date: '2025-12-06', completed: false }
    ],
    items: [
      { name: 'HP Laptop ProBook 450', sku: 'LAP-001', qty: 3 },
      { name: 'Dell Monitor 24"', sku: 'MON-024', qty: 5 },
      { name: 'Logitech Keyboard', sku: 'KEY-010', qty: 5 }
    ],
    updates: [
      { time: '13:45 PM', message: 'Package out for delivery' },
      { time: '11:00 AM', message: 'Departed from warehouse' },
      { time: '10:30 AM', message: 'Package loaded onto vehicle' },
      { time: '09:15 AM', message: 'Delivery order created' }
    ]
  }
}

export default function DeliveryTracking() {
  const [trackingId, setTrackingId] = useState('')
  const [trackingData, setTrackingData] = useState(null)

  const handleTrack = () => {
    const data = mockTrackingData[trackingId]
    setTrackingData(data || null)
  }

  const getStatusIcon = (status, completed) => {
    if (!completed) return <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
    
    const icons = {
      'created': <Package className="w-4 h-4" />,
      'loaded': <Package className="w-4 h-4" />,
      'departed': <Truck className="w-4 h-4" />,
      'in-transit': <Navigation className="w-4 h-4" />,
      'delivered': <CheckCircle className="w-4 h-4" />
    }
    return <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">{icons[status]}</div>
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Track Delivery" description="Real-time delivery tracking and monitoring" />

        {/* Search */}
        <Card className="rounded-3xl p-6">
          <div className="flex gap-3">
            <Input 
              className="rounded-xl flex-1" 
              placeholder="Enter Delivery ID or Customer Name..." 
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
            />
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600" onClick={handleTrack}>
              <Search className="w-4 h-4 mr-2" />
              Track
            </Button>
          </div>
          <div className="flex gap-2 mt-3">
            <span className="text-sm text-gray-600">Quick access:</span>
            {Object.keys(mockTrackingData).map(id => (
              <button
                key={id}
                onClick={() => { setTrackingId(id); setTrackingData(mockTrackingData[id]) }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium"
              >
                {id}
              </button>
            ))}
          </div>
        </Card>

        {trackingData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Tracking Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Card */}
              <Card className="rounded-3xl p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm opacity-90">Delivery Status</p>
                    <h2 className="text-3xl font-bold mt-1 capitalize">{trackingData.status.replace('-', ' ')}</h2>
                  </div>
                  <Truck className="w-16 h-16 opacity-80" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p className="text-xs opacity-80">Current Location</p>
                    <p className="font-semibold flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {trackingData.currentLocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80">ETA</p>
                    <p className="font-semibold flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4" />
                      {trackingData.eta}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span>Progress</span>
                    <span>{trackingData.progress}%</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2">
                    <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${trackingData.progress}%` }}></div>
                  </div>
                </div>
              </Card>

              {/* Map Placeholder */}
              <Card className="rounded-3xl p-6 h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Live Map View</p>
                  <p className="text-sm text-gray-500 mt-1">Real-time GPS tracking (mock)</p>
                </div>
              </Card>

              {/* Timeline */}
              <Card className="rounded-3xl p-6">
                <h3 className="font-bold mb-6">Delivery Timeline</h3>
                <div className="space-y-6">
                  {trackingData.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(event.status, event.completed)}
                        {idx < trackingData.timeline.length - 1 && (
                          <div className={`w-0.5 h-12 ${event.completed ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-bold capitalize ${event.completed ? 'text-blue-600' : 'text-gray-400'}`}>
                            {event.status.replace('-', ' ')}
                          </h4>
                          <span className="text-sm text-gray-600">{event.time}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Order Details */}
              <Card className="rounded-3xl p-6">
                <h3 className="font-bold mb-4">Order Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Delivery ID</p>
                    <p className="font-mono font-bold text-blue-600">{trackingData.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Order ID</p>
                    <p className="font-mono font-bold">{trackingData.orderId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Customer</p>
                    <p className="font-medium">{trackingData.customer}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Destination</p>
                    <p className="font-medium flex items-start gap-1">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {trackingData.destination}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Driver Info */}
              <Card className="rounded-3xl p-6">
                <h3 className="font-bold mb-4">Driver Information</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {trackingData.driver.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold">{trackingData.driver}</p>
                    <p className="text-sm text-gray-600">{trackingData.vehicle}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  {trackingData.phone}
                </Button>
              </Card>

              {/* Items */}
              <Card className="rounded-3xl p-6">
                <h3 className="font-bold mb-4">Package Contents</h3>
                <div className="space-y-3">
                  {trackingData.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                      <p className="font-medium text-sm">{item.name}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-600">SKU: {item.sku}</span>
                        <span className="text-xs font-medium">Qty: {item.qty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Live Updates */}
              <Card className="rounded-3xl p-6">
                <h3 className="font-bold mb-4">Live Updates</h3>
                <div className="space-y-3">
                  {trackingData.updates.map((update, idx) => (
                    <div key={idx} className="pb-3 border-b last:border-0">
                      <p className="text-xs text-gray-500">{update.time}</p>
                      <p className="text-sm mt-1">{update.message}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        ) : trackingId ? (
          <Card className="rounded-3xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-bold text-lg text-gray-700">No tracking information found</h3>
            <p className="text-sm text-gray-500 mt-2">Please check the delivery ID and try again</p>
          </Card>
        ) : null}
      </div>
    </DashboardLayout>
  )
}
