import { BackButton } from "@/components/common/BackButton";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { CreateTweetBox } from "@/components/home/CreateTweetBox";
import { MainTweet } from "@/components/tweet/MainTweet";
import { TweetCard } from "@/components/tweet/TweetCard";
import { trpc } from "@/utils/trpc";
import Head from "next/head";
import { useRouter } from "next/router";
import * as React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const TweetDetailPage: React.FC = () => {
  const router = useRouter();
  const { tweetId } = router.query;

  const {
    data: tweetDetail,
    isLoading: isDetailLoading,
    refetch: refetchTweetDetail,
  } = trpc.tweet.getById.useQuery(
    {
      id: tweetId as string,
    },
    {
      enabled: !!tweetId,
    },
  );

  const {
    data: subTweetList,
    isLoading: isSubTweetsLoading,
    fetchNextPage: fetchMoreSubTweets,
    refetch: refetchSubTweets,
    hasNextPage,
  } = trpc.tweet.getSubTweets.useInfiniteQuery(
    {
      limit: 15,
      id: tweetId as string,
    },
    {
      enabled: !!tweetId,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const refetchData = React.useCallback(() => {
    refetchTweetDetail();
    refetchSubTweets();
  }, [refetchTweetDetail, refetchSubTweets]);

  const subTweets = React.useMemo(() => {
    return subTweetList?.pages?.flatMap((page) => page.items) ?? [];
  }, [subTweetList]);

  if (isDetailLoading || isSubTweetsLoading) {
    return <LoadingSpinner />;
  }

  if (!tweetDetail) {
    return (
      <div className="flex-1 items-center justify-center">
        <div className="text-black">Tweet not found</div>
      </div>
    );
  }

  return (
    <div className="flex-1 ">
      <Head>
        <title>
          {tweetDetail?.user?.name} on Twixer: &rsquo;{tweetDetail?.content}
          &rsquo;
        </title>
      </Head>

      <BackButton title="Post" />

      <MainTweet tweet={tweetDetail} />

      <CreateTweetBox parentId={tweetId as string} />

      <InfiniteScroll
        dataLength={subTweets?.length ?? 0}
        next={fetchMoreSubTweets}
        hasMore={hasNextPage ?? false}
        loader={
          <div className="mt-3 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        }
        refreshFunction={refetchData}
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
        {subTweets?.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default TweetDetailPage;
