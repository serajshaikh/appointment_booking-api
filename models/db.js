import admin from "firebase-admin";
import serviceAccount from "../key.json" with { type: "json" }; // Add the assertion

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
export default db;
