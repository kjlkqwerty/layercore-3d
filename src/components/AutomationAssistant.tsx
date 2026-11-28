import { useState } from 'react'
import { Bot, Send, X } from 'lucide-react'
import { api } from '../api/client'
import type { BugReport, TabId } from '../types'

interface AutomationAssistantProps {
  onNavigate: (tab: TabId) => void
  onBugCreated: (bug: BugReport) => void
}

interface ChatMessage {
  id: string
  sender: 'bot' | 'user'
  text: string
  actionTab?: TabId
  actionLabel?: string
}

export function AutomationAssistant({
  onNavigate,
  onBugCreated,
}: AutomationAssistantProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [awaitingBugText, setAwaitingBugText] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'bot',
      text: 'Привіт! Я бот-помічник з 3D-друку. Допоможу обрати пластик, вирішити проблему друку, оформити замовлення або прийняти повідомлення про помилку в ПЗ.',
    },
  ])

  const handleUserText = async (raw: string) => {
    const text = raw.trim()
    if (!text || sending) return

    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, sender: 'user', text }])
    setSending(true)

    try {
      const res = await api.sendBotMessage(text, awaitingBugText)
      setAwaitingBugText(res.awaitingBugText)
      if (res.createdBug) {
        onBugCreated(res.createdBug)
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: res.reply,
          actionTab: res.actionTab,
          actionLabel: res.actionLabel,
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: 'Не вдалося з’єднатися з сервером бота. Перевірте, що бекенд запущено.',
        },
      ])
    } finally {
      setSending(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const text = input
    setInput('')
    void handleUserText(text)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="flex h-[420px] w-[330px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-orange-400" />
              <span className="text-xs font-semibold">Бот-помічник 3D / ПЗ</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-slate-400 hover:text-white cursor-pointer"
              aria-label="Закрити"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto bg-slate-50 p-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 ${
                    m.sender === 'user'
                      ? 'bg-orange-600 text-white'
                      : 'border border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  {m.text}
                </div>
                {m.actionTab && m.actionLabel && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate(m.actionTab!)
                      setOpen(false)
                    }}
                    className="mt-1 rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-orange-600 cursor-pointer"
                  >
                    {m.actionLabel}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1 border-t border-slate-100 bg-white px-2.5 py-2">
            {['Вибір пластику', 'Проблема друку', 'Замовлення', 'Помилка в ПЗ'].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => void handleUserText(label)}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-700 hover:bg-orange-50 hover:text-orange-700 cursor-pointer"
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-1.5 border-t border-slate-200 bg-white p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={awaitingBugText ? 'Опишіть помилку в ПЗ...' : 'Напишіть запит...'}
              className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-orange-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="rounded-lg bg-orange-600 p-2 text-white hover:bg-orange-500 disabled:opacity-60 cursor-pointer"
              aria-label="Надіслати"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-lg hover:bg-orange-600 cursor-pointer"
        >
          <Bot className="h-4 w-4 text-orange-400" />
          Бот-помічник
        </button>
      )}
    </div>
  )
}
