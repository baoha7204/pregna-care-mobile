import { Link } from "expo-router";
import { FC, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { View } from "@ant-design/react-native";

import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/styles/theme";
import LoadingView from "./LoadingView";

type AuthFormType = {
  email: string;
  password: string;
};

type AuthFormPropsType = {
  mode: "sign-in" | "sign-up";
  onSubmit: (email: string, password: string) => Promise<void>;
};

const AuthForm: FC<AuthFormPropsType> = ({ mode, onSubmit }) => {
  const [auth, setAuth] = useState<AuthFormType>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const title = mode === "sign-in" ? "Sign In" : "Sign Up";

  const handleChange = (key: keyof AuthFormType, value: string) => {
    setAuth((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    Animated.timing(translateY, {
      toValue: 500,
      duration: 500,
      useNativeDriver: true,
    }).start();

    try {
      // Pass the credentials to the parent component to handle the authentication logic
      await onSubmit(auth.email, auth.password);
      // No need to navigate here - the parent component will handle it
    } catch (error) {
      // Reset animation if there's an error
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <LoadingView />
      ) : (
        <View style={styles.contentContainer}>
          <Animated.View
            style={[styles.formCard, { transform: [{ translateY }] }]}
          >
            <Text style={styles.formTilte}>{title}</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={auth.email}
                  onChangeText={(text) => handleChange("email", text)}
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.textInput, styles.passwordInput]}
                    value={auth.password}
                    onChangeText={(text) => handleChange("password", text)}
                    placeholder="Enter your password"
                    secureTextEntry={!isPasswordVisible}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.visibilityIcon}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    <Ionicons
                      name={
                        isPasswordVisible ? "eye-off-outline" : "eye-outline"
                      }
                      size={24}
                      color="#888"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.signInButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.signInButtonText}>{title}</Text>
            </TouchableOpacity>

            {/* OR Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In Button */}
            {/* {mode === "sign-in" && (
              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
              >
                <View style={styles.googleButtonContent}>
                  <Text style={styles.googleIcon}>G</Text>
                  <Text style={styles.googleButtonText}>
                    Continue with Google
                  </Text>
                </View>
              </TouchableOpacity>
            )} */}

            {/* Create Account Link */}
            {mode === "sign-in" ? (
              <Link href="/sign-up" asChild>
                <TouchableOpacity style={styles.createAccountButton}>
                  <Text style={styles.createAccountText}>
                    Create an account
                  </Text>
                </TouchableOpacity>
              </Link>
            ) : (
              <Link href="/sign-in" asChild>
                <TouchableOpacity style={styles.createAccountButton}>
                  <Text style={styles.createAccountText}>
                    Have an account? Sign in
                  </Text>
                </TouchableOpacity>
              </Link>
            )}
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.primaryLight,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  formTilte: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    gap: 10,
    marginBottom: 20,
  },
  input: {
    fontSize: 22,
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: theme.secondaryLight,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: theme.textPrimary,
    borderWidth: 1,
    borderColor: theme.borderPrimary,
    borderRadius: 12,
    padding: 14,
    width: "100%",
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  passwordInput: {
    paddingRight: 50,
  },
  visibilityIcon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: "-50%" }],
  },
  signInButton: {
    backgroundColor: theme.primary,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
  },
  signInButtonText: {
    color: theme.textPrimary,
    fontSize: 18,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.borderPrimary,
  },
  dividerText: {
    color: "#888",
    paddingHorizontal: 16,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.textPrimary,
    borderWidth: 1,
    borderColor: theme.borderPrimary,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
  },
  googleButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: "#333",
  },
  createAccountButton: {
    marginTop: 20,
  },
  createAccountText: {
    color: theme.link,
    textAlign: "center",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: theme.primaryDisabled,
  },
  formCard: {
    backgroundColor: theme.textPrimary,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: theme.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tinyLogo: {
    width: 30,
    height: 30,
  },
  viewLoading: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  titleLoading: { fontSize: 24, fontWeight: "bold", color: theme.primary },
});

export default AuthForm;
