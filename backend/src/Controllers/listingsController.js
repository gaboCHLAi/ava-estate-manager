import pool from "../db.js";
import translate from "@vitalets/google-translate-api";
import crypto from "crypto";
import { supabase } from "../supabaseClient.js";
import multer from "multer";
export const sendOTP = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "ნომერი აუცილებელია" });
  }

  // 1. ვქმნით 4-ნიშნა შემთხვევით კოდს
  const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

  // 2. ვადა: ახლანდელ დროს დამატებული 5 წუთი
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  try {
    // 3. ვინახავთ ბაზაში
    await pool.query(
      "INSERT INTO otp_verifications (phone, code, expires_at) VALUES ($1, $2, $3)",
      [phone, otpCode, expiresAt],
    );

    // 4. აქ უნდა იყოს SMS პროვაიდერის კოდი (მაგ: sms.ge API)
    // ამჯერად უბრალოდ კონსოლში დავლოგოთ
    console.log(`SMS გაიგზავნა ${phone}-ზე. კოდი: ${otpCode}`);

    res.status(200).json({ message: "კოდი გაგზავნილია წარმატებით", otpCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "კოდის გაგზავნისას მოხდა შეცდომა" });
  }
};

export const createListing = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      property_type_id,
      deal_type_id,
      status_id,
      condition_id,
      city_id,
      location,
      price,
      price_per_m2,
      area_m2,
      rooms,
      bedrooms,
      floor,
      totalFloors,
      description,
      contact_name,
      contact_phone,
      contact_code,
      neighbourhood,
      city_name,
    } = req.body;

    /* ---------- OTP CHECK ---------- */
    const otpCheck = await pool.query(
      `SELECT 1 FROM otp_verifications 
       WHERE phone = $1 AND code = $2 AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [contact_phone, contact_code],
    );

    if (otpCheck.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "კოდი არასწორია ან ვადაგასულია!" });
    }

    /* ---------- CITY ---------- */
    const cityCheck = await pool.query(
      "SELECT id FROM cities WHERE place_id = $1",
      [city_id],
    );

    let finalCityId;
    if (cityCheck.rows.length === 0) {
      const cityInsert = await pool.query(
        `INSERT INTO cities (name, place_id, neighbourhood)
         VALUES ($1, $2, $3) RETURNING id`,
        [city_name, city_id, neighbourhood],
      );
      finalCityId = cityInsert.rows[0].id;
    } else {
      finalCityId = cityCheck.rows[0].id;
    }

    /* ---------- LISTING ---------- */
    const listingResult = await pool.query(
      `INSERT INTO listings (
        property_type_id, deal_type_id, status_id, condition_id, city_id,
        location, price, price_per_m2, area_m2, rooms, floor, bedrooms, total_floors,
        description, contact_name, contact_phone, contact_code, user_id, created_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,NOW()
      ) RETURNING *`,
      [
        property_type_id,
        deal_type_id,
        status_id,
        condition_id,
        finalCityId,
        location,
        price,
        price_per_m2,
        area_m2,
        rooms,
        floor,
        bedrooms,
        totalFloors,
        description,
        contact_name,
        contact_phone,
        contact_code,
        userId,
      ],
    );

    const listing = listingResult.rows[0];

    /* ---------- IMAGES (SUPABASE) ---------- */
    const imageUrls = [];

    if (req.files?.length) {
      for (const file of req.files) {
        const ext = file.mimetype.split("/")[1];
        const fileName = `${crypto.randomUUID()}.${ext}`;

        // Upload file to Supabase
        const { error: uploadError } = await supabase.storage

          .from("listing-images")
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false, // თუ იგივე სახელი არსებობს, არ ჩაანაცვლოს
          });
        for (const file of req.files) {
          console.log("BUFFER CHECK:", file.buffer?.length);
          console.log({
            originalname: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            hasBuffer: !!file.buffer,
          });
        }

        if (uploadError) throw uploadError;

        // Create public URL
        const { data } = supabase.storage
          .from("listing-images")
          .getPublicUrl(fileName);

        imageUrls.push(data.publicUrl);
      }
    }

    /* ---------- SAVE IMAGE URLs TO DB ---------- */
    if (imageUrls.length > 0) {
      await pool.query(
        `INSERT INTO listing_images (listing_id, image_url, position)
         VALUES ($1, $2::text[], 1)`,
        [listing.id, imageUrls],
      );
    }

    // Delete OTP after successful listing
    await pool.query("DELETE FROM otp_verifications WHERE phone = $1", [
      contact_phone,
    ]);

    res.status(201).json({ listing, images: imageUrls });
  } catch (err) {
    console.error("CREATE LISTING ERROR:", err);
    res
      .status(500)
      .json({ message: err.message || "უცნობი შეცდომა", detail: err.detail });
  }
};
export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const checkOwnership = await pool.query(
      "SELECT id FROM listings WHERE id = $1 AND user_id = $2",
      [id, userId],
    );

    if (checkOwnership.rows.length === 0) {
      return res.status(403).json({ message: "წვდომა უარყოფილია!" });
    }

    /* ---------- IMAGES ---------- */
    const imageUrls = [];

    if (req.files?.length) {
      for (const file of req.files) {
        const ext = file.mimetype.split("/")[1];
        const fileName = `${crypto.randomUUID()}.${ext}`;

        const { error } = await supabase.storage
          .from("listing-images")
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
          });

        if (error) throw error;

        const { data } = supabase.storage
          .from("listing-images")
          .getPublicUrl(fileName);

        imageUrls.push(data.publicUrl);
      }
    }

    const updateResult = await pool.query(
      `UPDATE listings SET
        location = $1,
        price = $2,
        description = $3,
        updated_at = NOW()
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [req.body.location, req.body.price, req.body.description, id, userId],
    );

    if (imageUrls.length > 0) {
      await pool.query(
        `UPDATE listing_images
         SET image_url = $1::text[]
         WHERE listing_id = $2`,
        [imageUrls, id],
      );
    }

    res.json(updateResult.rows[0]);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "შეცდომა განახლებისას" });
  }
};

