'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Upload, Search, Grid, List, Folder, Download, Eye, Share2, Trash2, Filter, MoreVertical, File, Image as ImageIcon, FileVideo } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const mockDocuments = [
  { id: 'DOC-001', name: 'Q4_Sales_Report_2025.pdf', type: 'pdf', size: '2.4 MB', folder: 'Reports', uploadedBy: 'Sarah Nambi', uploadDate: '2025-12-07', tags: ['Sales', 'Q4', 'Finance'], views: 45 },
  { id: 'DOC-002', name: 'Employee_Handbook_2026.pdf', type: 'pdf', size: '5.8 MB', folder: 'HR Documents', uploadedBy: 'HR Department', uploadDate: '2025-12-05', tags: ['HR', 'Policy'], views: 128 },
  { id: 'DOC-003', name: 'Product_Catalog_v3.pdf', type: 'pdf', size: '12.3 MB', folder: 'Marketing', uploadedBy: 'Marketing Team', uploadDate: '2025-12-03', tags: ['Marketing', 'Products'], views: 89 },
  { id: 'DOC-004', name: 'Invoice_Template.docx', type: 'doc', size: '245 KB', folder: 'Templates', uploadedBy: 'Finance Team', uploadDate: '2025-12-01', tags: ['Finance', 'Template'], views: 234 },
  { id: 'DOC-005', name: 'Company_Logo_2025.png', type: 'image', size: '1.2 MB', folder: 'Brand Assets', uploadedBy: 'Design Team', uploadDate: '2025-11-28', tags: ['Brand', 'Logo'], views: 567 },
  { id: 'DOC-006', name: 'Training_Video_CRM.mp4', type: 'video', size: '45.6 MB', folder: 'Training', uploadedBy: 'IT Department', uploadDate: '2025-11-25', tags: ['Training', 'CRM'], views: 156 },
  { id: 'DOC-007', name: 'Budget_2026.xlsx', type: 'excel', size: '890 KB', folder: 'Finance', uploadedBy: 'Finance Director', uploadDate: '2025-11-20', tags: ['Budget', 'Finance'], views: 78 }
]

const folders = [
  { name: 'Reports', count: 23, color: 'from-blue-500 to-cyan-500' },
  { name: 'HR Documents', count: 45, color: 'from-green-500 to-emerald-500' },
  { name: 'Marketing', count: 67, color: 'from-purple-500 to-pink-500' },
  { name: 'Finance', count: 89, color: 'from-orange-500 to-red-500' },
  { name: 'Templates', count: 34, color: 'from-yellow-500 to-orange-500' },
  { name: 'Brand Assets', count: 156, color: 'from-pink-500 to-red-500' }
]

export default function DocumentLibrary() {
  const [viewMode, setViewMode] = useState('grid')
  const [showUploadModal, setShowUploadModal] = useState(false)

  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf': return FileText
      case 'image': return ImageIcon
      case 'video': return FileVideo
      default: return File
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Document Library" description="Centralized document management and storage" />

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search documents..." className="pl-10 rounded-xl" />
          </div>
          <div className="flex gap-3">
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="sm"
                className={viewMode === 'grid' ? 'bg-white shadow' : ''}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                size="sm"
                className={viewMode === 'list' ? 'bg-white shadow' : ''}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" className="rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl" onClick={() => setShowUploadModal(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: 'Total Documents', value: mockDocuments.length, icon: FileText, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Folders', value: folders.length, icon: Folder, gradient: 'from-purple-500 to-pink-500' },
            { label: 'Total Size', value: '68.5 GB', icon: Upload, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Shared', value: '23', icon: Share2, gradient: 'from-orange-500 to-red-500' }
          ].map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 opacity-80" />
                </div>
                <p className="text-xs opacity-90">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </Card>
            </motion.div>
          ))}
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-600 uppercase mb-3">Folders</h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {folders.map((folder, idx) => (
              <motion.div
                key={folder.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className={`p-4 rounded-2xl cursor-pointer bg-gradient-to-br ${folder.color} text-white`}>
                  <Folder className="w-8 h-8 mb-2 opacity-80" />
                  <h4 className="font-semibold text-sm mb-1">{folder.name}</h4>
                  <p className="text-xs opacity-80">{folder.count} files</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-600 uppercase mb-3">Recent Documents</h3>
          {viewMode === 'grid' ? (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockDocuments.map((doc, idx) => {
                const Icon = getFileIcon(doc.type)
                return (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="rounded-2xl p-4 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${doc.type === 'pdf' ? 'from-red-500 to-orange-500' : doc.type === 'image' ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'} flex items-center justify-center text-white`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                      <h4 className="font-semibold text-sm mb-1 truncate" title={doc.name}>{doc.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{doc.size}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {doc.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">{tag}</span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <Card className="rounded-3xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Folder</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mockDocuments.map((doc, idx) => {
                    const Icon = getFileIcon(doc.type)
                    return (
                      <motion.tr 
                        key={doc.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-gray-400" />
                            <span className="font-semibold text-sm">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doc.folder}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doc.size}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doc.uploadDate}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doc.views}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="rounded-xl">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-xl">
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-xl">
                              <Share2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </Card>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowUploadModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Upload Documents</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="font-semibold mb-1">Drop files here or click to browse</p>
                  <p className="text-sm text-gray-600">Supports PDF, DOC, XLS, images, videos up to 100MB</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Folder</label>
                  <select className="w-full px-4 py-2 border rounded-xl">
                    {folders.map(folder => (
                      <option key={folder.name}>{folder.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags (optional)</label>
                  <Input className="rounded-xl" placeholder="Add tags separated by commas" />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">Upload</Button>
                  <Button variant="outline" onClick={() => setShowUploadModal(false)}>Cancel</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
