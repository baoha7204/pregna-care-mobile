import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { format } from "date-fns";
import { Card } from "@ant-design/react-native";

import { customAxios } from "@/api/core";
import { FetusesContext } from "@/contexts/fetuses.context";
import { theme } from "@/styles/theme";

type BlogPreviewData = {
  id: string;
  heading: string;
  description: string;
  feature_image_url: string;
  published_date: number;
  week: number;
};

const BlogPreview = () => {
  const router = useRouter();
  const { currentFetus } = useContext(FetusesContext);
  const [blogData, setBlogData] = useState<BlogPreviewData | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(
    currentFetus?.weeks || 1
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentFetus?.weeks) {
      setCurrentWeek(currentFetus.weeks);
    }
  }, [currentFetus?.weeks]);

  useEffect(() => {
    const fetchBlogPreview = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await customAxios.get("/blog-post/preview", {
          params: { week: currentWeek },
        });
        setBlogData(response.data.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("No blog post available for this week");
          setBlogData(null);
        } else {
          setError("Failed to load blog post");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPreview();
  }, [currentWeek]);

  const handlePreviousWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  const handleNextWeek = () => {
    if (currentWeek < 40) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  const handleViewDetails = () => {
    if (blogData) {
      router.push(`/(app)/(tabs)/(home)/blog/${blogData.id}`);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return format(date, "MMMM d, yyyy");
  };

  return (
    <Card style={styles.container}>
      <View style={styles.weekNavigation}>
        <TouchableOpacity
          style={[styles.navButton, currentWeek <= 1 && styles.disabledButton]}
          onPress={handlePreviousWeek}
          disabled={currentWeek <= 1}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={currentWeek <= 1 ? "#cccccc" : theme.primary}
          />
          <Text
            style={[styles.navText, currentWeek <= 1 && styles.disabledText]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, currentWeek >= 40 && styles.disabledButton]}
          onPress={handleNextWeek}
          disabled={currentWeek >= 40}
        >
          <Text
            style={[styles.navText, currentWeek >= 40 && styles.disabledText]}
          >
            Next
          </Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={currentWeek >= 40 ? "#cccccc" : theme.primary}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.weekText}>Week {currentWeek}</Text>

      <Card.Body style={{ borderTopWidth: 0 }}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.subErrorText}>
              Try navigating to another week
            </Text>
          </View>
        ) : (
          blogData && (
            <>
              <Image
                source={{ uri: blogData.feature_image_url }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.contentContainer}>
                <Text style={styles.heading}>{blogData.heading}</Text>
                <Text style={styles.date}>
                  Published on {formatDate(blogData.published_date)}
                </Text>
                <Text style={styles.description} numberOfLines={3}>
                  {blogData.description}
                </Text>
                <TouchableOpacity
                  onPress={handleViewDetails}
                  style={styles.button}
                >
                  <Text style={{ color: theme.textPrimary, fontWeight: "700" }}>
                    Read More
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )
        )}
      </Card.Body>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    margin: 16,
    overflow: "hidden",
  },
  weekNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  navText: {
    color: theme.secondary,
    fontSize: 16,
  },
  disabledText: {
    color: "#cccccc",
  },
  weekText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
  },
  image: {
    width: "100%",
    height: 200,
  },
  contentContainer: {
    padding: 15,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  button: {
    marginHorizontal: 16,
    backgroundColor: theme.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  loadingContainer: {
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subErrorText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});

export default BlogPreview;
