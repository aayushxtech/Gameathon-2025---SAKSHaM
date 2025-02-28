import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Image,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useUserProfile } from "@/hooks/useUserProfile";
import { CarbonTrackingForm } from "@/components/CarbonTrackingForm";

interface LeaderboardEntry {
  id: number;
  name: string;
  ciiScore: number;
}

// Leaderboard data with Indian names
const leaderboardData: LeaderboardEntry[] = [
  { id: 1, name: "Priyanka Gupta", ciiScore: 420 },
  { id: 2, name: "Vikas Patel", ciiScore: 385 },
  { id: 3, name: "Anjali Mishra", ciiScore: 340 },
  { id: 4, name: "Rahul Sharma", ciiScore: 275 },
  { id: 5, name: "Anil Verma", ciiScore: 260 },
  { id: 6, name: "Divya Singh", ciiScore: 245 },
  { id: 7, name: "Mohan Kumar", ciiScore: 230 },
  { id: 8, name: "Nisha Yadav", ciiScore: 210 },
  { id: 9, name: "Karan Agarwal", ciiScore: 195 },
  { id: 10, name: "Meena Reddy", ciiScore: 180 },
];

// Helper function to determine badge based on CII score
const getBadge = (score: number): { name: string; color: string } => {
  if (score >= 400) return { name: "Platinum", color: "#B9F2FF" };
  if (score >= 300) return { name: "Gold", color: "#FFD700" };
  if (score >= 200) return { name: "Silver", color: "#C0C0C0" };
  if (score >= 100) return { name: "Bronze", color: "#CD7F32" };
  return { name: "Beginner", color: "#A4A4A4" };
};

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, loading, error } = useUserProfile();
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleTrackingSubmit = (data: any) => {
    // Here you would handle the submission of tracking data
    console.log("Tracking data:", data);
    // You can add API call here to submit the data
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2E8B57" />
      </ThemedView>
    );
  }

  if (error || !profile) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ThemedText style={styles.errorText}>
          {error || "Failed to load profile"}
        </ThemedText>
      </ThemedView>
    );
  }

  const userBadge = getBadge(profile.ciiScore);

  // Find user's ranking
  const userRanking =
    leaderboardData.findIndex((entry) => entry.name === profile.name) + 1;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Header */}
      <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backButtonText}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Profile</ThemedText>
      </Animated.View>

      <ScrollView style={styles.content}>
        {/* User Profile Section */}
        <Animated.View
          entering={FadeInUp.delay(200)}
          style={styles.profileCard}
        >
          <Image source={profile.profilePic} style={styles.profilePic} />

          <ThemedView style={styles.userInfo}>
            <ThemedText style={styles.userName}>{profile.name}</ThemedText>
            <ThemedText style={styles.userEmail}>{profile.email}</ThemedText>

            <ThemedView style={styles.badgeContainer}>
              <ThemedView
                style={[styles.badge, { backgroundColor: userBadge.color }]}
              >
                <ThemedText style={styles.badgeText}>
                  {userBadge.name}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Animated.View>

        {/* Add Track Carbon Button */}
        <Animated.View
          entering={FadeInUp.delay(350)}
          style={styles.trackButtonContainer}
        >
          <TouchableOpacity
            style={styles.trackButton}
            onPress={() => setIsFormVisible(true)}
          >
            <ThemedText style={styles.trackButtonText}>
              Track Carbon Footprint
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>

        {/* CII Score Card */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.scoreCard}>
          <ThemedText style={styles.scoreTitle}>Your CII Score</ThemedText>
          <ThemedText style={styles.scoreValue}>{profile.ciiScore}</ThemedText>
          <ThemedView style={styles.rankingContainer}>
            <ThemedText style={styles.rankingText}>
              You are ranked{" "}
              <ThemedText style={styles.rankNumber}>#{userRanking}</ThemedText>
            </ThemedText>
          </ThemedView>
        </Animated.View>

        {/* Leaderboard */}
        <Animated.View
          entering={FadeInUp.delay(400)}
          style={styles.leaderboardCard}
        >
          <ThemedText style={styles.leaderboardTitle}>Leaderboard</ThemedText>

          <ThemedView style={styles.leaderboardHeader}>
            <ThemedText style={styles.rankColumnHeader}>Rank</ThemedText>
            <ThemedText style={styles.nameColumnHeader}>Name</ThemedText>
            <ThemedText style={styles.scoreColumnHeader}>Score</ThemedText>
          </ThemedView>

          {leaderboardData.map((entry, index) => (
            <ThemedView
              key={entry.id}
              style={[
                styles.leaderboardRow,
                entry.name === profile.name ? styles.highlightedRow : null,
              ]}
            >
              <ThemedText style={styles.rankColumn}>
                {index < 3 ? (
                  <ThemedText style={styles.topRank}>
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </ThemedText>
                ) : (
                  `#${index + 1}`
                )}
              </ThemedText>

              <ThemedText
                style={[
                  styles.nameColumn,
                  entry.name === profile.name ? styles.highlightedText : null,
                ]}
              >
                {entry.name}
              </ThemedText>

              <ThemedText
                style={[
                  styles.scoreColumn,
                  entry.name === profile.name ? styles.highlightedText : null,
                ]}
              >
                {entry.ciiScore}
              </ThemedText>
            </ThemedView>
          ))}
        </Animated.View>

        {/* Badge Information */}
        <Animated.View
          entering={FadeInUp.delay(500)}
          style={styles.badgeInfoCard}
        >
          <ThemedText style={styles.badgeInfoTitle}>
            CII Badge Levels
          </ThemedText>

          <ThemedView style={styles.badgeRow}>
            <ThemedView
              style={[styles.badgeIcon, { backgroundColor: "#B9F2FF" }]}
            >
              <ThemedText style={styles.badgeIconText}>P</ThemedText>
            </ThemedView>
            <ThemedView style={styles.badgeInfo}>
              <ThemedText style={styles.badgeName}>Platinum</ThemedText>
              <ThemedText style={styles.badgeRequirement}>
                400+ points
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.badgeRow}>
            <ThemedView
              style={[styles.badgeIcon, { backgroundColor: "#FFD700" }]}
            >
              <ThemedText style={styles.badgeIconText}>G</ThemedText>
            </ThemedView>
            <ThemedView style={styles.badgeInfo}>
              <ThemedText style={styles.badgeName}>Gold</ThemedText>
              <ThemedText style={styles.badgeRequirement}>
                300+ points
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.badgeRow}>
            <ThemedView
              style={[styles.badgeIcon, { backgroundColor: "#C0C0C0" }]}
            >
              <ThemedText style={styles.badgeIconText}>S</ThemedText>
            </ThemedView>
            <ThemedView style={styles.badgeInfo}>
              <ThemedText style={styles.badgeName}>Silver</ThemedText>
              <ThemedText style={styles.badgeRequirement}>
                200+ points
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.badgeRow}>
            <ThemedView
              style={[styles.badgeIcon, { backgroundColor: "#CD7F32" }]}
            >
              <ThemedText style={styles.badgeIconText}>B</ThemedText>
            </ThemedView>
            <ThemedView style={styles.badgeInfo}>
              <ThemedText style={styles.badgeName}>Bronze</ThemedText>
              <ThemedText style={styles.badgeRequirement}>
                100+ points
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </Animated.View>

        {/* Carbon Tracking Form Modal */}
        <CarbonTrackingForm
          visible={isFormVisible}
          onClose={() => setIsFormVisible(false)}
          onSubmit={handleTrackingSubmit}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    padding: 16,
    backgroundColor: "#2E8B57",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    flexDirection: "row",
    backgroundColor: "#000",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "white",
  },
  userEmail: {
    fontSize: 14,
    color: "white",
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: "row",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  scoreCard: {
    backgroundColor: "#2E8B57",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreTitle: {
    fontSize: 10,

    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  rankingContainer: {
    backgroundColor: "rgba(1, 1, 1, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  rankingText: {
    fontSize: 14,
    color: "#ffffff",
  },
  rankNumber: {
    fontWeight: "bold",
    fontSize: 16,
  },
  leaderboardCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E8B57",
    marginBottom: 16,
  },
  leaderboardHeader: {
    flexDirection: "row",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    marginBottom: 8,
  },
  rankColumnHeader: {
    width: 50,
    fontSize: 14,
    color: "white",
  },
  nameColumnHeader: {
    flex: 1,
    fontSize: 14,
    color: "white",
  },
  scoreColumnHeader: {
    width: 60,
    fontSize: 14,
    color: "white",
    textAlign: "right",
  },
  leaderboardRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    alignItems: "center",
  },
  highlightedRow: {
    backgroundColor: "#2E8B57",
    borderRadius: 8,
  },
  rankColumn: {
    width: 50,
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  nameColumn: {
    flex: 1,
    fontSize: 16,
    color: "white",
  },
  scoreColumn: {
    width: 60,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    color: "white",
  },
  topRank: {
    fontSize: 20,
  },
  highlightedText: {
    fontWeight: "bold",
    color: "white",
  },
  badgeInfoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E8B57",
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  badgeIconText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  badgeRequirement: {
    fontSize: 14,
    color: "#666",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
  trackButtonContainer: {
    marginBottom: 16,
  },
  trackButton: {
    backgroundColor: "#2E8B57",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trackButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
