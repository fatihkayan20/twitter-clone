import { Context } from "../context";
import { IGetByUsernameInputs } from "../validators/user/getByUsernameValidator";

const getByUsername = async (ctx: Context, input: IGetByUsernameInputs) => {
  const user = await ctx.prisma.user.findFirstOrThrow({
    where: {
      username: input.username,
    },
    include: {
      tweets: {
        where: {
          parent: null,
        },
        select: {
          id: true,
        },
      },
      followings: {
        select: {
          id: true,
        },
      },
    },
  });

  const { tweets, followings, ...rest } = user;

  return {
    ...rest,
    tweetCount: tweets.length,
    isFollowed: followings.length > 0,
  };
};

export default {
  getByUsername,
};
