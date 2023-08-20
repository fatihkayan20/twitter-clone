import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as React from "react";
import { Pressable, Text, View } from "react-native";
import { FromInput } from "../../components/form/FromInput";

interface IInput {
  placeholder: string;
  key: "email" | "password";
  props?: Partial<React.ComponentProps<typeof FromInput>>;
}

const inputs: IInput[] = [
  {
    placeholder: "Email address",
    key: "email",
  },
  {
    placeholder: "Password",
    key: "password",
    props: {
      secureTextEntry: true,
    },
  },
];

export default function Page(): JSX.Element | null {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [state, setState] = React.useState({
    email: "",
    password: "",
    error: "",
  });

  const handleChange = (key: keyof typeof state, value: string): void => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNavigateRegister = (): void => {
    router.push("/register");
  };

  if (!isLoaded) {
    return null;
  }

  const handleLogin = async (): Promise<void> => {
    const { email, password } = state;
    setState((prev) => ({ ...prev, error: "" }));

    await signIn
      .create({
        identifier: email,
        password,
      })
      .then((result) => {
        if (result.status === "complete") {
          setActive({ session: result.createdSessionId });
        }
      })
      .catch((err) =>
        setState((prev) => ({ ...prev, error: err.errors[0].longMessage })),
      );
  };

  return (
    <View className="flex-1 justify-center p-3">
      <Text className="text-xl font-bold">Login your account</Text>
      {inputs.map((input) => (
        <FromInput
          placeholder={input.placeholder}
          onChangeText={(value) => handleChange(input.key, value)}
          value={state[input.key]}
          key={input.key}
          {...input.props}
        />
      ))}

      <Pressable
        onPress={handleLogin}
        className="items-center rounded-md bg-blue-500 p-3 text-white"
      >
        <Text className="text-white">Login</Text>
      </Pressable>

      {state.error && (
        <Text className="mt-2 text-center text-red-500">{state.error}</Text>
      )}

      <Text className="mt-5 text-right ">
        Don&apos;t you have an account?
        <Text className="text-blue-500" onPress={handleNavigateRegister}>
          Register now...
        </Text>
      </Text>
    </View>
  );
}
