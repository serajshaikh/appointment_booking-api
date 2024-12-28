import express, { urlencoded } from "express";
import cors from "cors";
const app = express();
import bookingRoute from "./routes/booking.js";


app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(bookingRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
