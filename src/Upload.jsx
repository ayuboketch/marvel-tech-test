export default function Upload() {
  const [msg, setMsg] = useState('');
  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const r = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
      method: 'POST', body: fd
    });
    const j = await r.json();
    setMsg(j.inserted ? `Inserted ${j.inserted} rows` : j.error);
  }
  return (
    <form onSubmit={onSubmit}>
      <input type="file" name="file" accept=".xlsx" required />
      <button>Upload</button>
      <p>{msg}</p>
    </form>
  );
}