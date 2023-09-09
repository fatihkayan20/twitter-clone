import * as React from "react";

interface FromInputProps extends React.HTMLProps<HTMLInputElement> {
  error?: string;
}
export const FromInput: React.FunctionComponent<FromInputProps> = (props) => {
  return (
    <div className="my-3">
      <input
        {...props}
        className={`  w-full rounded-md border border-${
          props.error ? "red-500" : "gray-500"
        } p-2
      text-black

      ${props.className}`}
      />
      {props.error && (
        <p className="mt-1 text-xs text-red-500">{props.error}</p>
      )}
    </div>
  );
};
