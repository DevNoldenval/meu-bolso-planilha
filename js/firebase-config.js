// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYQm0K_4EdKHvvXOs81raKmstmAsRdT6g", // ← VERIFIQUE SE ESTÁ CORRETA
  authDomain: "controlemeubolso.firebaseapp.com",
  databaseURL: "https://controlemeubolso-default-rtdb.firebaseio.com",
  projectId: "controlemeubolso",
  storageBucket: "controlemeubolso.firebasestorage.app",
  messagingSenderId: "369393280169",
  appId: "1:369393280169:web:0b0d768f074e0ff4c775b8"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
