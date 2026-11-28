# LayerCore 3D

Веб-платформа (Frontend + Backend API) для автоматизації процесів IT-фірми з 3D-друку:

- **Вибір пластику** (`PLA`, `PETG`, `ABS`, `ASA`, `TPU 95A`) за призначенням деталі
- **Вирішення простих проблем 3D-друку** (адгезія, павутиння, недоекструзія, зсув шарів)
- **Прийом замовлень на деталі** із розрахунком вартості на сервері
- **Прийом помилок у ПЗ** (через форму або вбудованого чат-бота)

Діаграми архітектури, бізнес-процесів, послідовності та БД знаходяться у [`docs/diagrams.md`](docs/diagrams.md).

## Backend API (`server/index.ts`)

- `GET /api/health` — стан сервера
- `GET /api/materials` — каталог пластиків (фільтр `?useCase=`)
- `GET /api/troubleshooting` — база знань проблем (пошук `?q=`)
- `GET /api/orders`, `POST /api/orders`, `PATCH /api/orders/:id/status` — прийом та статуси замовлень
- `GET /api/bugs`, `POST /api/bugs`, `PATCH /api/bugs/:id/status` — реєстрація та статуси помилок ПЗ
- `POST /api/bot/message` — обробка запитів чат-бота та прийом помилок у ПЗ

Дані зберігаються у JSON-файлі `server/data/db.json`.

## Запуск локально

```bash
npm install
npm run dev:all
```

Або окремо:
- Бекенд: `npm run server` (`http://127.0.0.1:3001`)
- Фронтенд: `npm run dev` (`http://127.0.0.1:5173`)
