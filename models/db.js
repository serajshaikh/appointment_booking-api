import admin from "firebase-admin";
import {serviceAccount} from "./service_account.js"

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
export default db;
