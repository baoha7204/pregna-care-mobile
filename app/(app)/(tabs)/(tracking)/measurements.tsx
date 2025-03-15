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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { theme } from "@/styles/theme";
import useFetuses from "@/hooks/useFetuses";
import { customAxios } from "@/api/core";

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

interface GrowthMetricHistory {
  _id: string;
  fetusId: string;
  data: WeekData[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function MeasurementsScreen() {
  const { currentFetus } = useFetuses();
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [measurementTypes, setMeasurementTypes] = useState<MeasurementType[]>([]);
  const [growthMetricHistory, setGrowthMetricHistory] = useState<GrowthMetricHistory | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Generate array of 40 weeks
  const weeks = Array.from({ length: 40 }, (_, i) => i + 1);

  // Load growth metric history when current fetus changes
  useEffect(() => {
    if (currentFetus?.id) {
      loadGrowthMetricHistory();
    }
  }, [currentFetus]);

  // Load existing growth metrics for the fetus
  const loadGrowthMetricHistory = async () => {
    if (!currentFetus?.id) return;

    setHistoryLoading(true);

    try {
      const response = await customAxios.get(`/growth-metric/find-all-by-fetus/${currentFetus.id}`);

      if (response.data && response.data.success && response.data.data) {
        setGrowthMetricHistory(response.data.data);
      } else {
        setGrowthMetricHistory(null);
      }
    } catch (error) {
      console.error("Error loading growth metric history:", error);
      setGrowthMetricHistory(null);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Handle week selection - also load existing data if available
  const handleWeekSelect = async (week: number) => {
    setSelectedWeek(week);
    setLoading(true);

    try {
      // Load standard measurements for selected week
      const response = await customAxios.get(`/admin/fetus-standard/find-by-week?week=${week}`);

      if (response.data && response.data.success && response.data.data) {
        // Check if we have existing measurements for this week in history
        const existingWeekData = growthMetricHistory?.data.find(
            weekData => weekData.week === week
        );

        if (existingWeekData) {
          // Pre-fill with existing measurements
          const mappedData = response.data.data.map((standardItem: MeasurementType) => {
            // Find matching measurement in existing data
            const existingMeasurement = existingWeekData.data.find(
                item => item.name === standardItem.name
            );

            return {
              ...standardItem,
              value: existingMeasurement ? String(existingMeasurement.value) : ""
            };
          });
          setMeasurementTypes(mappedData);
        } else {
          // No existing data, use empty values
          const mappedData = response.data.data.map((item: MeasurementType) => ({
            ...item,
            value: ""
          }));
          setMeasurementTypes(mappedData);
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
          .filter(item => item.value && item.value.trim() !== '')
          .map(item => ({
            name: item.name,
            unit: item.unit,
            value: parseFloat(item.value || '0')
          }));

      // Format the complete payload
      const payload = {
        week: selectedWeek,
        data: formattedData
      };

      // Make the API call
      const response = await customAxios.post(
          `/growth-metric/create/${currentFetus.id}`,
          payload
      );

      if (response.data && response.data.success) {
        console.log("Successfully saved measurements");
        // Reload growth metric history
        await loadGrowthMetricHistory();
        // Clear the form after successful save
        setMeasurementTypes(measurementTypes.map(item => ({ ...item, value: "" })));
      } else {
        console.error("Error saving measurements:", response.data);
      }
    } catch (error) {
      console.error("Error saving measurements:", error);
    } finally {
      setLoading(false);
    }
  };

// Update the renderHistoryItem function to make each week clickable
  const renderHistoryItem = (weekData: WeekData) => (
      <TouchableOpacity
          key={weekData.week}
          style={styles.historyItem}
          onPress={() => handleHistoryWeekClick(weekData.week)}
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


  if (!currentFetus) {
    return (
        <SafeAreaView style={styles.container}>
          <Text style={styles.noFetusText}>
            Please select a baby to track measurements
          </Text>
        </SafeAreaView>
    );
  }
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

  return (
      <SafeAreaView style={styles.container}>
        <ScrollView
            ref={scrollViewRef}
            style={styles.scrollContainer}
        >
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
                  renderItem={({ item }) => (
                      <TouchableOpacity
                          style={[
                            styles.weekItem,
                            selectedWeek === item && styles.selectedWeekItem
                          ]}
                          onPress={() => handleWeekSelect(item)}
                      >
                        <Text
                            style={[
                              styles.weekText,
                              selectedWeek === item && styles.selectedWeekText
                            ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                  )}
                  keyExtractor={item => item.toString()}
                  contentContainerStyle={styles.weekList}
              />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.secondary} />
                </View>
            ) : (
                <View ref={formRef} style={styles.form}>
                  <Text style={styles.sectionTitle}>
                    {selectedWeek ? `Week ${selectedWeek} Measurements` : 'Select a week to view measurements'}
                  </Text>

                  {measurementTypes.length > 0 ? (
                      <>
                        {measurementTypes.map((measurement, index) => (
                            <View key={index} style={styles.inputGroup}>
                              <Text style={styles.label}>{measurement.name} ({measurement.unit})</Text>
                              <TextInput
                                  style={styles.input}
                                  value={measurement.value}
                                  onChangeText={(text) => updateMeasurementValue(index, text)}
                                  placeholder={`Enter ${measurement.name.toLowerCase()}`}
                                  keyboardType="numeric"
                              />
                            </View>
                        ))}

                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                          <Text style={styles.saveButtonText}>Save Measurements</Text>
                        </TouchableOpacity>
                      </>
                  ) : selectedWeek ? (
                      <Text style={styles.noDataText}>No standard measurements available for week {selectedWeek}</Text>
                  ) : (
                      <Text style={styles.noDataText}>Select a week to view standard measurements</Text>
                  )}
                </View>
            )}

            {/* Measurement History Section */}
            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>Measurement History</Text>

              {historyLoading ? (
                  <ActivityIndicator size="large" color={theme.secondary} style={styles.historyLoading} />
              ) : growthMetricHistory && growthMetricHistory.data.length > 0 ? (
                  <View style={styles.historyList}>
                    {growthMetricHistory.data
                        .sort((a, b) => b.week - a.week) // Sort by week descending (newest first)
                        .map(renderHistoryItem)
                    }
                  </View>
              ) : (
                  <View style={styles.historyEmpty}>
                    <Feather name="bar-chart-2" size={48} color={theme.primaryDark} />
                    <Text style={styles.historyEmptyText}>
                      No measurements recorded yet
                    </Text>
                  </View>
              )}
            </View>
          </View>
        </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
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
    fontWeight: 'bold',
  },
  loadingContainer: {
    backgroundColor: theme.textPrimary,
    borderRadius: 12,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});