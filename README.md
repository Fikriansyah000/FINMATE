# 💰 FinMate

<p align="center">
  <img src="docs/banner.png" width="100%" alt="FinMate Banner">
</p>

<p align="center">
  Personal Finance Tracker with Intelligent Expense Categorization
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success">
  <img src="https://img.shields.io/badge/Frontend-React-blue">
  <img src="https://img.shields.io/badge/Backend-Express-green">
  <img src="https://img.shields.io/badge/Database-PostgreSQL-blue">
  <img src="https://img.shields.io/badge/License-MIT-orange">
</p>

---

## 📖 About

FinMate is a modern personal finance tracking platform designed to help users monitor their spending habits and gain financial insights.

Unlike traditional expense trackers, users **do not manually choose categories**. Instead, FinMate automatically classifies expenses based on the description entered by the user.

Example:

| Description        | Predicted Category |
| ------------------ | ------------------ |
| Beli ayam geprek   | 🍜 Makanan         |
| Isi bensin motor   | ⛽ Transportasi    |
| Bayar UKT semester | 🎓 Pendidikan      |

---

# ✨ Features

### 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes

### 💸 Expense Management

- Add Expense
- Edit Expense
- Delete Expense (Soft Delete)
- Expense History

### 🤖 Intelligent Categorization

Users only input:

- Description
- Amount
- Transaction Date

FinMate automatically predicts the category.

### 📊 Analytics

- Total Spending
- Total Transactions
- Top Category
- Monthly Spending Trend
- Category Distribution

---

# 🏗️ System Architecture

```text
Frontend (React)
        │
        ▼
Backend API (Express)
        │
        ▼
ExpenseClassifierService
        │
        ▼
PostgreSQL
```

Future AI Architecture:

```text
Frontend (React)
        │
        ▼
Backend API (Express)
        │
        ▼
FastAPI AI Service
        │
        ▼
PostgreSQL
```

---

# 🛠️ Tech Stack

## Frontend

| Technology  | Purpose                 |
| ----------- | ----------------------- |
| React       | UI Framework            |
| TypeScript  | Type Safety             |
| Vite        | Build Tool              |
| TailwindCSS | Styling                 |
| Zustand     | State Management        |
| Axios       | HTTP Client             |
| Recharts    | Analytics Visualization |

## Backend

| Technology | Purpose          |
| ---------- | ---------------- |
| Node.js    | Runtime          |
| Express.js | API Server       |
| Prisma     | ORM              |
| PostgreSQL | Database         |
| JWT        | Authentication   |
| Zod        | Validation       |
| Bcrypt     | Password Hashing |

## Future AI

| Technology          | Purpose            |
| ------------------- | ------------------ |
| FastAPI             | AI API             |
| Scikit-Learn        | Classification     |
| TF-IDF              | Feature Extraction |
| Logistic Regression | Prediction         |

---

# 📂 Project Structure

```text
finmate/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── prisma/
│   ├── src/
│   └── package.json
│
└── README.md
```

---

# 🗄️ Database Design

## User

```text
User
├── id
├── name
├── email
├── passwordHash
├── isVerified
└── createdAt
```

## Category

```text
Category
├── id
├── name
└── description
```

## Expense

```text
Expense
├── id
├── userId
├── categoryId
├── description
├── amount
├── transactionDate
├── aiConfidence
└── predictionSource
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/Fikriansyah000/FINMATE.git
cd finmate
```

---

## Backend Setup

```bash
cd backend

npm install

cp .env.example .env

npx prisma generate

npx prisma db push

npm run db:seed

npm run dev
```

Backend:

```text
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔑 Environment Variables

## Backend

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
PORT=
```

## Frontend

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /auth/register |
| POST   | /auth/login    |

## Expenses

| Method | Endpoint      |
| ------ | ------------- |
| GET    | /expenses     |
| POST   | /expenses     |
| PATCH  | /expenses/:id |
| DELETE | /expenses/:id |

## Analytics

| Method | Endpoint              |
| ------ | --------------------- |
| GET    | /analytics/summary    |
| GET    | /analytics/categories |
| GET    | /analytics/monthly    |

---

# 📸 Screenshots

## Login

<img src="docs/login.png">

## Dashboard

<img src="docs/dashboard.png">

## History

<img src="docs/history.png">

## Analytics

<img src="docs/analytics.png">

---

# 🗺️ Roadmap

## MVP

- [x] Authentication
- [x] Expense CRUD
- [x] Rule-Based Categorization
- [x] Analytics Dashboard

## Next Release

- [ ] Category Correction
- [ ] Dataset Collection
- [ ] Dataset Export

## AI Release

- [ ] FastAPI AI Service
- [ ] Machine Learning Classifier
- [ ] Confidence Scoring
- [ ] Behavioral Insights

---

# 👥 Team

Developed as part of the **DBS Foundation Coding Camp Capstone Project**.

Team: **FinMate**

---

# 📄 License

MIT License © FinMate Team
