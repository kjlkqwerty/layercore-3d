# Діаграми проєкту LayerCore 3D

> Система охоплює 4 основні функції IT-фірми з 3D-друку: **вибір пластику**, **вирішення простих проблем**, **прийом замовлень на деталі** та **прийом помилок в ПЗ** (без надання рецептів кави).

---

## 1. Загальна архітектура системи

```mermaid
flowchart LR
    User["Користувач"]

    subgraph Front["Frontend (React + TypeScript)"]
        Site["Веб-сайт (4 основні модулі)"]
        Bot["Чат-бот помічник"]
    end

    subgraph Back["Backend API"]
        MatAPI["Підбір пластику"]
        DiagAPI["База знань проблем"]
        OrderAPI["Прийом замовлень"]
        BugAPI["Прийом помилок ПЗ"]
    end

    DB[("База даних та файли 3D-моделей")]

    User --> Site
    User --> Bot
    Site --> Back
    Bot --> Back
    Back --> DB
```

---

## 2. Схема основних бізнес-процесів

```mermaid
flowchart TD
    Start(["Вхід користувача на сайт або в бот"]) --> Choice{"Оберіть задачу"}

    Choice -->|"Вибір пластику"| P1["Вказати призначення деталі"]
    P1 --> P2["Отримати рекомендований пластик (PLA / PETG / ABS / ASA / TPU)"]
    P2 --> P3["Перейти до замовлення з обраним пластиком"]

    Choice -->|"Проблема 3D-друку"| T1["Знайти симптом (відклеювання, нитки, зсув шарів)"]
    T1 --> T2["Виконати прості кроки налаштування"]

    Choice -->|"Замовлення деталі"| O1["Завантажити STL / STEP і вказати вагу та кількість"]
    O1 --> O2["Розрахунок орієнтовної вартості та збереження в чергу"]

    Choice -->|"Помилка в ПЗ"| B1["Описати збій на сайті або в боті"]
    B1 --> B2["Створити заявку BUG-XX для розробників"]
```

---

## 3. Діаграма послідовності: замовлення деталі та реєстрація помилки ПЗ

```mermaid
sequenceDiagram
    actor User as Користувач
    participant UI as Сайт / Бот-помічник
    participant API as Backend API
    participant DB as База даних

    Note over User,DB: Сценарій 1: Прийом замовлення на деталь
    User->>UI: Завантажує 3D-файл, обирає пластик і кількість
    UI-->>User: Показує орієнтовну вартість (₴)
    User->>UI: Надсилає замовлення
    UI->>API: POST /orders
    API->>DB: Зберігає замовлення зі статусом "Новий"
    API-->>UI: Підтвердження ORD-XXX

    Note over User,DB: Сценарій 2: Прийом помилки в ПЗ
    User->>UI: Описує помилку в ПЗ через форму або чат-бота
    UI->>API: POST /bugs
    API->>DB: Зберігає баг зі статусом "Новий"
    API-->>UI: Номер заявки BUG-XX
```

---

## 4. ER-діаграма бази даних

```mermaid
erDiagram
    MATERIALS ||--o{ ORDERS : "використовується_в"

    MATERIALS {
        string id PK
        string name
        float price_per_gram
        string nozzle_temp
        string bed_temp
        int heat_limit_c
    }

    TROUBLESHOOT_CASES {
        string id PK
        string title
        string symptom
        string cause
        text solution
    }

    ORDERS {
        string id PK
        string customer_name
        string contact
        string part_name
        string file_name
        string material_id FK
        int quantity
        int total_price_uah
        string status
    }

    BUG_REPORTS {
        string id PK
        string title
        string module
        string severity
        string status
        text description
        string reporter
    }
```
