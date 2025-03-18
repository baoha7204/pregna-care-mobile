import { StyleSheet, View, Alert } from "react-native";
import { router } from "expo-router";
import { useEffect } from "react";

import AuthForm from "@/components/AuthForm";
import useSession from "@/hooks/useSession";
import { commonStyles } from "@/styles/common";
import React from "react";

const SigninScreen = () => {
  const { signIn, status } = useSession();

  useEffect(() => {
    // If already authenticated, redirect to home
    if (status.authenticated) {
      router.replace("/(app)/(tabs)/(home)");
    }
  }, [status.authenticated]);

  const handleSignIn = async (email: string, password: string) => {
    const success = await signIn(email, password);
    if (success) {
      router.replace("/(app)/(tabs)/(home)");
    } else {
      Alert.alert(
        "Sign In Failed",
        "Invalid email or password. Please try again."
      );
    }
  };

  return (
    <View style={commonStyles.container}>
      <AuthForm mode="sign-in" onSubmit={handleSignIn} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default SigninScreen;
