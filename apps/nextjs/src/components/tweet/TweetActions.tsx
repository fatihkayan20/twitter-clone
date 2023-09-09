import * as React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaComment, FaRetweet } from "react-icons/fa";
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { GoShare } from "react-icons/go";
import { useLike } from "@/hooks/tweet/useLike";

interface TweetActionsProps {
  isLiked: boolean;
  tweetId: string;
  counts: {
    likes: number;
    subTweets: number;
  };
  hideNumbers?: boolean;
  content: string;
}

export const TweetActions: React.FC<TweetActionsProps> = ({
  isLiked: initialIsLiked,
  counts,
  tweetId,
  hideNumbers,
  content,
}) => {
  const { toggleLike, isLiked, likeCount } = useLike({
    tweetId,
    isLiked: initialIsLiked,
    likeCount: counts.likes,
  });

  //   const { handleShareTweet } = useShare(content);

  return (
    <div
      className={`mt-2 flex flex-1 flex-row items-center  ${
        hideNumbers ? "justify-around" : "justify-between"
      }`}
    >
      <button className="flex flex-row items-center space-x-2 ">
        <FaComment size={20} color="gray" />

        {!hideNumbers && (
          <div className="text-xs text-gray-500">{counts.subTweets}</div>
        )}
      </button>

      <button className="flex flex-row items-center space-x-2">
        <FaRetweet size={20} color="gray" />

        {!hideNumbers && <div className="text-xs text-gray-500">{0}</div>}
      </button>

      <button
        className="flex flex-row items-center space-x-2"
        onClick={toggleLike}
      >
        {isLiked ? (
          <AiFillHeart size={20} color="red" />
        ) : (
          <AiOutlineHeart size={20} color="gray" />
        )}

        {!hideNumbers && (
          <div
            className={`text-xs ${isLiked ? "text-red-600" : "text-gray-500"}`}
          >
            {likeCount}
          </div>
        )}
      </button>

      <button className="flex flex-row items-center space-x-2">
        <BiSolidBarChartAlt2 size={20} color="gray" />

        {!hideNumbers && <div className="text-xs text-gray-500">{0}</div>}
      </button>

      <button
        className="flex flex-row items-center space-x-2"

        //    onClick={handleShareTweet}
      >
        <GoShare size={20} color="gray" />
      </button>
    </div>
  );
};
