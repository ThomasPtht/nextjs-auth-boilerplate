# Next.js Auth Boilerplate

A full-stack authentication boilerplate built with Next.js 16, Prisma, PostgreSQL and Resend.

## Features

- Register with email verification
- Login / Logout
- JWT access token (15min) + refresh token rotation (7 days)
- Forgot password / Reset password
- Protected routes via middleware
- Global auth state via AuthContext

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **Database** — PostgreSQL + Prisma
- **Auth** — JWT (jsonwebtoken) + bcryptjs
- **Email** — Resend
- **Validation** — Zod + React Hook Form
- **UI** — shadcn/ui + Tailwind CSS

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/ton-pseudo/nextjs-auth-boilerplate
cd nextjs-auth-boilerplate
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in the values in `.env` (see below).

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable              | Description                         |
| --------------------- | ----------------------------------- |
| `DATABASE_URL`        | PostgreSQL connection string        |
| `JWT_SECRET`          | Secret key for access tokens        |
| `JWT_REFRESH_SECRET`  | Secret key for refresh tokens       |
| `RESEND_API_KEY`      | Resend API key                      |
| `NEXT_PUBLIC_APP_URL` | App URL (ex: http://localhost:3000) |

## Project Structure
app/
├── (auth)/               # Auth pages (login, register, forgot/reset password)
├── api/auth/             # API routes (register, login, logout, refresh, verify-email...)
├── context/              # AuthContext — global auth state
├── lib/                  # Utilities (prisma, jwt, auth, email, validations)
└── types/                # TypeScript types (DTOs)
middleware.ts             # Route protection
prisma/
└── schema.prisma         # Database schema

## How to Use in a New Project

Use the GitHub "Use this template" button to create a new repo based on this boilerplate.