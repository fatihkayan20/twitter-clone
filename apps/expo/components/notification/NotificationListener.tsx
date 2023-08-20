import { useAuth } from "@clerk/clerk-expo";
import * as React from "react";
import { FB } from "../../firebase";
import { onValue, ref } from "firebase/database";
import { ExpoNotificationToken } from "./ExpoNotificationToken";

interface NotificationListenerProps {
  children: React.ReactNode;
}

interface NotificationContextValue {
  notificationCount: number;
}

const NotificationContext = React.createContext<NotificationContextValue>({
  notificationCount: 0,
});

export const NotificationListener: React.FC<NotificationListenerProps> = ({
  children,
}) => {
  const { userId } = useAuth();
  const [notificationCount, setNotificationCount] = React.useState(0);

  React.useEffect(() => {
    if (!userId) {
      return;
    }

    const notificationRef = ref(FB.db, `notifications/${userId}`);

    onValue(notificationRef, (snapshot) => {
      const notificationCount = snapshot.val()?.notificationCount || 0;
      setNotificationCount(notificationCount);
    });
  }, [userId]);

  return (
    <NotificationContext.Provider
      value={{
        notificationCount,
      }}
    >
      <ExpoNotificationToken>{children}</ExpoNotificationToken>
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextValue =>
  React.useContext(NotificationContext);
