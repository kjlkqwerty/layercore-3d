import { ArrowRight, Bug, Layers, PackagePlus, Wrench } from 'lucide-react'
import type { BugReport, PrintOrder, TabId } from '../types'

interface DashboardViewProps {
  orders: PrintOrder[]
  bugs: BugReport[]
  onNavigate: (tab: TabId) => void
}

export function DashboardView({ orders, bugs, onNavigate }: DashboardViewProps) {
  const openOrders = orders.filter((o) => o.status !== 'Готово').length
  const openBugs = bugs.filter((b) => b.status !== 'Вирішено').length

  const modules: {
    tab: TabId
    title: string
    desc: string
    icon: typeof Layers
  }[] = [
    {
      tab: 'materials',
      title: 'Вибір пластику',
      desc: 'Підбір PLA, PETG, ABS, ASA або TPU під умови роботи деталі.',
      icon: Layers,
    },
    {
      tab: 'troubleshooting',
      title: 'Вирішення простих проблем',
      desc: 'Швидкі підказки щодо адгезії, ниток, недоекструзії та зсуву шарів.',
      icon: Wrench,
    },
    {
      tab: 'orders',
      title: 'Прийом замовлень на деталі',
      desc: 'Завантаження 3D-файлу, вибір матеріалу та швидкий розрахунок вартості.',
      icon: PackagePlus,
    },
    {
      tab: 'bugs',
      title: 'Прийом помилок в ПЗ',
      desc: 'Реєстрація технічних збоїв сайту, слайсера чи бота для команди розробки.',
      icon: Bug,
    },
  ]

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Автоматизація процесів IT-фірми з 3D-друку
            </h2>
            <p className="text-sm text-slate-300">
              Веб-портал для підбору пластику, вирішення типових проблем друку, прийому
              замовлень на деталі та фіксації помилок у програмному забезпеченні.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-400 cursor-pointer"
            >
              Замовити деталь
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('materials')}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-700 cursor-pointer"
            >
              Підібрати пластик
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Доступно матеріалів</p>
          <p className="mt-1 text-2xl font-bold font-mono text-slate-900">5</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Активні замовлення</p>
          <p className="mt-1 text-2xl font-bold font-mono text-slate-900">{openOrders}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Відкриті баги ПЗ</p>
          <p className="mt-1 text-2xl font-bold font-mono text-slate-900">{openBugs}</p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {modules.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => onNavigate(item.tab)}
              className="group rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-orange-400 hover:shadow-sm cursor-pointer flex items-start gap-4"
            >
              <div className="rounded-xl bg-slate-100 p-3 text-slate-700 group-hover:bg-orange-50 group-hover:text-orange-600">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-orange-600">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </button>
          )
        })}
      </section>
    </div>
  )
}
