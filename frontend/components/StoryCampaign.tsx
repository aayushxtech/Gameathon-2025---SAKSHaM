import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Animated as RNAnimated,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface Villain {
  name: string;
  title: string;
  description: string;
  maxHealth: number;
  currentHealth: number;
  image: { uri: string };
  weakness: string;
}

interface StoryCampaignProps {
  userXp: number;
  onUseXp: (amount: number) => void;
  currentChapter: number;
}

const villains: Record<number, Villain> = {
  1: {
    name: "Lord Carbonius",
    title: "Master of Fossil Fuels",
    description:
      "A shadowy figure who profits from pollution and climate destruction. His power grows with every ton of carbon released into the atmosphere.",
    maxHealth: 100,
    currentHealth: 100,
    image: { uri: "https://images.unsplash.com/photo-1548431066-3dd9a752eccd" },
    weakness: "Renewable energy and sustainable practices",
  },
  2: {
    name: "Smog Emperor",
    title: "Ruler of the Toxic Skies",
    description:
      "Born from decades of industrial pollution, the Smog Emperor blinds cities with his poisonous embrace and chokes the lungs of all living beings.",
    maxHealth: 150,
    currentHealth: 150,
    image: {
      uri: "https://images.unsplash.com/photo-1574952466175-594addf96d26",
    },
    weakness: "Clean air technology and emission reductions",
  },
  3: {
    name: "Plasticron",
    title: "Ancient Monster of the Deep",
    description:
      "A colossal beast formed from centuries of plastic waste dumped into the oceans. It entangles marine life and corrupts the waters with microplastics.",
    maxHealth: 200,
    currentHealth: 200,
    image: {
      uri: "https://images.unsplash.com/photo-1526951521990-620dc14c214b",
    },
    weakness: "Waste reduction and ocean cleanup efforts",
  },
};

// Story narrative for each chapter
const chapterNarratives = [
  {
    title: "The Guardian Awakens",
    parts: [
      "For too long, humanity has taken Earth's bounty for granted. As climate chaos accelerates, the ancient spirit of Gaia has chosen YOU as her Guardian.",
      "With this power comes responsibility. Mother Earth is crying out for help as storms grow more violent, temperatures rise, and ecosystems collapse.",
      "The forces working against nature are powerful. They are led by Lord Carbonius, whose empire of fossil fuels and pollution threatens all life on our planet.",
      "As the Guardian, your daily actions in the real world generate the power needed to fight these climate villains. Each sustainable choice you make strengthens the Earth and weakens its enemies.",
    ],
  },
  {
    title: "Toxic Skies",
    parts: [
      "Having proven yourself a worthy Guardian, you now face a new threat. The Smog Emperor and his army of pollution particles have taken control of the atmosphere.",
      "Cities around the world are choked in deadly air, the sun barely visible through the haze. Plants struggle to photosynthesize and people fall ill.",
      "Your quest to clear the skies requires dedication to reduce emissions in your daily life. Each action you take creates powerful gusts of clean air in this battle.",
      "The Wind Purifier you earned can now be used to disperse the toxic clouds and reveal the Emperor's true form.",
    ],
  },
  {
    title: "Ocean's Cry",
    parts: [
      "The seas are filled with the tears of marine creatures as Plasticron, a monster born from humanity's waste, grows larger each day.",
      "Coral reefs bleach and die, sea turtles mistake plastic bags for jellyfish, and the once-vibrant ocean ecosystems fall silent.",
      "Your journey takes you to the depths where you must confront this abomination. Your Water Trident, earned through your conservation efforts, is the key to piercing its seemingly impenetrable hide.",
      "Every piece of plastic you properly dispose of or refuse to use in the real world weakens Plasticron in this battle.",
    ],
  },
];

