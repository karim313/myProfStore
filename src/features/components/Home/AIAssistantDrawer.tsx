import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, User, Bot } from 'lucide-react'
import { sendChatMessage } from '../../../api/axios'

interface AIAssistantDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function AIAssistantDrawer({ isOpen, onClose }: AIAssistantDrawerProps) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'أهلاً بك! كيف يمكنني مساعدتك في اختيار المنتج المناسب اليوم؟' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    const nextHistory = [...messages, { role: 'user', text: userMessage }]
    setMessages(nextHistory)
    setInput('')
    setIsLoading(true)

    try {
      const { response } = await sendChatMessage(userMessage, nextHistory)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: response }
      ])
    } catch (error) {
      console.error('Failed to send chat message:', error)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'عذراً، لا يتوفر خادم الدردشة حالياً. سأظل أساعدك عبر المنتجات المتاحة في المتجر.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }} // Slide in from right edge
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
            dir="rtl"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-[#00342B] to-[#004d40] text-white">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/20 text-emerald-300 p-2 rounded-xl backdrop-blur-sm border border-emerald-400/20">
                  <Sparkles size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">مساعد التسوق الذكي</h3>
                  <p className="text-xs text-emerald-200/80">متصل الآن - ذكاء اصطناعي</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* ── Chat Area ── */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-[#00342B] text-white' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3.5 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#00342B] text-white rounded-tl-none' 
                      : 'bg-white text-gray-700 border border-gray-100 rounded-tr-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white text-gray-700 border border-gray-100 rounded-2xl rounded-tr-none px-3.5 py-3 text-sm shadow-sm">
                    جاري التفكير في أفضل اقتراح...
                  </div>
                </div>
              )}
            </div>

            {/* ── Input Area ── */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="ابحث عن منتج، أو اسألني عن رأيي..."
                  className="w-full bg-gray-50 border border-gray-200 text-sm rounded-full py-3.5 pr-5 pl-14 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-gray-700"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute left-2 w-10 h-10 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white rounded-full transition-colors cursor-pointer"
                >
                  <Send size={16} style={{ transform: 'rotate(180deg)' }} />
                </button>
              </form>
            </div>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
