import type {
  BugReport,
  BugSeverity,
  BugStatus,
  MaterialSpec,
  OrderStatus,
  PrintOrder,
  TabId,
  TroubleshootCase,
} from '../types'

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(data.error || `Помилка сервера (${res.status})`)
  }
  return (await res.json()) as T
}

export const api = {
  getMaterials: () => requestJson<MaterialSpec[]>('/api/materials'),
  getTroubleshooting: () => requestJson<TroubleshootCase[]>('/api/troubleshooting'),
  getOrders: () => requestJson<PrintOrder[]>('/api/orders'),
  createOrder: (payload: {
    customerName: string
    contact: string
    partName: string
    fileName?: string
    materialId: string
    estimatedGrams: number
    quantity: number
  }) =>
    requestJson<PrintOrder>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateOrderStatus: (id: string, status: OrderStatus) =>
    requestJson<PrintOrder>(`/api/orders/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  getBugs: () => requestJson<BugReport[]>('/api/bugs'),
  createBug: (payload: {
    title: string
    module: string
    severity: BugSeverity
    description: string
    reporter: string
  }) =>
    requestJson<BugReport>('/api/bugs', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateBugStatus: (id: string, status: BugStatus) =>
    requestJson<BugReport>(`/api/bugs/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  sendBotMessage: (message: string, awaitingBugText: boolean) =>
    requestJson<{
      reply: string
      actionTab?: TabId
      actionLabel?: string
      awaitingBugText: boolean
      createdBug?: BugReport
    }>('/api/bot/message', {
      method: 'POST',
      body: JSON.stringify({ message, awaitingBugText }),
    }),
}
