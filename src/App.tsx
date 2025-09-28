import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { useEffect, useState } from 'react';

function App() {
  const [chars, setChars] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/characters?page=${page}`)
      .then(r => r.json())
      .then(setChars);
  }, [page]);

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
        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Prev</button>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </footer>
    </main>
  );
}
export default App;

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
