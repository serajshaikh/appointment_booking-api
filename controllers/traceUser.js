import db from "../models/db.js";

const getMinDate = () => {
  const now = new Date();
  if (now.getHours() >= 17) {
    // If the time is past 17:00, set default date to the next day
    const nextDay = new Date(now);
    nextDay.setDate(now.getDate() + 1);
    return nextDay;
  }
  return now;
};

const updateUserStatus = async (userId, date) => {
  if (!date || !userId) {
    throw new Error("Missing required fields: date, userId");
  }

  try {
    const userDocRef = db.collection("user").doc(userId);
    const userDoc = await userDocRef.get();
    let data = userDoc.exists ? userDoc.data() : { dateBooked: [] };

    const minDate = getMinDate();
    const formattedMinDate = minDate.toISOString().split("T")[0]; // Ensure date comparison is based on strings

    // Remove dates older than the current date
    const validDates = data.dateBooked.filter(
      (bookedDate) => bookedDate >= formattedMinDate
    );

    // Update the user record with valid dates
    if (JSON.stringify(validDates) !== JSON.stringify(data.dateBooked)) {
      await userDocRef.update({ dateBooked: validDates });
      data.dateBooked = validDates; // Update local copy
    }

    // Check if the user has already booked the date
    if (data.dateBooked.includes(date)) {
      return; // No action if the date is already booked
    }

    // Check if the user has already booked for 5 days
    if (data.dateBooked.length >= (process.env.BOOK_LIMIT ?? 5)) {
      throw new Error(`Limit exceeded! You can only book appointments for up to ${(process.env.BOOK_LIMIT)??5} days.`);
    }

    // Add the new date to the booked dates
    const updatedDates = [...data.dateBooked, date];
    await userDocRef.set({ dateBooked: updatedDates }, { merge: true });
  } catch (error) {
    console.error("Error in updating user status:", error);
    throw new Error(
      error.message ??
        `Limit exceeded! You can only book appointments for up to ${
          process.env.BOOK_LIMIT ?? 5
        } days.`
    );
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
        dateBooked: [],
      };
    }

    const data= userDoc.data();

    const minDate = getMinDate();
    const formattedMinDate = minDate.toISOString().split("T")[0]; // Ensure date comparison is based on strings
    console.log("Data----------->", formattedMinDate);
    // Remove dates older than the current date
    const validDates = data.dateBooked.filter(
      (bookedDate) => bookedDate >= formattedMinDate
    );

    // Update the user record with valid dates
    if (JSON.stringify(validDates) !== JSON.stringify(data.dateBooked)) {
      await userDocRef.update({ dateBooked: validDates });
      data.dateBooked = validDates; // Update local copy
    }

    return {
      message: "User record found.",
      dateBooked: data.dateBooked || [],
    };
  } catch (error) {
    console.error("Error in retrieving user status:", error);
    throw new Error("Error in retrieving user status.");
  }
};

export default updateUserStatus;
