# Architecture Overview

This project implements a **Marvel Characters Explorer** with a React frontend and an Express/Node.js backend. The frontend, built with Vite and React, fetches character data from the backend API, which in turn communicates with the Marvel public API and caches results. Uploaded Excel files are processed and stored in a SQLite database.  

```mermaid
C4Context
  title Marvel App - System Context

  Person(user, "User", "Browses Marvel characters and uploads data")
  System_Boundary(client, "Client") {
    Container(ui, "React UI", "React + Vite", "Interactive single-page application")
  }
  System_Boundary(api, "API") {
    Container(api_server, "Express API", "Node.js", "Handles character and upload endpoints")
    Container(cache, "In-Memory Cache", "node-cache", "Caches Marvel data for 10 min")
    Container(db, "SQLite DB", "better-sqlite3", "Stores uploaded rows")
  }
  System_Ext(marvel_api, "Marvel Public API", "External API for character data")

  user --> ui : Uses UI
  ui --> api_server : HTTP requests (/api/characters, /api/upload)
  api_server --> cache : Checks / sets cache
  api_server --> marvel_api : Fetches character data
  api_server --> db       : Inserts uploaded data
```

# ⚛️ src/main.tsx

This is the **entry point** of the React application. It mounts the root `<App />` component into the DOM in **StrictMode**. 

## Purpose
- Initializes React 18 root via `createRoot`.
- Wraps the app in `StrictMode` to highlight potential issues.
- Applies global styles from `index.css`.

## Key Imports

