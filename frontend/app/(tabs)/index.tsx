import {
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  View,
  Alert,
} from "react-native";
import { useState } from "react";
import Animated, { FadeInUp, FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ProfileButton from "../components/ProfileButton";
import HostEventModal, { EventFormData } from "../components/HostEventModal";

const { width } = Dimensions.get("window");

interface Event {
  id: number;
  title: string;
  description: string;
  image: { uri: string };
  date: string;
  location: string;
  organizer: string;
}

const climateEvents: Event[] = [
  {
    id: 1,
    title: "Climate Resilience Workshop",
    description:
      "Learn practical strategies for climate adaptation in urban environments",
    image: {
      uri: "https://images.unsplash.com/photo-1607946683673-c6d46bc96303?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    date: "March 15, 2025",
    location: "Anna University, Guindy, Chennai",
    organizer: "Chennai Climate Action Network",
  },
  {
    id: 2,
    title: "Coastal Conservation Drive",
    description: "Join us to protect Chennai's vulnerable coastal ecosystems",
    image: {
      uri: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    date: "March 22, 2025",
    location: "Marina Beach, Chennai",
    organizer: "Bay of Bengal Conservation Group",
  },
  {
    id: 3,
    title: "Urban Forest Initiative",
    description:
      "Help plant 1000 native trees across Chennai's urban landscape",
    image: {
      uri: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    date: "April 5, 2025",
    location: "Semmozhi Poonga, Chennai",
    organizer: "Green Chennai Mission",
  },
  {
    id: 4,
    title: "Climate Justice Panel Discussion",
    description:
      "Exploring how climate change affects vulnerable communities in Tamil Nadu",
    image: {
      uri: "https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    date: "April 12, 2025",
    location: "IIT Madras Research Park, Chennai",
    organizer: "Climate Equity Forum",
  },
  {
    id: 5,
    title: "Renewable Energy Expo",
    description:
      "Discover solar and wind energy solutions for urban households",
    image: {
      uri: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    date: "April 18, 2025",
    location: "Chennai Trade Centre, Nandambakkam",
    organizer: "Tamil Nadu Renewable Energy Association",
  },
  {
    id: 6,
    title: "Climate-Smart Agriculture Workshop",
    description:
      "Sustainable farming techniques for Chennai's peri-urban farmers",
    image: {
      uri: "https://images.unsplash.com/photo-1625246333195-78d73c5207fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    date: "April 25, 2025",
    location: "Tamil Nadu Agricultural University Extension, Chennai",
    organizer: "Sustainable Farming Collective",
  },
];

export default function HomeScreen() {
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [events, setEvents] = useState<Event[]>(climateEvents);

  const categories = [
    { id: "all", name: "All Events", icon: "calendar-alt" },
    { id: "workshop", name: "Workshops", icon: "chalkboard-teacher" },
    { id: "conservation", name: "Conservation", icon: "leaf" },
    { id: "discussion", name: "Discussions", icon: "comments" },
  ];

  const toggleEventDetails = (eventId: number) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  const handleCreateEvent = (formData: EventFormData) => {
    // Create a new event from the form data
    const newEvent: Event = {
      id: events.length + 1,
      title: formData.title,
      description: formData.description,
      image: { uri: formData.imageUri || "" },
      date: formData.date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      location: formData.location,
      organizer: formData.organizer,
    };

    // Add the new event to the events list
    setEvents([newEvent, ...events]);

    // Show success message
    Alert.alert(
      "Event Created",
      "Your event has been successfully created and is now listed.",
      [{ text: "OK" }]
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Enhanced Header Section - Made more compact */}
      <LinearGradient
        colors={["#1B5E20", "#2E8B57", "#43A047"]}
        style={styles.headerGradient}
      >
        <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
          <View style={styles.headerContent}>
            <ThemedText style={styles.welcomeText}>Welcome to</ThemedText>
            <ThemedText style={styles.headerTitle}>SAKSHaM</ThemedText>
            <ThemedText style={styles.locationText}>
              <FontAwesome5 name="map-marker-alt" size={14} color="#fff" />{" "}
              Chennai
            </ThemedText>
          </View>
          <ProfileButton />
        </Animated.View>
      </LinearGradient>

      {/* Combined Category Selector and Content in one ScrollView */}
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Selector now inside main ScrollView */}
        <View style={styles.categoryWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map((category, index) => (
              <Animated.View
                key={category.id}
                entering={FadeInUp.delay(index * 100)}
              >
                <TouchableOpacity
                  onPress={() => setActiveCategory(category.id)}
                  style={[
                    styles.categoryButton,
                    activeCategory === category.id &&
                      styles.categoryButtonActive,
                  ]}
                >
                  <FontAwesome5
                    name={category.icon}
                    size={16}
                    color={activeCategory === category.id ? "#fff" : "#2E8B57"}
                  />
                  <ThemedText
                    style={[
                      styles.categoryText,
                      activeCategory === category.id &&
                        styles.categoryTextActive,
                    ]}
                  >
                    {category.name}
                  </ThemedText>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.eventsContainer}>
          <ThemedText style={styles.subtitle}>
            <FontAwesome5 name="star" size={16} color="#2E8B57" /> Featured
            Events
          </ThemedText>

          {events.map((event, index) => (
            <Animated.View
              key={event.id}
              entering={FadeInUp.delay(index * 100)}
              style={styles.eventCard}
            >
              <Image source={event.image} style={styles.eventImage} />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)"]}
                style={styles.imageOverlay}
              />

              <View style={styles.eventDateBadge}>
                <ThemedText style={styles.eventDate}>
                  {new Date(event.date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </ThemedText>
              </View>

              <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                  <ThemedText style={styles.eventTitle}>
                    {event.title}
                  </ThemedText>
                  <TouchableOpacity
                    onPress={() => toggleEventDetails(event.id)}
                    style={styles.viewMoreButton}
                  >
                    <FontAwesome5
                      name={
                        expandedEvent === event.id
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={16}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.eventInfo}>
                  <View style={styles.eventInfoItem}>
                    <FontAwesome5
                      name="map-marker-alt"
                      size={14}
                      color="#fff"
                    />
                    <ThemedText style={styles.eventInfoText}>
                      {event.location}
                    </ThemedText>
                  </View>
                  <View style={styles.eventInfoItem}>
                    <FontAwesome5 name="users" size={14} color="#fff" />
                    <ThemedText style={styles.eventInfoText}>
                      {event.organizer}
                    </ThemedText>
                  </View>
                </View>

                {expandedEvent === event.id && (
                  <Animated.View
                    entering={FadeIn.duration(400)}
                    style={styles.eventDetails}
                  >
                    <ThemedText style={styles.eventDescription}>
                      {event.description}
                    </ThemedText>
                    <TouchableOpacity style={styles.registerButton}>
                      <ThemedText style={styles.registerButtonText}>
                        Register Now
                      </ThemedText>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Adding padding at the bottom to account for the floating button */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Host Event Modal */}
      <HostEventModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreateEvent}
      />

      {/* Enhanced Host Event Button */}
      <BlurView intensity={100} style={styles.hostEventButtonContainer}>
        <TouchableOpacity
          style={styles.hostEventButton}
          onPress={() => setModalVisible(true)}
        >
          <LinearGradient
            colors={["#2E8B57", "#43A047"]}
            style={styles.hostEventGradient}
          >
            <FontAwesome5 name="plus-circle" size={18} color="#fff" />
            <ThemedText style={styles.hostEventText}>Host Event</ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </BlurView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Slightly darker background to reduce white space feel
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 45 : 35, // Reduced padding
    borderBottomLeftRadius: 25, // Smaller radius
    borderBottomRightRadius: 25,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16, // Reduced padding
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14, // Smaller text
    color: "#E8F5E9",
    marginBottom: 2, // Reduced margin
  },
  headerTitle: {
    fontSize: 24, // Smaller text
    fontWeight: "bold",
    color: "#ffffff",
  },
  locationText: {
    fontSize: 12, // Smaller text
    color: "#E8F5E9",
    marginTop: 2, // Reduced margin
  },
  mainContainer: {
    flex: 1,
  },
  categoryWrapper: {
    backgroundColor: "#f0f0f0",
    paddingTop: 10, // Add padding
    marginTop: -15, // Pull up to overlap with header
    zIndex: 1,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingBottom: 4, // Reduced padding
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14, // Reduced padding
    paddingVertical: 8, // Reduced padding
    borderRadius: 20,
    marginRight: 10, // Reduced margin
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 }, // Smaller shadow
    shadowOpacity: 0.1,
    shadowRadius: 2, // Smaller shadow
    elevation: 2, // Smaller elevation
  },
  categoryButtonActive: {
    backgroundColor: "#2E8B57",
  },
  categoryText: {
    marginLeft: 6, // Reduced margin
    fontSize: 12, // Smaller text
    color: "#2E8B57",
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#fff",
  },
  eventsContainer: {
    padding: 12, // Reduced padding
  },
  subtitle: {
    fontSize: 18, // Smaller text
    fontWeight: "700",
    marginBottom: 10, // Reduced margin
    color: "#2E8B57",
  },
  eventCard: {
    marginBottom: 16, // Reduced margin
    borderRadius: 12, // Smaller radius
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  eventImage: {
    width: "100%",
    height: 180, // Smaller image
  },
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
  },
  eventDateBadge: {
    position: "absolute",
    top: 12, // Reduced position
    right: 12, // Reduced position
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 10, // Smaller radius
    padding: 6, // Reduced padding
    alignItems: "center",
  },
  eventDate: {
    fontSize: 12, // Smaller text
    fontWeight: "bold",
    color: "#2E8B57",
  },
  eventContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12, // Reduced padding
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6, // Reduced margin
  },
  eventTitle: {
    fontSize: 18, // Smaller text
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  viewMoreButton: {
    padding: 6, // Reduced padding
  },
  eventInfo: {
    flexDirection: "row",
    marginBottom: 8, // Reduced margin
  },
  eventInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12, // Reduced margin
  },
  eventInfoText: {
    marginLeft: 4, // Reduced margin
    color: "#fff",
    fontSize: 12, // Smaller text
  },
  eventDetails: {
    marginTop: 8, // Reduced margin
    padding: 12, // Reduced padding
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10, // Smaller radius
  },
  eventDescription: {
    color: "#fff",
    fontSize: 13, // Smaller text
    lineHeight: 18, // Reduced line height
    marginBottom: 12, // Reduced margin
  },
  registerButton: {
    backgroundColor: "#fff",
    paddingVertical: 8, // Reduced padding
    paddingHorizontal: 16, // Reduced padding
    borderRadius: 20, // Smaller radius
    alignItems: "center",
  },
  registerButtonText: {
    color: "#2E8B57",
    fontWeight: "bold",
    fontSize: 12, // Smaller text
  },
  bottomPadding: {
    height: 80, // Space for the floating button
  },
  hostEventButtonContainer: {
    position: "absolute",
    bottom: 16, // Reduced position
    left: 16, // Position from left instead of stretching across screen
    right: 16, // Position from right instead of stretching across screen
    paddingVertical: 0, // Removed padding
    paddingHorizontal: 0, // Removed padding
  },
  hostEventButton: {
    overflow: "hidden",
    borderRadius: 25, // Smaller radius
  },
  hostEventGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14, // Reduced padding
  },
  hostEventText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14, // Smaller text
    marginLeft: 8,
  },
});
