import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase only once
let app
try {
  // Check if Firebase app has already been initialized
  app = initializeApp(firebaseConfig)
  console.log("Firebase initialized successfully")
} catch (error) {
  console.error("Firebase initialization error:", error)
}

// Initialize Firebase services
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: "select_account",
})

// Use Auth Emulator in development if needed
// Uncomment this section if you want to use the Firebase Auth Emulator
// if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_AUTH_EMULATOR === 'true') {
//   connectAuthEmulator(auth, 'http://localhost:9099');
//   console.log('Using Auth Emulator');
// }

export { auth, googleProvider }

