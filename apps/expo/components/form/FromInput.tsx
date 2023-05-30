import * as React from "react";
import { Text, TextInput, View } from "react-native";

interface FromInputProps extends React.ComponentProps<typeof TextInput> {
  error?: string;
}
export const FromInput: React.FunctionComponent<FromInputProps> = (props) => {
  return (
    <View className="my-3">
      <TextInput
        {...props}
        className={`  w-full rounded-md border border-${
          props.error ? "red-500" : "gray-500"
        } p-2
      text-black

      ${props.className}`}
      />
      {props.error && (
        <Text className="mt-1 text-xs text-red-500">{props.error}</Text>
      )}
    </View>
  );
};
