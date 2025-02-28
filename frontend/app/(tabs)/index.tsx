import { Image, StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ProfileButton from '../components/ProfileButton';

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
    description: "Learn practical strategies for climate adaptation in urban environments",
    image: { uri: "https://images.unsplash.com/photo-1623527859518-37dbe5d5ae4c" },
    date: "March 15, 2025",
    location: "Anna University, Guindy, Chennai",
    organizer: "Chennai Climate Action Network"
  },
  {
    id: 2,
    title: "Coastal Conservation Drive",
    description: "Join us to protect Chennai's vulnerable coastal ecosystems",
    image: { uri: "https://images.unsplash.com/photo-1621451537084-482c73073a0f" },
    date: "March 22, 2025",
    location: "Marina Beach, Chennai",
    organizer: "Bay of Bengal Conservation Group"
  },
  {
    id: 3,
    title: "Urban Forest Initiative",
    description: "Help plant 1000 native trees across Chennai's urban landscape",
    image: { uri: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09" },
    date: "April 5, 2025",
    location: "Semmozhi Poonga, Chennai",
    organizer: "Green Chennai Mission"
  },
  {
    id: 4,
    title: "Climate Justice Panel Discussion",
    description: "Exploring how climate change affects vulnerable communities in Tamil Nadu",
    image: { uri: "https://images.unsplash.com/photo-1661956602116-aa6865609028" },
    date: "April 12, 2025",
    location: "IIT Madras Research Park, Chennai",
    organizer: "Climate Equity Forum"
  },
  {
    id: 5,
    title: "Renewable Energy Expo",
    description: "Discover solar and wind energy solutions for urban households",
    image: { uri: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d" },
    date: "April 18, 2025",
    location: "Chennai Trade Centre, Nandambakkam",
    organizer: "Tamil Nadu Renewable Energy Association"
  },
  {
    id: 6,
    title: "Climate-Smart Agriculture Workshop",
    description: "Sustainable farming techniques for Chennai's peri-urban farmers",
    image: { uri: "https://images.unsplash.com/photo-1625246333195-78d73c5207fd" },
    date: "April 25, 2025",
    location: "Tamil Nadu Agricultural University Extension, Chennai",
    organizer: "Sustainable Farming Collective"
  }

];

export default function HomeScreen() {
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  const toggleEventDetails = (eventId: number) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header Section */}
      <Animated.View 
        entering={FadeInUp.duration(800)}
        style={styles.header}
      >
        <ThemedText style={styles.headerTitle}>Climate Action</ThemedText>
        <ProfileButton />
      </Animated.View>

      {/* Events Listing */}
      <ScrollView style={styles.content}>
        <ThemedText style={styles.subtitle}>
          SDG 13 Events in Chennai
        </ThemedText>
        
        {climateEvents.map((event, index) => (
          <Animated.View 
            key={event.id}
            entering={FadeInUp.delay(index * 100)}
            style={styles.eventCard}
          >
            <Image source={event.image} style={styles.eventImage} />
            <ThemedView style={styles.eventContent}>
              <ThemedText style={styles.eventTitle}>{event.title}</ThemedText>
              <ThemedText style={styles.eventDescription}>{event.description}</ThemedText>
              
              <TouchableOpacity
                onPress={() => toggleEventDetails(event.id)}
                style={styles.viewMoreButton}
              >
                <ThemedText style={styles.viewMoreText}>
                  {expandedEvent === event.id ? 'View Less' : 'View More'}
                </ThemedText>
              </TouchableOpacity>

              {expandedEvent === event.id && (
                <Animated.View 
                  entering={FadeInUp.duration(400)}
                  style={styles.eventDetails}
                >
                  <ThemedText style={styles.detailLabel}>Date:</ThemedText>
                  <ThemedText style={styles.detailText}>{event.date}</ThemedText>
                  
                  <ThemedText style={styles.detailLabel}>Location:</ThemedText>
                  <ThemedText style={styles.detailText}>{event.location}</ThemedText>
                  
                  <ThemedText style={styles.detailLabel}>Organizer:</ThemedText>
                  <ThemedText style={styles.detailText}>{event.organizer}</ThemedText>
                </Animated.View>
              )}
            </ThemedView>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Host Event Button */}
      <TouchableOpacity style={styles.hostEventButton}>
        <ThemedText style={styles.hostEventText}>Host Climate Event</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff', // Light blue tint for climate theme
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2E8B57', // Sea green for environmental theme
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#2E8B57', // Matching header color
  },
  eventCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 180,
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2E8B57', // Matching header color
  },
  eventDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  viewMoreButton: {
    backgroundColor: '#f0f8ff',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  viewMoreText: {
    color: '#2E8B57',
    fontWeight: '600',
  },
  eventDetails: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginTop: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  hostEventButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#2E8B57',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  hostEventText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
