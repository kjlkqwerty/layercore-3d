import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type {
  BugReport,
  BugSeverity,
  BugStatus,
  MaterialSpec,
  OrderStatus,
  PrintOrder,
  TroubleshootCase,
} from '../src/types/index.ts'

export interface DatabaseState {
  materials: MaterialSpec[]
  troubleshooting: TroubleshootCase[]
  orders: PrintOrder[]
  bugs: BugReport[]
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, 'data')
const DB_PATH = path.join(DATA_DIR, 'db.json')

const INITIAL_DB: DatabaseState = {
  materials: [
    {
      id: 'pla',
      name: 'PLA',
      pricePerGramUah: 3.0,
      nozzleTemp: '200–215 °C',
      bedTemp: '60 °C',
      heatLimitC: 55,
      useCases: ['prototype'],
      summary: 'Простий та доступний пластик для макетів, прототипів і нескладних корпусів.',
    },
    {
      id: 'petg',
      name: 'PETG',
      pricePerGramUah: 3.8,
      nozzleTemp: '235–245 °C',
      bedTemp: '80 °C',
      heatLimitC: 75,
      useCases: ['mechanical', 'prototype'],
      summary: 'Міцний та вологостійкий матеріал для кріплень, кронштейнів і робочих деталей.',
    },
    {
      id: 'abs',
      name: 'ABS',
      pricePerGramUah: 4.2,
      nozzleTemp: '245–260 °C',
      bedTemp: '100 °C',
      heatLimitC: 95,
      useCases: ['mechanical'],
      summary: 'Термостійкий конструкційний пластик для корпусів електроніки та вузлів.',
    },
    {
      id: 'asa',
      name: 'ASA',
      pricePerGramUah: 5.2,
      nozzleTemp: '250–265 °C',
      bedTemp: '100 °C',
      heatLimitC: 98,
      useCases: ['outdoor', 'mechanical'],
      summary: 'Стійкий до сонця (UV) та погоди пластик для вуличних деталей і датчиків.',
    },
    {
      id: 'tpu',
      name: 'TPU 95A',
      pricePerGramUah: 6.0,
      nozzleTemp: '220–235 °C',
      bedTemp: '55 °C',
      heatLimitC: 65,
      useCases: ['flexible'],
      summary: 'Гнучкий еластичний матеріал для демпферів, ущільнювачів і захисних чохлів.',
    },
  ],
  troubleshooting: [
    {
      id: 'warping',
      title: 'Деталь відклеюється від столу (Warping)',
      symptom: 'Кути моделі піднімаються вгору під час перших шарів друку.',
      cause: 'Брудний стіл, низька температура платформи або протяг.',
      solution: [
        'Протерти стіл ізопропіловим спиртом.',
        'Підняти температуру столу на +5 °C і додати Brim у слайсері.',
        'Вимкнути обдув на перших 3 шарах.',
      ],
    },
    {
      id: 'stringing',
      title: 'Тонкі нитки між елементами (Stringing)',
      symptom: 'Між виступами моделі тягнеться пластикове «павутиння».',
      cause: 'Зависока температура сопла або малий відкат філаменту (Retraction).',
      solution: [
        'Знизити температуру сопла на 5–10 °C.',
        'Збільшити Retraction Distance (1–1.5 мм для Direct, 5 мм для Bowden).',
        'За потреби просушити пластик.',
      ],
    },
    {
      id: 'under-extrusion',
      title: 'Недоекструзія (пропуски в шарах)',
      symptom: 'Стінки тонкі або пористі, екструдер інколи клацає.',
      cause: 'Часткове засмічення сопла або низька температура друку.',
      solution: [
        'Прочистити сопло голкою або методом Cold Pull.',
        'Підняти температуру сопла на +5…+10 °C.',
        'Перевірити, що в слайсері стоїть Flow ~100%.',
      ],
    },
    {
      id: 'layer-shift',
      title: 'Зміщення шарів (Layer Shift)',
      symptom: 'Деталь з певної висоти зміщена вбік сходинкою.',
      cause: 'Слабкий натяг ременів X/Y або занадто висока швидкість переміщення.',
      solution: [
        'Перевірити натяг ременів та кріплення шківів.',
        'Увімкнути Z-hop 0.4 мм у слайсері.',
        'Зменшити швидкість і прискорення друку.',
      ],
    },
  ],
  orders: [
    {
      id: 'ORD-101',
      customerName: 'ТОВ «СкайРоботікс»',
      contact: '@skyrobotics',
      partName: 'Корпус контролера',
      fileName: 'controller_case.stl',
      materialId: 'asa',
      estimatedGrams: 45,
      quantity: 2,
      totalPriceUah: 518,
      status: 'В роботі',
      createdAt: '25.11.2026',
    },
    {
      id: 'ORD-102',
      customerName: 'Ігор Коваленко',
      contact: 'i.kovalenko@tech.ua',
      partName: 'Кронштейн датчика',
      fileName: 'sensor_mount.stl',
      materialId: 'petg',
      estimatedGrams: 30,
      quantity: 4,
      totalPriceUah: 506,
      status: 'Новий',
      createdAt: '25.11.2026',
    },
  ],
  bugs: [
    {
      id: 'BUG-01',
      title: 'Неправильно рахується ціна при кількості більше 10 шт',
      module: 'Форма замовлень',
      severity: 'Середня',
      status: 'В роботі',
      description: 'Після зміни кількості деталей сума оновлюється лише після повторного вибору пластику.',
      reporter: 'Олена М.',
      createdAt: '25.11.2026',
    },
    {
      id: 'BUG-02',
      title: 'Помилка завантаження .step файлу з пробілами в назві',
      module: 'Слайсер / Завантаження',
      severity: 'Висока',
      status: 'Новий',
      description: 'Якщо назва файлу містить пробіли, файл не прикріплюється до заявки.',
      reporter: 'Максим С.',
      createdAt: '25.11.2026',
    },
  ],
}

