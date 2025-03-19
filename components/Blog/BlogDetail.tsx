import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
  ActivityIndicator,
} from "react-native";
import { SvgCssUri } from "react-native-svg/css";
import { format } from "date-fns";
import { useLocalSearchParams } from "expo-router";

import { customAxios } from "@/api/core";
import { Card } from "@ant-design/react-native";
import { theme } from "@/styles/theme";

type ContentNode = {
  type: string;
  attrs?: any;
  content?: ContentNode[];
  text?: string;
  marks?: { type: string; attrs?: any }[];
};

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
        console.error("Failed to fetch blog detail:", err);
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

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  const renderTextWithMarks = (
    text: string,
    marks: { type: string; attrs?: any }[] | undefined
  ) => {
    if (!marks || marks.length === 0) {
      return <Text style={styles.normalText}>{text}</Text>;
    }

    let result = <Text style={styles.normalText}>{text}</Text>;

    marks.forEach((mark) => {
      switch (mark.type) {
        case "bold":
          result = <Text style={styles.boldText}>{text}</Text>;
          break;
        case "link":
          result = (
            <Text
              style={styles.linkText}
              onPress={() => handleLinkPress(mark.attrs?.href || "#")}
            >
              {text}
            </Text>
          );
          break;
        default:
          break;
      }
    });

    return result;
  };

  const renderContentNode = (
    node: ContentNode,
    index: number
  ): React.ReactNode => {
    switch (node.type) {
      case "heading":
        const level = node.attrs?.level || 1;
        const headingStyle = [
          styles.heading,
          level === 1
            ? styles.heading1
            : level === 2
            ? styles.heading2
            : level === 3
            ? styles.heading3
            : styles.heading4,
        ];
        return (
          <Text key={index} style={headingStyle}>
            {node.content?.map((child, childIndex) =>
              renderContentNode(child, childIndex)
            )}
          </Text>
        );

      case "paragraph":
        return (
          <Text key={index} style={styles.paragraph}>
            {node.content?.map((child, childIndex) =>
              renderContentNode(child, childIndex)
            )}
          </Text>
        );

      case "text":
        return renderTextWithMarks(node.text || "", node.marks);

      case "image":
        const src = node.attrs?.src || "";
        if (src.endsWith("svg")) {
          return <SvgCssUri key={index} width="100" height="100" uri={src} />;
        }
        if (
          src.endsWith("png") ||
          src.endsWith("jpg") ||
          src.endsWith("jpeg")
        ) {
          return (
            <Image
              key={index}
              source={{ uri: src }}
              style={styles.contentImage}
              resizeMode="contain"
            />
          );
        }

      default:
        return null;
    }
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
          {blogData.content.content.map((node, index) =>
            renderContentNode(node, index)
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
