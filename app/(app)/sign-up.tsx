import { View } from "@ant-design/react-native";
import { useRouter } from "expo-router";

import useSession from "@/hooks/useSession";
import AuthForm from "@/components/AuthForm";
import { commonStyles } from "@/styles/common";
import React from "react";

const SignupScreen = () => {
  const { signUp } = useSession();
  const router = useRouter();

  const handleSignUp = async (email: string, password: string) => {
    const result = await signUp(email, password);
    if (result) {
      router.push({
        pathname: "/otp-verification",
        params: {
          userId: result.id,
          email: result.email,
        },
      });
    }
  };

  return (
    <View style={commonStyles.container}>
      <AuthForm mode="sign-up" onSubmit={handleSignUp} />
    </View>
  );
};

export default SignupScreen;
