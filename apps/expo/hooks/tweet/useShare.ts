import * as React from "react";
import { Share } from "react-native";

interface ReturnType {
  handleShareTweet: () => void;
}

export const useShare = (content: string): ReturnType => {
  const handleShareTweet = React.useCallback(() => {
    Share.share({
      message: content,
    });
  }, [content]);

  return {
    handleShareTweet,
  };
};
