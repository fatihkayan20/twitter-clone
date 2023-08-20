/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

export const useDebounce = (
  fn: any,
  delay: number,
  cancel?: boolean,
): ((...args: any[]) => Promise<any>) => {
  const timer = React.useRef<NodeJS.Timeout>();

  const debounced = (...args: any[]): Promise<any> => {
    clearTimeout(timer.current);

    return new Promise((resolve) => {
      timer.current = setTimeout(() => {
        if (cancel) {
          return;
        }

        resolve(fn(...args));
      }, delay);
    });
  };

  return debounced;
};
