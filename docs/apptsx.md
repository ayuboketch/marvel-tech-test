# src/App.tsx

The **App** component is the root UI of a React + TypeScript application. It fetches paginated Marvel characters and renders them in a responsive grid.

## 🔧 Dependencies & Environment

This file relies on:

- **React hooks**: `useState`, `useEffect`  
- **TypeScript** for static typing  
- **Vite** environment variables via `import.meta.env`  
- **CSS styling** imported from `./App.css`  

| Package       | Purpose                              |
|---------------|--------------------------------------|
| react         | UI library                           |
| react-dom     | DOM rendering                       |
| vite (env)    | Build tool and environment support   |

```tsx
import { useEffect, useState } from 'react';
import './App.css'
```

## 📦 Types & State Management

A simple TypeScript `type` defines the API data shape:

```ts
type Character = {
  id: number;
  name: string;
  thumbnail: string;
};
```

State variables:

- **chars** (`Character[]`): Stores the list of characters  
- **page** (`number`): Tracks current pagination page  

```tsx
const [chars, setChars] = useState<Character[]>([]);
const [page, setPage] = useState(1);
```

## 🔄 Data Fetching with useEffect

On every `page` change, `useEffect` triggers a fetch:

1. Builds URL: `${VITE_API_URL}/api/characters?page=${page}`  
2. Parses JSON response  
3. Updates `chars` state  

```tsx
useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/characters?page=${page}`)
    .then(r => r.json())
    .then(setChars);
}, [page]);
```

- **Dependency**: `[page]` ensures re-fetch on page updates  
- **Error handling**: Assumes valid JSON; expand with `.catch()` if needed

## 🖼️ Rendering the UI

The component returns a JSX structure:

```tsx
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
);
```

- **`.container`**: Wraps the entire app  
- **`.grid`**: Responsive grid layout  
- **`.card`**: Individual character display  

## 📊 Pagination Controls

Two buttons allow page navigation:

- **Prev**: Decrements `page`; disabled on page 1  
- **Next**: Increments `page`  

Button state logic:

| Button | Action                       | Disabled when      |
|--------|------------------------------|--------------------|
| Prev   | `setPage(p => p - 1)`        | `page === 1`       |
| Next   | `setPage(p => p + 1)`        | _never_            |

## 🎨 Styling (App.css)

Though not shown here, `App.css` likely defines:

- **.container**: Centering, max-width  
- **.grid**: `display: grid; grid-template-columns; gap`  
- **.card**: Box shadow, padding, hover effects  
- **footer**: Flex layout for buttons  

Adjust CSS for responsiveness and theming.

## 🌐 Environment Variable

Configure the API base URL in a `.env` file at project root:

```bash
VITE_API_URL=https://your-api-domain.com
```

Vite injects it via `import.meta.env.VITE_API_URL`.

## 🚀 Running the App

Install dependencies and start the development server:

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

Then:

```bash
npm run dev
```

---

**App.tsx** provides a clean, type-safe UI for browsing Marvel characters with simple pagination. Its modular design and environment-driven API endpoint make it easy to extend and theme.