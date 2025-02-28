import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Animated, {
  FadeInUp,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

interface UserCII {
  name: string;
  score: number;
  actions: Array<{
    id: number;
    text: string;
    points: number;
    date: string;
    iconName: keyof typeof MaterialCommunityIcons.glyphMap;
    color: string;
  }>;
  tips: Array<{
    id: number;
    title: string;
    description: string;
    iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  }>;
}

interface LeaderboardEntry {
  id: number;
  name: string;
  ciiScore: number;
  avatar: string;
}

// Current user data
const userData: UserCII = {
  name: "Rahul Sharma",
  score: 325,
  actions: [
    {
      id: 1,
      text: "Participated in coastal cleanup",
      points: 50,
      date: "15 Feb 2025",
      iconName: "waves",
      color: "#03A9F4",
    },
    {
      id: 2,
      text: "Reduced plastic consumption for 3 months",
      points: 75,
      date: "5 Jan 2025",
      iconName: "recycle",
      color: "#4CAF50",
    },
    {
      id: 3,
      text: "Planted 10 trees",
      points: 100,
      date: "25 Dec 2024",
      iconName: "tree",
      color: "#8BC34A",
    },
    {
      id: 4,
      text: "Used public transport for 2 months",
      points: 60,
      date: "10 Nov 2024",
      iconName: "bus",
      color: "#FF9800",
    },
    {
      id: 5,
      text: "Attended climate workshop",
      points: 40,
      date: "3 Oct 2024",
      iconName: "school",
      color: "#9C27B0",
    },
  ],
  tips: [
    {
      id: 1,
      title: "Reduce Your Carbon Footprint",
      description:
        "Try walking or cycling for short trips instead of driving to reduce emissions and earn CII points.",
      iconName: "foot-print",
    },
    {
      id: 2,
      title: "Start Composting",
      description:
        "Turn kitchen waste into valuable compost for your garden and reduce methane emissions from landfills.",
      iconName: "recycle",
    },
    {
      id: 3,
      title: "Save Energy at Home",
      description:
        "Switch to LED bulbs and unplug electronics when not in use to conserve energy.",
      iconName: "lightbulb-on",
    },
    {
      id: 4,
      title: "Conserve Water",
      description:
        "Take shorter showers and fix leaky faucets to help preserve this precious resource.",
      iconName: "water",
    },
  ],
};

// Leaderboard data
const leaderboardData: LeaderboardEntry[] = [
  {
    id: 1,
    name: "Arjun Mehta",
    ciiScore: 1250,
    avatar: "https://randomuser.me/api/portraits/men/36.jpg",
  },
  {
    id: 2,
    name: "Priyanka Gupta",
    ciiScore: 980,
    avatar: "https://randomuser.me/api/portraits/women/47.jpg",
  },
  {
    id: 3,
    name: "Vikas Patel",
    ciiScore: 845,
    avatar: "https://randomuser.me/api/portraits/men/57.jpg",
  },
  {
    id: 4,
    name: "Anjali Mishra",
    ciiScore: 720,
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
  },
  {
    id: 5,
    name: "Kiran Singh",
    ciiScore: 590,
    avatar: "https://randomuser.me/api/portraits/men/82.jpg",
  },
  {
    id: 6,
    name: "Rahul Sharma",
    ciiScore: 325,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 7,
    name: "Anil Verma",
    ciiScore: 290,
    avatar: "https://randomuser.me/api/portraits/men/43.jpg",
  },
  {
    id: 8,
    name: "Divya Singh",
    ciiScore: 245,
    avatar: "https://randomuser.me/api/portraits/women/25.jpg",
  },
  {
    id: 9,
    name: "Mohan Kumar",
    ciiScore: 180,
    avatar: "https://randomuser.me/api/portraits/men/48.jpg",
  },
  {
    id: 10,
    name: "Nisha Yadav",
    ciiScore: 95,
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
  },
];

// Helper function to determine level based on CII score
const getCIILevel = (
  score: number
): {
  badge: string;
  title: string;
  level: string;
  color: string;
  gradient: readonly [string, string, string];
  nextThreshold: number;
} => {
  if (score >= 1001)
    return {
      badge: "🏆",
      title: "Carbon Neutral Champion",
      level: "Expert",
      color: "#4CAF50",
      gradient: ["#2E7D32", "#4CAF50", "#81C784"] as const,
      nextThreshold: Infinity,
    };
  if (score >= 501)
    return {
      badge: "🔥",
      title: "Sustainability Hero",
      level: "Advanced",
      color: "#FF9800",
      gradient: ["#E65100", "#FF9800", "#FFB74D"] as const,
      nextThreshold: 1001,
    };
  if (score >= 101)
    return {
      badge: "🌎",
      title: "Climate Warrior",
      level: "Intermediate",
      color: "#2196F3",
      gradient: ["#0D47A1", "#2196F3", "#64B5F6"] as const,
      nextThreshold: 501,
    };
  return {
    badge: "🌿",
    title: "Eco Novice",
    level: "Beginner",
    color: "#8BC34A",
    gradient: ["#558B2F", "#8BC34A", "#AED581"] as const,
    nextThreshold: 101,
  };
};

// Circular progress component
const CircularProgress = ({
  score,
  size,
  strokeWidth,
  level,
}: {
  score: number;
  size: number;
  strokeWidth: number;
  level: ReturnType<typeof getCIILevel>;
}) => {
  // Calculate level progress
  let percentage = 0;
  if (score < 101) {
    percentage = score / 101;
  } else if (score < 501) {
    percentage = (score - 101) / (501 - 101);
  } else if (score < 1001) {
    percentage = (score - 501) / (1001 - 501);
  } else {
    percentage = 1;
  }

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          stroke="rgba(255,255,255,0.3)"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <Circle
          stroke="white"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.circleContent}>
        <ThemedText style={styles.scoreValue}>{score}</ThemedText>
        <ThemedText style={styles.scoreBadge}>{level.badge}</ThemedText>
      </View>
    </View>
  );
};

