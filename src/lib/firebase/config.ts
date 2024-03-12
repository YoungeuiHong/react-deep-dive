import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBWshzAQ9Dvw4I3n36bDjsrY7sQraEFLis",
  authDomain: "pwa-test-5cd6c.firebaseapp.com",
  projectId: "pwa-test-5cd6c",
  storageBucket: "pwa-test-5cd6c.appspot.com",
  messagingSenderId: "229834477105",
  appId: "1:229834477105:web:a0e4bba012f2192f380f10",
  measurementId: "G-VJ89RZTDT2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
