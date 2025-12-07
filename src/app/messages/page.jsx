'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Users, Hash, Send, Paperclip, Smile, MoreVertical, Search, Plus, CheckCheck, Mic, Phone, Video, Info } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const mockChats = [
  { id: 1, type: 'direct', name: 'Sarah Nambi', avatar: 'SN', lastMessage: 'Sounds good! Let me check the report.', timestamp: '2 min ago', unread: 3, online: true },
  { id: 2, type: 'direct', name: 'David Ochola', avatar: 'DO', lastMessage: 'Thanks for the update 👍', timestamp: '15 min ago', unread: 0, online: true },
  { id: 3, type: 'department', name: 'Finance Team', avatar: '💰', lastMessage: 'Monthly reconciliation complete', timestamp: '1 hour ago', unread: 5, online: false },
  { id: 4, type: 'channel', name: 'general', avatar: '#', lastMessage: 'Welcome to the team!', timestamp: '2 hours ago', unread: 0, online: false },
  { id: 5, type: 'direct', name: 'Grace Akello', avatar: 'GA', lastMessage: 'See you at the meeting', timestamp: '3 hours ago', unread: 1, online: false },
  { id: 6, type: 'department', name: 'Sales Team', avatar: '📊', lastMessage: 'Q4 targets updated', timestamp: '1 day ago', unread: 0, online: false },
]

const mockMessages = [
  { id: 1, sender: 'David Ochola', avatar: 'DO', message: 'Hey, did you review the sales report for Q4?', timestamp: '10:23 AM', isMine: false, seen: true },
  { id: 2, sender: 'You', avatar: 'ME', message: 'Yes, I just finished going through it. The UGX 8.4M revenue is impressive!', timestamp: '10:25 AM', isMine: true, seen: true },
  { id: 3, sender: 'David Ochola', avatar: 'DO', message: 'Absolutely! The Kampala branch exceeded targets by 15%', timestamp: '10:26 AM', isMine: false, seen: true },
  { id: 4, sender: 'You', avatar: 'ME', message: 'That\'s great! Should we schedule a team meeting to discuss strategies for Q1 2026?', timestamp: '10:28 AM', isMine: true, seen: true },
  { id: 5, sender: 'David Ochola', avatar: 'DO', message: 'Sounds good! Let me check the report.', timestamp: '10:30 AM', isMine: false, seen: false },
]

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(mockChats[0])
  const [messageText, setMessageText] = useState('')
  const [showInfo, setShowInfo] = useState(false)

  const sendMessage = () => {
    if (messageText.trim()) {
      // Handle send logic
      setMessageText('')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Internal Messaging" 
          description="Team communication and collaboration"
        />

        <Card className="rounded-3xl overflow-hidden h-[700px] flex">
          {/* Left Sidebar - Chat List */}
          <div className="w-80 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search messages..." className="pl-10 rounded-xl" />
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                New Message
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button className="flex-1 py-3 text-sm font-semibold text-purple-600 border-b-2 border-purple-600">
                Direct
              </button>
              <button className="flex-1 py-3 text-sm font-semibold text-gray-500">
                Departments
              </button>
              <button className="flex-1 py-3 text-sm font-semibold text-gray-500">
                Channels
              </button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {mockChats.map((chat, idx) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat.id === chat.id ? 'bg-purple-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                        {chat.avatar}
                      </div>
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm truncate">{chat.name}</h4>
                        <span className="text-xs text-gray-500">{chat.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded-full min-w-[20px] text-center">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                    {selectedChat.avatar}
                  </div>
                  {selectedChat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedChat.name}</h3>
                  <p className="text-xs text-gray-500">
                    {selectedChat.online ? 'Online' : `Last seen ${selectedChat.timestamp}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Video className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl"
                  onClick={() => setShowInfo(!showInfo)}
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {mockMessages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-md ${msg.isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {msg.avatar}
                    </div>
                    <div>
                      <div className={`px-4 py-3 rounded-2xl ${
                        msg.isMine 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                          : 'bg-white text-gray-900'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                        <span>{msg.timestamp}</span>
                        {msg.isMine && msg.seen && <CheckCheck className="w-3 h-3 text-blue-500" />}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl"
                  onClick={sendMessage}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Info (Optional) */}
          {showInfo && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              className="border-l p-6 overflow-y-auto"
            >
              <h3 className="font-bold mb-4">Conversation Info</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2">
                    {selectedChat.avatar}
                  </div>
                  <h4 className="font-semibold">{selectedChat.name}</h4>
                  <p className="text-sm text-gray-500">{selectedChat.type === 'direct' ? 'Direct Message' : selectedChat.type}</p>
                </div>
                <div className="pt-4 border-t">
                  <h5 className="font-semibold text-sm mb-2">Shared Files</h5>
                  <p className="text-sm text-gray-500">No files shared yet</p>
                </div>
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
