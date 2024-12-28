import db from "../models/db.js";
import generateSlots from "../common/utills/generateSlots.js";


const bookSlot= async (req, res) => {
    const { date, slot, userId } = req.body;
  
    if (!date || !slot || !userId) {
      return res
        .status(400)
        .json({ error: "Missing required fields: date, slot, or userId" });
    }
  
    try {
      const slotDocRef = db.collection("slots").doc(date);
      const slotDoc = await slotDocRef.get();
  
      if (!slotDoc.exists) {
        // If the date doesn't exist, create the document with all slots
        const allSlots = generateSlots(); // Function to generate slots (09:00 - 17:00, 30-minute intervals)
        const initialData = {
          availableSlots: allSlots,
          bookedSlots: {},
        };
  
        await slotDocRef.set(initialData);
      }
  
      // Re-fetch the document to ensure it exists after creation
      const updatedSlotDoc = await slotDocRef.get();
      const data = updatedSlotDoc.data();
  
      // Check if the slot is already booked
      if (data.bookedSlots[slot]) {
        return res.status(400).json({ error: "Slot already booked." });
      }
      console.log("AvailableSlots==============>", data.availableSlots);
      console.log("slot==============>", slot);
  
      // Check if the slot is valid
      if (!data.availableSlots.includes(slot)) {
        return res.status(400).json({ error: "Invalid slot." });
      }
  
      // Book the slot
      const updatedAvailableSlots = data.availableSlots.filter((s) => s !== slot);
      const updatedBookedSlots = { ...data.bookedSlots, [slot]: userId };
  
      await slotDocRef.update({
        availableSlots: updatedAvailableSlots,
        bookedSlots: updatedBookedSlots,
      });
  
      return res.status(200).json({ message: "Slot booked successfully." });
    } catch (error) {
      console.error("Error booking slot:", error);
      return res.status(500).json({ error: "Error booking slot." });
    }
  }

export default bookSlot;