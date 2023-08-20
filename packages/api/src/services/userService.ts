import { Context } from "../context";
import { IGetByUsernameInputs } from "../validators/user/getByUsernameValidator";
import { ISetPushTokenValidatorInputs } from "../validators/user/setPushTokenValidator";

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

export const setPushToken = async (
  ctx: Context,
  input: ISetPushTokenValidatorInputs,
) => {
  const user = await ctx.prisma.user.update({
    where: {
      id: ctx.auth.userId as string,
    },
    data: {
      pushToken: input.token,
    },
  });

  return user;
};

export default {
  getByUsername,
  setPushToken,
};
