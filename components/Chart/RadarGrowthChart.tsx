import { customAxios } from '@/api/core';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { RadarChart } from 'react-native-gifted-charts';

// Define types for chart data
interface ChartDataItem {
  item: string;
  score: number;
  value: string; // 'min', 'max', or 'current'
}

function RadarGrowthChart() {
  const fetusId = '67c07b40a1af2f866632aae5';
  const week = 11;
  const [data, setData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentColor = 'rgba(255, 69, 0, 1.0)';
  const minColor = 'rgba(30, 144, 255, 1.0)';
  const maxColor = 'rgba(50, 205, 50, 1.0)';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await customAxios.get(`/growth-metric/chart-radar/${fetusId}/${week}`);
        console.log("response", response.data);

        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError("No data available");
        }
      } catch (error) {
        console.log("error", error);
        setError("Failed to load chart data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading chart data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || "Unable to display chart data"}</Text>
      </View>
    );
  }

  // Extract current values for the chart
  const currentData = data.filter(item => item.value === 'current');
  const minData = data.filter(item => item.value === 'min');
  const maxData = data.filter(item => item.value === 'max');

  const chartValues = currentData.map(item => item.score);
  const labels = currentData.map(item => item.item);
  const maxValue = Math.max(...chartValues, 100) + 50; // Adding margin for better scaling

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fetal Growth Metrics</Text>

      <RadarChart
        data={chartValues}
        labels={labels}
        labelConfig={{ stroke: 'blue', fontWeight: 'bold' }}
        dataLabels={chartValues.map(val => `${val}`)}
        dataLabelsConfig={{ stroke: 'brown' }}
        dataLabelsPositionOffset={0}
        maxValue={maxValue}
      />

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: currentColor }]} />
          <Text style={styles.legendText}>Current</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: minColor }]} />
          <Text style={styles.legendText}>Minimum</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: maxColor }]} />
          <Text style={styles.legendText}>Maximum</Text>
        </View>
      </View>

      <Text style={styles.note}>
        Note: Values are displayed in their respective medical units
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
    color: 'gray',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default RadarGrowthChart;