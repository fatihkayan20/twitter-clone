import * as React from "react";
import { ITab } from "../../types/ITab";
import { trpc } from "../../utils/trpc";
import { LoadingSpinner } from "../common/LoadingSpinner";
import InfiniteScroll from "react-infinite-scroll-component";
import { TweetCard } from "../tweet/TweetCard";

interface TweetListProps {
  tab: ITab;
}

export const TweetList: React.FC<TweetListProps> = ({ tab }) => {
  const {
    isLoading,
    isFetching,
    data: tweets,
    hasNextPage,
    refetch: refetchTweets,
    fetchNextPage,
  } = trpc.tweet.all.useInfiniteQuery(
    {
      limit: 15,
      isFollowingOnly: tab === ITab.Following,
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
      <div className="mt-5 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className=" scrollbar-hide flex-1">
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
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </InfiniteScroll>
    </div>
  );
};
