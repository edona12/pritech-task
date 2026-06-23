import { router } from "expo-router";
import { useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Task = {
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
};

export default function HomeScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [tasks, setTasks] = useState<Task[]>([
    {
      title: "Learn React Native",
      description: "Practice React Native basics",
      completed: false,
      createdAt: new Date().toLocaleDateString(),
    },
    {
      title: "Finish Pritech Task",
      description: "Complete technical assignment",
      completed: false,
      createdAt: new Date().toLocaleDateString(),
    },
    {
      title: "Read a book",
      description: "Read 20 pages",
      completed: true,
      createdAt: new Date().toLocaleDateString(),
    },
  ]);

  const addTask = () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (trimmedTitle === "") return;

    setTasks([
      ...tasks,
      {
        title: trimmedTitle,
        description: trimmedDescription,
        completed: false,
        createdAt: new Date().toLocaleDateString(),
      },
    ]);

    setTitle("");
    setDescription("");
  };

  const deleteTask = (indexToDelete: number) => {
    setTasks(tasks.filter((_, index) => index !== indexToDelete));
  };

  const toggleTask = (indexToToggle: number) => {
    setTasks(
      tasks.map((task, index) =>
        index === indexToToggle ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Tasks</Text>

      <TouchableOpacity onPress={() => router.push("/api")}>
        <Text style={styles.apiLink}>View API Data</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Task title..."
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Task description..."
        value={description}
        onChangeText={setDescription}
      />

      <Button title="Add Task" onPress={addTask} />

      <View style={styles.list}>
        {tasks.map((item, index) => (
          <View key={`${item.title}-${index}`} style={styles.taskRow}>
            <TouchableOpacity onPress={() => toggleTask(index)}>
              <Text style={styles.checkbox}>{item.completed ? "Done" : "Todo"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.taskContent}
              onPress={() =>
                router.push({
                  pathname: "/details",
                  params: {
                    title: item.title,
                    description: item.description,
                    completed: String(item.completed),
                    createdAt: item.createdAt,
                  },
                })
              }
            >
              <Text style={styles.task}>{item.title}</Text>
              <Text style={styles.description}>{item.description || "No description"}</Text>
              <Text style={styles.date}>{item.createdAt}</Text>
              <Text style={[styles.status, item.completed ? styles.completed : styles.pending]}>
                {item.completed ? "Completed" : "Not Completed"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteTask(index)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  apiLink: {
    color: "blue",
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  list: {
    marginTop: 20,
  },
  taskRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    minWidth: 46,
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
  },
  taskContent: {
    flex: 1,
  },
  task: {
    fontSize: 18,
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: "gray",
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  status: {
    fontSize: 12,
    marginTop: 2,
  },
  completed: {
    color: "green",
  },
  pending: {
    color: "orange",
  },
  delete: {
    color: "red",
    fontWeight: "bold",
    marginLeft: 10,
  },
});
