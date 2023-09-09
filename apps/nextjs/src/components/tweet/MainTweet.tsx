import * as React from "react";
import { format } from "date-fns";
import { RouterOutput } from "@acme/api";
import { useRouter } from "next/router";
import { Avatar } from "../common/Avatar";
import { CiCircleMore } from "react-icons/ci";
import { TweetActions } from "./TweetActions";

interface MainTweetProps {
  tweet: RouterOutput["tweet"]["getById"];
}

export const MainTweet: React.FC<MainTweetProps> = ({ tweet }) => {
  const router = useRouter();

  const handleNavigateToUserProfile = React.useCallback(() => {
    router.push(`/user/${tweet.user?.username}`);
  }, [tweet.user?.username, router]);

  return (
    <div className="p-3 dark:text-white">
      <div className="flex flex-row items-center ">
        <button onClick={handleNavigateToUserProfile}>
          <Avatar url={tweet.user?.profilePicture} />
        </button>

        <button
          className=" flex flex-1 flex-col items-start pl-3 "
          onClick={handleNavigateToUserProfile}
        >
          <div className="text-base font-bold ">{tweet?.user?.name}</div>
          <div className="text-gray-500">@{tweet?.user?.username}</div>
        </button>

        <CiCircleMore size={26} className="h-full text-black dark:text-white" />
      </div>

      <div className="mt-3 ">{tweet?.content}</div>

      <div className="mt-3 border-b pb-3 text-xs text-gray-500">
        {format(new Date(tweet?.createdAt ?? ""), "h:mm · dd.mm.yyy")}
        <span className="px-2 font-bold text-black dark:text-white">
          {/* TODO: {tweet?._count.views} */} {Math.floor(Math.random() * 100)}
        </span>
        Views
      </div>

      <div className="mt-3 flex flex-row items-center border-b pb-3 ">
        <div className=" text-gray-500">
          <span className="font-bold text-black dark:text-white">
            {tweet?._count.subTweets}{" "}
          </span>
          Retweets
        </div>

        <div className="ml-2 text-gray-500">
          <span className="font-bold text-black dark:text-white">
            {tweet?._count.likes}{" "}
          </span>
          Likes
        </div>
      </div>

      <div className="border-b pb-4 pt-2">
        <TweetActions
          counts={tweet._count}
          isLiked={tweet.isLiked}
          tweetId={tweet.id}
          hideNumbers
          content={tweet.content ?? ""}
        />
      </div>
    </div>
  );
};
