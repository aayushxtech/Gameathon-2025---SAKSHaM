import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  // Create refs for input fields
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Focus states
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    Keyboard.dismiss();
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

  const focusPasswordField = () => {
    passwordRef.current?.focus();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <StatusBar style="dark" />
      <LinearGradient
        colors={["#f8f9fa", "#e9ecef"]}
        style={styles.gradientBackground}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
      >
        <ThemedView
          style={styles.content}
          onStartShouldSetResponder={() => false}
        >
          {/* Logo Section */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.logoCircleWrapper}>
              <LinearGradient
                colors={["#4CAF50", "#2E7D32"]}
                style={styles.logoCircle}
              >
                <ThemedText type="title" style={styles.logoText}>
                  S
                </ThemedText>
              </LinearGradient>
            </View>
            <ThemedText type="title" style={styles.appTitle}>
              SAKSHaM
            </ThemedText>
            <ThemedText style={styles.tagline}>
              For the Community . By the Community
            </ThemedText>
          </Animated.View>

          {/* Form Section */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
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
                <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
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
                ref={emailRef}
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#A8A8A8"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                returnKeyType="next"
                onSubmitEditing={focusPasswordField}
                blurOnSubmit={false}
                autoComplete="email"
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
                ref={passwordRef}
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A8A8A8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                autoComplete="password"
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

            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <ThemedText style={styles.forgotPasswordText}>
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButtonWrapper}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  isLoading ? ["#81C784", "#A5D6A7"] : ["#4CAF50", "#2E7D32"]
                }
                start={[0, 0]}
                end={[1, 0]}
                style={styles.loginButton}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <ThemedText style={styles.loginButtonText}>Login</ThemedText>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Register link section */}
          <Animated.View
            style={[
              styles.registerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <ThemedText style={styles.noAccountText}>
              Don't have an account?{" "}
            </ThemedText>
            <TouchableOpacity onPress={navigateToRegister}>
              <ThemedText style={styles.registerLink}>Register</ThemedText>
            </TouchableOpacity>
          </Animated.View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: height,
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.07,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: "transparent",
    minHeight: height - 40, // Ensure content takes full screen minus status bar
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 30,
  },
  logoCircleWrapper: {
    shadowColor: "#388E3C",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
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
    letterSpacing: 0.3,
  },
  formContainer: {
    width: "100%",
    paddingVertical: 24,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 20,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    marginBottom: 28,
    textAlign: "center",
    color: "#333333",
    letterSpacing: 0.5,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 12,
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
    borderRadius: 14,
    marginBottom: 20,
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
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 24,
    marginTop: 4,
  },
  forgotPasswordText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
  },
  loginButtonWrapper: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#388E3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButton: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
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
    marginTop: 24,
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
