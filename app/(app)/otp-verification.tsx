import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "@/styles/theme";
import useSession from "@/hooks/useSession";
import LoadingView from "@/components/LoadingView";

const OTP_TIMEOUT = 10 * 60; // 10 minutes in seconds

const OtpVerificationScreen = () => {
  const { userId, email } = useLocalSearchParams();
  const { verifyOtp, resendOtp } = useSession();
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(OTP_TIMEOUT);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>(Array(6).fill(null));

  // Check if the OTP is complete (all 6 digits entered)
  const isOtpComplete = otp.every((digit) => digit !== "");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      // Handle paste case
      const pastedValue = text.slice(0, 6);
      const chars = pastedValue.split("").slice(0, 6);
      const newOtp = [...otp];

      chars.forEach((char, i) => {
        if (i + index < 6) {
          newOtp[i + index] = char;
        }
      });

      setOtp(newOtp);

      // Focus the appropriate input after paste
      if (index + chars.length < 6) {
        inputRefs.current[index + chars.length]?.focus();
      } else {
        inputRefs.current[5]?.blur();
      }
      return;
    }

    // Normal case: single character input
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-advance to next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace - move to previous input
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      Alert.alert("Validation Error", "Please enter all 6 digits of the OTP");
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(userId as string, otpString);
      router.push("/(app)/(tabs)/(home)");
    } catch (error) {
      Alert.alert(
        "Verification Failed",
        "The OTP you entered is invalid or has expired. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (timeLeft === 0) {
      resendOtp(userId as string);
      setTimeLeft(OTP_TIMEOUT);
      Alert.alert(
        "OTP Sent",
        "A new verification code has been sent to your email."
      );
    }
  };

  const goBack = () => {
    router.back();
  };

  if (loading) {
    return <LoadingView />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color={theme.secondary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to{"\n"}
            <Text style={styles.emailText}>{email}</Text>
          </Text>
        </View>

        <View style={styles.otpContainer}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                style={styles.otpInput}
                value={otp[index]}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={6} // Allow paste to work
                selectTextOnFocus
                autoFocus={index === 0}
              />
            ))}
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            {timeLeft > 0
              ? `Code expires in ${formatTime(timeLeft)}`
              : "Code has expired"}
          </Text>

          <TouchableOpacity
            onPress={handleResendOtp}
            disabled={timeLeft > 0}
            style={timeLeft === 0 ? styles.resendActive : styles.resendInactive}
          >
            <Text
              style={
                timeLeft === 0
                  ? styles.resendTextActive
                  : styles.resendTextInactive
              }
            >
              Resend Code
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={
            isOtpComplete ? styles.verifyButton : styles.verifyButtonDisabled
          }
          onPress={handleSubmit}
          disabled={!isOtpComplete}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryLight,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    padding: 8,
    marginTop: 8,
    width: 40,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.secondary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.secondaryLight,
    textAlign: "center",
    lineHeight: 22,
  },
  emailText: {
    fontWeight: "600",
    color: theme.primary,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: theme.borderPrimary,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: theme.textPrimary,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  timerText: {
    fontSize: 16,
    color: theme.secondaryLight,
    marginBottom: 10,
  },
  resendActive: {
    padding: 8,
  },
  resendInactive: {
    padding: 8,
    opacity: 0.5,
  },
  resendTextActive: {
    color: theme.primary,
    fontWeight: "600",
    fontSize: 16,
  },
  resendTextInactive: {
    color: theme.secondaryLight,
    fontSize: 16,
  },
  verifyButton: {
    backgroundColor: theme.primary,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  verifyButtonDisabled: {
    backgroundColor: theme.primaryDisabled || "#B8C9E7", // Fallback if theme.primaryDisabled is not defined
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  verifyButtonText: {
    color: theme.textPrimary,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default OtpVerificationScreen;
