import * as React from "react";
import { FromInput } from "../components/form/FormInput";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "@/types/NextPageWithLayout";
import { BlankLayout } from "@/components/layout/BlankLayout";

interface IClerkSignUpError {
  errors: {
    meta: {
      paramName: string;
    };
    longMessage: string;
  }[];
}

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
      type: "password",
    },
  },
  {
    placeholder: "Confirm password",
    key: "confirmPassword",
    props: {
      type: "password",
    },
  },
];

const RegisterPage: NextPageWithLayout = () => {
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
      <div className="flex-1 justify-center p-3">
        <div className="text-xl font-bold">Verify your email</div>
        <FromInput
          placeholder="Verification code"
          value={state.code}
          onChange={(e) => handleChange("code", e.currentTarget.value)}
        />
        <button
          onClick={onPressVerify}
          className="items-center rounded-md bg-blue-500 p-3 text-white"
        >
          Verify
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col  justify-center p-10">
      <h3 className="mb-4 text-3xl font-bold dark:text-white">
        Create your account
      </h3>
      {inputs.map((input) => (
        <FromInput
          placeholder={input.placeholder}
          onChange={(e) => handleChange(input.key, e.currentTarget.value)}
          value={state[input.key]}
          key={input.key}
          error={errors[input.key]}
          {...input.props}
        />
      ))}

      <button
        onClick={handleSubmit}
        className="mt-5 items-center self-end rounded-md bg-blue-500 p-3 text-white"
      >
        Create account
      </button>

      <div className="mt-5 text-right ">
        Do you have already an account?{" "}
        <button className="ml-1 text-blue-500" onClick={handleNavigateLogin}>
          Login...
        </button>
      </div>
    </div>
  );
};

RegisterPage.getLayout = (page) => {
  return <BlankLayout>{page}</BlankLayout>;
};

export default RegisterPage;
