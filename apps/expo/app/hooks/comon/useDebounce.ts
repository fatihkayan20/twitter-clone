import * as React from "react";

export const useDebounce = (fn: any, delay: number, cancel?: boolean) => {
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
