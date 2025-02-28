import React, { useState, useEffect } from "react";
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
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

const { width } = Dimensions.get("window");

export default function RegisterScreen() {
  // State Management
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Focus states
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];
  const shakeAnimation = useState(new Animated.Value(0))[0];

  // Start animations when component mounts
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

  // Animation functions
  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form submission
  const handleRegister = async () => {
    // Form validation
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setErrorMessage("Please fill in all fields");
      startShake();
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      startShake();
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      startShake();
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      startShake();
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: Replace with actual registration logic
      console.log("Registering with:", { name, email, password });

      // Navigate to main app after successful registration
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Registration failed. Please try again.");
      startShake();
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation
  const navigateToLogin = () => {
    router.push("/auth/login");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <StatusBar style="dark" />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.content}>
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
            </Animated.View>

            {/* Form Section */}
            <Animated.View
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { translateX: shakeAnimation },
                  ],
                },
              ]}
            >
              <ThemedText type="defaultSemiBold" style={styles.welcomeText}>
                Create Account
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

              {/* Name Field */}
              <View
                style={[
                  styles.inputContainer,
                  isNameFocused && styles.inputContainerFocused,
                ]}
              >
                <IconSymbol
                  name="person"
                  size={20}
                  color={isNameFocused ? "#4CAF50" : "#A8A8A8"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#A8A8A8"
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                />
              </View>

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
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <IconSymbol
                    name={showPassword ? "eye.slash" : "eye"}
                    size={20}
                    color={isPasswordFocused ? "#4CAF50" : "#A8A8A8"}
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password Field */}
              <View
                style={[
                  styles.inputContainer,
                  isConfirmPasswordFocused && styles.inputContainerFocused,
                ]}
              >
                <IconSymbol
                  name="lock"
                  size={20}
                  color={isConfirmPasswordFocused ? "#4CAF50" : "#A8A8A8"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#A8A8A8"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => setIsConfirmPasswordFocused(true)}
                  onBlur={() => setIsConfirmPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <IconSymbol
                    name={showConfirmPassword ? "eye.slash" : "eye"}
                    size={20}
                    color={isConfirmPasswordFocused ? "#4CAF50" : "#A8A8A8"}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <ThemedText style={styles.dividerText}>
                  Create your account
                </ThemedText>
                <View style={styles.divider} />
              </View>

              <TouchableOpacity
                style={[
                  styles.registerButton,
                  isLoading && styles.registerButtonDisabled,
                ]}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <ThemedText style={styles.registerButtonText}>
                    Register
                  </ThemedText>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Login link section */}
            <Animated.View
              style={[
                styles.loginContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <ThemedText style={styles.hasAccountText}>
                Already have an account?{" "}
              </ThemedText>
              <TouchableOpacity
                onPress={navigateToLogin}
                hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
              >
                <ThemedText style={styles.loginLink}>Login</ThemedText>
              </TouchableOpacity>
            </Animated.View>
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
    marginBottom: 10,
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
    display: "flex",
    alignContent: "center",
    textAlign: "center",
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
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
    letterSpacing: 0.3,
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
    fontWeight: "700",
    letterSpacing: 0.5,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    width: "100%",
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    paddingHorizontal: 12,
    color: "#888888",
    fontSize: 14,
    fontWeight: "500",
  },
  registerButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 14,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 10,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  registerButtonDisabled: {
    backgroundColor: "#81C784",
    shadowOpacity: 0.1,
  },
  registerButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 30,
    paddingVertical: 10,
  },
  hasAccountText: {
    fontSize: 15,
    color: "#666666",
  },
  loginLink: {
    color: "#4CAF50",
    fontWeight: "700",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
