# SRM Full Stack Engineering Challenge

This repository contains a Next.js full-stack application for the SRM Full Stack Engineering Challenge.

## Overview

The application provides:

- A frontend interface to submit graph edge input.
- A backend API endpoint at `POST /bfhl`.
- Validation and graph processing for invalid entries, duplicate edges, tree/cycle grouping, and summary generation.

## Tech Stack

- Next.js (Pages Router)
- React
- Tailwind CSS

## API

### Endpoint

`POST /bfhl`

### Request Body

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

### Response

Returns identity fields, `hierarchies`, `invalid_entries`, `duplicate_edges`, and `summary` according to challenge requirements.

## Local Development

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Start development server on port 3001:

```bash
npm run dev:3001
```

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm run start
```

## Deployment

Deploy as a standard Next.js application.

- Frontend URL: your deployed domain
- Backend API Base URL: the same deployed domain
- API endpoint: `/bfhl`
