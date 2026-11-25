import { useMemo, useState } from 'react'
import { MATERIALS } from '../data/printData'
import type { MaterialUseCase } from '../types'

interface MaterialSelectorViewProps {
  onSelectForOrder: (materialId: string) => void
}

const USE_CASES: { id: 'all' | MaterialUseCase; label: string }[] = [
  { id: 'all', label: 'Усі матеріали' },
  { id: 'prototype', label: 'Прототип / Корпус' },
  { id: 'mechanical', label: 'Міцна деталь' },
  { id: 'outdoor', label: 'Вулиця / Сонце' },
  { id: 'flexible', label: 'Гнучка деталь' },
]

export function MaterialSelectorView({ onSelectForOrder }: MaterialSelectorViewProps) {
  const [filter, setFilter] = useState<'all' | MaterialUseCase>('all')

  const visibleMaterials = useMemo(() => {
    if (filter === 'all') return MATERIALS
    return MATERIALS.filter((m) => m.useCases.includes(filter))
  }, [filter])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Вибір пластику для 3D-друку</h2>
        <p className="text-sm text-slate-600">
          Оберіть призначення деталі, щоб швидко підібрати потрібний філамент.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {USE_CASES.map((uc) => (
          <button
            key={uc.id}
            type="button"
            onClick={() => setFilter(uc.id)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition cursor-pointer ${
              filter === uc.id
                ? 'bg-slate-900 text-white'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {uc.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visibleMaterials.map((mat) => (
          <article
            key={mat.id}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{mat.name}</h3>
                <span className="font-mono text-sm font-bold text-orange-600">
                  {mat.pricePerGramUah.toFixed(1)} ₴/г
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{mat.summary}</p>

              <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-2.5 text-xs border border-slate-100">
                <div>
                  <span className="block text-[10px] text-slate-400">Сопло</span>
                  <span className="font-mono font-medium text-slate-800">{mat.nozzleTemp}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">Стіл</span>
                  <span className="font-mono font-medium text-slate-800">{mat.bedTemp}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">До °C</span>
                  <span className="font-mono font-medium text-slate-800">{mat.heatLimitC} °C</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectForOrder(mat.id)}
              className="w-full rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition cursor-pointer"
            >
              Обрати для замовлення
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
