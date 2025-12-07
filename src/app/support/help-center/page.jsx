'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Search, ThumbsUp, MessageCircle, ChevronRight, HelpCircle, FileText, Video, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const categories = [
  { id: 1, name: 'Getting Started', icon: HelpCircle, articles: 12, color: 'from-blue-500 to-cyan-500' },
  { id: 2, name: 'Sales & Invoicing', icon: FileText, articles: 23, color: 'from-green-500 to-emerald-500' },
  { id: 3, name: 'Inventory Management', icon: BookOpen, articles: 18, color: 'from-purple-500 to-pink-500' },
  { id: 4, name: 'Reports & Analytics', icon: FileText, articles: 15, color: 'from-orange-500 to-red-500' },
  { id: 5, name: 'User Management', icon: HelpCircle, articles: 9, color: 'from-pink-500 to-red-500' },
  { id: 6, name: 'Video Tutorials', icon: Video, articles: 7, color: 'from-yellow-500 to-orange-500' }
]

const popularArticles = [
  { id: 'ART-001', title: 'How to Create Your First Invoice', category: 'Sales & Invoicing', views: 2345, helpful: 98, readTime: '5 min' },
  { id: 'ART-002', title: 'Setting Up Inventory Tracking', category: 'Inventory Management', views: 1876, helpful: 95, readTime: '8 min' },
  { id: 'ART-003', title: 'Understanding Sales Reports in UGX', category: 'Reports & Analytics', views: 1654, helpful: 97, readTime: '6 min' },
  { id: 'ART-004', title: 'Managing User Roles and Permissions', category: 'User Management', views: 1432, helpful: 93, readTime: '7 min' },
  { id: 'ART-005', title: 'Quick Start Guide for XHETON', category: 'Getting Started', views: 3210, helpful: 99, readTime: '10 min' }
]

const recentArticles = [
  { id: 'ART-006', title: 'New Features in v0.0.013 - Workflow Automation', publishDate: '2025-12-07', category: 'Getting Started' },
  { id: 'ART-007', title: 'Document Management System Overview', publishDate: '2025-12-07', category: 'Getting Started' },
  { id: 'ART-008', title: 'Using the Support Ticket System', publishDate: '2025-12-07', category: 'Getting Started' },
  { id: 'ART-009', title: 'Creating Automated Workflows for Stock Alerts', publishDate: '2025-12-06', category: 'Inventory Management' }
]

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Help Center" description="Knowledge base and support articles" />

        {/* Search Bar */}
        <Card className="rounded-3xl p-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">How can we help you today?</h2>
            <p className="text-sm opacity-90">Search our knowledge base for answers</p>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search articles, guides, and tutorials..."
              className="pl-12 py-6 rounded-2xl text-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-bold mb-4">Browse by Category</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {categories.map((category, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className={`p-6 rounded-3xl bg-gradient-to-br ${category.color} text-white cursor-pointer hover:scale-105 transition-transform`}>
                  <div className="flex items-center justify-between mb-3">
                    <category.icon className="w-8 h-8" />
                    <ChevronRight className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-lg mb-1">{category.name}</h4>
                  <p className="text-sm opacity-90">{category.articles} articles</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div>
          <h3 className="text-lg font-bold mb-4">Popular Articles</h3>
          <Card className="rounded-3xl overflow-hidden">
            <div className="divide-y">
              {popularArticles.map((article, idx) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span className="text-xs text-gray-500">{article.category}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{article.readTime} read</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{article.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {article.helpful}% helpful
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {article.views.toLocaleString()} views
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Articles */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold mb-4">Recent Articles</h3>
            <Card className="rounded-3xl p-6">
              <div className="space-y-4">
                {recentArticles.map((article, idx) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                  >
                    <FileText className="w-4 h-4 text-purple-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{article.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{article.category}</span>
                        <span>•</span>
                        <span>{article.publishDate}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <Card className="rounded-3xl p-6">
              <div className="space-y-3">
                {[
                  { title: 'Submit a Support Ticket', icon: MessageCircle, link: '/support/tickets' },
                  { title: 'Video Tutorials', icon: Video, link: '/support/help-center?category=videos' },
                  { title: 'System Status', icon: HelpCircle, link: '/support/status' },
                  { title: 'Contact Support Team', icon: MessageCircle, link: '/support/contact' }
                ].map((link, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-between rounded-2xl p-4 h-auto"
                      onClick={() => window.location.href = link.link}
                    >
                      <div className="flex items-center gap-3">
                        <link.icon className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold">{link.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <Card className="rounded-3xl p-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="text-center">
            <HelpCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Still need help?</h3>
            <p className="text-gray-600 mb-6">Our support team is ready to assist you</p>
            <div className="flex gap-3 justify-center">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl" onClick={() => window.location.href = '/support/tickets'}>
                Submit a Ticket
              </Button>
              <Button variant="outline" className="rounded-xl">
                Chat with Support
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
