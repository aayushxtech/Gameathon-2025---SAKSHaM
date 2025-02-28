import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

interface CarbonTrackingFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const CarbonTrackingForm = ({
  visible,
  onClose,
  onSubmit,
}: CarbonTrackingFormProps) => {
  const [publicTransport, setPublicTransport] = useState("");
  const [privateTransport, setPrivateTransport] = useState("");
  const [electricity, setElectricity] = useState("");
  const [meal, setMeal] = useState("vegetarian");
  const [animationValue] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(animationValue, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();
    } else {
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSubmit = () => {
    onSubmit({
      publicTransport: Number(publicTransport),
      privateTransport: Number(privateTransport),
      electricity: Number(electricity),
      meal,
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setPublicTransport("");
    setPrivateTransport("");
    setElectricity("");
    setMeal("vegetarian");
  };

  const translateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get("window").height, 0],
  });

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalBackdrop}>
          <Animated.View
            style={[styles.modalContainer, { transform: [{ translateY }] }]}
          >
            <ThemedView style={styles.formContainer}>
              <View style={styles.headerContainer}>
                <MaterialCommunityIcons name="leaf" size={26} color="#2E8B57" />
                <ThemedText style={styles.title}>
                  Track Carbon Footprint
                </ThemedText>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ThemedText style={styles.subtitle}>
                Track your daily activities to monitor your carbon impact
              </ThemedText>

              <ThemedView style={styles.inputContainer}>
                <View style={styles.iconLabelContainer}>
                  <MaterialIcons
                    name="directions-bus"
                    size={20}
                    color="#2E8B57"
                  />
                  <ThemedText style={styles.label}>Public Transport</ThemedText>
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={publicTransport}
                    onChangeText={setPublicTransport}
                    keyboardType="numeric"
                    placeholder="Distance in km"
                    placeholderTextColor="#999"
                  />
                  <ThemedText style={styles.unit}>km</ThemedText>
                </View>
              </ThemedView>

              <ThemedView style={styles.inputContainer}>
                <View style={styles.iconLabelContainer}>
                  <MaterialIcons
                    name="directions-car"
                    size={20}
                    color="#2E8B57"
                  />
                  <ThemedText style={styles.label}>
                    Private Transport
                  </ThemedText>
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={privateTransport}
                    onChangeText={setPrivateTransport}
                    keyboardType="numeric"
                    placeholder="Distance in km"
                    placeholderTextColor="#999"
                  />
                  <ThemedText style={styles.unit}>km</ThemedText>
                </View>
              </ThemedView>

              <ThemedView style={styles.inputContainer}>
                <View style={styles.iconLabelContainer}>
                  <MaterialIcons name="power" size={20} color="#2E8B57" />
                  <ThemedText style={styles.label}>Electricity Used</ThemedText>
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={electricity}
                    onChangeText={setElectricity}
                    keyboardType="numeric"
                    placeholder="Amount used"
                    placeholderTextColor="#999"
                  />
                  <ThemedText style={styles.unit}>kWh</ThemedText>
                </View>
              </ThemedView>

              <ThemedView style={styles.inputContainer}>
                <View style={styles.iconLabelContainer}>
                  <MaterialIcons name="restaurant" size={20} color="#2E8B57" />
                  <ThemedText style={styles.label}>Meal Type</ThemedText>
                </View>
                <View style={styles.pickerContainer}>
                  {Platform.OS === "ios" ? (
                    <Picker
                      selectedValue={meal}
                      onValueChange={(itemValue) => setMeal(itemValue)}
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                    >
                      <Picker.Item label="Vegetarian" value="vegetarian" />
                      <Picker.Item label="Vegan" value="vegan" />
                      <Picker.Item
                        label="Non-vegetarian"
                        value="non-vegetarian"
                      />
                      <Picker.Item label="Pescatarian" value="pescatarian" />
                    </Picker>
                  ) : (
                    <Picker
                      selectedValue={meal}
                      onValueChange={(itemValue) => setMeal(itemValue)}
                      style={styles.picker}
                      dropdownIconColor="#2E8B57"
                    >
                      <Picker.Item
                        label="Vegetarian"
                        value="vegetarian"
                        color="#333"
                      />
                      <Picker.Item label="Vegan" value="vegan" color="#333" />
                      <Picker.Item
                        label="Non-vegetarian"
                        value="non-vegetarian"
                        color="#333"
                      />
                      <Picker.Item
                        label="Pescatarian"
                        value="pescatarian"
                        color="#333"
                      />
                    </Picker>
                  )}
                </View>
              </ThemedView>

              <View style={styles.divider} />

              <ThemedView style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <ThemedText style={styles.cancelButtonText}>
                    Cancel
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <ThemedText style={styles.buttonText}>Submit</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "transparent",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E8B57",
    flex: 1,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  iconLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    marginLeft: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: "#333",
  },
  unit: {
    paddingRight: 14,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    color: "#333",
    height: 50,
  },
  pickerItem: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  submitButton: {
    backgroundColor: "#2E8B57",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#2E8B57",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#666",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
});
