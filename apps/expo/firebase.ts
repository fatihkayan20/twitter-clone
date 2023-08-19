import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAM4GpzaC51HtDCTp3SN_vg_37keIkf6Uo",
  authDomain: "twitter-clone-380407.firebaseapp.com",
  projectId: "twitter-clone-380407",
  storageBucket: "twitter-clone-380407.appspot.com",
  messagingSenderId: "389251599803",
  appId: "1:389251599803:web:5475c677a7af424049c89e",
  measurementId: "G-D3HFX3SS4V",
  databaseURL:
    "https://twitter-clone-380407-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();

export const FB = {
  app,
  db,
};
