# Marvel + Upload Tech Test

## Setup

1. `npm install`
2. Add `.env` with Marvel keys
3. `npm run dev`

## Features

- Responsive character grid with pagination
- 10-minute in-memory cache for Marvel calls
- Excel upload endpoint that bulk-inserts into SQLite

## Run tests

No automated tests for scope, but manual checks:

- Resize browser: grid collapses to single column
- Upload `data.xlsx`: row count echoed back
