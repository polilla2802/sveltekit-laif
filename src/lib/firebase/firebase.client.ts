// src/lib/firebase/firebase.client.ts
import firebaseConfig from "./firebaseConfig";
import { deleteApp, getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

let firebaseApp: FirebaseApp;

if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApp();
    deleteApp(firebaseApp);
    firebaseApp = initializeApp(firebaseConfig);
}

export const storage = getStorage(firebaseApp);
export const db = getFirestore(firebaseApp);
