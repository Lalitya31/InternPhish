# InternPhish Backend

Production-ready Node.js, Express, TypeScript, PostgreSQL, Prisma, and Zod API for internship scam reports.

## Features

- Submit internship scam reports with screenshot/PDF evidence.
- Search reports by company name, keyword, and fee range.
- Retrieve report details and related disputes.
- Auto-detect scam red flags and assign a risk score.
- Submit disputes for incorrectly reported internships.
- Stats endpoint.
- Pagination, validation, centralized errors, Helmet, CORS, rate limiting, Multer uploads.
- Docker-ready PostgreSQL and API setup.

## Setup

```bash
cd backend
npm install
cp .env.example .env
docker compose up -d postgres
npm run prisma:migrate
npm run dev
```

API base URL:

```text
http://localhost:4000/api/v1
```

## Scripts

```bash
npm run dev             # Start TypeScript dev server
npm run build           # Compile to dist
npm start               # Run compiled server
npm run lint            # Type-check
npm run prisma:migrate  # Create/apply local migrations
npm run prisma:deploy   # Apply migrations in production
```

## Docker

```bash
cd backend
docker compose up --build
```

The API starts on `http://localhost:4000`. Uploaded files are stored in the `uploads` Docker volume.

## Endpoints

### Health

`GET /api/v1/health`

### Submit Report

`POST /api/v1/reports`

Use `multipart/form-data`.

Fields: `companyName`, `internshipTitle`, `description`, optional `scamType`, `feeAmount`, `currency`, `contactEmail`, `contactPhone`, `websiteUrl`, `reporterName`, `reporterEmail`, `location`, and up to five `screenshots` files.

### Search Reports

`GET /api/v1/reports?companyName=Acme&q=training&minFee=10&maxFee=500&page=1&limit=20`

### Report Details

`GET /api/v1/reports/:id`

### Submit Dispute

`POST /api/v1/reports/:reportId/disputes`

Use `multipart/form-data`.

Fields: `submitterName`, `submitterEmail`, `reason`, and optional `screenshots`.

### Stats

`GET /api/v1/reports/stats`

## Environment

See `.env.example`.

`DATABASE_URL` is required. `CORS_ORIGIN` accepts `*` or a comma-separated list of allowed origins.

## Postman

Import `postman/InternPhish.postman_collection.json`. The collection uses `{{baseUrl}}`, defaulting to `http://localhost:4000/api/v1`.