export default function CIIScreen() {
  const [activeTab, setActiveTab] = useState<"overview" | "actions" | "tips">(
    "overview"
  );
  const [expandedTip, setExpandedTip] = useState<number | null>(null);
  const { height } = useWindowDimensions();

  // Animation values
  const scoreScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const tabIndicatorPosition = useSharedValue(0);

  // User rank
  const userRanking =
    leaderboardData.findIndex((entry) => entry.name === userData.name) + 1;

  // User level
  const userLevel = getCIILevel(userData.score);

  // Points to next level
  const pointsToNextLevel = Math.max(
    0,
    userLevel.nextThreshold - userData.score
  );

  // Toggle tip expansion
  const toggleTip = (id: number) => {
    setExpandedTip(expandedTip === id ? null : id);
  };

  // Tab press animation
  const onTabPress = (tab: "overview" | "actions" | "tips") => {
    buttonScale.value = withSpring(0.95, { damping: 10 }, () => {
      buttonScale.value = withSpring(1);
    });

    setActiveTab(tab);

    // Set indicator position
    if (tab === "overview") tabIndicatorPosition.value = withSpring(0);
    if (tab === "actions") tabIndicatorPosition.value = withSpring(1);
    if (tab === "tips") tabIndicatorPosition.value = withSpring(2);
  };

  // Animation for score on press
  const onScorePress = () => {
    scoreScale.value = withSpring(1.1, { damping: 2 }, () => {
      scoreScale.value = withSpring(1);
    });
  };

  // Gesture for the circle progress
  const tapGesture = Gesture.Tap().onStart(() => {
    onScorePress();
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Animated.View entering={FadeInUp.duration(500)}>
            {/* Progress to Next Level */}
            <Animated.View entering={FadeInUp.delay(100).duration(500)}>
              <LinearGradient
                colors={userLevel.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressCard, { shadowColor: userLevel.color }]}
              >
                <ThemedText style={styles.progressTitle}>
                  Progress to Next Level
                </ThemedText>

                <ThemedView style={styles.progressBarContainer}>
                  <Animated.View
                    style={[
                      styles.progressBar,
                      {
                        width:
                          userLevel.nextThreshold === Infinity
                            ? "100%"
                            : `${
                                ((userData.score -
                                  (userLevel.nextThreshold - 400)) /
                                  400) *
                                100
                              }%`,
                      },
                    ]}
                  />
                </ThemedView>

                {userLevel.nextThreshold < Infinity ? (
                  <ThemedText style={styles.progressText}>
                    {pointsToNextLevel} points needed to reach{" "}
                    {userData.score < 101
                      ? "Climate Warrior"
                      : userData.score < 501
                      ? "Sustainability Hero"
                      : "Carbon Neutral Champion"}
                  </ThemedText>
                ) : (
                  <ThemedText style={styles.progressText}>
                    You've reached the highest level!
                  </ThemedText>
                )}
              </LinearGradient>
            </Animated.View>

            {/* CII Level Chart */}
            <Animated.View
              entering={FadeInUp.delay(200).duration(500)}
              style={[styles.levelsCard, { shadowColor: userLevel.color }]}
            >
              <ThemedText style={styles.levelsTitle}>CII Levels</ThemedText>

              {[
                {
                  badge: "🏆",
                  title: "Carbon Neutral Champion",
                  level: "Expert",
                  points: "1001+ points",
                  color: "#4CAF50",
                  active: userData.score >= 1001,
                },
                {
                  badge: "🔥",
                  title: "Sustainability Hero",
                  level: "Advanced",
                  points: "501 - 1000 points",
                  color: "#FF9800",
                  active: userData.score >= 501 && userData.score < 1001,
                },
                {
                  badge: "🌎",
                  title: "Climate Warrior",
                  level: "Intermediate",
                  points: "101 - 500 points",
                  color: "#2196F3",
                  active: userData.score >= 101 && userData.score < 501,
                },
                {
                  badge: "🌿",
                  title: "Eco Novice",
                  level: "Beginner",
                  points: "0 - 100 points",
                  color: "#8BC34A",
                  active: userData.score < 101,
                },
              ].map((level, index) => (
                <Animated.View
                  key={index}
                  entering={FadeInUp.delay(200 + index * 100)}
                  style={[
                    styles.levelRow,
                    level.active
                      ? {
                          backgroundColor: `${level.color}15`,
                          borderRadius: 12,
                          paddingHorizontal: 8,
                          shadowColor: level.color,
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.2,
                          shadowRadius: 3,
                          elevation: level.active ? 4 : 0,
                          transform: [{ scale: level.active ? 1.02 : 1 }],
                        }
                      : null,
                    index === 3 ? { borderBottomWidth: 0 } : null,
                  ]}
                >
                  <View
                    style={[
                      styles.levelIconContainer,
                      { backgroundColor: level.color },
                    ]}
                  >
                    <ThemedText style={styles.levelBadge}>
                      {level.badge}
                    </ThemedText>
                  </View>
                  <ThemedView style={styles.levelInfo}>
                    <ThemedText style={styles.levelName}>
                      {level.title}
                    </ThemedText>
                    <ThemedText style={styles.levelPoints}>
                      {level.points}
                    </ThemedText>
                    <ThemedText
                      style={[styles.levelType, { color: level.color }]}
                    >
                      {level.level}
                    </ThemedText>
                  </ThemedView>
                  {level.active && (
                    <View
                      style={[
                        styles.activeIndicator,
                        { backgroundColor: level.color },
                      ]}
                    >
                      <ThemedText style={styles.activeIndicatorText}>
                        YOU
                      </ThemedText>
                    </View>
                  )}
                </Animated.View>
              ))}
            </Animated.View>

            {/* Leaderboard */}
            <Animated.View
              entering={FadeInUp.delay(300).duration(500)}
              style={styles.leaderboardCard}
            >
              <View style={styles.leaderboardHeader}>
                <ThemedText style={styles.leaderboardTitle}>
                  CII Leaderboard
                </ThemedText>
                <TouchableOpacity
                  style={styles.viewAllButton}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={userLevel.gradient}
                    style={styles.viewAllGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <ThemedText style={styles.viewAllText}>View All</ThemedText>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <GestureHandlerRootView style={{ flex: 1 }}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.leaderboardScrollContent}
                  decelerationRate="fast"
                  snapToInterval={135}
                  snapToAlignment="center"
                >
                  {leaderboardData.slice(0, 5).map((entry, index) => {
                    const entryLevel = getCIILevel(entry.ciiScore);
                    const isUser = entry.name === userData.name;

                    return (
                      <Animated.View
                        key={entry.id}
                        entering={FadeInUp.delay(300 + index * 100)}
                      >
                        <TouchableOpacity
                          style={[
                            styles.leaderCard,
                            isUser
                              ? {
                                  borderColor: entryLevel.color,
                                  borderWidth: 2,
                                  shadowColor: entryLevel.color,
                                  shadowOpacity: 0.3,
                                  elevation: 5,
                                }
                              : null,
                          ]}
                          activeOpacity={0.9}
                        >
                          <View
                            style={[
                              styles.rankIndicator,
                              {
                                backgroundColor:
                                  index < 3 ? entryLevel.color : "#ffffff",
                                shadowColor: entryLevel.color,
                              },
                            ]}
                          >
                            {index < 3 ? (
                              <ThemedText style={styles.topRankEmoji}>
                                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                              </ThemedText>
                            ) : (
                              <ThemedText
                                style={[
                                  styles.rankNumber,
                                  isUser ? { color: entryLevel.color } : null,
                                ]}
                              >
                                #{index + 1}
                              </ThemedText>
                            )}
                          </View>
                          <View style={styles.leaderAvatarContainer}>
                            <Image
                              source={{ uri: entry.avatar }}
                              style={styles.leaderAvatar}
                            />
                            <View
                              style={[
                                styles.badgeIcon,
                                { backgroundColor: entryLevel.color },
                              ]}
                            >
                              <ThemedText style={styles.badgeIconText}>
                                {entryLevel.badge}
                              </ThemedText>
                            </View>
                          </View>
                          <ThemedText
                            style={[
                              styles.leaderName,
                              isUser
                                ? {
                                    fontWeight: "bold",
                                    color: entryLevel.color,
                                  }
                                : null,
                            ]}
                            numberOfLines={1}
                          >
                            {entry.name}
                          </ThemedText>
                          <LinearGradient
                            colors={
                              isUser
                                ? entryLevel.gradient
                                : [entryLevel.color, entryLevel.color]
                            }
                            style={styles.scoreTag}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          >
                            <ThemedText style={styles.scoreTagText}>
                              {entry.ciiScore}
                            </ThemedText>
                          </LinearGradient>
                        </TouchableOpacity>
                      </Animated.View>
                    );
                  })}
                </ScrollView>
              </GestureHandlerRootView>

              {userRanking > 5 && (
                <Animated.View
                  entering={FadeInUp.delay(600)}
                  style={styles.userRankInfo}
                >
                  <ThemedText style={styles.yourRankText}>Your Rank</ThemedText>
                  <View
                    style={[
                      styles.userRankBadge,
                      { backgroundColor: userLevel.color },
                    ]}
                  >
                    <ThemedText style={styles.userRankText}>
                      #{userRanking}
                    </ThemedText>
                  </View>
                </Animated.View>
              )}
            </Animated.View>
          </Animated.View>
        );

      case "actions":
        return (
          <Animated.View
            entering={FadeInUp.duration(500)}
            style={styles.actionsContainer}
          >
            <ThemedText style={styles.actionsTitle}>
              Your Climate Actions
            </ThemedText>
            {userData.actions.map((action, index) => (
              <Animated.View
                key={action.id}
                entering={FadeInUp.delay(index * 100)}
              >
                <TouchableOpacity activeOpacity={0.9}>
                  <View
                    style={[
                      styles.actionCard,
                      {
                        borderLeftWidth: 5,
                        borderLeftColor: action.color,
                        shadowColor: action.color,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.actionIconContainer,
                        { backgroundColor: action.color },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={action.iconName}
                        size={24}
                        color="white"
                      />
                    </View>
                    <View style={styles.actionContent}>
                      <ThemedText style={styles.actionText}>
                        {action.text}
                      </ThemedText>
                      <ThemedText style={styles.actionDate}>
                        {action.date}
                      </ThemedText>
                      <View
                        style={[
                          styles.pointsTag,
                          { backgroundColor: `${action.color}15` },
                        ]}
                      >
                        <ThemedText
                          style={[styles.pointsText, { color: action.color }]}
                        >
                          +{action.points} points
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}

            <Animated.View
              entering={FadeInUp.delay(userData.actions.length * 100)}
            >
              <TouchableOpacity
                style={styles.addActionButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={userLevel.gradient}
                  style={styles.addActionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <MaterialCommunityIcons name="plus" size={24} color="white" />
                  <ThemedText style={styles.addActionText}>
                    Log New Action
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        );

      case "tips":
        return (
          <Animated.View
            entering={FadeInUp.duration(500)}
            style={styles.tipsContainer}
          >
            <ThemedText style={styles.tipsTitle}>Eco-Friendly Tips</ThemedText>
            {userData.tips.map((tip, index) => (
              <Animated.View
                key={tip.id}
                entering={FadeInUp.delay(index * 100)}
              >
                <TouchableOpacity
                  style={[
                    styles.tipCard,
                    expandedTip === tip.id
                      ? {
                          shadowColor: "#8BC34A",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 6,
                          elevation: 8,
                        }
                      : {},
                  ]}
                  onPress={() => toggleTip(tip.id)}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={
                      index % 2 === 0
                        ? ["#8BC34A", "#689F38"]
                        : ["#4CAF50", "#2E7D32"]
                    }
                    style={styles.tipGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View style={styles.tipHeader}>
                      <MaterialCommunityIcons
                        name={tip.iconName}
                        size={24}
                        color="white"
                      />
                      <ThemedText style={styles.tipTitle}>
                        {tip.title}
                      </ThemedText>
                    </View>

                    {expandedTip === tip.id && (
                      <Animated.View
                        entering={FadeInUp.duration(300)}
                        style={styles.tipDetails}
                      >
                        <ThemedText style={styles.tipDescription}>
                          {tip.description}
                        </ThemedText>
                        <TouchableOpacity style={styles.tipActionButton}>
                          <ThemedText style={styles.tipActionText}>
                            Learn More
                          </ThemedText>
                        </TouchableOpacity>
                      </Animated.View>
                    )}

                    <MaterialCommunityIcons
                      name={
                        expandedTip === tip.id ? "chevron-up" : "chevron-down"
                      }
                      size={24}
                      color="white"
                      style={styles.expandIcon}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>
        );

      default:
        return null;
    }
  };

  // Animated styles for the tab indicator
  const animatedTabStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabIndicatorPosition.value * (width / 3) }],
    };
  });

  // Animated styles for score circle
  const animatedScoreStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scoreScale.value }],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Header Banner */}
      <LinearGradient
        colors={userLevel.gradient}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <ThemedText style={styles.userName}>{userData.name}</ThemedText>
            <ThemedText style={styles.levelTitle}>{userLevel.title}</ThemedText>
            <ThemedText style={styles.levelText}>
              {userLevel.level} Level
            </ThemedText>
          </View>

          <GestureDetector gesture={tapGesture}>
            <Animated.View style={animatedScoreStyles}>
              <CircularProgress
                score={userData.score}
                size={140}
                strokeWidth={12}
                level={userLevel}
              />
            </Animated.View>
          </GestureDetector>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {/* Animated tab indicator */}
        <Animated.View style={[styles.tabIndicator, animatedTabStyles]} />

        {/* Tab buttons */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onTabPress("overview")}
        >
          <MaterialCommunityIcons
            name="view-dashboard"
            size={24}
            color={activeTab === "overview" ? userLevel.color : "#757575"}
          />
          <ThemedText
            style={[
              styles.tabText,
              activeTab === "overview"
                ? { color: userLevel.color, fontWeight: "600" }
                : null,
            ]}
          >
            Overview
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onTabPress("actions")}
        >
          <MaterialCommunityIcons
            name="star"
            size={24}
            color={activeTab === "actions" ? userLevel.color : "#757575"}
          />
          <ThemedText
            style={[
              styles.tabText,
              activeTab === "actions"
                ? { color: userLevel.color, fontWeight: "600" }
                : null,
            ]}
          >
            Actions
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onTabPress("tips")}
        >
          <MaterialCommunityIcons
            name="lightbulb-on"
            size={24}
            color={activeTab === "tips" ? userLevel.color : "#757575"}
          />
          <ThemedText
            style={[
              styles.tabText,
              activeTab === "tips"
                ? { color: userLevel.color, fontWeight: "600" }
                : null,
            ]}
          >
            Tips
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {renderTabContent()}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    fontStyle: "italic",
    marginTop: 5,
  },
  levelText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
  },
  circleContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
  },
  scoreBadge: {
    fontSize: 24,
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: 15,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 10,
    padding: 5,
    position: "relative",
  },
  tabIndicator: {
    position: "absolute",
    width: "33.33%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 10,
  },
  tabButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    zIndex: 1,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: "#757575",
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  progressCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "white",
    borderRadius: 6,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "green",
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "center",
  },
  levelsCard: {
    backgroundColor: "black",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  levelsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#0D47A1",
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  levelIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  levelBadge: {
    fontSize: 18,
  },
  levelInfo: {
    flex: 1,
    marginLeft: 12,
  },
  levelName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white", // Changed from white to blue
  },
  levelPoints: {
    fontSize: 14,
    color: "white", // Changed from white to lighter blue
    marginTop: 2,
  },
  levelType: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  activeIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIndicatorText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },
  leaderboardCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  leaderboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000", // Changed to black
  },
  viewAllButton: {
    overflow: "hidden",
    borderRadius: 12,
  },
  viewAllGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  viewAllText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  leaderboardScrollContent: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  leaderCard: {
    width: 120,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rankIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  topRankEmoji: {
    fontSize: 16,
  },
  rankNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#757575",
  },
  leaderAvatarContainer: {
    position: "relative",
    marginBottom: 8,
  },
  leaderAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  badgeIcon: {
    position: "absolute",
    bottom: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  badgeIconText: {
    fontSize: 12,
  },
  leaderName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    textAlign: "center",
    color: "#000000", // Changed to black
  },
  scoreTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  scoreTagText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 12,
  },
  userRankInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  yourRankText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
    color: "#000000", // Changed to black
  },
  userRankBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  userRankText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  actionsContainer: {
    padding: 4,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    marginLeft: 4,
    color: "#000000", // Changed to black
  },
  actionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    padding: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  actionContent: {
    flex: 1,
    marginLeft: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000", // Changed to black
  },
  actionDate: {
    fontSize: 12,
    color: "#757575",
    marginTop: 2,
  },
  pointsTag: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  pointsText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  addActionButton: {
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  addActionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  addActionText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  tipsContainer: {
    padding: 4,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    marginLeft: 4,
    color: "#000000", // Changed to black
  },
  tipCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipGradient: {
    padding: 16,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  tipTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
    flex: 1,
  },
  tipDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgb(0, 0, 0)",
  },
  tipDescription: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 20,
  },
  tipActionButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 12,
  },
  tipActionText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  expandIcon: {
    position: "absolute",
    top: 16,
    right: 16,
  },
});
