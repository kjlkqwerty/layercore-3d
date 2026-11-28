import cors from 'cors'
import express from 'express'
import type { BugSeverity, BugStatus, MaterialUseCase, OrderStatus, TabId } from '../src/types/index.ts'
import {
  createBug,
  createOrder,
  readDb,
  updateBugStatus,
  updateOrderStatus,
} from './store.ts'

const app = express()
const PORT = Number(process.env.PORT || 3001)

app.use(cors())
app.use(express.json())

const ORDER_STATUSES: OrderStatus[] = ['Новий', 'В роботі', 'Готово']
const BUG_STATUSES: BugStatus[] = ['Новий', 'В роботі', 'Вирішено']
const BUG_SEVERITIES: BugSeverity[] = ['Висока', 'Середня', 'Низька']

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'layercore-3d-api' })
})

app.get('/api/materials', (req, res) => {
  const useCase = req.query.useCase as MaterialUseCase | undefined
  const db = readDb()
  const materials = useCase
    ? db.materials.filter((m) => m.useCases.includes(useCase))
    : db.materials
  res.json(materials)
})

app.get('/api/troubleshooting', (req, res) => {
  const q = String(req.query.q ?? '').trim().toLowerCase()
  const db = readDb()
  const cases = q
    ? db.troubleshooting.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.symptom.toLowerCase().includes(q) ||
          c.cause.toLowerCase().includes(q),
      )
    : db.troubleshooting
  res.json(cases)
})

app.get('/api/orders', (_req, res) => {
  const db = readDb()
  res.json(db.orders)
})

app.post('/api/orders', (req, res) => {
  const { customerName, contact, partName, fileName, materialId, estimatedGrams, quantity } =
    req.body ?? {}

  if (!customerName || !contact || !partName || !materialId) {
    res.status(400).json({ error: 'Заповніть обов’язкові поля: замовник, контакт, назва деталі та матеріал.' })
    return
  }

  const order = createOrder({
    customerName: String(customerName),
    contact: String(contact),
    partName: String(partName),
    fileName: fileName ? String(fileName) : undefined,
    materialId: String(materialId),
    estimatedGrams: Number(estimatedGrams),
    quantity: Number(quantity),
  })

  res.status(201).json(order)
})

app.patch('/api/orders/:id/status', (req, res) => {
  const status = req.body?.status as OrderStatus
  if (!ORDER_STATUSES.includes(status)) {
    res.status(400).json({ error: 'Некоректний статус замовлення.' })
    return
  }

  const updated = updateOrderStatus(req.params.id, status)
  if (!updated) {
    res.status(404).json({ error: 'Замовлення не знайдено.' })
    return
  }

  res.json(updated)
})

app.get('/api/bugs', (_req, res) => {
  const db = readDb()
  res.json(db.bugs)
})

app.post('/api/bugs', (req, res) => {
  const { title, module, severity, description, reporter } = req.body ?? {}

  if (!title || !description) {
    res.status(400).json({ error: 'Вкажіть заголовок та опис помилки.' })
    return
  }

  const validSeverity: BugSeverity = BUG_SEVERITIES.includes(severity) ? severity : 'Середня'
  const bug = createBug({
    title: String(title),
    module: module ? String(module) : undefined,
    severity: validSeverity,
    description: String(description),
    reporter: reporter ? String(reporter) : undefined,
  })

  res.status(201).json(bug)
})

app.patch('/api/bugs/:id/status', (req, res) => {
  const status = req.body?.status as BugStatus
  if (!BUG_STATUSES.includes(status)) {
    res.status(400).json({ error: 'Некоректний статус помилки.' })
    return
  }

  const updated = updateBugStatus(req.params.id, status)
  if (!updated) {
    res.status(404).json({ error: 'Помилку не знайдено.' })
    return
  }

  res.json(updated)
})

app.post('/api/bot/message', (req, res) => {
  const text = String(req.body?.message ?? '').trim()
  const awaitingBugText = Boolean(req.body?.awaitingBugText)

  if (!text) {
    res.status(400).json({ error: 'Повідомлення не може бути порожнім.' })
    return
  }

  if (awaitingBugText) {
    const bug = createBug({
      title: text.slice(0, 60),
      module: 'Бот-помічник',
      severity: 'Середня',
      description: text,
      reporter: 'Через чат-бота',
    })

    res.json({
      reply: `Дякую! Помилку в ПЗ зареєстровано під номером ${bug.id}.`,
      actionTab: 'bugs' as TabId,
      actionLabel: 'Переглянути у списку помилок',
      awaitingBugText: false,
      createdBug: bug,
    })
    return
  }

  const q = text.toLowerCase()

  if (q.includes('кав') || q.includes('рецепт') || q.includes('еспресо') || q.includes('лате')) {
    res.json({
      reply: 'Рецепти кави не надаються. Працюю лише з 3D-друком (пластик, проблеми, замовлення) та помилками в ПЗ.',
      awaitingBugText: false,
    })
    return
  }

  if (q.includes('пластик') || q.includes('матеріал')) {
    res.json({
      reply: 'Для прототипів підійде PLA, для міцних деталей — PETG або ABS, для вулиці — ASA, для гнучких — TPU.',
      actionTab: 'materials' as TabId,
      actionLabel: 'Відкрити вибір пластику',
      awaitingBugText: false,
    })
    return
  }

  if (q.includes('проблем') || q.includes('відкле') || q.includes('нитки') || q.includes('зсув')) {
    res.json({
      reply: 'Маю базові інструкції щодо відклеювання, ниток, недоекструзії та зсуву шарів.',
      actionTab: 'troubleshooting' as TabId,
      actionLabel: 'Відкрити вирішення проблем',
      awaitingBugText: false,
    })
    return
  }

  if (q.includes('замов') || q.includes('деталь')) {
    res.json({
      reply: 'Оформити замовлення та дізнатись орієнтовну вартість можна у розділі «Замовлення».',
      actionTab: 'orders' as TabId,
      actionLabel: 'Перейти до замовлень',
      awaitingBugText: false,
    })
    return
  }

  if (q.includes('баг') || q.includes('помил') || q.includes('пз')) {
    res.json({
      reply: 'Напишіть одним повідомленням, яка саме помилка виникла в ПЗ — я одразу збережу її на сервері.',
      awaitingBugText: true,
    })
    return
  }

  res.json({
    reply: 'Оберіть одну з дій нижче або напишіть, що потрібно: пластик, проблема друку, замовлення чи помилка в ПЗ.',
    awaitingBugText: false,
  })
})

app.listen(PORT, '127.0.0.1', () => {
  console.log(`LayerCore 3D API listening on http://127.0.0.1:${PORT}`)
})
