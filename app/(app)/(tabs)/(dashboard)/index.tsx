import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-gifted-charts";
import { Card } from "@ant-design/react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { customAxios } from "@/api/core";
import { theme } from "@/styles/theme";
import FetusSelectionModal from "@/components/Header/FetusSelectionModal";
import useFetuses from "@/hooks/useFetuses";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  membership: {
    plan: string;
    dueDate: string | null;
  };
}

interface Fetus {
  id: string;
  name: string;
  dueDate: number;
  gender: string;
  weeks: number;
}

interface MetricData {
  name: string;
  unit: string;
  min: number;
  max: number;
  value: number;
}

interface GrowthMetric {
  week: number;
  data: MetricData[];
}

// Baby Overview Component
const BabyOverview = ({
  fetus,
  latestWeek,
}: {
  fetus: Fetus;
  latestWeek: number | null;
}) => {
  const formatDueDate = (dateNumber: number) => {
    const dateString = dateNumber.toString();
    const day = dateString.substring(0, 2);
    const month = dateString.substring(2, 4);
    const year = dateString.substring(4);
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.overviewContainer}>
      <Text style={styles.sectionTitle}>Growth Overview</Text>
      <View style={styles.overviewRow}>
        <View style={styles.overviewBox}>
          <Text style={styles.overviewValue}>{fetus.weeks}</Text>
          <Text style={styles.overviewLabel}>Weeks</Text>
        </View>
        <View style={styles.overviewBox}>
          <Text style={styles.overviewValue}>
            {latestWeek
              ? latestWeek <= 13
                ? "1st"
                : latestWeek <= 27
                ? "2nd"
                : "3rd"
              : "N/A"}
          </Text>
          <Text style={styles.overviewLabel}>Trimester</Text>
        </View>
      </View>
    </View>
  );
};

// Weekly Overview Component
const WeeklyOverview = ({
  weekData,
  selectedWeek,
  setSelectedWeek,
  weekInput,
  setWeekInput,
  minWeek,
  maxWeek,
}: {
  weekData: GrowthMetric;
  selectedWeek: number | null;
  setSelectedWeek: (week: number) => void;
  weekInput: string;
  setWeekInput: (input: string) => void;
  minWeek: number;
  maxWeek: number;
}) => {
  const handleWeekInputChange = (text: string) => {
    setWeekInput(text);
    const weekNum = parseInt(text, 10);
    if (!isNaN(weekNum) && weekNum >= minWeek && weekNum <= maxWeek) {
      setSelectedWeek(weekNum);
    }
  };

  return (
    <View style={styles.weeklySection}>
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Week {selectedWeek}</Text>
        <View style={styles.weekInputContainer}>
          <TextInput
            style={styles.weekInput}
            value={weekInput}
            onChangeText={handleWeekInputChange}
            keyboardType="numeric"
            placeholder={`Enter week (${minWeek}-${maxWeek})`}
            placeholderTextColor={theme.secondaryLight}
          />
        </View>
        <Slider
          style={styles.slider}
          minimumValue={minWeek}
          maximumValue={maxWeek}
          step={1}
          value={selectedWeek || minWeek}
          onValueChange={(value) => {
            setSelectedWeek(value);
            setWeekInput(value.toString());
          }}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.borderPrimary}
          thumbTintColor={theme.primaryDark}
        />
      </View>
      <Card style={styles.weeklyCard}>
        <Card.Header title={`Week ${weekData.week}`} />
        <Card.Body>
          {weekData.data.map((metric, index) => (
            <View key={index} style={styles.weeklyItem}>
              <Text style={styles.weeklyLabel}>{metric.name}:</Text>
              <Text style={styles.weeklyValue}>
                {metric.value} {metric.unit}
              </Text>
            </View>
          ))}
        </Card.Body>
      </Card>
    </View>
  );
};

