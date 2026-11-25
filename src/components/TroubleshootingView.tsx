import { useMemo, useState } from 'react'
import { Search, Wrench } from 'lucide-react'
import { TROUBLESHOOT_CASES } from '../data/printData'

export function TroubleshootingView() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return TROUBLESHOOT_CASES
    return TROUBLESHOOT_CASES.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.symptom.toLowerCase().includes(q) ||
        item.cause.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Вирішення простих проблем друку</h2>
          <p className="text-sm text-slate-600">
            Знайдіть симптом і виконайте базові кроки налаштування.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук проблеми..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs focus:border-orange-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white p-5 space-y-3"
          >
            <div className="flex items-start gap-2.5">
              <Wrench className="h-4 w-4 text-orange-600 shrink-0 mt-1" />
              <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <p>
                <strong className="text-slate-800">Симптом:</strong> {item.symptom}
              </p>
              <p>
                <strong className="text-slate-800">Причина:</strong> {item.cause}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <p className="text-xs font-semibold text-slate-800 mb-1.5">Як виправити:</p>
              <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
                {item.solution.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
