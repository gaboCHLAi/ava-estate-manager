import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";

dotenv.config(); // აუცილებელია, რომ db.js-მაც დაინახოს .env

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1); // სერვერი გადაიტვირთება და თავიდან დაუკავშირდება
});
export default pool;
