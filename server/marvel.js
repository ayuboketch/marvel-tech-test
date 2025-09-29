import axios from "axios";
import crypto from "crypto";

const { MARVEL_PUBLIC_KEY, MARVEL_PRIVATE_KEY } = process.env;
const base = "https://gateway.marvel.com/v1/public";

export function url(path, extra = {}) {
  const ts = Date.now();
  const hash = crypto
    .createHash("md5")
    .update(ts + MARVEL_PRIVATE_KEY + MARVEL_PUBLIC_KEY)
    .digest("hex");
  const params = new URLSearchParams({
    ts,
    apikey: MARVEL_PUBLIC_KEY,
    hash,
    ...extra,
  });
  return `${base}${path}?${params}`;
}
