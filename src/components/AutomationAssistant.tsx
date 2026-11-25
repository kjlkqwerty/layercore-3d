import { useState } from 'react'
import { Bot, Send, X } from 'lucide-react'
import type { BugReport, TabId } from '../types'

interface AutomationAssistantProps {
  onNavigate: (tab: TabId) => void
  onSubmitQuickBug: (bug: BugReport) => void
  bugsCount: number
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
  onSubmitQuickBug,
  bugsCount,
}: AutomationAssistantProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [awaitingBugText, setAwaitingBugText] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'bot',
      text: 'Привіт! Я бот-помічник з 3D-друку. Допоможу обрати пластик, вирішити проблему друку, оформити замовлення або прийняти повідомлення про помилку в ПЗ.',
    },
  ])

  const handleUserText = (raw: string) => {
    const text = raw.trim()
    const q = text.toLowerCase()

    if (awaitingBugText) {
      const bugId = `BUG-0${bugsCount + 1}`
      const now = new Date()
      const dateStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`

      onSubmitQuickBug({
        id: bugId,
        title: text.slice(0, 60),
        module: 'Бот-помічник',
        severity: 'Середня',
        status: 'Новий',
        description: text,
        reporter: 'Через чат-бота',
        createdAt: dateStr,
      })

      setAwaitingBugText(false)
      setMessages((prev) => [
        ...prev,
        { id: `u-${Date.now()}`, sender: 'user', text },
        {
          id: `b-${Date.now() + 1}`,
          sender: 'bot',
          text: `Дякую! Помилку в ПЗ зареєстровано під номером ${bugId}.`,
          actionTab: 'bugs',
          actionLabel: 'Переглянути у списку помилок',
        },
      ])
      return
    }

    let reply: Omit<ChatMessage, 'id' | 'sender'>

    if (q.includes('кав') || q.includes('рецепт')) {
      reply = {
        text: 'Рецепти кави не надаються. Працюю лише з 3D-друком (пластик, проблеми, замовлення) та помилками в ПЗ.',
      }
    } else if (q.includes('пластик') || q.includes('матеріал')) {
      reply = {
        text: 'Для прототипів підійде PLA, для міцних деталей — PETG або ABS, для вулиці — ASA, для гнучких — TPU.',
        actionTab: 'materials',
        actionLabel: 'Відкрити вибір пластику',
      }
    } else if (q.includes('проблем') || q.includes('відкле') || q.includes('нитки')) {
      reply = {
        text: 'Маю базові інструкції щодо відклеювання, ниток, недоекструзії та зсуву шарів.',
        actionTab: 'troubleshooting',
        actionLabel: 'Відкрити вирішення проблем',
      }
    } else if (q.includes('замов') || q.includes('деталь')) {
      reply = {
        text: 'Оформити замовлення та дізнатись орієнтовну вартість можна у розділі «Замовлення деталей».',
        actionTab: 'orders',
        actionLabel: 'Перейти до замовлень',
      }
    } else if (q.includes('баг') || q.includes('помил') || q.includes('пз')) {
      setAwaitingBugText(true)
      reply = {
        text: 'Напишіть одним повідомленням, яка саме помилка виникла в ПЗ — я одразу збережу її.',
      }
    } else {
      reply = {
        text: 'Оберіть одну з дій нижче або напишіть, що потрібно: пластик, проблема друку, замовлення чи помилка в ПЗ.',
      }
    }

    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: 'user', text },
      { id: `b-${Date.now() + 1}`, sender: 'bot', ...reply },
    ])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    handleUserText(input)
    setInput('')
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
                onClick={() => handleUserText(label)}
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
              className="rounded-lg bg-orange-600 p-2 text-white hover:bg-orange-500 cursor-pointer"
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
