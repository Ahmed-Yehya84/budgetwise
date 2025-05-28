import { getDatabase } from "firebase/database";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDKknjtoLV9Icib7Gwf-3fc2936de7f-o",
  authDomain: "budgetwise-2f8ab.firebaseapp.com",
  projectId: "budgetwise-2f8ab",
  storageBucket: "budgetwise-2f8ab.firebasestorage.app",
  messagingSenderId: "213006654132",
  appId: "1:213006654132:web:cb45d5c13b8cacc74415e1",
  databaseURL:
    "https://budgetwise-2f8ab-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