| Symbol         | Source                     | Role                                     |
| -------------- | -------------------------- | ---------------------------------------- |
| **StrictMode** | react                      | Activates additional checks              |
| **createRoot** | react-dom/client           | React 18 root API                        |
| **‘./index.css’** | Local CSS file           | Global styling                           |
| **App**        | ./App.tsx                  | Main application component               |

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
``` 

# 🖼️ src/App.tsx

This component displays a **paginated grid** of Marvel characters. It fetches data from `/api/characters?page={page}` and renders thumbnails and names. 

## Highlights
- Uses TypeScript for **type safety** (`Character` interface).
- Manages `chars` and `page` via React state.
- Auto-fetches on `page` change with `useEffect`.
- Renders a grid of `<article>` cards and **Prev/Next** navigation.

```tsx
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  type Character = {
    id: number
    name: string
    thumbnail: string
  }

  const [chars, setChars] = useState<Character[]>([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/characters?page=${page}`)
      .then(r => r.json())
      .then(setChars)
  }, [page])

  return (
    <main className="container">
      <h1>Marvel Characters</h1>
      <section className="grid">
        {chars.map(ch => (
          <article key={ch.id} className="card">
            <img src={ch.thumbnail} alt={ch.name} />
            <h3>{ch.name}</h3>
          </article>
        ))}
      </section>
      <footer>
        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
          Prev
        </button>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </footer>
    </main>
  )
}

export default App
```

# 📤 src/Upload.jsx

Provides a **file upload form** to send `.xlsx` files to `/api/upload`. It displays success/error messages based on the JSON response. 

- Uses native `FormData` for file posting.
- Shows feedback (`Inserted X rows` or error).

```jsx
export default function Upload() {
  const [msg, setMsg] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const r = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
      method: 'POST',
      body: fd
    })
    const j = await r.json()
    setMsg(j.inserted ? `Inserted ${j.inserted} rows` : j.error)
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="file" name="file" accept=".xlsx" required />
      <button>Upload</button>
      <p>{msg}</p>
    </form>
  )
}
```

# ⚙️ Configuration Files

## tsconfig.app.json  
TypeScript settings for the **client** build. 

- **target**: ES2022, **module**: ESNext  
- **jsx**: react-jsx  
- **strict** and linting options enabled  
- **include**: `src`

## tsconfig.node.json  
TypeScript for **server/Vite** tooling. 

- **target**: ES2023  
- **include**: `vite.config.ts`

## tsconfig.json  
References both `tsconfig.app.json` and `tsconfig.node.json`. 

## vite.config.ts  
Vite configuration with React plugin and `babel-plugin-react-compiler`. 

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
})
```

## eslint.config.js  
ESLint setup for `.ts`/`.tsx`, React hooks, and Vite refresh. 

## netlify.toml  
Deployment settings for Netlify. 

- **build**: `npm run build`, **publish**: `dist`  
- Omits sensitive keys from logs  

# 📄 HTML Template

## index.html  
Loads the React bundle into `<div id="root">` via Vite’s dev server or build. 

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>marvel-app</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

# 🔧 Backend (server/)

## server/package.json  
Defines the **Marvel API** service dependencies and scripts. 

- **express**, **cors**, **axios**, **node-cache**, **better-sqlite3**, **multer**, **xlsx**  
- **nodemon** for live reload

## server/index.js  
Express server exposing two endpoints: `/api/characters` and `/api/upload`. 

- **GET /api/characters**:  
  - Paginates and caches Marvel data via `node-cache` (TTL 600s).  
  - Transforms Marvel API payload to `{ id, name, thumbnail }`.  
- **POST /api/upload**:  
  - Accepts Excel file, converts to JSON, bulk inserts into SQLite.  
- Serves static `public/` assets and logs on `port`.

```js
app.get("/api/characters", async (req, res) => { ... })
app.post("/api/upload", upload.single("file"), (req, res) => { ... })
app.listen(port, () => console.log(`Listening on port ${port}`))
```

## server/cache.js  
Creates a `NodeCache` instance with 10-minute TTL for Marvel data.

```js
import NodeCache from 'node-cache'
export const cache = new NodeCache({ stdTTL: 600 })
```

## server/db.js  
Sets up a SQLite database, applies `schema.sql`, and exports `bulkInsert`.  

```js
import Database from "better-sqlite3"
... 
export function bulkInsert(rows) { ... }
```

## server/marvel.js  
Utility to build signed Marvel API URLs with MD5 hash. 

```js
export function url(path, extra = {}) {
  const ts = Date.now()
  const hash = crypto
    .createHash("md5")
    .update(ts + PRIVATE + PUBLIC)
    .digest("hex")
  return `https://gateway.marvel.com/v1/public${path}?ts=${ts}&apikey=${PUBLIC}&hash=${hash}&...`
}
```

## db/schema.sql  
Defines the `upload_rows` table schema. 

```sql
CREATE TABLE IF NOT EXISTS upload_rows (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  col_a   TEXT,
  col_b   TEXT,
  col_c   TEXT
);
```

# 📦 Package Installation

```packagemanagers
{
  "commands": {
    "npm": "npm install",
    "yarn": "yarn",
    "pnpm": "pnpm install",
    "bun": "bun install"
  }
}
```

# 🔗 API Endpoints

```api
{
  "title": "List Marvel Characters",
  "description": "Fetches a paginated list of Marvel characters, with caching.",
  "method": "GET",
  "baseUrl": "http://localhost:4000",
  "endpoint": "/api/characters",
  "headers": [],
  "queryParams": [
    { "key": "page", "value": "Page number", "required": false }
  ],
  "pathParams": [],
  "bodyType": "none",
  "responses": {
    "200": {
      "description": "Array of characters",
      "body": "[\n  {\"id\": 1011334, \"name\": \"3-D Man\", \"thumbnail\": \"...\"},\n  {...}\n]"
    },
    "500": {
      "description": "Server error",
      "body": "{ \"error\": \"Details\" }"
    }
  }
}
```

```api
{
  "title": "Upload Excel File",
  "description": "Accepts an Excel file and stores row data into SQLite DB.",
  "method": "POST",
  "baseUrl": "http://localhost:4000",
  "endpoint": "/api/upload",
  "headers": [
    { "key": "Content-Type", "value": "multipart/form-data", "required": true }
  ],
  "queryParams": [],
  "pathParams": [],
  "bodyType": "form",
  "formData": [
    { "key": "file", "value": ".xlsx file", "required": true }
  ],
  "responses": {
    "200": {
      "description": "Number of rows inserted",
      "body": "{ \"inserted\": 42 }"
    },
    "500": {
      "description": "Server error",
      "body": "{ \"error\": \"Error message\" }"
    }
  }
}
```

---

This documentation outlines each file’s role, interactions, and key patterns within the **Marvel Tech Test** codebase. It should serve as a comprehensive reference for both frontend and backend components.