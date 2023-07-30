import { Context } from "../context";
import { createUuid } from "../utils";
import { IToggleFollowInputs } from "../validators/follow/toggleFollowValidator";

const toggleFollow = async (ctx: Context, input: IToggleFollowInputs) => {
  const validId = createUuid();

  const isAlreadyFollowing = await ctx.prisma.follow.findFirst({
    where: {
      followerId: ctx.auth.userId,
      followingId: input.userId,
    },
  });

  if (isAlreadyFollowing) {
    await ctx.prisma.follow.delete({
      where: {
        id: isAlreadyFollowing.id,
      },
    });

    return {
      isFollowing: false,
      users: {
        follower: ctx.auth.userId ?? "",
        following: input.userId,
      },
    };
  }

  await ctx.prisma.follow.create({
    data: {
      id: validId,
      follower: {
        connect: {
          id: ctx.auth.userId ?? "",
        },
      },
      following: {
        connect: {
          id: input.userId,
        },
      },
    },
  });

  return {
    isFollowing: true,
    users: {
      follower: ctx.auth.userId ?? "",
      following: input.userId,
    },
  };
};

export default {
  toggleFollow,
};
