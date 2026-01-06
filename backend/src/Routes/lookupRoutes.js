import express from "express";
import {
  getStatuses,
  getPropertyTypes,
  getCities,
  getBuildigCondiotios,
  getRepairStatuses,
} from "../Controllers/lookupController.js";

const router = express.Router();

router.get("/deal_type", getStatuses);
router.get("/property-type", getPropertyTypes);
router.get("/cities", getCities);
router.get("/status", getBuildigCondiotios);
router.get("/condition", getRepairStatuses);
export default router;
