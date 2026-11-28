import { useState } from 'react'
import { Bug, CheckCircle2 } from 'lucide-react'
import type { BugReport, BugSeverity, BugStatus } from '../types'

interface BugTrackerViewProps {
  bugs: BugReport[]
  onCreateBug: (payload: {
    title: string
    module: string
    severity: BugSeverity
    description: string
    reporter: string
  }) => Promise<BugReport>
  onChangeStatus: (bugId: string, status: BugStatus) => Promise<void>
}

const STATUS_STYLE: Record<BugStatus, string> = {
  Новий: 'bg-cyan-50 text-cyan-700',
  'В роботі': 'bg-orange-50 text-orange-700',
  Вирішено: 'bg-emerald-50 text-emerald-700',
}

export function BugTrackerView({ bugs, onCreateBug, onChangeStatus }: BugTrackerViewProps) {
  const [title, setTitle] = useState('')
  const [module, setModule] = useState('Форма замовлень')
  const [severity, setSeverity] = useState<BugSeverity>('Середня')
  const [reporter, setReporter] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const created = await onCreateBug({
        title: title.trim(),
        module,
        severity,
        description: description.trim(),
        reporter: reporter.trim() || 'Користувач',
      })

      setNotice(`Повідомлення про помилку ${created.id} збережено!`)
      setTitle('')
      setDescription('')
      setTimeout(() => setNotice(null), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не вдалося зберегти помилку.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Прийом помилок у програмному забезпеченні</h2>
        <p className="text-sm text-slate-600">
          Повідомте про збій на сайті, у боті або слайсері — заявка збережеться на сервері.
        </p>
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {notice}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-3.5"
        >
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Bug className="h-4 w-4 text-rose-600" />
            Повідомити про помилку в ПЗ
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Суть помилки *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Напр. Не відкривається форма замовлення"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-orange-400 focus:outline-none"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Модуль ПЗ</label>
              <select
                value={module}
                onChange={(e) => setModule(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus:border-orange-400 focus:outline-none"
              >
                <option value="Форма замовлень">Форма замовлень</option>
                <option value="Підбір пластику">Підбір пластику</option>
                <option value="Слайсер / Завантаження">Слайсер / Завантаження</option>
                <option value="Бот-помічник">Бот-помічник</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Важливість</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as BugSeverity)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus:border-orange-400 focus:outline-none"
              >
                <option value="Висока">Висока</option>
                <option value="Середня">Середня</option>
                <option value="Низька">Низька</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Ваше ім’я</label>
            <input
              type="text"
              value={reporter}
              onChange={(e) => setReporter(e.target.value)}
              placeholder="Опціонально"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-orange-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Опис помилки *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишіть, що саме працює неправильно..."
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-orange-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-rose-600 disabled:opacity-60 cursor-pointer"
          >
            {submitting ? 'Надсилання...' : 'Надіслати помилку'}
          </button>
        </form>

        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Зареєстровані помилки ({bugs.length})
          </h3>
          {bugs.map((bug) => (
            <article
              key={bug.id}
              className="rounded-xl border border-slate-200 bg-white p-4 space-y-2"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{bug.id}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLE[bug.status]}`}>
                      {bug.status}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">
                      {bug.module}
                    </span>
                    <span className="text-[11px] text-slate-500">• {bug.severity}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">{bug.title}</h4>
                </div>

                <select
                  value={bug.status}
                  onChange={(e) => void onChangeStatus(bug.id, e.target.value as BugStatus)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-700"
                >
                  <option value="Новий">Новий</option>
                  <option value="В роботі">В роботі</option>
                  <option value="Вирішено">Вирішено</option>
                </select>
              </div>

              <p className="text-xs text-slate-600">{bug.description}</p>
              <p className="text-[11px] text-slate-400">
                Від: {bug.reporter} • {bug.createdAt}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
