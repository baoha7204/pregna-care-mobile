import React, { useMemo } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { View } from "@ant-design/react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, FontAwesome } from "@expo/vector-icons";

import { Fetus } from "@/contexts/auth.context";
import { theme } from "@/styles/theme";

type FetusSelectionModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (newFetus: Fetus) => void;
  fetuses: Fetus[];
  currentFetus: Fetus | null;
};

const FetusSelectionModal = ({
  visible,
  onClose,
  onSelect,
  fetuses,
  currentFetus,
}: FetusSelectionModalProps) => {
  return (
    <SafeAreaView style={styles.modalContainer}>
      <Modal animationType="fade" transparent={true} visible={visible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Baby List</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.babyList}>
              {fetuses.map((fetus) => (
                <TouchableOpacity
                  key={fetus.id}
                  style={[
                    styles.babyItem,
                    currentFetus &&
                      currentFetus.id === fetus.id &&
                      styles.selectedBabyItem,
                  ]}
                  onPress={() => onSelect(fetus)}
                >
                  <View style={styles.babyItemContent}>
                    <Image
                      source={{
                        uri: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1470&auto=format&fit=crop",
                      }}
                      style={styles.babyItemIcon}
                    />
                    <View>
                      <Text style={styles.babyItemName}>{fetus.name}</Text>
                      <Text style={styles.babyItemWeeks}>
                        {fetus.weeks} weeks
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity style={styles.addBabyButton}>
                <FontAwesome name="plus" size={20} color={theme.primary} />
                <Text style={styles.addBabyText}>Update family info</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: theme.textPrimary,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: theme.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderPrimary,
  },
  closeButton: {
    padding: 4,
  },
  babyList: {
    maxHeight: 400,
  },
  babyItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  selectedBabyItem: {
    backgroundColor: theme.primaryDisabled,
  },
  babyItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  babyItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  babyItemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  babyItemWeeks: {
    fontSize: 14,
    color: "#666",
  },
  addBabyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  addBabyText: {
    marginLeft: 8,
    fontSize: 16,
    color: theme.primary,
    fontWeight: "500",
  },
});

export default FetusSelectionModal;
