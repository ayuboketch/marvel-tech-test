# Marvel Characters

<img width="1680" height="968" alt="Screenshot 2025-09-29 at 17 43 33" src="https://github.com/user-attachments/assets/34422310-c5d8-4387-ac41-42d887bb36d1" />

A tiny full-stack demo that answers **both** interview questions:

1. Paginated, responsive gallery of Marvel characters (React + Vite).  
2. Drag-and-drop Excel upload that bulk-inserts rows into SQLite (Express).

---

## What it does
- Fetches 50 Marvel heroes at a time via the official Marvel REST API.  
- Caches each page for 10 min in memory → faster reloads.  
- Resize your browser: cards collapse to single column (mobile-first CSS).  

---

## Stack
**Front-end**: React 18, Vite, TypeScript  
**Back-end**: Node 20, Express, better-sqlite3, SheetJS  
**Hosting**: React → Netlify, API → Render (or any Node host).

---

## 30-second try-out
```bash
npm install

npm start          # API :4000  +  Vite :5173
```
Open [localhost:5173](http://localhost:5173) – browse heroes, then hit **Upload** tab.

---

## Deploy
1. Push repo.  
2. Set env vars (`MARVEL_PUBLIC_KEY`, `MARVEL_PRIVATE_KEY`, `PORT`).  
3. Build Command: `npm install` (no build needed for the API).  
4. Update front-end `.env` to point at the live backend → rebuild.

---

## Folder map
```
├─ server/          # Express + SQLite
├─ src/             # React pages & components
├─ public/          # static assets
└─ uploads/         # temp Excel files (git-ignored)
```

That’s it – clone, run, deploy.  

```
