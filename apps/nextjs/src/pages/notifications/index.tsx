import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { NotificationCard } from "@/components/notification/NotificationCard";
import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import Head from "next/head";
import * as React from "react";

const NotificationPage: NextPage = () => {
  const { isLoading, data: notifications } = trpc.notification.all.useQuery();
  const utils = trpc.useContext();

  React.useEffect(() => {
    utils.notification.all.invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 p-3">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col ">
      <Head>
        <title>Notifications</title>
      </Head>
      {notifications?.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationPage;
