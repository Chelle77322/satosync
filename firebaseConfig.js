import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    //apiKey:"AIzaSyADDljMyDxXqN4p3sMaXJcC7FNzavs2rY-",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId:"satosync-34bf6",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId:"SENDER_ID",
    appId: "APP_ID",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);