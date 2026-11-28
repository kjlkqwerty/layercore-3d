import { useEffect, useState } from 'react'
import { Box, Bug, Home, Layers, Menu, PackagePlus, Wrench, X } from 'lucide-react'
import { api } from './api/client'
import { AutomationAssistant } from './components/AutomationAssistant'
import { BugTrackerView } from './components/BugTrackerView'
import { DashboardView } from './components/DashboardView'
import { MaterialSelectorView } from './components/MaterialSelectorView'
import { OrdersView } from './components/OrdersView'
import { TroubleshootingView } from './components/TroubleshootingView'
import {
  INITIAL_BUGS,
  INITIAL_ORDERS,
  MATERIALS,
  TROUBLESHOOT_CASES,
} from './data/printData'
import type {
  BugReport,
  BugSeverity,
  BugStatus,
  MaterialSpec,
  OrderStatus,
  PrintOrder,
  TabId,
  TroubleshootCase,
} from './types'

const NAV_ITEMS: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Головна', icon: Home },
  { id: 'materials', label: 'Вибір пластику', icon: Layers },
  { id: 'troubleshooting', label: 'Проблеми друку', icon: Wrench },
  { id: 'orders', label: 'Замовлення', icon: PackagePlus },
  { id: 'bugs', label: 'Помилки в ПЗ', icon: Bug },
]

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [materials, setMaterials] = useState<MaterialSpec[]>(MATERIALS)
  const [troubleshootCases, setTroubleshootCases] = useState<TroubleshootCase[]>(TROUBLESHOOT_CASES)
  const [orders, setOrders] = useState<PrintOrder[]>(INITIAL_ORDERS)
  const [bugs, setBugs] = useState<BugReport[]>(INITIAL_BUGS)
  const [selectedMaterial, setSelectedMaterial] = useState('petg')
  const [apiOnline, setApiOnline] = useState<boolean | null>(null)

  useEffect(() => {
    let active = true
    Promise.all([
      api.getMaterials(),
      api.getTroubleshooting(),
      api.getOrders(),
      api.getBugs(),
    ])
      .then(([mats, cases, ord, bg]) => {
        if (!active) return
        setMaterials(mats)
        setTroubleshootCases(cases)
        setOrders(ord)
        setBugs(bg)
        setApiOnline(true)
      })
      .catch(() => {
        if (!active) return
        setApiOnline(false)
      })
    return () => {
      active = false
    }
  }, [])

  const handleSelectMaterial = (materialId: string) => {
    setSelectedMaterial(materialId)
    setActiveTab('orders')
  }

  const handleCreateOrder = async (payload: {
    customerName: string
    contact: string
    partName: string
    fileName?: string
    materialId: string
    estimatedGrams: number
    quantity: number
  }) => {
    const created = await api.createOrder(payload)
    setOrders((prev) => [created, ...prev])
    return created
  }

  const handleOrderStatus = async (orderId: string, status: OrderStatus) => {
    const updated = await api.updateOrderStatus(orderId, status)
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)))
  }

  const handleCreateBug = async (payload: {
    title: string
    module: string
    severity: BugSeverity
    description: string
    reporter: string
  }) => {
    const created = await api.createBug(payload)
    setBugs((prev) => [created, ...prev])
    return created
  }

  const handleBugStatus = async (bugId: string, status: BugStatus) => {
    const updated = await api.updateBugStatus(bugId, status)
    setBugs((prev) => prev.map((b) => (b.id === bugId ? updated : b)))
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-orange-400">
              <Box className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-900">LayerCore 3D</span>
              <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                Автоматизація 3D-друку
                {apiOnline !== null && (
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${
                      apiOnline ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    title={apiOnline ? 'API підключено' : 'Офлайн-режим'}
                  />
                )}
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const active = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-orange-400' : ''}`} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="rounded-lg border border-slate-200 p-2 text-slate-700 md:hidden cursor-pointer"
            aria-label="Меню"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="border-t border-slate-100 bg-white px-4 py-2 space-y-1 md:hidden">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const active = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer ${
                    active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        {activeTab === 'home' && (
          <DashboardView
            materialsCount={materials.length}
            orders={orders}
            bugs={bugs}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialSelectorView
            materials={materials}
            onSelectForOrder={handleSelectMaterial}
          />
        )}

        {activeTab === 'troubleshooting' && (
          <TroubleshootingView cases={troubleshootCases} />
        )}

        {activeTab === 'orders' && (
          <OrdersView
            materials={materials}
            orders={orders}
            initialMaterialId={selectedMaterial}
            onCreateOrder={handleCreateOrder}
            onChangeStatus={handleOrderStatus}
          />
        )}

        {activeTab === 'bugs' && (
          <BugTrackerView
            bugs={bugs}
            onCreateBug={handleCreateBug}
            onChangeStatus={handleBugStatus}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        LayerCore 3D • Автоматизація процесів IT-фірми з 3D-друку
      </footer>

      <AutomationAssistant
        onNavigate={setActiveTab}
        onBugCreated={(bug) => setBugs((prev) => [bug, ...prev])}
      />
    </div>
  )
}

export default App
