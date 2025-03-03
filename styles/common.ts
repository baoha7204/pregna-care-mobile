import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "#fff",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    borderRadius: 12,
    marginLeft: 5,
  },
});
