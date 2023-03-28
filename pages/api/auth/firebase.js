import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: "open-ai-project-d5d57.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: "open-ai-project-d5d57.appspot.com",
  messagingSenderId: "228022092701",
  appId: "1:228022092701:web:b248149b29ac94662a2574",
  measurementId: "G-L65B5S9QC8",
};
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;

    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);

    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
      });
    }
    return user;
  } catch (err) {
    console.log(err);
  }
};

export const signOutUser = async () => await signOut(auth);
