import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { TweetCard } from "@/components/tweet/TweetCard";
import { UserProfileHeader } from "@/components/userProfile/UserProfileHeader";
import { trpc } from "@/utils/trpc";
import Head from "next/head";
import { useRouter } from "next/router";
import * as React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface UserProfilePageProps {}

const UserProfilePage: React.FC<UserProfilePageProps> = () => {
  const router = useRouter();
  const { username } = router.query;

  const { data: userData } = trpc.user.getByUsername.useQuery({
    username: username as string,
  });

  const {
    isLoading,
    hasNextPage,
    data: tweets = { pages: [] },
    refetch: refetchTweets,
    fetchNextPage,
  } = trpc.tweet.userTweets.useInfiniteQuery(
    {
      username: username as string,
      limit: 15,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const allTweets = React.useMemo(() => {
    return tweets?.pages.flatMap((page) => page.items);
  }, [tweets]);

  if (isLoading) {
    return (
      <div className="flex-1 p-3">
        <LoadingSpinner />
      </div>
    );
  }

  if (!userData) {
    return <div className="flex-1 p-3 ">User not found</div>;
  }

  return (
    <div>
      <Head>
        <title>
          {userData.name} (@{userData.username}) / Twixer
        </title>
      </Head>
      <UserProfileHeader user={userData} tweetCount={userData.tweetCount} />

      <InfiniteScroll
        dataLength={allTweets?.length ?? 0}
        next={fetchNextPage}
        hasMore={hasNextPage ?? false}
        loader={
          <div className="mt-3 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        }
        refreshFunction={refetchTweets}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 className="mt-3 text-center dark:text-white">
            &#8595; Pull down to refresh
          </h3>
        }
        className="scrollbar-hide"
        releaseToRefreshContent={
          <h3 className="mt-3 text-center dark:text-white">
            &#8593; Release to refresh
          </h3>
        }
      >
        {allTweets?.map((tweet) => (
          <TweetCard tweet={tweet} key={tweet.id} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default UserProfilePage;
