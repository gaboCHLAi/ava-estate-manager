import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";

dotenv.config();

// ვიღებთ მისამართს
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  // SSL-ს ვრთავთ მხოლოდ მაშინ, როცა DATABASE_URL არსებობს და არის Supabase-ის
  ssl:
    (connectionString && connectionString.includes("supabase.com")) ||
    connectionString.includes("pooler.supabase.com")
      ? { rejectUnauthorized: false }
      : false,
});

// კავშირის შემოწმების ლოგი
pool.connect((err, client, release) => {
  if (err) {
    return console.error("❌ კავშირის შეცდომა:", err.message);
  }
  console.log("🚀 მონაცემთა ბაზა წარმატებით დაუკავშირდა!");
  release();
});

export default pool;
