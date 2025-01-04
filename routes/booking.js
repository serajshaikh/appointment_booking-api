import { Router } from "express";
import getSlots from "../controllers/getSlots.js";
import bookSlot from "../controllers/bookSlot.js";

const router = Router();

// Define routes
router.get("/slots", getSlots);
router.post("/bookSlot", bookSlot);

export default router;