export default function StoryCampaign({
  userXp,
  onUseXp,
  currentChapter,
}: StoryCampaignProps) {
  const villain = villains[currentChapter] || villains[1];
  const narrative =
    chapterNarratives[currentChapter - 1] || chapterNarratives[0];
  const [narrativeIndex, setNarrativeIndex] = useState(0);
  const [showAttackEffect, setShowAttackEffect] = useState(false);
  const [villainHealth, setVillainHealth] = useState(villain.currentHealth);

  // Animated values
  const shakeAnimation = useSharedValue(0);
  const damageOpacity = useSharedValue(0);

  // Attack animation effect
  const attackVillain = (xpAmount: number) => {
    if (userXp < xpAmount) return;

    // Calculate damage (1 XP = 2 health points)
    const damage = Math.min(xpAmount * 2, villainHealth);

    // Use XP
    onUseXp(xpAmount);

    // Show attack effect
    setShowAttackEffect(true);

    // Shake villain
    shakeAnimation.value = withSequence(
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 100 }),
      withTiming(-5, { duration: 100 }),
      withTiming(5, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );

    // Show damage number
    damageOpacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(1, { duration: 800 }),
      withTiming(0, { duration: 200 })
    );

    // Reduce villain health
    setTimeout(() => {
      setVillainHealth((current) => Math.max(0, current - damage));
      setTimeout(() => setShowAttackEffect(false), 1000);
    }, 400);
  };

  const villainStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeAnimation.value }],
    };
  });

  const damageTextStyle = useAnimatedStyle(() => {
    return {
      opacity: damageOpacity.value,
      transform: [{ translateY: withSpring(-30 * damageOpacity.value) }],
    };
  });

  // Calculate health percentage
  const healthPercentage = (villainHealth / villain.maxHealth) * 100;

  // Next narrative part
  const nextNarrativePart = () => {
    if (narrativeIndex < narrative.parts.length - 1) {
      setNarrativeIndex(narrativeIndex + 1);
    }
  };

  // Previous narrative part
  const prevNarrativePart = () => {
    if (narrativeIndex > 0) {
      setNarrativeIndex(narrativeIndex - 1);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Chapter Title */}
      <LinearGradient
        colors={["#D32F2F", "#B71C1C"]}
        style={styles.chapterHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <ThemedText style={styles.chapterTitle}>
          Chapter {currentChapter}: {narrative.title}
        </ThemedText>
      </LinearGradient>

      {/* Story Narrative */}
      <View style={styles.narrativeContainer}>
        <Animated.View
          key={`narrative-${narrativeIndex}`}
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.narrativeCard}
        >
          <ScrollView style={styles.narrativeScroll}>
            <ThemedText style={styles.narrativeText}>
              {narrative.parts[narrativeIndex]}
            </ThemedText>
          </ScrollView>

          <View style={styles.narrativeNav}>
            <TouchableOpacity
              style={[
                styles.navButton,
                narrativeIndex === 0 && styles.navButtonDisabled,
              ]}
              disabled={narrativeIndex === 0}
              onPress={prevNarrativePart}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={narrativeIndex === 0 ? "#CCCCCC" : "#D32F2F"}
              />
            </TouchableOpacity>

            <View style={styles.narrativeDots}>
              {narrative.parts.map((_, index) => (
                <View
                  key={`dot-${index}`}
                  style={[
                    styles.narrativeDot,
                    index === narrativeIndex && styles.narrativeDotActive,
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.navButton,
                narrativeIndex === narrative.parts.length - 1 &&
                  styles.navButtonDisabled,
              ]}
              disabled={narrativeIndex === narrative.parts.length - 1}
              onPress={nextNarrativePart}
            >
              <Ionicons
                name="chevron-forward"
                size={24}
                color={
                  narrativeIndex === narrative.parts.length - 1
                    ? "#CCCCCC"
                    : "#D32F2F"
                }
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>

      {/* Attack Controls - Moved Up */}
      <View style={styles.attackControlsContainer}>
        <View style={styles.xpAvailableContainer}>
          <ThemedText style={styles.xpAvailableText}>
            Available XP: {userXp}
          </ThemedText>
        </View>

        <View style={styles.attackButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.attackButton,
              userXp < 10 && styles.attackButtonDisabled,
            ]}
            disabled={userXp < 10}
            onPress={() => attackVillain(10)}
          >
            <ThemedText style={styles.attackButtonText}>
              Light Attack
            </ThemedText>
            <ThemedText style={styles.attackCostText}>10 XP</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.attackButton,
              styles.attackButtonMedium,
              userXp < 25 && styles.attackButtonDisabled,
            ]}
            disabled={userXp < 25}
            onPress={() => attackVillain(25)}
          >
            <ThemedText style={styles.attackButtonText}>
              Medium Attack
            </ThemedText>
            <ThemedText style={styles.attackCostText}>25 XP</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.attackButton,
              styles.attackButtonHeavy,
              userXp < 50 && styles.attackButtonDisabled,
            ]}
            disabled={userXp < 50}
            onPress={() => attackVillain(50)}
          >
            <ThemedText style={styles.attackButtonText}>
              Heavy Attack
            </ThemedText>
            <ThemedText style={styles.attackCostText}>50 XP</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Villain Section */}
      <View style={styles.villainSection}>
        <View style={styles.villainInfoContainer}>
          <View style={styles.villainNameContainer}>
            <ThemedText style={styles.villainName}>{villain.name}</ThemedText>
            <ThemedText style={styles.villainTitle}>{villain.title}</ThemedText>
          </View>

          <View style={styles.healthBarContainer}>
            <View style={styles.healthBarBackground}>
              <View
                style={[
                  styles.healthBar,
                  { width: `${healthPercentage}%` },
                  healthPercentage < 30
                    ? styles.healthBarLow
                    : healthPercentage < 60
                    ? styles.healthBarMedium
                    : styles.healthBarHigh,
                ]}
              />
            </View>
            <ThemedText style={styles.healthText}>
              {villainHealth}/{villain.maxHealth}
            </ThemedText>
          </View>
        </View>

        <View style={styles.villainImageContainer}>
          <Animated.View style={[styles.villainImageWrapper, villainStyle]}>
            <Image source={villain.image} style={styles.villainImage} />

            {showAttackEffect && (
              <View style={styles.attackEffectContainer}>
                <Image
                  source={{
                    uri: "https://static.vecteezy.com/system/resources/previews/009/385/277/original/lightning-strike-clipart-design-illustration-free-png.png",
                  }}
                  style={styles.attackEffect}
                />

                <Animated.View
                  style={[styles.damageTextContainer, damageTextStyle]}
                >
                  <ThemedText style={styles.damageText}>
                    -{userXp * 2}
                  </ThemedText>
                </Animated.View>
              </View>
            )}
          </Animated.View>
        </View>

        <View style={styles.villainDescription}>
          <ThemedText style={styles.descriptionText}>
            {villain.description}
          </ThemedText>
          <View style={styles.weaknessContainer}>
            <ThemedText style={styles.weaknessLabel}>Weakness: </ThemedText>
            <ThemedText style={styles.weaknessText}>
              {villain.weakness}
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Victory Message (when villain health is 0) */}
      {villainHealth === 0 && (
        <Animated.View style={styles.victoryContainer} entering={FadeIn}>
          <LinearGradient
            colors={["rgba(211, 47, 47, 0.9)", "rgba(183, 28, 28, 0.9)"]}
            style={styles.victoryGradient}
          >
            <View style={styles.victoryContent}>
              <ThemedText style={styles.victoryTitle}>Victory!</ThemedText>
              <ThemedText style={styles.victoryText}>
                You have defeated {villain.name} and saved the environment from{" "}
                {villain.title.toLowerCase()}!
              </ThemedText>
              <ThemedText style={styles.victoryText}>
                Continue your quest by completing more daily challenges to
                unlock the next chapter.
              </ThemedText>

              <TouchableOpacity style={styles.continueButton}>
                <ThemedText style={styles.continueButtonText}>
                  Continue Your Journey
                </ThemedText>
              </TouchableOpacity>
            </View>
          </LinearGradient>
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
  chapterHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  chapterTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  narrativeContainer: {
    padding: 16,
  },
  narrativeCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  narrativeScroll: {
    maxHeight: 150,
  },
  narrativeText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  narrativeNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  navButton: {
    padding: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  narrativeDots: {
    flexDirection: "row",
    justifyContent: "center",
  },
  narrativeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D0D0D0",
    marginHorizontal: 4,
  },
  narrativeDotActive: {
    backgroundColor: "#D32F2F",
    width: 12,
    height: 8,
  },
  // Attack Controls - Moved up in the component
  attackControlsContainer: {
    padding: 16,
    backgroundColor: "#FFEBEE", // Light red background
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  xpAvailableContainer: {
    marginBottom: 12,
  },
  xpAvailableText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#D32F2F",
  },
  attackButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  attackButton: {
    flex: 1,
    backgroundColor: "#8BC34A",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  attackButtonMedium: {
    backgroundColor: "#FFA000",
  },
  attackButtonHeavy: {
    backgroundColor: "#E53935",
  },
  attackButtonDisabled: {
    backgroundColor: "#D0D0D0",
  },
  attackButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  attackCostText: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
  villainSection: {
    marginTop: 0,
    paddingHorizontal: 16,
  },
  villainInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  villainNameContainer: {
    flex: 1,
  },
  villainName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D32F2F",
  },
  villainTitle: {
    fontSize: 14,
    color: "#757575",
    fontStyle: "italic",
  },
  healthBarContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  healthBarBackground: {
    width: "100%",
    height: 16,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#BDBDBD",
  },
  healthBar: {
    height: "100%",
    borderRadius: 8,
  },
  healthBarHigh: {
    backgroundColor: "#4CAF50",
  },
  healthBarMedium: {
    backgroundColor: "#FFC107",
  },
  healthBarLow: {
    backgroundColor: "#F44336",
  },
  healthText: {
    fontSize: 12,
    marginTop: 4,
    color: "#666",
  },
  villainImageContainer: {
    position: "relative",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },
  villainImageWrapper: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    borderWidth: 2,
    borderColor: "#D32F2F",
  },
  villainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  attackEffectContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  attackEffect: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  damageTextContainer: {
    position: "absolute",
    backgroundColor: "rgba(211, 47, 47, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "white",
  },
  damageText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  villainDescription: {
    backgroundColor: "#FFEBEE",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#444",
  },
  weaknessContainer: {
    flexDirection: "row",
    marginTop: 12,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    padding: 8,
    borderRadius: 8,
  },
  weaknessLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#D32F2F",
  },
  weaknessText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#555",
    flex: 1,
  },
  victoryContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  victoryGradient: {
    width: "90%",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: "#FFCDD2",
  },
  victoryContent: {
    alignItems: "center",
  },
  victoryTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  victoryText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 12,
  },
  continueButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  continueButtonText: {
    color: "#D32F2F",
    fontWeight: "bold",
    fontSize: 16,
  },
});
