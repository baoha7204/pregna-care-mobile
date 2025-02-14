import { useRouter } from "expo-router";
import { FC, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Button, Input, List, View } from "@ant-design/react-native";

import { commonStyles } from "@/styles/common";

type AuthFormType = {
  email: string;
  password: string;
};

type AuthFormPropsType = {
  mode: "sign-in" | "sign-up";
  onSubmit: (email: string, password: string) => Promise<void>;
};

const AuthForm: FC<AuthFormPropsType> = ({ mode, onSubmit }) => {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthFormType>({
    email: "",
    password: "",
  });

  const title = mode === "sign-in" ? "Sign in" : "Sign up";

  const handleChange = (key: keyof AuthFormType, value: string) => {
    setAuth((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(auth.email, auth.password);
    if (mode === "sign-in") {
      router.push("/(app)/(tabs)/(home)");
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <View>
      <Text style={[commonStyles.text, { marginBottom: 15 }]}>{title}</Text>
      <View style={styles.inputContainer}>
        <List renderHeader="Email">
          <List.Item>
            <Input
              placeholder="abc@example.com"
              value={auth.email}
              onChangeText={(text) => handleChange("email", text)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </List.Item>
        </List>
        <List renderHeader="Password">
          <List.Item>
            <Input
              value={auth.password}
              onChangeText={(text) => handleChange("password", text)}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />
          </List.Item>
        </List>
      </View>
      <Button onPress={handleSubmit}>{title}</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    gap: 10,
    marginBottom: 20,
  },
  input: {
    fontSize: 22,
  },
});

export default AuthForm;
