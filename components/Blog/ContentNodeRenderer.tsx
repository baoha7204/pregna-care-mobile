import React from "react";
import { Text, Image, StyleSheet, Linking, FlatList } from "react-native";
import { SvgCssUri } from "react-native-svg/css";

export type ContentNode = {
  type: string;
  attrs?: any;
  content?: ContentNode[];
  text?: string;
  marks?: { type: string; attrs?: any }[];
};

interface ContentNodeRendererProps {
  node: ContentNode;
  index: number;
}

const ContentNodeRenderer: React.FC<ContentNodeRendererProps> = ({
  node,
  index,
}) => {
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
              onPress={() => Linking.openURL(mark.attrs?.href || "#")}
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
          {node.content && (
            <FlatList
              data={node.content}
              keyExtractor={(_, i) => `heading-child-${index}-${i}`}
              renderItem={({ item, index: childIndex }) => (
                <ContentNodeRenderer node={item} index={childIndex} />
              )}
              scrollEnabled={false}
            />
          )}
        </Text>
      );

    case "paragraph":
      return (
        <Text key={index} style={styles.paragraph}>
          {node.content && (
            <FlatList
              data={node.content}
              keyExtractor={(_, i) => `paragraph-child-${index}-${i}`}
              renderItem={({ item, index: childIndex }) => (
                <ContentNodeRenderer node={item} index={childIndex} />
              )}
              scrollEnabled={false}
            />
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
      if (src.endsWith("png") || src.endsWith("jpg") || src.endsWith("jpeg")) {
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

// Content renderer component that uses FlatList
export const ContentRenderer = ({ content }: { content: ContentNode[] }) => {
  return (
    <FlatList
      data={content}
      keyExtractor={(_, index) => `content-node-${index}`}
      renderItem={({ item, index }) => (
        <ContentNodeRenderer node={item} index={index} />
      )}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
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

export default ContentNodeRenderer;
