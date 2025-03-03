import { StyleSheet, View } from "react-native";

import AuthForm from "@/components/AuthForm";
import useSession from "@/hooks/useSession";
import { commonStyles } from "@/styles/common";
import React from "react";

const SigninScreen = () => {
  const { signIn } = useSession();

  return (
    <View style={commonStyles.container}>
      <AuthForm mode="sign-in" onSubmit={signIn} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default SigninScreen;
