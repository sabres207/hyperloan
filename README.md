# Hyperloan

Full-stack web application for managing bullet loans and their repayment schedules.

## Tech Stack

- **Frontend:** React, React Router, Apollo Client, Styled Components, Vite
- **Backend:** Node.js, Apollo Server, TypeORM, SQLite
- **Language:** TypeScript
- **Code Generation:** GraphQL Codegen

## Prerequisites

- Node.js >= 18

## Getting Started

```bash
# 1. Install all dependencies (client + server)
npm install

# 2. Generate TypeScript types from the GraphQL schema
npm run codegen

# 3. Run database migrations
npm run migrate

# 4. Start both client and server in dev mode
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:4000
