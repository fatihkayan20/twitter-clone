import { useSignUp } from "@clerk/clerk-expo";
import * as React from "react";
import { Pressable, Text, View } from "react-native";
import { FromInput } from "../../components/form/FromInput";
import { useRouter } from "expo-router";

interface IInput {
  placeholder: string;
  key:
    | "firstName"
    | "username"
    | "emailAddress"
    | "birthday"
    | "password"
    | "confirmPassword";
  props?: Partial<React.ComponentProps<typeof FromInput>>;
}

const inputs: IInput[] = [
  {
    placeholder: "Name",
    key: "firstName",
  },
  {
    placeholder: "Username",
    key: "username",
  },
  {
    placeholder: "Email address",
    key: "emailAddress",
  },
  {
    placeholder: "Date of birth",
    key: "birthday",
  },
  {
    placeholder: "Password",
    key: "password",
    props: {
      secureTextEntry: true,
    },
  },
  {
    placeholder: "Confirm password",
    key: "confirmPassword",
    props: {
      secureTextEntry: true,
    },
  },
];

interface IClerkSignUpError {
  errors: {
    meta: {
      paramName: string;
    };
    longMessage: string;
  }[];
}

export default function Page(): JSX.Element {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [state, setState] = React.useState({
    emailAddress: "",
    password: "",
    pendingVerification: false,
    code: "",
    birthday: "",
    firstName: "",
    confirmPassword: "",
    username: "",
  });

  const [errors, setErrors] = React.useState({
    emailAddress: "",
    password: "",
    birthday: "",
    firstName: "",
    confirmPassword: "",
    username: "",
  });

  const handleChange = (key: string, value: string): void => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNavigateLogin = (): void => {
    router.push("/login");
  };

  const handleSubmit = async (): Promise<void> => {
    if (!isLoaded) {
      return;
    }

    setErrors((prev) => ({
      ...prev,
      confirmPassword: "",
      emailAddress: "",
      password: "",
      birthday: "",
      firstName: "",
      username: "",
    }));

    if (state.password.length < 8 || state.password !== state.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          "Password must be at least 8 characters long and match the confirm password field.",
      }));

      return;
    }

    try {
      const { emailAddress, password, birthday, username } = state;

      await signUp.create({
        emailAddress,
        password,
        birthday,
        username,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to our pending section.
      setState((prev) => ({
        ...prev,
        pendingVerification: true,
      }));
    } catch (err) {
      const errors = err as IClerkSignUpError;

      let newErrors = {};

      errors.errors.forEach((error) => {
        newErrors = {
          ...newErrors,
          [error.meta.paramName]: error.longMessage,
        };
      });

      setErrors((prev) => ({
        ...prev,
        ...newErrors,
      }));
    }
  };

  const onPressVerify = async (): Promise<void> => {
    if (!isLoaded) {
      return;
    }

    const completeSignUp = await signUp.attemptEmailAddressVerification({
      code: state.code,
    });

    if (completeSignUp.status === "complete") {
      await setActive({ session: completeSignUp.createdSessionId });
      router.push("/tweets");
    }
  };

  if (state.pendingVerification) {
    return (
      <View className="flex-1 justify-center p-3">
        <Text className="text-xl font-bold">Verify your email</Text>
        <FromInput
          placeholder="Verification code"
          value={state.code}
          onChangeText={(value) => handleChange("code", value)}
        />
        <Pressable
          onPress={onPressVerify}
          className="items-center rounded-md bg-blue-500 p-3 text-white"
        >
          <Text className="text-white">Verify</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center p-3">
      <Text className="text-xl font-bold">Create your account</Text>
      {inputs.map((input) => (
        <FromInput
          placeholder={input.placeholder}
          onChangeText={(value) => handleChange(input.key, value)}
          value={state[input.key]}
          key={input.key}
          error={errors[input.key]}
          {...input.props}
        />
      ))}

      <Pressable
        onPress={handleSubmit}
        className="items-center rounded-md bg-blue-500 p-3 text-white"
      >
        <Text className="text-white">Create account</Text>
      </Pressable>

      <Text className="mt-5 text-right ">
        Do you have already an account?{" "}
        <Text className="text-blue-500" onPress={handleNavigateLogin}>
          Login...
        </Text>
      </Text>
    </View>
  );
}
