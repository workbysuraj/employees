import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions, Alert, Pressable } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Appbar, Card, Button } from "react-native-paper";
import moment from "moment";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { LinearGradient } from "expo-linear-gradient";

export default function AttendanceScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError("");
      setAttendance([]);

      try {
        const q = query(collection(db, "attendance"), where("employeeId", "==", id));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setError("No attendance records found.");
        } else {
          const attendanceData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAttendance(
            attendanceData.sort((a, b) =>
              new Date(b.date.seconds ? b.date.toDate() : b.date) - new Date(a.date.seconds ? a.date.toDate() : a.date)
            )
          );
        }
      } catch (error) {
        setError("Failed to fetch attendance.");
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [id]);

  // Convert data to CSV format
  const generateCSV = () => {
    if (attendance.length === 0) {
      Alert.alert("No data", "No attendance records available to export.");
      return;
    }

    let csvContent = "Date,Status\n";
    attendance.forEach((record) => {
      const formattedDate = moment(record.date.seconds ? record.date.toDate() : record.date).format("DD MMM YYYY");
      const status = record.status === "H" ? "Holiday" : record.status;
      csvContent += `${formattedDate},${status}\n`;
    });

    return csvContent;
  };

  // Save CSV and share
  const exportToCSV = async () => {
    const csvData = generateCSV();
    if (!csvData) return;

    const fileUri = FileSystem.documentDirectory + `Attendance_${id}.csv`;

    try {
      await FileSystem.writeAsStringAsync(fileUri, csvData, { encoding: FileSystem.EncodingType.UTF8 });
      Alert.alert("Success", "CSV file generated successfully!", [
        { text: "Share", onPress: () => shareCSV(fileUri) },
        { text: "OK" },
      ]);
    } catch (error) {
      console.error("Error saving CSV file:", error);
      Alert.alert("Error", "Failed to export CSV.");
    }
  };

  // Share CSV file
  const shareCSV = async (fileUri) => {
    try {
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error sharing file:", error);
      Alert.alert("Error", "Failed to share file.");
    }
  };

  return (
    <LinearGradient colors={["#07f0d8", "#bc6fe3"]} style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Attendance Records" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          attendance.map((record) => (
            <Card key={record.id} style={styles.card}>
              <Card.Content>
                <Text style={styles.date}>
                  {moment(record.date.seconds ? record.date.toDate() : record.date).format("DD MMM YYYY")}
                </Text>
                <Text
                  style={[
                    styles.status,
                    {
                      color: record.status === "Present" ? "green" : record.status === "Absent" ? "red" : "blue",
                    },
                  ]}
                >
                  {record.status === "H" ? "Holiday" : record.status}
                </Text>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <View style={styles.exportButtonContainer}>
        <Pressable onPress={exportToCSV} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <LinearGradient colors={["#ff7e5f", "#feb47b"]} style={styles.gradientButton}>
            <Text style={styles.buttonText}>Export as CSV</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: height * 0.1,
  },
  loader: {
    marginTop: height * 0.2,
  },
  error: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  card: {
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  date: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#fff",
  },
  status: {
    fontSize: width * 0.04,
    marginTop: 5,
    fontWeight: "bold",
    color: "#fff",
  },
  exportButtonContainer: {
    padding: 20,
    alignItems: "center",
  },
  button: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  gradientButton: {
    padding: height * 0.018,
    alignItems: "center",
    borderRadius: 12,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
});