// Chart Component
const GrowthChart = ({
  growthMetrics,
  selectedMetric,
}: {
  growthMetrics: GrowthMetric[];
  selectedMetric: string;
}) => {
  const getMetricChartData = () => {
    return growthMetrics
      .filter((metric) =>
        metric.data.some((data) => data.name === selectedMetric)
      )
      .map((metric) => {
        const metricData = metric.data.find(
          (data) => data.name === selectedMetric
        );
        return {
          week: metric.week,
          value: metricData?.value || 0,
          min: metricData?.min || 0,
          max: metricData?.max || 0,
        };
      })
      .sort((a, b) => a.week - b.week);
  };

  const chartData = getMetricChartData();

  if (chartData.length === 0) {
    return (
      <Text style={styles.noDataText}>
        No data available for {selectedMetric}
      </Text>
    );
  }

  const lineData = chartData.map((item) => ({
    value: item.value,
    label: `W${item.week}`,
  }));

  const minLineData = chartData.map((item) => ({
    value: item.min,
    label: `W${item.week}`,
  }));

  const maxLineData = chartData.map((item) => ({
    value: item.max,
    label: `W${item.week}`,
  }));

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{selectedMetric} Growth</Text>
      <LineChart
        data={lineData}
        data2={minLineData}
        data3={maxLineData}
        width={300}
        height={240}
        spacing={40}
        initialSpacing={20}
        color1={theme.primary}
        color2={theme.primaryDark}
        color3={theme.secondaryLight}
        textColor1={theme.secondary}
        hideDataPoints={false}
        dataPointsColor1={theme.primary}
        dataPointsColor2={theme.primaryDark}
        dataPointsColor3={theme.secondaryLight}
        thickness={2}
        yAxisTextStyle={{ color: theme.secondaryLight, fontSize: 12 }}
        xAxisLabelTextStyle={{ color: theme.secondaryLight, fontSize: 12 }}
        showVerticalLines
        verticalLinesColor={theme.borderPrimary}
        curved
      />
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: theme.primary }]}
          />
          <Text style={styles.legendText}>Actual</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: theme.primaryDark }]}
          />
          <Text style={styles.legendText}>Min</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: theme.secondaryLight },
            ]}
          />
          <Text style={styles.legendText}>Max</Text>
        </View>
      </View>
    </View>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedFetus, setSelectedFetus] = useState<Fetus | null>(null);
  const [growthMetrics, setGrowthMetrics] = useState<GrowthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState("Weight");
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [weekInput, setWeekInput] = useState<string>("");
  const [viewMode, setViewMode] = useState<"overview" | "chart">("overview");
  const { fetuses, currentFetus, switchFetus } = useFetuses();
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: userData } = await customAxios.get("/users/self");
        setUser(userData.data);

        const { data: fetusesData } = await customAxios.get(
          `/fetuses/users/${userData.data.id}`
        );

        if (fetusesData.data.length > 0) {
          const { data: metricsData } = await customAxios.get(
            `/growth-metric/find-all-by-fetus/${currentFetus?.id}`
          );

          // setGrowthMetrics(metricsData.data);
          // if (metricsData.data.length > 0) {
          //   const latestWeek =
          //     metricsData.data[metricsData.data.length - 1].week;
          //   setSelectedWeek(latestWeek);
          //   setWeekInput(latestWeek.toString());
          // }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchGrowthMetrics = async () => {
      if (!currentFetus) return;

      try {
        setLoading(true);
        const { data: metricsData } = await customAxios.get(
          `/growth-metric/find-all-by-fetus/${currentFetus.id}`
        );

        setGrowthMetrics(metricsData.data);
        if (metricsData.data.length > 0) {
          const latestWeek = metricsData.data[metricsData.data.length - 1].week;
          setSelectedWeek(latestWeek);
          setWeekInput(latestWeek.toString());
        } else {
          // Reset metrics data if there are no metrics for the current fetus
          setSelectedWeek(null);
          setWeekInput("");
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchGrowthMetrics();
  }, [currentFetus]);

  const getAvailableMetrics = () => {
    const metrics = new Set<string>();
    growthMetrics.forEach((metric) => {
      metric.data.forEach((data) => metrics.add(data.name));
    });
    return Array.from(metrics);
  };

  const latestWeek =
    growthMetrics.length > 0
      ? growthMetrics[growthMetrics.length - 1].week
      : null;
  const minWeek = growthMetrics.length > 0 ? growthMetrics[0].week : 0;
  const maxWeek = latestWeek || 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Fetus Selection */}
        <View style={styles.fetusSelection}>
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
        {loading ? (
          <SafeAreaView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={styles.loadingText}>Loading data...</Text>
          </SafeAreaView>
        ) : (
          <>
            {/* Baby Overview */}
            {currentFetus && (
              <BabyOverview fetus={currentFetus} latestWeek={latestWeek} />
            )}

            {/* Tab Options for Overview and Chart */}
            {currentFetus && growthMetrics.length > 0 && (
              <>
                <View style={styles.tabSection}>
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      viewMode === "overview" && styles.tabButtonActive,
                    ]}
                    onPress={() => setViewMode("overview")}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        viewMode === "overview" && styles.tabTextActive,
                      ]}
                    >
                      Weekly Overview
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      viewMode === "chart" && styles.tabButtonActive,
                    ]}
                    onPress={() => setViewMode("chart")}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        viewMode === "chart" && styles.tabTextActive,
                      ]}
                    >
                      Chart
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Conditional Rendering of Overview or Chart */}
                {viewMode === "overview" ? (
                  <WeeklyOverview
                    weekData={
                      growthMetrics.find(
                        (metric) => metric.week === selectedWeek
                      ) || growthMetrics[0]
                    }
                    selectedWeek={selectedWeek}
                    setSelectedWeek={setSelectedWeek}
                    weekInput={weekInput}
                    setWeekInput={setWeekInput}
                    minWeek={minWeek}
                    maxWeek={maxWeek}
                  />
                ) : (
                  <>
                    <View style={styles.metricSelector}>
                      <Text style={styles.sectionTitle}>Growth Metrics</Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                      >
                        {getAvailableMetrics().map((metric) => (
                          <TouchableOpacity
                            key={metric}
                            style={[
                              styles.metricItem,
                              selectedMetric === metric &&
                                styles.selectedMetric,
                            ]}
                            onPress={() => setSelectedMetric(metric)}
                          >
                            <Text
                              style={[
                                styles.metricName,
                                selectedMetric === metric &&
                                  styles.selectedMetricText,
                              ]}
                            >
                              {metric}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                    <GrowthChart
                      growthMetrics={growthMetrics}
                      selectedMetric={selectedMetric}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryLight,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.primaryLight,
  },
  loadingText: {
    marginTop: 10,
    color: theme.secondaryLight,
    fontSize: 16,
  },
  header: {
    backgroundColor: theme.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.textPrimary,
  },
  fetusSelection: {
    padding: 16,
    backgroundColor: theme.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderPrimary,
  },
  fetusDropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: theme.borderPrimary,
  },
  fetusIcon: {
    marginRight: 10,
  },
  fetusDropdownText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: theme.secondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.secondary,
    marginBottom: 5,
    paddingLeft: 4,
  },
  overviewContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  overviewBox: {
    backgroundColor: theme.primary,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.textPrimary,
  },
  overviewLabel: {
    fontSize: 14,
    color: theme.textPrimary,
    marginTop: 5,
  },
  tabSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    paddingHorizontal: 12,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: theme.borderPrimary,
  },
  tabButtonActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primaryDark,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.secondary,
  },
  tabTextActive: {
    color: theme.textPrimary,
  },
  weeklySection: {
    marginVertical: 5,
    paddingHorizontal: 12,
  },
  sliderContainer: {
    marginBottom: 5,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.secondary,
    marginBottom: 5,
    textAlign: "center",
  },
  weekInputContainer: {
    alignItems: "center",
    marginBottom: 5,
  },
  weekInput: {
    width: 120,
    height: 40,
    borderWidth: 1,
    borderColor: theme.borderPrimary,
    borderRadius: 8,
    paddingHorizontal: 10,
    textAlign: "center",
    color: theme.secondary,
    backgroundColor: "#fff",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  weeklyCard: {
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: theme.borderPrimary,
  },
  weeklyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  weeklyLabel: {
    fontSize: 14,
    color: theme.secondaryLight,
    fontWeight: "500",
  },
  weeklyValue: {
    fontSize: 14,
    color: theme.secondary,
    fontWeight: "600",
  },
  metricSelector: {
    marginVertical: 12,
    paddingHorizontal: 12,
  },
  metricItem: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: theme.borderPrimary,
  },
  selectedMetric: {
    backgroundColor: theme.primary,
    borderColor: theme.primaryDark,
  },
  metricName: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.secondary,
  },
  selectedMetricText: {
    color: theme.textPrimary,
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.borderPrimary,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.secondary,
    marginBottom: 5,
  },
  noDataText: {
    textAlign: "center",
    padding: 20,
    color: theme.secondaryLight,
    fontSize: 14,
  },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 1,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    color: theme.secondary,
    fontSize: 12,
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
});

export default Dashboard;
