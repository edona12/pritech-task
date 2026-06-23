import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
};

type TaskFilter = "all" | "todo" | "done";

const STORAGE_KEY = "pritech-task-list";

const defaultTasks: Task[] = [
  {
    id: "learn-react-native",
    title: "Learn React Native",
    description: "Practice React Native basics",
    completed: false,
    createdAt: new Date().toLocaleDateString(),
  },
  {
    id: "finish-pritech-task",
    title: "Finish Pritech Task",
    description: "Complete technical assignment",
    completed: false,
    createdAt: new Date().toLocaleDateString(),
  },
  {
    id: "read-a-book",
    title: "Read a book",
    description: "Read 20 pages",
    completed: true,
    createdAt: new Date().toLocaleDateString(),
  },
];

export default function HomeScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);

        if (savedTasks) {
          setTasks(JSON.parse(savedTasks) as Task[]);
        }
      } catch {
        setTasks(defaultTasks);
      } finally {
        setIsReady(true);
      }
    };

    loadTasks();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [isReady, tasks]);

  const filteredTasks = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchText);
      const matchesFilter =
        filter === "all" ||
        (filter === "todo" && !task.completed) ||
        (filter === "done" && task.completed);

      return matchesSearch && matchesFilter;
    });
  }, [filter, search, tasks]);

  const addTask = () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (trimmedTitle === "") return;

    setTasks([
      ...tasks,
      {
        id: `${Date.now()}`,
        title: trimmedTitle,
        description: trimmedDescription,
        completed: false,
        createdAt: new Date().toLocaleDateString(),
      },
    ]);

    setTitle("");
    setDescription("");
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const toggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Tasks</Text>

      <View style={styles.navigation}>
        <TouchableOpacity onPress={() => router.push("/api")}>
          <Text style={styles.apiLink}>View API Data</Text>
        </TouchableOpacity>
      </View>

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

      <TextInput
        style={[styles.input, styles.searchInput]}
        placeholder="Search by title..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filters}>
        {(["all", "todo", "done"] as TaskFilter[]).map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.filterButton, filter === item && styles.activeFilter]}
            onPress={() => setFilter(item)}
          >
            <Text style={[styles.filterText, filter === item && styles.activeFilterText]}>
              {item === "all" ? "All" : item === "todo" ? "Todo" : "Done"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.counter}>
        Showing {filteredTasks.length} of {tasks.length} tasks
      </Text>

      <View style={styles.list}>
        {filteredTasks.length === 0 ? (
          <Text style={styles.emptyText}>No tasks found.</Text>
        ) : (
          filteredTasks.map((item) => (
            <View key={item.id} style={styles.taskRow}>
              <TouchableOpacity onPress={() => toggleTask(item.id)}>
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

              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
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
    marginBottom: 12,
    textAlign: "center",
  },
  navigation: {
    alignItems: "center",
    marginBottom: 15,
  },
  apiLink: {
    color: "blue",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  searchInput: {
    marginTop: 18,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  filterButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  activeFilter: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  filterText: {
    color: "#333",
    fontWeight: "700",
  },
  activeFilterText: {
    color: "#fff",
  },
  counter: {
    color: "#666",
    fontSize: 12,
    marginBottom: 6,
  },
  list: {
    marginTop: 10,
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
  emptyText: {
    color: "#666",
    textAlign: "center",
    marginTop: 24,
  },
});
