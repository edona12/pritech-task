import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function DetailsScreen() {
  const { title, description, completed, createdAt } = useLocalSearchParams<{
    title?: string;
    description?: string;
    completed?: string;
    createdAt?: string;
  }>();

  const isCompleted = completed === "true";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title || "Untitled task"}</Text>
      <Text style={styles.label}>Description</Text>
      <Text style={styles.value}>{description || "No description"}</Text>
      <Text style={styles.label}>Created at</Text>
      <Text style={styles.value}>{createdAt || "Unknown"}</Text>
      <Text style={styles.label}>Status</Text>
      <Text style={[styles.value, isCompleted ? styles.completed : styles.pending]}>
        {isCompleted ? "Completed" : "Not Completed"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#666",
    marginTop: 16,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 18,
    marginTop: 6,
  },
  completed: {
    color: "green",
  },
  pending: {
    color: "orange",
  },
});
