import type { BugReport, MaterialSpec, PrintOrder, TroubleshootCase } from '../types'

export const MATERIALS: MaterialSpec[] = [
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
]

export const TROUBLESHOOT_CASES: TroubleshootCase[] = [
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
]

export const INITIAL_ORDERS: PrintOrder[] = [
  {
    id: 'ORD-101',
    customerName: 'ТОВ «СкайРоботікс»',
    contact: '@skyrobotics',
    partName: 'Корпус контролера',
    fileName: 'controller_case.stl',
    materialId: 'asa',
    estimatedGrams: 45,
    quantity: 2,
    totalPriceUah: 568,
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
    totalPriceUah: 556,
    status: 'Новий',
    createdAt: '25.11.2026',
  },
]

export const INITIAL_BUGS: BugReport[] = [
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
]
