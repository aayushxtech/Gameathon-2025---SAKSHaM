import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Animated, { FadeInUp, FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface DailyQuest {
  id: number;
  title: string;
  description: string;
  impact: string;
  xpReward: number;
  icon: string;
  completed: boolean;
}

interface StoryChapter {
  id: number;
  title: string;
  description: string;
  image: { uri: string };
  isLocked: boolean;
  requiredXp: number;
  reward: string;
}

// Sample daily quests data based on SDG 13
const dailyQuests: DailyQuest[] = [
  {
    id: 1,
    title: "Public Transportation Hero",
    description: "Use public transportation instead of a car today",
    impact: "Reduces carbon emissions by up to 20kg CO2",
    xpReward: 50,
    icon: "bus",
    completed: false,
  },
  {
    id: 2,
    title: "Green Diet Day",
    description: "Eat only plant-based meals today",
    impact: "Saves approximately 5kg CO2 equivalent",
    xpReward: 40,
    icon: "leaf",
    completed: false,
  },
  {
    id: 3,
    title: "Cleanup Warrior",
    description: "Pick up and properly dispose of trash in your area",
    impact: "Prevents pollution and protects wildlife",
    xpReward: 35,
    icon: "trash-bin",
    completed: true,
  },
  {
    id: 4,
    title: "Tree Planter",
    description: "Plant a tree or maintain a garden",
    impact: "Each tree absorbs about 25kg of CO2 per year",
    xpReward: 75,
    icon: "flower",
    completed: false,
  },
  {
    id: 5,
    title: "Water Saver",
    description: "Reduce water usage by taking shorter showers",
    impact: "Saves up to 40 liters of water",
    xpReward: 30,
    icon: "water",
    completed: false,
  },
];

// Story campaign chapters
const storyChapters: StoryChapter[] = [
  {
    id: 1,
    title: "The Awakening",
    description:
      "Discover the ancient powers of the Earth Guardians and your role in the battle against climate destruction.",
    image: {
      uri: "https://images.unsplash.com/photo-1476610182048-b716b8518aae",
    },
    isLocked: false,
    requiredXp: 0,
    reward: "Seed Blaster",
  },
  {
    id: 2,
    title: "Toxic Skies",
    description:
      "Battle the Smog Demons polluting the atmosphere and restore balance to the air.",
    image: {
      uri: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce",
    },
    isLocked: false,
    requiredXp: 120,
    reward: "Wind Purifier",
  },
  {
    id: 3,
    title: "Ocean's Cry",
    description:
      "Dive into the depths to confront Plasticron, the ancient monster created from humanity's waste.",
    image: {
      uri: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d",
    },
    isLocked: true,
    requiredXp: 250,
    reward: "Water Trident",
  },
  {
    id: 4,
    title: "Forest Guardians",
    description:
      "Ally with the spirits of the forest to fight against the Timber Tyrants destroying ancient woodlands.",
    image: {
      uri: "https://images.unsplash.com/photo-1473649085228-583485e6e4d7",
    },
    isLocked: true,
    requiredXp: 400,
    reward: "Leaf Shield",
  },
  {
    id: 5,
    title: "Climate Nexus",
    description:
      "Enter the final showdown with Lord Carbonius at his fortress of fossil fuels.",
    image: {
      uri: "https://images.unsplash.com/photo-1569163139599-0f4517ef39e2",
    },
    isLocked: true,
    requiredXp: 600,
    reward: "Gaia's Sword",
  },
];

export default function StoryScreen() {
  const router = useRouter();
  const [userXp, setUserXp] = useState(150);
  const [selectedQuest, setSelectedQuest] = useState<DailyQuest | null>(null);

  const completeQuest = (quest: DailyQuest) => {
    // In a real app, this would connect to your backend
    setUserXp((prev) => prev + quest.xpReward);
    // Mark quest as completed
    const updatedQuests = dailyQuests.map((q) =>
      q.id === quest.id ? { ...q, completed: true } : q
    );
    // Update quests state here if you're storing it in state
    setSelectedQuest(null);
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header Section */}
      <View style={styles.header}>
        <LinearGradient
          colors={["#3E885B", "#2E7D32"]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerTop}>
            <View>
              <ThemedText style={styles.headerTitle}>Earth Guardian</ThemedText>
              <View style={styles.xpContainer}>
                <ThemedText style={styles.xpLabel}>XP: </ThemedText>
                <ThemedText style={styles.xpValue}>{userXp}</ThemedText>
              </View>
            </View>

            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="person-circle" size={36} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${Math.min((userXp / 600) * 100, 100)}%` },
              ]}
            />
            <ThemedText style={styles.progressText}>
              {userXp}/600 XP to save Mother Earth
            </ThemedText>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Daily Quests Section */}
        <Animated.View entering={FadeIn}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Daily Quests</ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              Complete quests to earn XP and unlock story chapters
            </ThemedText>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.questsContainer}
          >
            {dailyQuests.map((quest, index) => (
              <TouchableOpacity
                key={quest.id}
                style={[
                  styles.questCard,
                  quest.completed && styles.questCardCompleted,
                ]}
                onPress={() => setSelectedQuest(quest)}
                activeOpacity={0.8}
              >
                <View style={styles.questIconContainer}>
                  <Ionicons
                    name={quest.icon as any}
                    size={28}
                    color={quest.completed ? "#70A288" : "#3E885B"}
                  />
                  {quest.completed && (
                    <View style={styles.completedBadge}>
                      <Ionicons name="checkmark" size={12} color="white" />
                    </View>
                  )}
                </View>

                <ThemedText style={styles.questTitle} numberOfLines={2}>
                  {quest.title}
                </ThemedText>

                <View style={styles.questXpContainer}>
                  <ThemedText style={styles.questXpText}>
                    +{quest.xpReward} XP
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Story Campaign Section */}
        <View style={styles.storyCampaignSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Story Campaign</ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              Complete quests to progress in the adventure
            </ThemedText>
          </View>

          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5",
            }}
            style={styles.storyBanner}
            imageStyle={{ borderRadius: 16 }}
          >
            <LinearGradient
              colors={["rgba(252, 250, 250, 0.1)", "rgba(0,0,0,0.8)"]}
              style={styles.storyBannerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <ThemedText style={styles.storyBannerTitle}>
                The Guardian's Quest
              </ThemedText>
              <ThemedText style={styles.storyBannerSubtitle}>
                Join the fight to save Mother Earth from the forces of pollution
                and climate chaos
              </ThemedText>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => {
                  // Navigate to the story campaign screen with the current chapter
                  // Find the first unlocked chapter or the first one if none are unlocked
                  const currentChapter =
                    storyChapters.find((chapter) => !chapter.isLocked) ||
                    storyChapters[0];
                  router.push({
                    pathname: "/story-campaign",
                    params: { chapter: currentChapter.id },
                  });
                }}
              >
                <ThemedText style={styles.buttonText}>
                  Continue Adventure
                </ThemedText>
              </TouchableOpacity>
            </LinearGradient>
          </ImageBackground>

          {storyChapters.map((chapter, index) => {
            const isUnlockable = userXp >= chapter.requiredXp;

            return (
              <Animated.View
                key={chapter.id}
                entering={FadeInUp.delay(index * 150).springify()}
                style={[
                  styles.chapterCard,
                  chapter.isLocked && !isUnlockable && styles.chapterCardLocked,
                ]}
              >
                <Image source={chapter.image} style={styles.chapterImage} />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.85)"]}
                  style={styles.chapterOverlay}
                >
                  <View style={styles.chapterContent}>
                    <ThemedText style={styles.chapterTitle}>
                      {chapter.title}
                    </ThemedText>

                    <View style={styles.chapterReward}>
                      <Ionicons name="flash" size={16} color="#FFD700" />
                      <ThemedText style={styles.chapterRewardText}>
                        Reward: {chapter.reward}
                      </ThemedText>
                    </View>

                    <View style={styles.chapterInfoRow}>
                      <ThemedText
                        style={styles.chapterDescription}
                        numberOfLines={2}
                      >
                        {chapter.description}
                      </ThemedText>

                      {chapter.isLocked && !isUnlockable ? (
                        <View style={styles.lockContainer}>
                          <Ionicons
                            name="lock-closed"
                            size={20}
                            color="#8E8E8E"
                          />
                          <ThemedText style={styles.lockText}>
                            {chapter.requiredXp} XP required
                          </ThemedText>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={[
                            styles.chapterButton,
                            chapter.isLocked &&
                              !isUnlockable &&
                              styles.chapterButtonLocked,
                          ]}
                          disabled={chapter.isLocked && !isUnlockable}
                        >
                          <ThemedText style={styles.chapterButtonText}>
                            {chapter.isLocked && !isUnlockable
                              ? "Locked"
                              : "Play"}
                          </ThemedText>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      {/* Quest Detail Modal */}
      {selectedQuest && (
        <Animated.View style={styles.modalOverlay} entering={FadeIn}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setSelectedQuest(null)}
            activeOpacity={1}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons
                name={selectedQuest.icon as any}
                size={40}
                color="#3E885B"
              />
            </View>

            <ThemedText style={styles.modalTitle}>
              {selectedQuest.title}
            </ThemedText>
            <ThemedText style={styles.modalDescription}>
              {selectedQuest.description}
            </ThemedText>

            <View style={styles.impactContainer}>
              <ThemedText style={styles.impactTitle}>
                Environmental Impact:
              </ThemedText>
              <ThemedText style={styles.impactText}>
                {selectedQuest.impact}
              </ThemedText>
            </View>

            <View style={styles.modalReward}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <ThemedText style={styles.modalRewardText}>
                +{selectedQuest.xpReward} XP
              </ThemedText>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setSelectedQuest(null)}
              >
                <ThemedText style={styles.modalCancelText}>Later</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalCompleteButton,
                  selectedQuest.completed && styles.modalCompletedButton,
                ]}
                onPress={() => completeQuest(selectedQuest)}
                disabled={selectedQuest.completed}
              >
                <ThemedText style={styles.modalCompleteText}>
                  {selectedQuest.completed ? "Completed" : "Complete Quest"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  header: {
    width: "100%",
    height: 160,
  },
  headerGradient: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  xpContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  xpLabel: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
  },
  xpValue: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBarContainer: {
    height: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    marginTop: 20,
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#8BC34A",
    borderRadius: 10,
  },
  progressText: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 20,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#3E885B",
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    color: "#666666",
  },
  questsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  questCard: {
    width: 130,
    height: 150,
    backgroundColor: "lightgreen",
    marginHorizontal: 6,
    borderRadius: 16,
    padding: 12,
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  questCardCompleted: {
    backgroundColor: "lightyellow",
  },
  questIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  completedBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  questTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3E885B",
  },
  questXpContainer: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  questXpText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3E885B",
  },
  storyCampaignSection: {
    paddingBottom: 20,
  },
  storyBanner: {
    height: 180,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  storyBannerGradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
  },
  storyBannerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  storyBannerSubtitle: {
    fontSize: 14,
    color: "white",
    opacity: 0.9,
    marginBottom: 16,
    width: "80%",
  },
  storyBannerButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
  },
  continueButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  storyBannerButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  chapterCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    height: 150,
    elevation: 3,
    backgroundColor: "white", // Add this line
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chapterCardLocked: {
    opacity: 0.7,
  },
  chapterImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  chapterOverlay: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  chapterContent: {
    padding: 16,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  chapterInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  chapterDescription: {
    fontSize: 13,
    color: "white",
    opacity: 0.9,
    flex: 1,
    marginRight: 20,
  },
  chapterReward: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  chapterRewardText: {
    fontSize: 12,
    color: "#FFD700",
    marginLeft: 4,
  },
  chapterButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  chapterButtonLocked: {
    backgroundColor: "rgba(100,100,100,0.7)",
  },
  chapterButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
  },
  lockContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  lockText: {
    color: "#CCCCCC",
    fontSize: 12,
    marginLeft: 6,
  },
  // Modal styles
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    width: width - 60,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  impactContainer: {
    width: "100%",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  impactTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  impactText: {
    fontSize: 14,
  },
  modalReward: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  modalRewardText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalCancelButton: {
    flex: 0.45,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
  },
  modalCancelText: {
    color: "#666666",
    fontWeight: "600",
  },
  modalCompleteButton: {
    flex: 0.45,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  modalCompletedButton: {
    backgroundColor: "#70A288",
  },
  modalCompleteText: {
    color: "white",
    fontWeight: "600",
  },
});
