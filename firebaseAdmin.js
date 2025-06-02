import admin from "firebase-admin";
import serviceAccount from "./satosync-34bf6.json";//rename your key file
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
module.exports = admin;
