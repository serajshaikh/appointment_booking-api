import { Router } from "express";
import getSlots from "../controllers/getSlots.js"; // Ensure the .js extension
import bookSlot from "../controllers/bookSlot.js"; // Ensure the .js extension

const router = Router();

// Define routes
router.get("/api/slots", getSlots);
router.post("/api/bookSlot", bookSlot);

export default router;
