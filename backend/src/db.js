import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";

dotenv.config();

// ვამოწმებთ, საერთოდ არსებობს თუ არა ცვლადი
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "❌ ERROR: DATABASE_URL is NOT DEFINED! Check Render Environment Variables."
  );
} else {
  // უსაფრთხოდ გამოგვაქვს ნაწილი, რომ დავინახოთ, კითხულობს თუ არა
  console.log(
    "✅ Database URL found, starts with:",
    connectionString.substring(0, 20)
  );
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
