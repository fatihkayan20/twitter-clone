import { useUser } from "@clerk/nextjs";
import * as React from "react";
import { Avatar } from "../common/Avatar";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { LoadingButton } from "../common/LoadingButton";

interface CreateTweetBoxProps {
  parentId?: string;
}

export const CreateTweetBox: React.FC<CreateTweetBoxProps> = ({ parentId }) => {
  const { user } = useUser();
  const utils = trpc.useContext();
  const router = useRouter();

  const [tweet, setTweet] = React.useState("");

  const { mutateAsync: createTweet, isLoading: isCreating } =
    trpc.tweet.createTweet.useMutation({
      onSuccess: (data) => {
        utils.tweet.all.invalidate();

        router.push(`/user/${data.user?.username}/status/${data.id}`);
      },
    });

  const disabled = tweet.length === 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (disabled) return;

    createTweet({ content: tweet, parentId });
  };

  return (
    <form
      className="flex w-full space-x-3 border-b p-3"
      onSubmit={handleSubmit}
    >
      <Avatar url={user?.imageUrl ?? ""} />
      <div className="flex w-full flex-col items-end justify-end space-y-4">
        <textarea
          className="h-24 w-full  resize-none border-b bg-transparent p-2 outline-none dark:text-white"
          placeholder={parentId ? "Post your reply" : "What's happening?"}
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
        />
        <LoadingButton
          className="rounded-full bg-blue-500 px-3 py-2 font-bold text-white disabled:opacity-50"
          type="submit"
          isLoading={isCreating}
          disabled={disabled}
        >
          Post
        </LoadingButton>
      </div>
    </form>
  );
};
