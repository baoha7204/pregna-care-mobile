import { StyleSheet } from "react-native";
import { View } from "@ant-design/react-native";

import useSession from "@/hooks/useSession";
import AuthForm from "@/components/AuthForm";
import { commonStyles } from "@/styles/common";
import React from "react";

const SignupScreen = () => {
  const { signUp } = useSession();

  return (
    <View style={commonStyles.container}>
      <AuthForm mode="sign-up" onSubmit={signUp} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default SignupScreen;
