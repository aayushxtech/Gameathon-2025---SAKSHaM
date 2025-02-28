import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, createContext } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebaseConfig";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Create Auth Context
export const AuthContext = createContext<{
  user: User | null;
  isLoading: boolean;
}>({
  user: null,
  isLoading: true,
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!loaded || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthContext.Provider value={{ user, isLoading }}>
          <Slot />
          <StatusBar style="auto" />
        </AuthContext.Provider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
