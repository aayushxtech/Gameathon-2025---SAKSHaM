import React, { useEffect } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, Alert } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import StoryCampaign from "@/components/StoryCampaign";
import { useUserStore } from "../app/store/userStore";

export default function StoryCampaignScreen() {
  const { userXp, decreaseXp, unlockChapter, increaseXp, unlockedChapters } =
    useUserStore();
  const router = useRouter();
  const params = useLocalSearchParams();
  const chapterParam = params.chapter;

  // Convert the chapter parameter to a number or default to 1
  const currentChapter =
    typeof chapterParam === "string" ? parseInt(chapterParam, 10) || 1 : 1;

  const handleUseXp = (amount: number) => {
    decreaseXp(amount);
  };

  const handleChapterComplete = () => {
    console.log("Chapter complete handler called");

    // Unlock the next chapter when current chapter is completed
    unlockChapter(currentChapter + 1);

    // Award XP for completing a chapter
    increaseXp(50);

    // Navigate to the next chapter or back to story selection
    if (currentChapter < 3) {
      // Assuming there are 3 chapters total
      // Navigate to the next chapter
      console.log(`Navigating to chapter ${currentChapter + 1}`);
      router.replace({
        pathname: "/story-campaign",
        params: { chapter: currentChapter + 1 },
      });
    } else {
      // Last chapter completed
      Alert.alert(
        "Campaign Complete!",
        "Congratulations! You've completed all available chapters.",
        [{ text: "Return to Home", onPress: () => router.replace("/") }]
      );
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  // Debugging
  useEffect(() => {
    console.log("Current chapter:", currentChapter);
    console.log("Unlocked chapters:", unlockedChapters);
  }, [currentChapter, unlockedChapters]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <StoryCampaign
          userXp={userXp}
          onUseXp={handleUseXp}
          currentChapter={currentChapter}
          onComplete={handleChapterComplete}
          onBack={handleBackPress}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000", // Or use your theme color
  },
  container: {
    flex: 1,
  },
});
