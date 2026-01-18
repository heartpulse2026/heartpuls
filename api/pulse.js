import { Pool } from "pg";

export const config = { runtime: "nodejs18.x" };

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { device, bpm, signal } = req.body;
    if (!bpm) return res.status(400).json({ error: "Missing BPM" });

    await pool.query(
      "INSERT INTO pulse_data(device, bpm, signal) VALUES($1,$2,$3)",
      [device, bpm, signal]
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
