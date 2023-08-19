import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";

import { addNotification } from "./functions/addNotification";
import { readAllNotifications } from "./functions/readAllNotifications";

const initializeApp = async () => {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
        projectId: serviceAccount.project_id,
      }),
      databaseURL:
        "https://twitter-clone-380407-default-rtdb.europe-west1.firebasedatabase.app",
    });
    console.log("Initialized.");
  } catch (error) {
    /*
     * We skip the "already exists" message which is
     * not an actual error when we're hot-reloading.
     */
    if (!/already exists/u.test(error.message)) {
      console.error("Firebase admin initialization error", error.stack);
    }
  }
};

export const firebaseFunctions = {
  addNotification,
  readAllNotifications,
  initializeApp,
};
