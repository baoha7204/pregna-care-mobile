import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import useFetuses from "@/hooks/useFetuses";
import { theme } from "@/styles/theme";
import FetusSelectionModal from "@/components/Header/FetusSelectionModal";

export default function TrackingScreen() {
  const router = useRouter();
  const { fetuses, currentFetus, switchFetus } = useFetuses();
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.fetusSelector}
          onPress={toggleModal}
          activeOpacity={0.7}
        >
          <View style={styles.babyInfo}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1470&auto=format&fit=crop",
              }}
              style={styles.babyIcon}
            />
            <View>
              <Text style={styles.babyName}>
                {currentFetus ? currentFetus.name : "No baby yet"}
              </Text>
              <Text style={styles.babyWeeks}>
                {currentFetus ? `${currentFetus.weeks} weeks` : ""}
              </Text>
            </View>
            <Feather
              name="chevron-down"
              size={20}
              color={theme.secondary}
              style={styles.dropDownIcon}
            />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Growth Overview</Text>
          {currentFetus ? (
            <>
              <View style={styles.metricsContainer}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{currentFetus.weeks}</Text>
                  <Text style={styles.metricLabel}>Weeks</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>
                    {currentFetus.weeks >= 27
                      ? "3rd"
                      : currentFetus.weeks >= 14
                      ? "2nd"
                      : "1st"}
                  </Text>
                  <Text style={styles.metricLabel}>Trimester</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Tracking Tools</Text>
              <View style={styles.trackingOptions}>
                <TouchableOpacity
                  style={styles.trackingCard}
                  onPress={() =>
                    router.push("/(app)/(tabs)/(tracking)/measurements")
                  }
                >
                  <View style={styles.trackingIconContainer}>
                    <FontAwesome5
                      name="weight"
                      size={24}
                      color={theme.primary}
                    />
                  </View>
                  <Text style={styles.trackingCardTitle}>
                    Growth Measurements
                  </Text>
                  <Text style={styles.trackingCardDesc}>
                    Track weight, length, and head size
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.trackingCard}>
                  <View style={styles.trackingIconContainer}>
                    <FontAwesome5
                      name="heartbeat"
                      size={24}
                      color={theme.primary}
                    />
                  </View>
                  <Text style={styles.trackingCardTitle}>Kicks Counter</Text>
                  <Text style={styles.trackingCardDesc}>
                    Monitor baby's movements
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={styles.noFetusText}>
              Please select or add a baby to start tracking
            </Text>
          )}
        </View>
        <FetusSelectionModal
          visible={modalVisible}
          fetuses={fetuses || []}
          currentFetus={currentFetus}
          onClose={toggleModal}
          onSelect={switchFetus}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryLight,
  },
  header: {
    padding: 16,
    backgroundColor: theme.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderPrimary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.secondary,
    marginBottom: 16,
  },
  fetusSelector: {
    backgroundColor: theme.primaryDisabled,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  babyInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  babyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  babyName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.secondary,
  },
  babyWeeks: {
    fontSize: 14,
    color: theme.secondaryLight,
  },
  dropDownIcon: {
    position: "absolute",
    right: 0,
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.secondary,
    marginTop: 10,
    marginBottom: 16,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: theme.primaryDisabled,
    borderRadius: 12,
    padding: 20,
    width: "45%",
    alignItems: "center",
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.secondary,
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 16,
    color: theme.secondaryLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.secondary,
    marginBottom: 16,
  },
  trackingOptions: {
    gap: 16,
  },
  trackingCard: {
    backgroundColor: theme.textPrimary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  trackingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  trackingCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.secondary,
    marginBottom: 4,
  },
  trackingCardDesc: {
    fontSize: 14,
    color: theme.secondaryLight,
  },
  noFetusText: {
    fontSize: 16,
    color: theme.secondaryLight,
    textAlign: "center",
    marginTop: 40,
  },
});
