import db from "../models/db.js";

const getSlots =  async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Date is required." });
  }

  try {
    const slotDoc = await db.collection("slots").doc(date).get();
    console.log("---------------------->", date);
    if (!slotDoc.exists) {
      return res.status(404).json({ availableSlots: [], bookedSlots: {} });
    }

    const data = slotDoc.data();
    res.json({
      availableSlots: data.availableSlots,
      bookedSlots: data.bookedSlots,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching slots." });
  }
};

export default getSlots;