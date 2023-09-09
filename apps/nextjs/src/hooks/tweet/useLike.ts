import * as React from "react";
import { useDebounce } from "../common/useDebounce";
import { trpc } from "@/utils/trpc";

interface ReturnType {
  toggleLike: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isLiked: boolean;
  likeCount: number;
  isLoading: boolean;
}

interface IUseLikeProps {
  isLiked: boolean;
  likeCount: number;
  tweetId: string;
}

export const useLike = ({
  isLiked,
  likeCount,
  tweetId,
}: IUseLikeProps): ReturnType => {
  const utils = trpc.useContext();
  const firstLikeStatus = React.useRef(isLiked);

  const { mutateAsync: toggleLikeMutation, isLoading } =
    trpc.tweet.toggleLike.useMutation();

  const [state, setState] = React.useState({
    isLiked: isLiked,
    likeCount: likeCount ?? 0,
  });

  const debounced = useDebounce(
    toggleLikeMutation,
    500,
    firstLikeStatus.current !== state.isLiked,
  );

  React.useEffect(() => {
    setState((prev) => ({
      ...prev,
      isLiked: isLiked,
      likeCount: likeCount ?? 0,
    }));

    firstLikeStatus.current = isLiked;
  }, [isLiked, likeCount]);

  const toggleLike = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> => {
    e.stopPropagation();

    setState((prev) => ({
      ...prev,
      isLiked: !prev.isLiked,
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
    }));

    debounced({ tweetId }).then(() => {
      utils.tweet.all.invalidate();
      utils.tweet.getById.invalidate({ id: tweetId });
    });
  };

  return {
    toggleLike,
    isLiked: state.isLiked,
    likeCount: state.likeCount,
    isLoading,
  };
};
