import { StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { Accelerometer, Pedometer } from "expo-sensors";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function HomeScreen() {
  const [steps, setSteps] = useState(0);
  const [activity, setActivity] = useState("Idle");
  const [tracking, setTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);

  let accelSubscription: any = null;
  let stepSubscription: any = null;

  const detectActivity = (x: number, y: number, z: number) => {
    const magnitude = Math.sqrt(x * x + y * y + z * z);

    if (magnitude < 1.1) setActivity("Standing");
    else if (magnitude < 2) setActivity("Walking");
    else setActivity("Running");
  };

  const startTracking = async () => {
    setTracking(true);

    stepSubscription = Pedometer.watchStepCount((result) => {
      setSteps(result.steps);
      setDistance(result.steps * 0.0008);
      setCalories(result.steps * 0.04);
    });

    accelSubscription = Accelerometer.addListener((data) => {
      detectActivity(data.x, data.y, data.z);
    });

    Accelerometer.setUpdateInterval(500);
  };

  const stopTracking = () => {
    setTracking(false);

    if (stepSubscription) stepSubscription.remove();
    if (accelSubscription) accelSubscription.remove();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Smart Fitness</ThemedText>

      <ThemedView style={styles.activityCard}>
        <ThemedText style={styles.label}>Current Activity</ThemedText>
        <ThemedText style={styles.activity}>{activity}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.statsRow}>
        <ThemedView style={styles.statBox}>
          <ThemedText style={styles.statValue}>{steps}</ThemedText>
          <ThemedText style={styles.statLabel}>Steps</ThemedText>
        </ThemedView>

        <ThemedView style={styles.statBox}>
          <ThemedText style={styles.statValue}>{distance.toFixed(2)}</ThemedText>
          <ThemedText style={styles.statLabel}>KM</ThemedText>
        </ThemedView>

        <ThemedView style={styles.statBox}>
          <ThemedText style={styles.statValue}>{calories.toFixed(0)}</ThemedText>
          <ThemedText style={styles.statLabel}>Calories</ThemedText>
        </ThemedView>
      </ThemedView>

      {!tracking ? (
        <TouchableOpacity style={styles.startBtn} onPress={startTracking}>
          <ThemedText style={styles.btnThemedText}>Start Tracking</ThemedText>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.stopBtn} onPress={stopTracking}>
          <ThemedText style={styles.btnThemedText}>Stop</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 40
  },

  activityCard: {
    backgroundColor: "#1e293b",
    padding: 30,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 30
  },

  label: {
    color: "#94a3b8",
    fontSize: 16
  },

  activity: {
    color: "#22c55e",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 40
  },

  statBox: {
    backgroundColor: "#1e293b",
    width: "30%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center"
  },

  statValue: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold"
  },

  statLabel: {
    color: "#94a3b8"
  },

  startBtn: {
    backgroundColor: "#22c55e",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 15
  },

  stopBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 15
  },

  btnThemedText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  }
});