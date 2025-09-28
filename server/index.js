import express from 'express';
import cors from 'cors';
import { url } from './marvel.js';
import { cache } from './cache.js';
import axios from 'axios';
import multer from 'multer';
import xlsx from 'xlsx';
import { bulkInsert } from './db.js';

const app = express();
const upload = multer({ dest: 'uploads/' });
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.get('/api/characters', async (req, res) => {
  const page = +req.query.page || 1;
  const limit = 50;
  const key = `chars:${page}`;

  if (cache.has(key)) return res.json(cache.get(key));

  try {
    const u = url('/characters', { offset: (page - 1) * limit, limit });
    const { data } = await axios.get(u);
    const payload = data.data.results.map(ch => ({
      id: ch.id,
      name: ch.name,
      thumbnail: `${ch.thumbnail.path}/standard_medium.${ch.thumbnail.extension}`,
    }));
    cache.set(key, payload);
    res.json(payload);
  } catch (e) {
    res.status(500).json({ error: 'Marvel API error' });
  }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    const book = xlsx.readFile(req.file.path);
    const sheet = book.Sheets[book.SheetNames[0]];
    const json = xlsx.utils.sheet_to_json(sheet, { defval: '' });
    const rows = json.map(r => ({ col_a: r.A, col_b: r.B, col_c: r.C }));
    bulkInsert(rows);
    res.json({ inserted: rows.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));