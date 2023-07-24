export const getNextCursor = (items: any[], limit: number) => {
  let nextCursor = undefined;

  if (items.length > limit) {
    const nextItem = items.pop();
    nextCursor = nextItem?.id;
  }

  return nextCursor;
};
