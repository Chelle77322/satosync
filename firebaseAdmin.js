import admin from "firebase-admin";
import serviceAccount from "./firebase-service.account.json";//rename your key file
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
module.exports = admin;
