import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";

import { addNotification } from "./functions/addNotification";
import { readAllNotifications } from "./functions/readAllNotifications";
import { removeNotification } from "./functions/removeNotification";

interface FirebaseInitError {
  stack: string;
  message: string;
}

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
  } catch (error) {
    const typedError = error as FirebaseInitError;

    if (!/already exists/u.test(typedError.message)) {
      // eslint-disable-next-line no-console
      console.error("Firebase admin initialization error", typedError.stack);
    }
  }
};

export const firebaseFunctions = {
  addNotification,
  removeNotification,
  readAllNotifications,
  initializeApp,
};
