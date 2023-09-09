import * as React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = (props) => {
  const { isLoading, ...rest } = props;

  return (
    <button {...rest}>{isLoading ? <LoadingSpinner /> : props.children}</button>
  );
};
