import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedText } from "@/components/ThemedText";

interface HostEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (eventData: EventFormData) => void;
}

export interface EventFormData {
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  imageUri: string | null;
  category: string;
}

const HostEventModal: React.FC<HostEventModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: new Date(),
    location: "",
    organizer: "",
    imageUri: null,
    category: "workshop",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof EventFormData, string>>
  >({});

  const categories = [
    { id: "workshop", name: "Workshop" },
    { id: "conservation", name: "Conservation" },
    { id: "discussion", name: "Discussion" },
    { id: "other", name: "Other" },
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({ ...formData, imageUri: result.assets[0].uri });
      // Clear any image error
      setErrors((prev) => ({ ...prev, imageUri: undefined }));
    }
  };

  const handleInputChange = (
    field: keyof EventFormData,
    value: string | Date
  ) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange("date", selectedDate);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.organizer.trim())
      newErrors.organizer = "Organizer is required";
    if (!formData.imageUri) newErrors.imageUri = "Event image is required";

    // Check if date is in the future
    if (formData.date <= new Date()) {
      newErrors.date = "Event date must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      // Reset form data
      setFormData({
        title: "",
        description: "",
        date: new Date(),
        location: "",
        organizer: "",
        imageUri: null,
        category: "workshop",
      });
      onClose();
    } else {
      Alert.alert("Form Error", "Please fill all required fields correctly.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <BlurView intensity={100} style={styles.blurContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidContainer}
        >
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={["#2E8B57", "#43A047"]}
              style={styles.modalHeader}
            >
              <ThemedText style={styles.modalTitle}>
                Host Climate Event
              </ThemedText>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <FontAwesome5 name="times" size={20} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

            <ScrollView style={styles.formContainer}>
              {/* Event Title */}
              <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Event Title*</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    errors.title ? styles.inputError : null,
                  ]}
                  placeholder="Enter event title"
                  placeholderTextColor="#999"
                  value={formData.title}
                  onChangeText={(text) => handleInputChange("title", text)}
                />
                {errors.title && (
                  <ThemedText style={styles.errorText}>
                    {errors.title}
                  </ThemedText>
                )}
              </View>

              {/* Event Description */}
              <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Description*</ThemedText>
                <TextInput
                  style={[
                    styles.textArea,
                    errors.description ? styles.inputError : null,
                  ]}
                  placeholder="Describe your event"
                  placeholderTextColor="#999"
                  multiline={true}
                  numberOfLines={4}
                  value={formData.description}
                  onChangeText={(text) =>
                    handleInputChange("description", text)
                  }
                />
                {errors.description && (
                  <ThemedText style={styles.errorText}>
                    {errors.description}
                  </ThemedText>
                )}
              </View>

              {/* Event Date */}
              <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Event Date*</ThemedText>
                <TouchableOpacity
                  style={[
                    styles.dateSelector,
                    errors.date ? styles.inputError : null,
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <FontAwesome5
                    name="calendar-alt"
                    size={16}
                    color="#2E8B57"
                    style={styles.dateIcon}
                  />
                  <ThemedText style={styles.dateText}>
                    {formData.date.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </ThemedText>
                </TouchableOpacity>
                {errors.date && (
                  <ThemedText style={styles.errorText}>
                    {errors.date}
                  </ThemedText>
                )}

                {showDatePicker && (
                  <DateTimePicker
                    value={formData.date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </View>

              {/* Location */}
              <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Location*</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    errors.location ? styles.inputError : null,
                  ]}
                  placeholder="Event location"
                  placeholderTextColor="#999"
                  value={formData.location}
                  onChangeText={(text) => handleInputChange("location", text)}
                />
                {errors.location && (
                  <ThemedText style={styles.errorText}>
                    {errors.location}
                  </ThemedText>
                )}
              </View>

              {/* Organizer */}
              <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Organizer*</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    errors.organizer ? styles.inputError : null,
                  ]}
                  placeholder="Organization name"
                  placeholderTextColor="#999"
                  value={formData.organizer}
                  onChangeText={(text) => handleInputChange("organizer", text)}
                />
                {errors.organizer && (
                  <ThemedText style={styles.errorText}>
                    {errors.organizer}
                  </ThemedText>
                )}
              </View>

              {/* Category Selection */}
              <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Category*</ThemedText>
                <View style={styles.categoryContainer}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryOption,
                        formData.category === category.id &&
                          styles.categorySelected,
                      ]}
                      onPress={() => handleInputChange("category", category.id)}
                    >
                      <ThemedText
                        style={[
                          styles.categoryText,
                          formData.category === category.id &&
                            styles.categoryTextSelected,
                        ]}
                      >
                        {category.name}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Image Upload */}
              <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Event Image*</ThemedText>
                <TouchableOpacity
                  style={styles.imageUploadContainer}
                  onPress={pickImage}
                >
                  {formData.imageUri ? (
                    <Image
                      source={{ uri: formData.imageUri }}
                      style={styles.uploadedImage}
                    />
                  ) : (
                    <View
                      style={[
                        styles.imageUploadPlaceholder,
                        errors.imageUri ? styles.inputError : null,
                      ]}
                    >
                      <FontAwesome5 name="image" size={28} color="#aaa" />
                      <ThemedText style={styles.uploadText}>
                        Upload Event Image
                      </ThemedText>
                    </View>
                  )}
                </TouchableOpacity>
                {errors.imageUri && (
                  <ThemedText style={styles.errorText}>
                    {errors.imageUri}
                  </ThemedText>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <LinearGradient
                  colors={["#2E8B57", "#43A047"]}
                  style={styles.submitGradient}
                >
                  <ThemedText style={styles.submitText}>
                    Create Event
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.bottomPadding} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: "center",
  },
  keyboardAvoidContainer: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    padding: 5,
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 14,
    color: "#333",
  },
  inputError: {
    borderColor: "#f44336",
    borderWidth: 1,
  },
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginTop: 4,
  },
  textArea: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 14,
    color: "#333",
    height: 100,
    textAlignVertical: "top",
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 14,
    color: "#333",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryOption: {
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categorySelected: {
    backgroundColor: "#2E8B57",
    borderColor: "#2E8B57",
  },
  categoryText: {
    fontSize: 14,
    color: "#555",
  },
  categoryTextSelected: {
    color: "#fff",
  },
  imageUploadContainer: {
    width: "100%",
    height: 150,
    marginBottom: 10,
  },
  imageUploadPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#aaa",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  uploadText: {
    marginTop: 8,
    color: "#777",
    fontSize: 14,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 25,
    overflow: "hidden",
  },
  submitGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomPadding: {
    height: 20,
  },
});

export default HostEventModal;
