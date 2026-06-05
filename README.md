# FinMate

<p align="center">
  <img src="docs/banner.png" width="100%" alt="FinMate Banner">
</p>

<p align="center">
  AI-Powered Personal Finance Tracker with Intelligent Expense Categorization
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success">
  <img src="https://img.shields.io/badge/Frontend-React-blue">
  <img src="https://img.shields.io/badge/Backend-Express-green">
  <img src="https://img.shields.io/badge/AI-TensorFlow-orange">
  <img src="https://img.shields.io/badge/Database-PostgreSQL-blue">
  <img src="https://img.shields.io/badge/License-MIT-orange">
</p>

---

# About

FinMate is an AI-powered personal finance tracking platform designed to help users monitor their spending habits and gain financial insights.

Unlike traditional expense trackers, users do not manually choose categories. Instead, FinMate automatically classifies expenses using a TensorFlow Deep Learning model served through a FastAPI microservice.

Example:

| Description          | Predicted Category            |
| -------------------- | ----------------------------- |
| fried chicken        | Food & Dining                 |
| gasoline refill      | Transportation                |
| school tuition       | Education                     |
| netflix subscription | Entertainment & Recreation    |

---

# Features

## Authentication

* User Registration
* User Login
* JWT Authentication
* Remember Me (30 Days)
* Protected Routes
* Automatic Logout on Token Expiration

## Expense Management

* Add Expense
* Edit Expense
* Delete Expense (Soft Delete)
* Expense History
* User-Specific Data Isolation

## AI Categorization

Users only provide:

* Description
* Amount
* Transaction Date

FinMate automatically:

* Predicts Expense Category
* Stores Confidence Score
* Records Prediction Source
* Falls back to Rule-Based Classification if AI Service is unavailable

## Analytics

* Total Spending
* Total Transactions
* Top Spending Category
* Monthly Spending Trends
* Category Distribution

## Security

* JWT Authentication
* Helmet Security Headers
* Express Rate Limiting
* Request Validation (Zod)
* Password Hashing (bcrypt)
* Protected API Routes
* CORS Restriction

---

# System Architecture

```text
Frontend (React + Vite)
          │
          ▼
Backend API (Express + Prisma)
          │
          ▼
FastAPI AI Service
          │
          ▼
TensorFlow Model
          │
          ▼
PostgreSQL
```

---

# AI Categorization Flow

```text
User Input
    │
    ▼
"fried chicken"
    │
    ▼
Backend API
    │
    ▼
FastAPI AI Service
    │
    ▼
TensorFlow Model
    │
    ▼
Food & Dining
    │
    ▼
Stored in PostgreSQL
```

---

# Tech Stack

## Frontend

| Technology   | Purpose                 |
| ------------ | ----------------------- |
| React        | UI Framework            |
| TypeScript   | Type Safety             |
| Vite         | Build Tool              |
| Tailwind CSS | Styling                 |
| Zustand      | State Management        |
| Axios        | HTTP Client             |
| Recharts     | Analytics Visualization |
| React Router | Routing                 |

---

## Backend

| Technology         | Purpose          |
| ------------------ | ---------------- |
| Node.js            | Runtime          |
| Express.js         | API Server       |
| Prisma             | ORM              |
| PostgreSQL         | Database         |
| JWT                | Authentication   |
| Zod                | Validation       |
| Bcrypt             | Password Hashing |
| Helmet             | Security Headers |
| Express Rate Limit | Rate Limiting    |

---

## AI Service & Data Science

| Technology | Purpose                            |
| ---------- | ---------------------------------- |
| FastAPI    | AI Inference API                   |
| TensorFlow | Deep Learning Model                |
| NumPy      | Data Processing                    |
| Joblib     | Label Encoder Loader               |
| Streamlit  | Data Science Analytics Dashboard   |
| Plotly     | Interactive Data Visualization     |
| Pandas     | Data Manipulation & Aggregation    |

---

# AI Model

FinMate uses a custom TensorFlow text classification model trained on transaction descriptions.

### Model Information

* Framework: TensorFlow / Keras
* Task: Multi-Class Text Classification
* Categories: 8
* Input: Transaction Description
* Output: Expense Category
* Confidence Score: Stored in Database

### Supported Categories

* Food & Dining
* Transportation
* Shopping & Retail
* Entertainment & Recreation
* Utilities & Services
* Healthcare & Medical
* Education
* Others

---

