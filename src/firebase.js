import firebase from "firebase"

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDXgXASJ8At1SuLUJmBGA4P0pby9xFTdLE",
  authDomain: "instagram-clone-41335.firebaseapp.com",
  projectId: "instagram-clone-41335",
  storageBucket: "instagram-clone-41335.appspot.com",
  messagingSenderId: "270219496609",
  appId: "1:270219496609:web:40fb735f42033f659674e0",
  measurementId: "G-5RZRZ6Q7P6"
})

const db = firebase.firestore();
const auth= firebase.auth();
const storage= firebase.storage();
 
export {db, auth, storage};