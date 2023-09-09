import { RouterOutput } from "@acme/api";
import { useRouter } from "next/router";
import * as React from "react";
import { Avatar } from "../common/Avatar";
import { TweetActions } from "./TweetActions";
import { formatDistanceToNow } from "date-fns";

interface TweetCardProps {
  tweet: RouterOutput["tweet"]["all"]["items"][number];
}

export const TweetCard: React.FC<TweetCardProps> = ({ tweet }) => {
  const router = useRouter();

  const handleNavigateToTweetDetail = React.useCallback(() => {
    router.push(`/user/${tweet.user?.username}/status/${tweet.id}`);
  }, [router, tweet.user?.username, tweet.id]);

  const handleNavigateToUserProfile = React.useCallback(() => {
    router.push(`/user/${tweet.user?.username}`);
  }, [tweet.user?.username, router]);

  return (
    <button
      onClick={handleNavigateToTweetDetail}
      className="flex w-full flex-row space-x-2 border-b py-3 px-3"
    >
      <button onClick={handleNavigateToUserProfile}>
        <Avatar url={tweet.user?.profilePicture} />
      </button>

      <div className="flex-1">
        <button
          onClick={handleNavigateToUserProfile}
          className="flex flex-row space-x-1"
        >
          <div className="font-bold dark:text-white">{tweet.user?.name}</div>
          <div className="text-xs text-gray-600 ">@{tweet.user?.username}</div>
          <div className="text-xs text-gray-600">
            •{formatDistanceToNow(tweet.createdAt)}
          </div>
        </button>

        <div className="mt-1.5 w-full flex-wrap text-left text-sm dark:text-white">
          {tweet.content}
        </div>
        <TweetActions
          isLiked={tweet.isLiked}
          tweetId={tweet.id}
          counts={{
            likes: tweet._count.likes,
            subTweets: tweet._count.subTweets,
          }}
          content={tweet.content ?? ""}
        />
      </div>
    </button>
  );
};
