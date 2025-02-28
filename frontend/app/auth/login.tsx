import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Focus states
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to main app after successful login
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    router.push("/auth/register");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.content}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <ThemedText type="title" style={styles.logoText}>
                  S
                </ThemedText>
              </View>
              <ThemedText type="title" style={styles.appTitle}>
                SAKSHaM
              </ThemedText>
              <ThemedText style={styles.tagline}>
                For the Community . By the Community
              </ThemedText>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              <ThemedText type="defaultSemiBold" style={styles.welcomeText}>
                Welcome Back
              </ThemedText>

              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <IconSymbol
                    name="exclamationmark.circle"
                    size={16}
                    color="#FF5252"
                  />
                  <ThemedText style={styles.errorText}>
                    {errorMessage}
                  </ThemedText>
                </View>
              ) : null}

              {/* Email Field */}
              <View
                style={[
                  styles.inputContainer,
                  isEmailFocused && styles.inputContainerFocused,
                ]}
              >
                <IconSymbol
                  name="envelope"
                  size={20}
                  color={isEmailFocused ? "#4CAF50" : "#A8A8A8"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#A8A8A8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                />
              </View>

              {/* Password Field */}
              <View
                style={[
                  styles.inputContainer,
                  isPasswordFocused && styles.inputContainerFocused,
                ]}
              >
                <IconSymbol
                  name="lock"
                  size={20}
                  color={isPasswordFocused ? "#4CAF50" : "#A8A8A8"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#A8A8A8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <IconSymbol
                    name={showPassword ? "eye.slash" : "eye"}
                    size={20}
                    color={isPasswordFocused ? "#4CAF50" : "#A8A8A8"}
                  />
                </TouchableOpacity>
              </View>

              {/* <TouchableOpacity style={styles.forgotPasswordContainer}>
                <ThemedText style={styles.forgotPasswordText}>
                  Forgot Password?
                </ThemedText>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <ThemedText style={styles.loginButtonText}>Login</ThemedText>
                )}
              </TouchableOpacity>
            </View>

            {/* Register link section */}
            <View style={styles.registerContainer}>
              <ThemedText style={styles.noAccountText}>
                Don't have an account?{" "}
              </ThemedText>
              <TouchableOpacity onPress={navigateToRegister}>
                <ThemedText style={styles.registerLink}>Register</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.07,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: "#FFFFFF",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 30,
  },
  logoCircle: {
    width: 90,
    height: 90,
    backgroundColor: "#4CAF50",
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    elevation: 8,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  logoText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    lineHeight: 46,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
    opacity: 0.8,
  },
  formContainer: {
    width: "100%",
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 28,
    marginBottom: 28,
    textAlign: "center",
    color: "#333333",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FF5252",
  },
  errorText: {
    color: "#FF5252",
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    marginBottom: 24,
    height: 58,
    paddingHorizontal: 16,
    backgroundColor: "#F8F8F8",
  },
  inputContainerFocused: {
    borderColor: "#4CAF50",
    backgroundColor: "#FFFFFF",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 58,
    color: "#333333",
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  // forgotPasswordContainer: {
  //   alignSelf: "flex-end",
  //   marginBottom: 20,
  // },
  // forgotPasswordText: {
  //   color: "#4CAF50",
  //   fontSize: 14,
  //   fontWeight: "600",
  // },
  loginButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 14,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  loginButtonDisabled: {
    backgroundColor: "#81C784",
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    paddingVertical: 10,
  },
  noAccountText: {
    fontSize: 15,
    color: "#666666",
  },
  registerLink: {
    color: "#4CAF50",
    fontWeight: "700",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
