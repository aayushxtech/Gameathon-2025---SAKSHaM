import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';

const ProfileButton: React.FC = () => {
  const router = useRouter();
  const userName = "Rahul"; // Indian name in English

  const handleProfilePress = () => {
    router.push('/profile');
  };

  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={handleProfilePress}
    >
      <View style={styles.avatarContainer}>
        <ThemedText style={styles.avatarText}>
          {userName.charAt(0)}
        </ThemedText>
      </View>
      <ThemedText style={styles.text}>{userName}</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ProfileButton;