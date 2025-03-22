import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { format } from "date-fns";
import { useLocalSearchParams } from "expo-router";

import { customAxios } from "@/api/core";
import { Card } from "@ant-design/react-native";
import { theme } from "@/styles/theme";
import { ContentNode, ContentRenderer } from "./ContentNodeRenderer";

type BlogPost = {
  id: string;
  author_id: string;
  heading: string;
  content: {
    type: string;
    content: ContentNode[];
  };
  description: string;
  feature_image_url: string;
  published_date: number;
  week: number;
};

const BlogDetail = () => {
  const { id } = useLocalSearchParams();
  const [blogData, setBlogData] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const response = await customAxios.get(`/blog-post/${id}`);
        setBlogData(response.data.data);
      } catch (err) {
        setError("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [id]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return format(date, "MMMM d, yyyy");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error || !blogData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || "Blog post not found"}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.cardContainer}>
        <Image
          source={{ uri: blogData.feature_image_url }}
          style={styles.featureImage}
          resizeMode="cover"
        />

        <View style={styles.headerContainer}>
          <Text style={styles.title}>{blogData.heading}</Text>
          <Text style={styles.date}>
            Published on {formatDate(blogData.published_date)}
          </Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{blogData.description}</Text>
        </View>

        <View style={styles.contentContainer}>
          {blogData.content.content && (
            <ContentRenderer content={blogData.content.content} />
          )}
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    padding: 0,
    overflow: "hidden",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  featureImage: {
    width: "100%",
    height: 250,
  },
  headerContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "#888",
  },
  descriptionContainer: {
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  description: {
    fontSize: 16,
    fontStyle: "italic",
    lineHeight: 22,
  },
  contentContainer: {
    padding: 15,
  },
  heading: {
    fontWeight: "bold",
    marginVertical: 10,
  },
  heading1: {
    fontSize: 24,
  },
  heading2: {
    fontSize: 22,
  },
  heading3: {
    fontSize: 20,
  },
  heading4: {
    fontSize: 18,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  contentImage: {
    width: "100%",
    height: 250,
    marginVertical: 15,
  },
  normalText: {
    fontSize: 16,
  },
  boldText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    fontSize: 16,
    color: "#2089dc",
    textDecorationLine: "underline",
  },
});

export default BlogDetail;
