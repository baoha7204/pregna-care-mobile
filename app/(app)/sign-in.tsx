import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";

import AuthForm from "@/components/AuthForm";
import useSession from "@/hooks/useSession";
import { commonStyles } from "@/styles/common";
import React from "react";

const SigninScreen = () => {
  const { signIn } = useSession();

  return (
    <View style={commonStyles.container}>
      <AuthForm mode="sign-in" onSubmit={signIn} />
      {/* <Link href="/sign-up" asChild>
        <TouchableOpacity>
          <Text style={commonStyles.text}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </Link> */}
    </View>
  );
};

const styles = StyleSheet.create({});

export default SigninScreen;
