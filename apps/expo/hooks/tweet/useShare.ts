import * as React from "react";
import { Share } from "react-native";

export const useShare = (content: string) => {
  const handleShareTweet = React.useCallback(() => {
    Share.share({
      message: content,
    });
  }, [content]);

  return {
    handleShareTweet,
  };
};
