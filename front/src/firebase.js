// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyD3JPBc9RE1p1H_JMV9xcdarh_N3sbq0zU",
  authDomain: "managemoney-ba8e6.firebaseapp.com",
  projectId: "managemoney-ba8e6",
  storageBucket: "managemoney-ba8e6.firebasestorage.app",
  messagingSenderId: "681551113112",
  appId: "1:681551113112:web:cf83d86a85e79d8e3999ed",
  measurementId: "G-3JF99T4B80"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export{ auth , provider};