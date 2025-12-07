'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Plus, Save, Play, Settings, Trash2, ArrowRight, Mail, MessageSquare, FileText, Bell, Database, ShoppingCart, DollarSign, Package } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const triggers = [
  { id: 'trigger-1', name: 'Record Created', icon: Plus, color: 'from-blue-500 to-cyan-500' },
  { id: 'trigger-2', name: 'Record Updated', icon: Database, color: 'from-purple-500 to-pink-500' },
  { id: 'trigger-3', name: 'Record Deleted', icon: Trash2, color: 'from-red-500 to-orange-500' },
  { id: 'trigger-4', name: 'Inventory Below Threshold', icon: Package, color: 'from-orange-500 to-yellow-500' },
  { id: 'trigger-5', name: 'New Sale', icon: ShoppingCart, color: 'from-green-500 to-emerald-500' },
  { id: 'trigger-6', name: 'Payment Received', icon: DollarSign, color: 'from-teal-500 to-cyan-500' }
]

const actions = [
  { id: 'action-1', name: 'Send Email', icon: Mail, color: 'from-blue-500 to-cyan-500' },
  { id: 'action-2', name: 'Send SMS', icon: MessageSquare, color: 'from-green-500 to-emerald-500' },
  { id: 'action-3', name: 'Create Task', icon: Plus, color: 'from-purple-500 to-pink-500' },
  { id: 'action-4', name: 'Update Record', icon: Database, color: 'from-orange-500 to-red-500' },
  { id: 'action-5', name: 'Push Notification', icon: Bell, color: 'from-yellow-500 to-orange-500' },
  { id: 'action-6', name: 'Generate PDF', icon: FileText, color: 'from-indigo-500 to-purple-500' }
]

export default function WorkflowBuilder() {
  const [workflowName, setWorkflowName] = useState('New Workflow')
  const [selectedTrigger, setSelectedTrigger] = useState(null)
  const [selectedActions, setSelectedActions] = useState([])
  const [showSettingsPanel, setShowSettingsPanel] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)

  const addAction = (action) => {
    setSelectedActions([...selectedActions, { ...action, id: `${action.id}-${Date.now()}` }])
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Workflow Builder" description="Design automation workflows with drag & drop" />

        <div className="flex items-center justify-between">
          <Input 
            value={workflowName} 
            onChange={(e) => setWorkflowName(e.target.value)}
            className="max-w-md text-xl font-bold border-0 focus:ring-2 focus:ring-purple-500 rounded-xl"
          />
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl">
              <Play className="w-4 h-4 mr-2" />
              Test Workflow
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
              <Save className="w-4 h-4 mr-2" />
              Save Automation
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Left Sidebar - Triggers & Actions */}
          <Card className="rounded-3xl p-4 h-[calc(100vh-280px)] overflow-y-auto">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              Triggers
            </h3>
            <div className="space-y-2 mb-6">
              {triggers.map((trigger) => (
                <motion.div
                  key={trigger.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTrigger(trigger)}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    selectedTrigger?.id === trigger.id 
                      ? 'bg-gradient-to-r ' + trigger.color + ' text-white shadow-lg' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <trigger.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{trigger.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-purple-600" />
              Actions
            </h3>
            <div className="space-y-2">
              {actions.map((action) => (
                <motion.div
                  key={action.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addAction(action)}
                  className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2">
                    <action.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{action.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Canvas */}
          <Card className="md:col-span-2 rounded-3xl p-6 h-[calc(100vh-280px)] overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="space-y-6">
              {/* Trigger Node */}
              {selectedTrigger ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                >
                  <Card className={`p-6 rounded-2xl bg-gradient-to-r ${selectedTrigger.color} text-white shadow-xl`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <selectedTrigger.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs opacity-80">TRIGGER</p>
                          <h4 className="font-bold">{selectedTrigger.name}</h4>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-white/40 text-white hover:bg-white/20"
                        onClick={() => {
                          setSelectedNode(selectedTrigger)
                          setShowSettingsPanel(true)
                        }}
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                  {selectedActions.length > 0 && (
                    <div className="flex justify-center my-4">
                      <ArrowRight className="w-6 h-6 text-purple-600" />
                    </div>
                  )}
                </motion.div>
              ) : (
                <Card className="p-12 rounded-2xl border-2 border-dashed text-center">
                  <Zap className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Select a trigger to start building your workflow</p>
                </Card>
              )}

              {/* Action Nodes */}
              {selectedActions.map((action, idx) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-6 rounded-2xl border-2 border-purple-200 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center text-white`}>
                          <action.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">ACTION {idx + 1}</p>
                          <h4 className="font-bold">{action.name}</h4>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedNode(action)
                            setShowSettingsPanel(true)
                          }}
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600"
                          onClick={() => setSelectedActions(selectedActions.filter(a => a.id !== action.id))}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                  {idx < selectedActions.length - 1 && (
                    <div className="flex justify-center my-4">
                      <ArrowRight className="w-6 h-6 text-purple-600" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Add Action Button */}
              {selectedTrigger && selectedActions.length > 0 && (
                <Card className="p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <Plus className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600">Click an action from the left panel to add</p>
                </Card>
              )}
            </div>
          </Card>

          {/* Right Sidebar - Settings Panel */}
          <Card className={`rounded-3xl p-4 h-[calc(100vh-280px)] overflow-y-auto ${showSettingsPanel ? '' : 'opacity-50'}`}>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-purple-600" />
              Node Settings
            </h3>
            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Node Name</label>
                  <Input className="rounded-xl" defaultValue={selectedNode.name} />
                </div>
                
                {selectedNode.name === 'Send Email' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">To (Email)</label>
                      <Input className="rounded-xl" placeholder="recipient@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <Input className="rounded-xl" placeholder="Email subject" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Body</label>
                      <textarea className="w-full px-4 py-2 border rounded-xl" rows={6} placeholder="Email body..."></textarea>
                    </div>
                  </>
                )}

                {selectedNode.name === 'Send SMS' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <Input className="rounded-xl" placeholder="+256 700 000 000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <textarea className="w-full px-4 py-2 border rounded-xl" rows={4} placeholder="SMS message..."></textarea>
                    </div>
                  </>
                )}

                {selectedNode.name === 'Inventory Below Threshold' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Category</label>
                      <select className="w-full px-4 py-2 border rounded-xl">
                        <option>All Categories</option>
                        <option>Electronics</option>
                        <option>Furniture</option>
                        <option>Raw Materials</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Threshold Quantity</label>
                      <Input type="number" className="rounded-xl" defaultValue="10" />
                    </div>
                  </>
                )}

                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  Save Settings
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center mt-8">
                Select a node from the canvas to configure its settings
              </p>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
