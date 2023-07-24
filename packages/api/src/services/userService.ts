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
      _count: {
        select: {
          tweets: true,
        },
      },
    },
  });

  return user;
};

export default {
  getByUsername,
};
