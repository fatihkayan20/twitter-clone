import * as React from "react";
import { trpc } from "@/utils/trpc";
import { useAuth } from "@clerk/clerk-expo";
import { useDebounce } from "../comon/useDebounce";
import { Like } from ".prisma/client";

interface IUseLikeProps {
  likes: Like[];
  tweetId: string;
}

export const useLike = ({ likes, tweetId }: IUseLikeProps) => {
  const utils = trpc.useContext();
  const { userId } = useAuth();
  const firstLikeStatus = React.useRef(
    likes?.some((like) => like.userId === userId),
  );

  const { mutateAsync: likeTweet, isLoading } =
    trpc.tweet.likeTweet.useMutation();

  const [state, setState] = React.useState({
    isLiked: likes?.some((like) => like.userId === userId),
    likeCount: likes?.length ?? 0,
  });

  const debounced = useDebounce(
    likeTweet,
    500,
    firstLikeStatus.current !== state.isLiked,
  );

  React.useEffect(() => {
    setState((prev) => ({
      ...prev,
      isLiked: likes?.some((like) => like.userId === userId),
      likeCount: likes?.length ?? 0,
    }));

    firstLikeStatus.current = likes?.some((like) => like.userId === userId);
  }, [likes]);

  const handleLike = async () => {
    setState((prev) => ({
      ...prev,
      isLiked: !prev.isLiked,
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
    }));

    debounced({ tweetId }).then(() => {
      utils.tweet.all.invalidate();
    });
  };

  return {
    handleLike,
    isLiked: state.isLiked,
    likeCount: state.likeCount,
    isLoading,
  };
};
