import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { theme } from "@/styles/theme";
import useFetuses from "@/hooks/useFetuses";
import { customAxios } from "@/api/core";
import RadarGrowthChart from "@/components/Chart/RadarGrowthChart";

// Define types for the data structures
interface MeasurementType {
  name: string;
  unit: string;
  value?: string; // For storing user input
}

interface MeasurementValue {
  name: string;
  unit: string;
  value: number;
}

interface WeekData {
  week: number;
  data: MeasurementValue[];
}

// Cập nhật định nghĩa interface để phản ánh đúng dữ liệu API
interface GrowthMetricHistory {
  _id?: string;
  fetusId?: string;
  week: number;
  data: MeasurementValue[];
}

export default function MeasurementsScreen() {
  const { currentFetus } = useFetuses();
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [measurementTypes, setMeasurementTypes] = useState<MeasurementType[]>(
    []
  );
  // Cập nhật state để sử dụng mảng thay vì một object
  const [growthMetricHistory, setGrowthMetricHistory] = useState<
    GrowthMetricHistory[]
  >([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPregnancyWeek, setCurrentPregnancyWeek] = useState<number>(0);

  // Generate array of 40 weeks
  const weeks = Array.from({ length: 40 }, (_, i) => i + 1);

  // Load growth metric history when current fetus changes
  useEffect(() => {
    if (currentFetus?.id) {
      loadGrowthMetricHistory();
    }
  }, [currentFetus]);

  // Add this effect to set the current pregnancy week when the currentFetus changes
  useEffect(() => {
    if (currentFetus?.weeks) {
      setCurrentPregnancyWeek(currentFetus.weeks);
    }
  }, [currentFetus]);

  // Sửa lại hàm loadGrowthMetricHistory
  const loadGrowthMetricHistory = async () => {
    if (!currentFetus?.id) return;

    setHistoryLoading(true);

    try {
      const response = await customAxios.get(
        `/growth-metric/find-all-by-fetus/${currentFetus.id}`
      );

      if (response.data && response.data.success && response.data.data) {
        // Lưu trữ dữ liệu như một mảng
        setGrowthMetricHistory(response.data.data);
      } else {
        setGrowthMetricHistory([]);
      }
    } catch (error) {
      console.error("Error loading growth metric history:", error);
      setGrowthMetricHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Cập nhật hàm handleWeekSelect
  const handleWeekSelect = async (week: number) => {
    setSelectedWeek(week);
    setLoading(true);

    try {
      // Tìm dữ liệu cho tuần đã chọn
      const existingWeekData = Array.isArray(growthMetricHistory)
        ? growthMetricHistory.find((weekData) => weekData.week === week)
        : undefined;

      // Load standard measurements for selected week
      const response = await customAxios.get(
        `/admin/fetus-standard/find-by-week?week=${week}`
      );

      if (response.data && response.data.success && response.data.data) {
        if (
          existingWeekData &&
          existingWeekData.data &&
          existingWeekData.data.length > 0
        ) {
          // Pre-fill with existing measurements and set editMode to true
          const mappedData = response.data.data.map(
            (standardItem: MeasurementType) => {
              // Find matching measurement in existing data
              const existingMeasurement = existingWeekData.data.find(
                (item) => item.name === standardItem.name
              );

              console.log(
                `For ${standardItem.name}, found existing value:`,
                existingMeasurement?.value
              );

              return {
                ...standardItem,
                value: existingMeasurement
                  ? String(existingMeasurement.value)
                  : "",
              };
            }
          );
          setMeasurementTypes(mappedData);
          setEditMode(true);
        } else {
          // No existing data, use empty values and set editMode to false
          const mappedData = response.data.data.map(
            (item: MeasurementType) => ({
              ...item,
              value: "",
            })
          );
          setMeasurementTypes(mappedData);
          setEditMode(false);
        }
      } else {
        setMeasurementTypes([]);
      }
    } catch (error) {
      console.error("Error fetching fetus standards:", error);
      setMeasurementTypes([]);
    } finally {
      setLoading(false);
    }
  };

  // Update measurement value
  const updateMeasurementValue = (index: number, value: string) => {
    const updatedMeasurements = [...measurementTypes];
    updatedMeasurements[index] = { ...updatedMeasurements[index], value };
    setMeasurementTypes(updatedMeasurements);
  };

  // Save measurements
  const handleSave = async () => {
    if (!selectedWeek || !currentFetus || !currentFetus.id) {
      console.error("Missing required data (week or fetus id)");
      return;
    }

    setLoading(true);

    try {
      // Format data according to the required payload format
      const formattedData = measurementTypes
        .filter((item) => item.value && item.value.trim() !== "")
        .map((item) => ({
          name: item.name,
          unit: item.unit,
          value: parseFloat(item.value || "0"),
        }));

      // Format the complete payload
      const payload = {
        week: selectedWeek,
        data: formattedData,
      };

      // Make the API call
      const response = await customAxios.post(
        `/growth-metric/create/${currentFetus.id}`,
        payload
      );

      if (response.data && response.data.success) {
        // Reload growth metric history
        await loadGrowthMetricHistory();
        // Clear the form after successful save
        setMeasurementTypes(
          measurementTypes.map((item) => ({ ...item, value: "" }))
        );
      } else {
        console.error("Error saving measurements:", response.data);
      }
    } catch (error) {
      console.error("Error saving measurements:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add this at the component level
  const formRef = React.useRef<View>(null);

  // Update handleHistoryWeekClick to include scrolling functionality
  const handleHistoryWeekClick = (week: number) => {
    // Set the selected week and trigger the same data loading process
    handleWeekSelect(week);

    // Add a slight delay to ensure the form is rendered before attempting to scroll
    setTimeout(() => {
      // Scroll to form section
      if (formRef.current && scrollViewRef.current) {
        formRef.current.measureLayout(
          // @ts-ignore - measureLayout has the correct parameters despite TypeScript warnings
          scrollViewRef.current.getInnerViewNode(),
          (_, y) => {
            scrollViewRef.current?.scrollTo({ y: y - 20, animated: true });
          },
          () => console.error("Failed to measure layout")
        );
      }
    }, 300);
  };

  // Add scrollViewRef
  const scrollViewRef = React.useRef<ScrollView>(null);

  // Cập nhật hàm hasDataForWeek
  const hasDataForWeek = (week: number): boolean => {
    if (!growthMetricHistory || !Array.isArray(growthMetricHistory)) {
      return false;
    }
    return growthMetricHistory.some((weekData) => weekData.week === week);
  };

  // Add these functions to handle opening and closing the modal
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Add a function to view measurements details
  const handleViewMeasurements = (week: number) => {
    handleWeekSelect(week);
    // Don't open the modal here, just show the data
  };

  // Sửa renderHistoryItem để phù hợp với cấu trúc dữ liệu mới
  const renderHistoryItem = (weekData: GrowthMetricHistory) => (
    <TouchableOpacity
      key={weekData.week}
      style={styles.historyItem}
      onPress={() => handleViewMeasurements(weekData.week)}
    >
      <View style={styles.historyHeader}>
        <Text style={styles.historyWeek}>Week {weekData.week}</Text>
        <Feather name="chevron-right" size={18} color={theme.secondaryLight} />
      </View>
      {weekData.data.map((measurement, index) => (
        <Text key={index} style={styles.historyMeasurement}>
          {measurement.name}: {measurement.value} {measurement.unit}
        </Text>
      ))}
    </TouchableOpacity>
  );

  // Add this function to handle updates of existing measurements
  const handleUpdate = async () => {
    if (!selectedWeek || !currentFetus || !currentFetus.id) {
      console.error("Missing required data for update (week or fetus id)");
      return;
    }

    // Make sure growthMetricHistory is an array before trying to find in it
    if (!Array.isArray(growthMetricHistory)) {
      console.error("Growth metric history is not an array");
      return;
    }

    const existingRecord = growthMetricHistory.find(
      (item) => item.week === selectedWeek
    );

    if (!existingRecord) {
      console.error("Could not find existing record for week", selectedWeek);
      // If record doesn't exist, use handleSave instead
      handleSave();
      handleCloseModal();
      return;
    }

    if (!existingRecord._id) {
      console.error("Found record but missing _id for week", selectedWeek);
      // If _id is missing, use handleSave instead
      handleSave();
      handleCloseModal();
      return;
    }

    setLoading(true);

    try {
      // Format data according to the required payload format
      const formattedData = measurementTypes
        .filter((item) => item.value && item.value.trim() !== "")
        .map((item) => ({
          name: item.name,
          unit: item.unit,
          value: parseFloat(item.value || "0"),
        }));

      // Format the complete payload
      const payload = {
        week: selectedWeek,
        data: formattedData,
      };

      console.log(
        `Updating record ${existingRecord._id} with payload:`,
        payload
      );

      // Make the API call using PATCH
      const response = await customAxios.patch(
        `/growth-metric/${existingRecord._id}`,
        payload
      );

      if (response.data && response.data.success) {
        console.log("Successfully updated measurements");
        // Reload growth metric history
        await loadGrowthMetricHistory();
      } else {
        console.error("Error updating measurements:", response.data);
      }
    } catch (error) {
      console.error("Error updating measurements:", error);
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  if (!currentFetus) {
    return (
      // <SafeAreaView style={styles.container}>
      //   <Text style={styles.noFetusText}>
      //     Please select a baby to track measurements
      //   </Text>
      // </SafeAreaView>
      <View style={styles.chartContainer}>
        <RadarGrowthChart />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView ref={scrollViewRef} style={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Growth Measurements</Text>
          <Text style={styles.subtitle}>
            Track {currentFetus.name}'s growth metrics
          </Text>

          {/* Week selector */}
          <View style={styles.weekSelector}>
            <Text style={styles.sectionTitle}>Select Pregnancy Week</Text>
            <FlatList
              data={weeks}
              horizontal
              showsHorizontalScrollIndicator={true}
              renderItem={({ item }) => {
                const hasData = hasDataForWeek(item);
                const isFutureWeek = item > currentPregnancyWeek;

                return (
                  <TouchableOpacity
                    style={[
                      styles.weekItem,
                      selectedWeek === item && styles.selectedWeekItem,
                      hasData && styles.weekItemWithData,
                      isFutureWeek && styles.disabledWeekItem,
                    ]}
                    onPress={() => {
                      if (!isFutureWeek) {
                        handleWeekSelect(item);
                      }
                    }}
                    disabled={isFutureWeek}
                  >
                    <Text
                      style={[
                        styles.weekText,
                        selectedWeek === item && styles.selectedWeekText,
                        isFutureWeek && styles.disabledWeekText,
                      ]}
                    >
                      {item}
                    </Text>
                    {hasData && <View style={styles.weekDataIndicator} />}
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item) => item.toString()}
              contentContainerStyle={styles.weekList}
            />
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.secondary} />
            </View>
          ) : (
            <View ref={formRef} style={styles.form}>
              <View style={styles.formHeader}>
                <Text style={styles.sectionTitle}>
                  {selectedWeek
                    ? `Week ${selectedWeek} Measurements`
                    : "Select a week to view measurements"}
                </Text>

                {selectedWeek && (
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      editMode ? styles.editButton : styles.addButton,
                    ]}
                    onPress={handleOpenModal}
                  >
                    <Feather
                      name={editMode ? "edit" : "plus"}
                      size={20}
                      color={theme.textPrimary}
                    />
                    <Text style={styles.actionButtonText}>
                      {editMode ? "Edit" : "Add"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {selectedWeek && measurementTypes.length > 0 && editMode ? (
                <View style={styles.measurementsList}>
                  {measurementTypes
                    .filter((item) => item.value && item.value.trim() !== "")
                    .map((measurement, index) => (
                      <View key={index} style={styles.measurementItem}>
                        <Text style={styles.measurementName}>
                          {measurement.name}
                        </Text>
                        <Text style={styles.measurementValue}>
                          {measurement.value} {measurement.unit}
                        </Text>
                      </View>
                    ))}
                  {measurementTypes.filter(
                    (item) => item.value && item.value.trim() !== ""
                  ).length === 0 && (
                    <Text style={styles.noDataText}>
                      No measurement values found for this week
                    </Text>
                  )}
                </View>
              ) : selectedWeek && !editMode ? (
                <View style={styles.noMeasurementsContainer}>
                  <Feather
                    name="file-text"
                    size={42}
                    color={theme.primaryDark}
                  />
                  <Text style={styles.noMeasurementsText}>
                    No measurements recorded for week {selectedWeek}
                  </Text>
                  <Text style={styles.noMeasurementsSubtext}>
                    Tap "Add" to record your baby's growth
                  </Text>
                </View>
              ) : (
                <Text style={styles.noDataText}>
                  Select a week to view or add measurements
                </Text>
              )}
            </View>
          )}

          {/* Measurement History Section
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Measurement History</Text>

            {historyLoading ? (
              <ActivityIndicator
                size="large"
                color={theme.secondary}
                style={styles.historyLoading}
              />
            ) : growthMetricHistory &&
              Array.isArray(growthMetricHistory) &&
              growthMetricHistory.length > 0 ? (
              <View style={styles.historyList}>
                {growthMetricHistory
                  .sort((a, b) => b.week - a.week) // Sort by week descending (newest first)
                  .map((weekData) => renderHistoryItem(weekData))}
              </View>
            ) : (
              <View style={styles.historyEmpty}>
                <Feather
                  name="bar-chart-2"
                  size={48}
                  color={theme.primaryDark}
                />
                <Text style={styles.historyEmptyText}>
                  No measurements recorded yet
                </Text>
              </View>
            )}
          </View> */}
        </View>
      </ScrollView>

      {/* Modal for adding/editing measurements */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editMode ? "Edit" : "Add"} Measurements for Week {selectedWeek}
              </Text>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color={theme.secondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalFormContainer}>
              {measurementTypes.map((measurement, index) => (
                <View key={index} style={styles.inputGroup}>
                  <Text style={styles.label}>
                    {measurement.name} ({measurement.unit})
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={measurement.value}
                    onChangeText={(text) => updateMeasurementValue(index, text)}
                    placeholder={`Enter ${measurement.name.toLowerCase()}`}
                    keyboardType="numeric"
                  />
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  if (editMode) {
                    handleUpdate();
                  } else {
                    handleSave();
                    handleCloseModal();
                  }
                }}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryLight,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.secondary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.secondaryLight,
    marginBottom: 24,
    textAlign: "center",
  },
  form: {
    backgroundColor: theme.textPrimary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.secondary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: theme.secondary,
  },
  input: {
    backgroundColor: theme.primaryLight,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: theme.secondary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: theme.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  historySection: {
    backgroundColor: theme.textPrimary,
    borderRadius: 12,
    padding: 16,
  },
  historyEmpty: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  historyEmptyText: {
    marginTop: 8,
    fontSize: 16,
    color: theme.secondaryLight,
    textAlign: "center",
  },
  historyLoading: {
    padding: 24,
  },
  historyList: {
    maxHeight: 300,
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: theme.primaryLight,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  historyWeek: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.secondary,
    marginBottom: 4,
  },
  historyMeasurement: {
    fontSize: 14,
    color: theme.secondaryLight,
    marginLeft: 8,
    marginBottom: 2,
  },
  noFetusText: {
    fontSize: 16,
    color: theme.secondaryLight,
    textAlign: "center",
    padding: 24,
  },
  noDataText: {
    fontSize: 16,
    color: theme.secondaryLight,
    textAlign: "center",
    padding: 12,
  },
  weekSelector: {
    backgroundColor: theme.textPrimary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  weekList: {
    paddingVertical: 10,
  },
  weekItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
  selectedWeekItem: {
    backgroundColor: theme.secondary,
  },
  weekText: {
    fontSize: 16,
    color: theme.secondary,
  },
  selectedWeekText: {
    color: theme.textPrimary,
    fontWeight: "bold",
  },
  loadingContainer: {
    backgroundColor: theme.textPrimary,
    borderRadius: 12,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  weekItemWithData: {
    borderWidth: 2,
    borderColor: theme.primary,
  },
  weekDataIndicator: {
    position: "absolute",
    bottom: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.primary,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: theme.secondary,
  },
  editButton: {
    backgroundColor: theme.primary,
  },
  actionButtonText: {
    color: theme.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  measurementsList: {
    backgroundColor: theme.primaryLight,
    borderRadius: 8,
    padding: 12,
  },
  measurementItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.textPrimary,
  },
  measurementName: {
    fontSize: 16,
    color: theme.secondary,
    fontWeight: "500",
  },
  measurementValue: {
    fontSize: 16,
    color: theme.secondary,
    fontWeight: "600",
  },
  noMeasurementsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  noMeasurementsText: {
    fontSize: 16,
    color: theme.secondary,
    fontWeight: "500",
    marginTop: 12,
    textAlign: "center",
  },
  noMeasurementsSubtext: {
    fontSize: 14,
    color: theme.secondaryLight,
    marginTop: 8,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: theme.textPrimary,
    borderRadius: 12,
    width: "90%",
    maxHeight: "80%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.primaryLight,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.secondary,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalFormContainer: {
    maxHeight: "80%",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.primaryLight,
    paddingTop: 16,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.secondaryLight,
  },
  cancelButtonText: {
    fontSize: 16,
    color: theme.secondaryLight,
  },
  disabledWeekItem: {
    backgroundColor: theme.primaryLight,
    opacity: 0.5,
  },
  disabledWeekText: {
    color: theme.secondaryLight,
  },
  chartContainer: {
    marginVertical: 20,
    width: '100%',
  },
});
