# SoVI Backend - Quick Start

## Prerequisites
- Node.js 18+
- PostgreSQL database
- npm 9+

## Quick Start

### Option 1: Automated Setup
```bash
npm run setup
```

### Option 2: Manual Setup
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

## Environment Setup

1. Update `.env` file with your database credentials:
```
DATABASE_URL="postgresql://username:password@localhost:5432/sovi_portal"
```

2. Run database migrations:
```bash
npx prisma migrate dev
```

## Available Scripts

- `npm run setup` - Automated setup and start
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npx prisma studio` - Open database GUI

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/districts` - Get all districts
- `GET /api/sovi` - Get SoVI data

Server runs on: http://localhost:5001