import { Context } from "../context";

const getByUsername = async (
  ctx: Context,
  input: {
    username: string;
  },
) => {
  const user = await ctx.prisma.user.findFirstOrThrow({
    where: {
      username: input.username,
    },
    include: {
      tweets: {
        where: {
          parent: null,
        },
      },
    },
  });

  const { tweets, ...rest } = user;

  return {
    ...rest,
    tweetCount: tweets.length,
  };
};

export default {
  getByUsername,
};
