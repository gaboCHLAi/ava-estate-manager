import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";

dotenv.config();

// პრიორიტეტს ვანიჭებთ DATABASE_URL-ს, რომელიც Render-ზე გვაქვს
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    // ეს აუცილებელია Render-ისთვის, რომ კავშირი არ გაწყდეს
    rejectUnauthorized: false,
  },
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
