import { getDatabase } from "firebase-admin/database";

export const removeNotification = async ({
  userId,
  type,
}: {
  userId: string;
  type: "notification" | "message";
}) => {
  if (type === "message") {
    return;
  }

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

    const notificationCount =
      data.notificationCount - 1 < 0 ? 0 : data.notificationCount - 1;

    userRef.update({
      notificationCount: notificationCount,
    });
  });
};
