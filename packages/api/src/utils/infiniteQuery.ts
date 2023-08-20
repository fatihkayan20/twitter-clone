/* eslint-disable @typescript-eslint/no-explicit-any */
export const getNextCursor = (
  items: any[],
  limit: number,
): string | undefined => {
  let nextCursor = undefined;

  if (items.length > limit) {
    const nextItem = items.pop();
    nextCursor = nextItem?.id;
  }

  return nextCursor;
};
