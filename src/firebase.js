// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración Firebase - Italito Gestión Escolar
const firebaseConfig = {
  apiKey: "AIzaSyAw1WXIdXxc6YaLigkIUV6dom2iFR4BCO8",
  authDomain: "italito-gestion-escolar.firebaseapp.com",
  projectId: "italito-gestion-escolar",
  storageBucket: "italito-gestion-escolar.firebasestorage.app",
  messagingSenderId: "472276744442",
  appId: "1:472276744442:web:b8b6e557b87ee3111d7143",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios principales
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Exportaciones para usar en todo el sistema
export {
  app,
  auth,
  db,
  storage,

  // Firestore
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  runTransaction,
};