import { useEffect, useState } from 'react';
import './App.css'

function App() {
  type Character = {
    id: number;
    name: string;
    thumbnail: string;
  };

  const [chars, setChars] = useState<Character[]>([]);
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