# Project Structure

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
├── ai-service/
│   ├── data-science/
│   │   ├── app.py
│   │   ├── data_preparation.py
│   │   ├── data/
│   │   ├── requirements.txt
│   │   └── FINMATE_Capstone_Proyek.ipynb
│   ├── model/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── docs/
│
├── docker-compose.yml
│
└── README.md
```

---

# Installation

## Prerequisites

Install:

* Node.js 20+
* PostgreSQL 15+
* Python 3.10+
* Git

Verify installation:

```bash
node -v
npm -v
python --version
psql --version
```

---

# Clone Repository

```bash
git clone https://github.com/Fikriansyah000/FINMATE.git

cd FINMATE
```

---

# Backend Setup

```bash
cd backend

npm install
```

Create `.env`

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/finmate"

JWT_SECRET="your-secret-key"

JWT_EXPIRES_IN="1d"

PORT=5000

AI_SERVICE_URL=http://localhost:8000

FRONTEND_URL=http://localhost:5173
```

Generate Prisma Client:

```bash
npx prisma generate
```

Push schema:

```bash
npx prisma db push
```

Seed categories:

```bash
npm run db:seed
```

Start backend:

```bash
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

---

# AI Service Setup

Navigate to AI Service:

```bash
cd ai-service
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## AI Model Setup

Create:

```text
ai-service/model/
```

Place the following files inside:

```text
best_finmate_expense_classifier.keras
label_encoder.pkl
```

Required structure:

```text
ai-service/
└── model/
    ├── best_finmate_expense_classifier.keras
    └── label_encoder.pkl
```

Without these files the AI Service will not start.

Run AI Service:

```bash
uvicorn main:app --reload --port 8000
```

Health Check:

```bash
curl http://localhost:8000/health
```

Expected:

```json
{
  "status": "ok",
  "service": "finmate-ai-service"
}
```

Prediction Test:

```bash
curl -X POST http://localhost:8000/predict \
-H "Content-Type: application/json" \
-d "{\"description\":\"fried chicken\"}"
```

---

# Data Science & Dashboard Setup

The Data Science module is an interactive Streamlit dashboard that provides an in-depth analysis of credit card transaction behavior, spending categorization, anomaly/fraud detection patterns, and NLP model performance.

Navigate to the Data Science module:

```bash
cd ai-service/data-science
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Run the Streamlit Dashboard:

```bash
streamlit run app.py
```

The application will launch on your default web browser, usually at:
```text
http://localhost:8501
```

**Features included in the Dashboard:**
- **Overview:** General summary, KPIs, and demographic distributions.
- **Spending Analysis:** Identifies primary spending habits and indicators of overspending.
- **Time Patterns & Fraud:** Detects financial risk patterns over time using specific data anomalies.
- **NLP Performance Evaluation:** Accuracy and classification report for the Logistic Regression & Naive Bayes models developed in the Capstone notebook.

---

# Frontend Setup

```bash
cd frontend

npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Run frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# Docker Setup

Run the entire stack:

```bash
docker-compose up --build
```

Services:

* Frontend
* Backend
* PostgreSQL
* AI Service

---

# API Endpoints

## Authentication

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /auth/register |
| POST   | /auth/login    |

---

## Expenses

| Method | Endpoint      |
| ------ | ------------- |
| GET    | /expenses     |
| POST   | /expenses     |
| PATCH  | /expenses/:id |
| DELETE | /expenses/:id |

---

## Analytics

| Method | Endpoint              |
| ------ | --------------------- |
| GET    | /analytics/summary    |
| GET    | /analytics/categories |
| GET    | /analytics/monthly    |

---

# Authentication

Protected endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Remember Me

Enabled:

```text
JWT expires in 30 days
```

Disabled:

```text
JWT expires in 1 day
```

---

# Screenshots

## Login

<p align="center">
  <img src="docs/login.jpg" width="85%">
</p>

## Dashboard

<p align="center">
  <img src="docs/dashboard.jpg" width="85%">
</p>

## History

<p align="center">
  <img src="docs/history.jpg" width="85%">
</p>

## Analytics

<p align="center">
  <img src="docs/analytics.jpg" width="85%">
</p>

---

# Roadmap

## MVP

* [x] Authentication
* [x] Expense CRUD
* [x] Analytics Dashboard
* [x] AI Categorization
* [x] TensorFlow Integration

## Next Release

* [ ] Forgot Password
* [ ] Email Verification
* [ ] Behavioral Insights Engine
* [ ] Spending Recommendation Engine
* [ ] User Category Correction

---

# Team

Developed as part of the **DBS Foundation Coding Camp Capstone Project**.

Team: **FinMate**

---

# License

MIT License © FinMate Team
