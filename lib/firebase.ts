import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getFunctions } from "firebase/functions"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyD_FWLIHzDLCOUSwGsm-ZDmHFpLY5ez3p0",
  authDomain: "libas-collective-fullstack.firebaseapp.com",
  projectId: "libas-collective-fullstack",
  storageBucket: "libas-collective-fullstack.firebasestorage.app",
  messagingSenderId: "318134831083",
  appId: "1:318134831083:web:dbe4f56c3f4a14eb793bae",
  measurementId: "G-ZFNMGYRHK4",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const functions = getFunctions(app)

export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null

export const isFirebaseConfigured = () => {
  return true // Always true since we have hardcoded config
}

export default app