export function formatToday(): string {
  const now = new Date()
  return `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`
}

export function readDb(): DatabaseState {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DB, null, 2), 'utf-8')
    return structuredClone(INITIAL_DB)
  }
  const raw = fs.readFileSync(DB_PATH, 'utf-8')
  return JSON.parse(raw) as DatabaseState
}

export function writeDb(state: DatabaseState): void {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2), 'utf-8')
}

export function createOrder(input: {
  customerName: string
  contact: string
  partName: string
  fileName?: string
  materialId: string
  estimatedGrams: number
  quantity: number
}): PrintOrder {
  const db = readDb()
  const material = db.materials.find((m) => m.id === input.materialId) ?? db.materials[0]
  const grams = Math.max(5, Number(input.estimatedGrams) || 35)
  const qty = Math.max(1, Number(input.quantity) || 1)
  const setupFee = 50
  const totalPriceUah = Math.round(grams * qty * material.pricePerGramUah + setupFee)

  const order: PrintOrder = {
    id: `ORD-${101 + db.orders.length}`,
    customerName: input.customerName.trim(),
    contact: input.contact.trim(),
    partName: input.partName.trim(),
    fileName: (input.fileName ?? '').trim() || 'model.stl',
    materialId: material.id,
    estimatedGrams: grams,
    quantity: qty,
    totalPriceUah,
    status: 'Новий',
    createdAt: formatToday(),
  }

  db.orders.unshift(order)
  writeDb(db)
  return order
}

export function updateOrderStatus(id: string, status: OrderStatus): PrintOrder | null {
  const db = readDb()
  const target = db.orders.find((o) => o.id === id)
  if (!target) return null
  target.status = status
  writeDb(db)
  return target
}

export function createBug(input: {
  title: string
  module?: string
  severity?: BugSeverity
  description: string
  reporter?: string
}): BugReport {
  const db = readDb()
  const nextNum = db.bugs.length + 1
  const bug: BugReport = {
    id: `BUG-${String(nextNum).padStart(2, '0')}`,
    title: input.title.trim(),
    module: input.module?.trim() || 'Веб-сайт',
    severity: input.severity ?? 'Середня',
    status: 'Новий',
    description: input.description.trim(),
    reporter: input.reporter?.trim() || 'Користувач',
    createdAt: formatToday(),
  }

  db.bugs.unshift(bug)
  writeDb(db)
  return bug
}

export function updateBugStatus(id: string, status: BugStatus): BugReport | null {
  const db = readDb()
  const target = db.bugs.find((b) => b.id === id)
  if (!target) return null
  target.status = status
  writeDb(db)
  return target
}
