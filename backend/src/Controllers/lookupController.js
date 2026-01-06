// Controllers/lookupController.js
import pool from "../db.js";

export const getStatuses = async (req, res) => {
  // 1. ვიღებთ ენას Query-დან (მაგ: /deal_type?lang=en)
  const lang = req.query.lang || "ka";

  // 2. ვწყვეტთ რომელი სვეტი წამოვიდეს
  const col = lang === "en" ? "name_en" : "name";

  try {
    // 3. ვიყენებთ AS name-ს, რომ JSON-ში ყოველთვის "name" ერქვას გასაღებს
    const result = await pool.query(
      `SELECT id, ${col} AS name FROM deal_type ORDER BY id`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPropertyTypes = async (req, res) => {
  const lang = req.query.lang || "ka";
  const col = lang === "en" ? "name_en" : "name";

  try {
    const result = await pool.query(
      `SELECT id, ${col} AS name FROM property_type ORDER BY id`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCities = async (req, res) => {
  const lang = req.query.lang || "ka";
  const col = lang === "en" ? "name_en" : "name";

  try {
    // ქალაქების შემთხვევაშიც name_en უნდა გქონდეს ბაზაში (მაგ: Tbilisi, Batumi)
    const result = await pool.query(
      `SELECT id, ${col} AS name, place_id, neighbourhood FROM cities ORDER BY id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getBuildigCondiotios = async (req, res) => {
  const lang = req.query.lang || "ka";
  const col = lang === "en" ? "name_en" : "name";

  try {
    const result = await pool.query(
      `SELECT id, ${col} AS name FROM status ORDER BY id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getRepairStatuses = async (req, res) => {
  const lang = req.query.lang || "ka";
  const col = lang === "en" ? "name_en" : "name";

  try {
    const result = await pool.query(
      `SELECT id, ${col} AS name FROM condition ORDER BY id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
