export type TabId = 'home' | 'materials' | 'troubleshooting' | 'orders' | 'bugs'

export type MaterialUseCase = 'prototype' | 'mechanical' | 'outdoor' | 'flexible'

export interface MaterialSpec {
  id: string
  name: string
  pricePerGramUah: number
  nozzleTemp: string
  bedTemp: string
  heatLimitC: number
  useCases: MaterialUseCase[]
  summary: string
}

export interface TroubleshootCase {
  id: string
  title: string
  symptom: string
  cause: string
  solution: string[]
}

export type OrderStatus = 'Новий' | 'В роботі' | 'Готово'

export interface PrintOrder {
  id: string
  customerName: string
  contact: string
  partName: string
  fileName: string
  materialId: string
  estimatedGrams: number
  quantity: number
  totalPriceUah: number
  status: OrderStatus
  createdAt: string
}

export type BugSeverity = 'Висока' | 'Середня' | 'Низька'
export type BugStatus = 'Новий' | 'В роботі' | 'Вирішено'

export interface BugReport {
  id: string
  title: string
  module: string
  severity: BugSeverity
  status: BugStatus
  description: string
  reporter: string
  createdAt: string
}
