import db from "../models/db.js";

const updateUserStatus = async (userId, date) => {
  if (!date || !userId) {
    throw new Error("Missing required fields: date, userId");
  }

  try {
    const userDocRef = db.collection("user").doc(userId);
    const userDoc = await userDocRef.get();
    let data = userDoc.exists ? userDoc.data() : { dateBooked: [] };

    // Check if the user has already booked the date
    if (data.dateBooked.includes(date)) {
      return; // No action if the date is already booked
    }

    // Check if the user has already booked for 5 days
    if (data.dateBooked.length >= ((process.env.BOOK_LIMIT)??5)) {
      throw new Error("You can book appointments for a maximum of 5 days.");
    }

    // Add the new date to the booked dates
    const updatedDates = [...data.dateBooked, date];
    await userDocRef.set({ dateBooked: updatedDates }, { merge: true });

  } catch (error) {
    console.error("Error in updating user status:", error);
    throw new Error(error.message??`Limit exceeded! You can only book appointments for up to ${(process.env.BOOK_LIMIT)??5} days.`);
  }
};

export const getUserStatus = async (userId) => {
  if (!userId) {
    throw new Error("Missing required field: userId");
  }

  try {
    const userDocRef = db.collection("user").doc(userId);
    const userDoc = await userDocRef.get();
  
    if (!userDoc.exists) {
      return {
        message: "User record does not exist.",
        dateBooked: []
      };
    }
  
    return {
      message: "User record found.",
      dateBooked: userDoc.data().dateBooked || []
    };
  } catch (error) {
    console.error("Error in retrieving user status:", error);
    throw new Error("Error in retrieving user status.");
  }
};

export default updateUserStatus;

