import express from "express";
import {
  createListing,
  getListings,
  sendOTP,
  getListingById,
  getProfile,
  getUserCards,
  deleteList,
  getUserListingById,
  updateListing,
} from "../Controllers/listingsController.js";
import { upload } from "../storage.js";
import { verifyToken } from "../Middleware/verifyToken.js";
const router = express.Router();

// Create new listing
router.post(
  "/",
  verifyToken,
  upload.array("images", 10), // max 10 ფოტო
  createListing
);
router.put(
  "/:id",
  verifyToken,
  upload.array("images", 10), // max 10 ფოტო
  updateListing
);
router.post("/send-otp", sendOTP);
router.post("/getListings", getListings);
router.get("/getList/:id", getListingById);
router.get("/getProfile", verifyToken, getProfile);
router.get("/getMyListings", verifyToken, getUserCards);
router.get("/getUserListingById/:id", verifyToken, getUserListingById);
router.delete("/delete/:id", verifyToken, deleteList);

// Filter listings by activeStatus + activeProperty

export default router;
