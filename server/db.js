import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbDir = join(__dirname, "..", "db");
mkdirSync(dbDir, { recursive: true }); // ensure folder exists
const db = new Database(join(dbDir, "data.db"));
