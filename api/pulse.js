import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Neon
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { device, bpm, signal } = req.body;

    await pool.query(
      "INSERT INTO pulse_data(device, bpm, signal) VALUES($1,$2,$3)",
      [device, bpm, signal]
    );

    return res.status(200).json({ ok: true });
  }

  if (req.method === "GET") {
    const result = await pool.query(
      "SELECT bpm, signal, created_at FROM pulse_data ORDER BY id DESC LIMIT 200"
    );
    return res.status(200).json(result.rows.reverse());
  }
}
