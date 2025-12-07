'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, Search, Paperclip, Smile, MoreVertical, Phone, Video, Users, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const mockChats = [
  { id: 'CHAT-001', name: 'Sarah Nambi', avatar: 'SN', lastMessage: 'Thanks for the update!', time: '2m ago', unread: 2, isOnline: true, isTyping: false },
  { id: 'CHAT-002', name: 'David Ochola', avatar: 'DO', lastMessage: 'When is the meeting?', time: '15m ago', unread: 0, isOnline: true, isTyping: false },
  { id: 'CHAT-003', name: 'Grace Akello', avatar: 'GA', lastMessage: 'I sent the files', time: '1h ago', unread: 5, isOnline: false, isTyping: false },
  { id: 'CHAT-004', name: 'Sales Team', avatar: 'ST', lastMessage: 'Great work everyone!', time: '2h ago', unread: 0, isOnline: false, isTyping: false, isGroup: true },
  { id: 'CHAT-005', name: 'Mark Okello', avatar: 'MO', lastMessage: 'See you tomorrow', time: 'Yesterday', unread: 0, isOnline: false, isTyping: false }
]

const mockMessages = [
  { id: 'MSG-001', sender: 'Sarah Nambi', content: 'Hi! Can you send me the latest sales report?', time: '10:30 AM', isMine: false },
  { id: 'MSG-002', sender: 'You', content: 'Sure, let me pull that up for you.', time: '10:31 AM', isMine: true },
  { id: 'MSG-003', sender: 'You', content: 'Here you go!', time: '10:32 AM', isMine: true, attachment: 'sales-report-dec-2025.pdf' },
  { id: 'MSG-004', sender: 'Sarah Nambi', content: 'Thanks for the update!', time: '10:33 AM', isMine: false, seen: true }
]

export default function InternalChat() {
  const [selectedChat, setSelectedChat] = useState(mockChats[0])
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState(mockMessages)

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    
    const newMessage = {
      id: `MSG-${Date.now()}`,
      sender: 'You',
      content: messageInput,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isMine: true
    }
    
    setMessages([...messages, newMessage])
    setMessageInput('')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Internal Chat" description="Real-time messaging for your team" />

        <div className="grid md:grid-cols-3 gap-6">
          {/* Chat List */}
          <Card className="rounded-3xl overflow-hidden h-[calc(100vh-250px)]">
            <div className="p-4 border-b">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search chats..." className="pl-10 rounded-xl" />
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-120px)]">
              {mockChats.map(chat => (
                <motion.div
                  key={chat.id}
                  whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 border-b cursor-pointer transition-colors ${selectedChat.id === chat.id ? 'bg-purple-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {chat.avatar}
                      </div>
                      {chat.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm">{chat.name}</h4>
                          {chat.isGroup && <Users className="w-3 h-3 text-gray-400" />}
                        </div>
                        <span className="text-xs text-gray-500">{chat.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Chat Window */}
          <Card className="md:col-span-2 rounded-3xl overflow-hidden h-[calc(100vh-250px)] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {selectedChat.avatar}
                  </div>
                  {selectedChat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedChat.name}</h3>
                  {selectedChat.isTyping ? (
                    <p className="text-xs text-purple-600">Typing...</p>
                  ) : (
                    <p className="text-xs text-gray-500">{selectedChat.isOnline ? 'Online' : 'Offline'}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              <AnimatePresence>
                {messages.map((message, idx) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${message.isMine ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-white'} rounded-2xl p-3 shadow-sm`}>
                      {!message.isMine && (
                        <p className="text-xs font-semibold mb-1 text-purple-600">{message.sender}</p>
                      )}
                      <p className="text-sm">{message.content}</p>
                      {message.attachment && (
                        <div className={`mt-2 p-2 ${message.isMine ? 'bg-white/20' : 'bg-purple-50'} rounded-xl flex items-center gap-2`}>
                          <Paperclip className="w-4 h-4" />
                          <span className="text-xs">{message.attachment}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <p className={`text-xs ${message.isMine ? 'text-white/70' : 'text-gray-500'}`}>{message.time}</p>
                        {message.isMine && message.seen && (
                          <div className="text-xs text-white/70">✓✓</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input 
                  placeholder="Type a message..." 
                  className="flex-1 rounded-xl"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl"
                  onClick={handleSendMessage}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
