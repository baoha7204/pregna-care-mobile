import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { View } from "@ant-design/react-native";

import useSession from "@/hooks/useSession";
import AuthForm from "@/components/AuthForm";
import { commonStyles } from "@/styles/common";

const SignupScreen = () => {
  const { signUp } = useSession();

  return (
    <View style={commonStyles.container}>
      <AuthForm mode="sign-up" onSubmit={signUp} />
      <Link href="/sign-in" asChild>
        <TouchableOpacity>
          <Text style={commonStyles.text}>Have an account? Sign in</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({});

export default SignupScreen;
