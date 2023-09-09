import * as React from "react";
import { FromInput } from "../components/form/FormInput";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";

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
      type: "password",
    },
  },
];

const LoginPage: React.FC = () => {
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
    <div className="flex h-full flex-1 flex-col  justify-center  p-3">
      <p className="text-xl font-bold dark:text-white">Login your account</p>
      {inputs.map((input) => (
        <FromInput
          placeholder={input.placeholder}
          onChange={(e) => handleChange(input.key, e.currentTarget.value)}
          value={state[input.key]}
          key={input.key}
          {...input.props}
        />
      ))}

      <button
        onClick={handleLogin}
        className="items-center rounded-md bg-blue-500 p-3 text-white"
      >
        <p className="text-white">Login</p>
      </button>

      {state.error && (
        <p className="mt-2 text-center text-red-500">{state.error}</p>
      )}

      <p className="mt-5 text-right dark:text-white">
        Don&apos;t you have an account?
        <button className="ml-1 text-blue-500" onClick={handleNavigateRegister}>
          Register now...
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
