# FinMate Backend

Backend API for the FinMate application.

## Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL database

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment variables:
   Copy `.env.example` to `.env` and update the values.
   ```bash
   cp .env.example .env
   ```

3. Database setup:
   ```bash
   npm run prisma:generate
   npm run prisma:push
   npm run db:seed
   ```

## Development
To start the server in development mode:
```bash
npm run dev
```

## Production
To build and start the server:
```bash
npm run build
npm run start
```
