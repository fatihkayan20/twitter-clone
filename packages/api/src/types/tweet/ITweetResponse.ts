interface ILikeATweetResponse {
  isLiked: boolean;
  tweetId: string;
  isSubTweet: boolean;
  users: {
    likedBy: string;
    author: string;
  };
}