export const getListings = async (req, res) => {
  const {
    dealTypeId = [],
    propertyId = [],
    searchTerm,
    minPrice,
    maxPrice,
  } = req.body;
  const lang = req.query.lang || "ka";
  const col = lang === "en" ? "name_en" : "name";

  try {
    let query = `
      SELECT 
        l.*,  
        dt.${col} AS deal_type,
        pt.${col} AS property_type,
        s.${col} AS status,
        c.${col} AS condition,
        ci.neighbourhood,   
        ci.name AS city,
        li.image_url AS image
      FROM listings l
      JOIN deal_type dt ON l.deal_type_id = dt.id 
      JOIN property_type pt ON l.property_type_id = pt.id 
      JOIN cities ci ON l.city_id = ci.id
      JOIN status s ON l.status_id = s.id
      JOIN condition c ON l.condition_id = c.id
      JOIN listing_images li ON l.id = li.listing_id
      WHERE 1=1
    `;

    const values = [];

    if (dealTypeId.length > 0) {
      query += ` AND l.deal_type_id = ANY($${values.length + 1}::int[])`;
      values.push(dealTypeId);
    }

    if (propertyId.length > 0) {
      query += ` AND l.property_type_id = ANY($${values.length + 1}::int[])`;
      values.push(propertyId);
    }
    if (minPrice) {
      values.push(minPrice);
      query += ` AND l.price >= $${values.length}`;
    }

    // მაქსიმალური ფასი
    if (maxPrice) {
      values.push(maxPrice);
      query += ` AND l.price <= $${values.length}`;
    }

    if (searchTerm) {
      const search = `%${searchTerm}%`;
      values.push(search); // for ci.name
      values.push(search); // for ci.neighbourhood
      query += ` AND (ci.name ILIKE $${
        values.length - 1
      } OR ci.neighbourhood ILIKE $${values.length})`;
    }

    query += " ORDER BY l.created_at DESC";

    const result = await pool.query(query, values);
    console.log("დალოგილი ლისტები", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
// ერთი კონკრეტული განცხადების წამოღება ID-ით
export const getListingById = async (req, res) => {
  const { id } = req.params; // ვიღებთ ID-ს URL-იდან
  const lang = req.query.lang || "ka"; // იღებს ენას params-იდან
  const col = lang === "en" ? "name_en" : "name";
  try {
    const query = `
      SELECT 
        l.*,  
        dt.${col} AS deal_type,
        pt.${col} AS property_type,
        s.${col} AS status,
        c.${col} AS condition,
        ci.neighbourhood,   
        ci.name AS city,
        li.image_url AS image
      FROM listings l
      LEFT JOIN deal_type dt ON l.deal_type_id = dt.id 
      LEFT JOIN property_type pt ON l.property_type_id = pt.id 
      LEFT JOIN cities ci ON l.city_id = ci.id
      LEFT JOIN status s ON l.status_id = s.id
      LEFT JOIN condition c ON l.condition_id = c.id
      LEFT JOIN listing_images li ON l.id = li.listing_id
      WHERE l.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "განცხადება ვერ მოიძებნა" });
    }

    res.json(result.rows[0]); // ვაბრუნებთ მხოლოდ ერთ ობიექტს
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "სერვერის შეცდომა" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "მომხმარებლის იდენტიფიკატორი არ არსებობს" });
    }

    // 1️⃣ User info (password-ის გარეშე)
    const userQuery = `
      SELECT 
        id,
        first_name,
        last_name,
        email,
        created_at
      FROM users
      WHERE id = $1;
    `;

    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "მომხმარებელი ვერ მოიძებნა" });
    }

    const user = userResult.rows[0];

    res.status(200).json({
      user,
      message: "პროფილის მონაცემები წარმატებით წამოღებულია",
    });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "სერვერის შეცდომა პროფილის წამოღებისას" });
  }
};

export const getUserCards = async (req, res) => {
  const userId = req.userId;

  try {
    const userQuery = `
      SELECT id, first_name
      FROM users
      WHERE id = $1;
    `;

    const resultUser = await pool.query(userQuery, [userId]);

    if (resultUser.rows.length === 0) {
      return res.status(404).json({ message: "მომხმარებელი ვერ მოიძებნა" });
    }

    const user = resultUser.rows[0];

    const listingsQuery = `
      SELECT DISTINCT ON (l.id) 
    l.*, 
    li.image_url AS image
    FROM listings l
    LEFT JOIN listing_images li ON l.id = li.listing_id
    WHERE l.user_id = $1
    ORDER BY l.id, l.created_at DESC;
    `;

    const resultOfListings = await pool.query(listingsQuery, [userId]);

    res.status(200).json({
      user,
      listsOfUser: resultOfListings.rows, // შეიძლება იყოს []
      message: "წარმატებით გამოიგზავნა",
    });
  } catch (err) {
    console.error("GET USER LISTINGS ERROR:", err);
    res.status(500).json({ message: "სერვერის შეცდომა ლისტების წამოღებისას" });
  }
};
export const getUserListingById = async (req, res) => {
  const listingId = req.params.id;
  const userId = req.userId; // დარწმუნდი, რომ ეს იუსერია პატრონი
  // ვიღებთ ID-ს URL-იდან
  const lang = req.query.lang || "ka"; // იღებს ენას params-იდან
  const col = lang === "en" ? "name_en" : "name";
  try {
    const query = `
      SELECT 
        l.*,  
        dt.${col} AS deal_type,
        pt.${col} AS property_type,
        s.${col} AS status,
        c.${col} AS condition,
        ci.neighbourhood,   
        ci.name AS city,
        li.image_url AS image
      FROM listings l
      LEFT JOIN deal_type dt ON l.deal_type_id = dt.id 
      LEFT JOIN property_type pt ON l.property_type_id = pt.id 
      LEFT JOIN cities ci ON l.city_id = ci.id
      LEFT JOIN status s ON l.status_id = s.id
      LEFT JOIN condition c ON l.condition_id = c.id
      LEFT JOIN listing_images li ON l.id = li.listing_id
      WHERE l.id = $1 AND l.user_id = $2
      `;

    const result = await pool.query(query, [listingId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "განცხადება ვერ მოიძებნა" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "შეცდომა მონაცემის წამოღებისას" });
  }
};
export const deleteList = async (req, res) => {
  const listingId = req.params.id;
  const userId = req.userId; // მოდის middleware-დან (token-ით)

  try {
    const deleteQuery =
      "DELETE FROM listings WHERE id = $1 AND user_id = $2 RETURNING *";
    const result = await pool.query(deleteQuery, [listingId, userId]);

    if (result.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "წაშლა აკრძალულია ან განცხადება არ არსებობს" });
    }

    res.status(200).json({ message: "წარმატებით წაიშალა" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};
