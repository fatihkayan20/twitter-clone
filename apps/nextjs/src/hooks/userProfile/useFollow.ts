import * as React from "react";
import { trpc } from "@/utils/trpc";
import { useDebounce } from "../common/useDebounce";

interface ReturnType {
  toggleFollow: () => void;
  isFollowed: boolean;
  isLoading: boolean;
}

interface IUseFollowProps {
  isFollowed: boolean;
  userId: string;
  username: string;
}

export const useFollow = ({
  isFollowed,
  username,
  userId,
}: IUseFollowProps): ReturnType => {
  const utils = trpc.useContext();
  const firstFollowStatus = React.useRef(isFollowed);

  const { mutateAsync: toggleFollowMutation, isLoading } =
    trpc.follow.toggleFollow.useMutation();

  const [state, setState] = React.useState({
    isFollowed,
  });

  const debounced = useDebounce(
    toggleFollowMutation,
    500,
    firstFollowStatus.current !== state.isFollowed,
  );

  React.useEffect(() => {
    setState((prev) => ({
      ...prev,
      isFollowed,
    }));

    firstFollowStatus.current = isFollowed;
  }, [isFollowed]);

  const toggleFollow = async (): Promise<void> => {
    setState((prev) => ({
      ...prev,
      isFollowed: !prev.isFollowed,
    }));

    debounced({ userId }).then(() => {
      utils.user.getByUsername.invalidate({ username });
    });
  };

  return {
    toggleFollow,
    isFollowed: state.isFollowed,
    isLoading,
  };
};
