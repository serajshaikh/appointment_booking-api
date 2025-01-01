import db from "../models/db.js";
import { getUserStatus } from "./traceUser.js";

const getSlots = async (req, res) => {
  const { date, userId } = req.query;
  console.log("Get Slots info--------->", {date, userId})
  if (!date) {
    return res.status(400).json({ error: "Date is required." });
  }

  try {
    const status = await getUserStatus(userId);
    if (status.dateBooked.length >= ((process.env.BOOK_LIMIT)??5)) {
      throw new Error(`Limit exceeded! You can only book appointments for up to ${(process.env.BOOK_LIMIT)??5} days.`);
    }
    console.log("Successfully Verified user book status.")
    const slotDoc = await db.collection("slots").doc(date).get();
    console.log("---------------------->", date);
    if (!slotDoc.exists) {
      return res.status(200).json({ availableSlots: [], bookedSlots: {} });
    }

    const data = slotDoc.data();
    res.json({
      availableSlots: data.availableSlots,
      bookedSlots: data.bookedSlots,
    });
  } catch (error) {
    res.status(500).json({ error: error?.message ?? "Error fetching slots." });
  }
};

export default getSlots;
