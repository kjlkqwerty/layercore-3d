import { useMemo, useState } from 'react'
import { CheckCircle2, PackagePlus, Upload } from 'lucide-react'
import { MATERIALS } from '../data/printData'
import type { OrderStatus, PrintOrder } from '../types'

interface OrdersViewProps {
  orders: PrintOrder[]
  initialMaterialId: string
  onAddOrder: (order: PrintOrder) => void
  onChangeStatus: (orderId: string, status: OrderStatus) => void
}

const STATUS_STYLE: Record<OrderStatus, string> = {
  Новий: 'bg-slate-100 text-slate-700',
  'В роботі': 'bg-orange-50 text-orange-700',
  Готово: 'bg-emerald-50 text-emerald-700',
}

export function OrdersView({
  orders,
  initialMaterialId,
  onAddOrder,
  onChangeStatus,
}: OrdersViewProps) {
  const [customerName, setCustomerName] = useState('')
  const [contact, setContact] = useState('')
  const [partName, setPartName] = useState('')
  const [fileName, setFileName] = useState('')
  const [materialId, setMaterialId] = useState(initialMaterialId || 'petg')
  const [estimatedGrams, setEstimatedGrams] = useState(35)
  const [quantity, setQuantity] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const selectedMaterial = useMemo(
    () => MATERIALS.find((m) => m.id === materialId) ?? MATERIALS[0],
    [materialId],
  )

  const totalPriceUah = useMemo(() => {
    const setupFee = 50
    return Math.round(estimatedGrams * quantity * selectedMaterial.pricePerGramUah + setupFee)
  }, [estimatedGrams, quantity, selectedMaterial])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newId = `ORD-${103 + orders.length}`
    const now = new Date()
    const dateStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`

    onAddOrder({
      id: newId,
      customerName: customerName.trim(),
      contact: contact.trim(),
      partName: partName.trim(),
      fileName: fileName || 'model.stl',
      materialId: selectedMaterial.id,
      estimatedGrams,
      quantity,
      totalPriceUah,
      status: 'Новий',
      createdAt: dateStr,
    })

    setNotice(`Замовлення ${newId} успішно прийнято!`)
    setCustomerName('')
    setContact('')
    setPartName('')
    setFileName('')
    setTimeout(() => setNotice(null), 4000)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Прийом замовлень на 3D-друк деталей</h2>
        <p className="text-sm text-slate-600">
          Прикріпіть 3D-файл, виберіть пластик і кількість — система розрахує орієнтовну вартість.
        </p>
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {notice}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-3.5"
        >
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <PackagePlus className="h-4 w-4 text-orange-600" />
            Оформлення замовлення
          </h3>

          <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center cursor-pointer hover:border-orange-400">
            <Upload className="h-5 w-5 text-slate-400 mb-1" />
            <span className="text-xs font-medium text-slate-700">
              {fileName ? `Файл: ${fileName}` : 'Обрати STL / STEP / OBJ файл'}
            </span>
            <input
              type="file"
              accept=".stl,.step,.stp,.obj,.3mf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) {
                  setFileName(f.name)
                  if (!partName) setPartName(f.name.replace(/\.[^/.]+$/, ''))
                }
              }}
            />
          </label>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Назва деталі *</label>
            <input
              type="text"
              required
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              placeholder="Напр. Кріплення корпусу"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-orange-400 focus:outline-none"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Ім’я / Компанія *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ваше ім’я"
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-orange-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Контакт *</label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="@telegram або email"
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-orange-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Пластик</label>
              <select
                value={materialId}
                onChange={(e) => setMaterialId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus:border-orange-400 focus:outline-none"
              >
                {MATERIALS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.pricePerGramUah} ₴/г)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Вага 1 шт (г)</label>
              <input
                type="number"
                min={5}
                max={2000}
                value={estimatedGrams}
                onChange={(e) => setEstimatedGrams(Math.max(5, Number(e.target.value)))}
                className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-mono focus:border-orange-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Кількість</label>
              <input
                type="number"
                min={1}
                max={200}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-mono focus:border-orange-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-white">
            <span className="text-xs text-slate-300">Орієнтовна вартість:</span>
            <span className="font-mono text-lg font-bold text-orange-400">
              {totalPriceUah} ₴
            </span>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-orange-600 py-2.5 text-xs font-semibold text-white hover:bg-orange-500 cursor-pointer"
          >
            Відправити замовлення
          </button>
        </form>

        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Список замовлень ({orders.length})
          </h3>
          {orders.map((order) => {
            const mat = MATERIALS.find((m) => m.id === order.materialId)
            return (
              <div
                key={order.id}
                className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{order.id}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLE[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="text-[11px] text-slate-400">{order.createdAt}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">{order.partName}</h4>
                  <p className="text-xs text-slate-600">
                    {order.customerName} ({order.contact}) • {mat?.name ?? order.materialId} •{' '}
                    {order.quantity} шт • <span className="font-mono">{order.fileName}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {order.totalPriceUah} ₴
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => onChangeStatus(order.id, e.target.value as OrderStatus)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-700"
                  >
                    <option value="Новий">Новий</option>
                    <option value="В роботі">В роботі</option>
                    <option value="Готово">Готово</option>
                  </select>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
