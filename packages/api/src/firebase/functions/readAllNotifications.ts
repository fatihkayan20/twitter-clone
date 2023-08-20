import { getDatabase } from "firebase-admin/database";

export const readAllNotifications = async ({ userId }: { userId: string }) => {
  const db = getDatabase();
  const ref = db.ref("notifications");

  const userRef = ref.child(userId);

  userRef.once("value", (snapshot) => {
    const data = snapshot.val();

    if (data === null) {
      userRef.set({
        notificationCount: 0,
      });

      return;
    }

    userRef.update({
      notificationCount: 0,
    });
  });
};
