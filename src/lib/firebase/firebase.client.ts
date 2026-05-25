import firebaseConfig from "./firebaseConfig";
import { deleteApp, getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getStorage } from "firebase/storage";

let firebaseApp: FirebaseApp;

if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApp();
    deleteApp(firebaseApp);
    firebaseApp = initializeApp(firebaseConfig);
}

export const storage = getStorage(firebaseApp);
