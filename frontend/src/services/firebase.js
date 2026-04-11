import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA7SJ944KHjAdHSOLcaDxv26WbhdAiEB3g",
  authDomain: "invisible-india-31d7b.firebaseapp.com",
  projectId: "invisible-india-31d7b",
  storageBucket: "invisible-india-31d7b.firebasestorage.app",
  messagingSenderId: "748596408320",
  appId: "1:748596408320:web:288cc570fbbd66f22be8e5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export { RecaptchaVerifier, signInWithPhoneNumber };