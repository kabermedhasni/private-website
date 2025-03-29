// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlvRsNuOxcC4i649bh8Xcp3O92QSzgLlg",
  authDomain: "private-website-1d261.firebaseapp.com",
  projectId: "private-website-1d261",
  storageBucket: "private-website-1d261.firebasestorage.app",
  messagingSenderId: "1072170930334",
  appId: "1:1072170930334:web:f3d867ef181aa4732e2b8f",
  measurementId: "G-S56VGXBN6S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };

