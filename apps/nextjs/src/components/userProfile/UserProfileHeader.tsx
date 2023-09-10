import * as React from "react";
import { BackButton } from "../common/BackButton";
import { RouterOutput } from "@acme/api";
import { Avatar } from "../common/Avatar";
import Image from "next/image";
import { IoIosCalendar } from "react-icons/io";
import { format } from "date-fns";
import { FollowButton } from "./FollowButton";

interface UserProfileHeaderProps {
  user: RouterOutput["user"]["getByUsername"];
  tweetCount: number;
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  user,
  tweetCount,
}) => {
  return (
    <div className="bg-black/70 px-4 pb-2 pt-3">
      <div className="flex-row items-center justify-between">
        <div className="flex-row items-center justify-between space-x-2">
          <div className="mb-3">
            <BackButton
              title={
                <div className="text-left">
                  <div className="text-xl font-bold dark:text-white">
                    {user.name}
                  </div>
                  <div className="text-sm font-light dark:text-gray-500">
                    {tweetCount} Tweets
                  </div>
                </div>
              }
            />
          </div>
        </div>

        <div className="relative -m-3 h-32 w-[calc(100%+1.7rem)] overflow-hidden">
          <Image src={user.profilePicture ?? ""} alt="header" fill />
        </div>

        <div className="flex items-end justify-between">
          <Avatar url={user.profilePicture} size={120} />
          <FollowButton user={user} />
        </div>

        <div className="mt-3">
          <p className="text-xl font-bold">{user.name}</p>
          <p className="text-gray-500">@{user.username}</p>
        </div>

        <div className="flex-row items-center space-x-1">
          <IoIosCalendar size={24} color="black" />
          <span>Joined {format(new Date(user.createdAt), "MMM yyyy")}</span>
        </div>
      </div>
    </div>
  );
};
