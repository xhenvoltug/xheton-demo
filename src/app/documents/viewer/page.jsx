'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Printer, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Clock, User, Eye } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const mockDocument = {
  id: 'DOC-001',
  name: 'Q4_Sales_Report_2025.pdf',
  size: '2.4 MB',
  uploadedBy: 'Sarah Nambi',
  uploadDate: '2025-12-07 14:23',
  folder: 'Reports',
  tags: ['Sales', 'Q4', 'Finance'],
  totalPages: 12,
  versions: [
    { version: 'v3', date: '2025-12-07 14:23', author: 'Sarah Nambi', size: '2.4 MB', changes: 'Updated Q4 revenue figures with UGX 8,450,000 total' },
    { version: 'v2', date: '2025-12-06 10:15', author: 'David Ochola', size: '2.3 MB', changes: 'Added regional breakdown charts' },
    { version: 'v1', date: '2025-12-05 09:30', author: 'Sarah Nambi', size: '2.1 MB', changes: 'Initial draft' }
  ]
}

export default function DocumentViewer() {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [showVersionHistory, setShowVersionHistory] = useState(false)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Document Viewer" description={mockDocument.name} />

        <div className="grid md:grid-cols-4 gap-6">
          {/* Main Viewer */}
          <div className="md:col-span-3 space-y-4">
            {/* Toolbar */}
            <Card className="rounded-3xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="rounded-xl">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" className="rounded-xl">
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="font-semibold text-sm min-w-[60px] text-center">{zoom}%</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setZoom(Math.min(200, zoom + 10))}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="font-semibold text-sm min-w-[80px] text-center">
                    {currentPage} / {mockDocument.totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage === mockDocument.totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* PDF Viewer Area */}
            <Card className="rounded-3xl p-8 min-h-[600px] bg-gray-100">
              <div className="bg-white shadow-2xl rounded-lg mx-auto" style={{ width: `${zoom}%`, maxWidth: '100%' }}>
                <div className="aspect-[8.5/11] bg-white p-12 rounded-lg">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h1 className="text-3xl font-bold mb-2">Q4 Sales Report</h1>
                      <p className="text-gray-600">October - December 2025</p>
                    </div>
                    
                    <div className="border-t border-b py-6 my-6">
                      <h2 className="text-xl font-bold mb-4">Executive Summary</h2>
                      <p className="text-gray-700 leading-relaxed">
                        The fourth quarter of 2025 showed exceptional performance across all regions, with total revenue reaching <strong>UGX 8,450,000</strong> representing a 12.5% increase compared to Q3 2025.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-purple-50 rounded-xl">
                        <p className="text-sm text-purple-600 mb-1">Total Revenue</p>
                        <p className="text-2xl font-bold text-purple-700">UGX 8,450,000</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-xl">
                        <p className="text-sm text-green-600 mb-1">Growth Rate</p>
                        <p className="text-2xl font-bold text-green-700">+12.5%</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 text-center mt-12">Page {currentPage} of {mockDocument.totalPages}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Document Info */}
            <Card className="rounded-3xl p-4">
              <h3 className="font-bold mb-4">Document Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">File Size</p>
                  <p className="font-semibold">{mockDocument.size}</p>
                </div>
                <div>
                  <p className="text-gray-600">Uploaded By</p>
                  <p className="font-semibold">{mockDocument.uploadedBy}</p>
                </div>
                <div>
                  <p className="text-gray-600">Upload Date</p>
                  <p className="font-semibold">{mockDocument.uploadDate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Folder</p>
                  <p className="font-semibold">{mockDocument.folder}</p>
                </div>
                <div>
                  <p className="text-gray-600">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mockDocument.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Page Thumbnails */}
            <Card className="rounded-3xl p-4">
              <h3 className="font-bold mb-4">Pages</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {Array.from({ length: mockDocument.totalPages }, (_, i) => i + 1).map(page => (
                  <motion.div
                    key={page}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setCurrentPage(page)}
                    className={`p-2 rounded-xl cursor-pointer transition-all ${
                      currentPage === page 
                        ? 'bg-purple-100 border-2 border-purple-600' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="aspect-[8.5/11] bg-white rounded mb-2 flex items-center justify-center text-gray-400">
                      <FileText className="w-8 h-8" />
                    </div>
                    <p className="text-xs text-center font-semibold">Page {page}</p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Version History */}
            <Card className="rounded-3xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Version History</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowVersionHistory(!showVersionHistory)}
                >
                  {showVersionHistory ? 'Hide' : 'Show'}
                </Button>
              </div>
              {showVersionHistory && (
                <div className="space-y-3">
                  {mockDocument.versions.map((version, idx) => (
                    <motion.div
                      key={version.version}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`p-3 rounded-xl border-l-4 ${idx === 0 ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm">{version.version}</span>
                        {idx === 0 && <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs">Current</span>}
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {version.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {version.date}
                        </div>
                        <p className="mt-2 text-gray-700">{version.changes}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
