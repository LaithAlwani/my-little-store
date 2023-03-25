// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  setDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  connectStorageEmulator,
} from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
let firebaseConfig = {
  apiKey: "AIzaSyA1X15-ijN6YBkL6hwgL3DmoxXjE3_YWlk",
  authDomain: "bgdb-2dd2f.firebaseapp.com",
  projectId: "bgdb-2dd2f",
  storageBucket: "bgdb-2dd2f.appspot.com",
  messagingSenderId: "888021691344",
  appId: "1:888021691344:web:2d351ccfc376cbe75727d5",
  measurementId: "G-47833ZQY6R"
};
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const appCheck = initializeAppCheck(firebaseApp, {
//   provider: new ReCaptchaEnterpriseProvider(import.meta.env.VITE_RE_CAPTCHA_ENTERPRISE),
//   isTokenAutoRefreshEnabled: true, // Set to true to allow auto-refresh.
// });
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const analytics = getAnalytics(firebaseApp);
export const functions = getFunctions(firebaseApp);

if (location.hostname === "localhost") {
  connectStorageEmulator(storage, "localhost", 9199, { disableWarnings: false });
  connectFirestoreEmulator(db, "localhost", 8080, { disableWarnings: false });
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: false });
  connectFunctionsEmulator(functions, "localhost", 5001, { disableWarnings: false });
}
