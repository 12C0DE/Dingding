import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useBoxingTimer } from "../context/BoxingTimerContext";
import { Picker } from "@react-native-picker/picker";

interface SetupPageProps {
  onNavigateToTimer: () => void;
}

export const SetupPage: React.FC<SetupPageProps> = ({ onNavigateToTimer }) => {
  const { settings, updateSettings } = useBoxingTimer();
  const [rounds, setRounds] = useState(settings.rounds.toString());
  const [roundMinutes, setRoundMinutes] = useState(
    Math.floor(settings.roundDuration / 60).toString()
  );
  const [roundSeconds, setRoundSeconds] = useState(
    (settings.roundDuration % 60).toString()
  );
  const [restMinutes, setRestMinutes] = useState(
    (settings.restDuration / 60).toString()
  );
  const [restSeconds, setRestSeconds] = useState(
    (settings.restDuration % 60).toString()
  );
  const getRoundDurationSeconds = () => {
    return (parseInt(roundMinutes) || 0) * 60 + (parseInt(roundSeconds) || 0);
  };
  const getRestDurationSeconds = () => {
    return (parseInt(restMinutes) || 0) * 60 + (parseInt(restSeconds) || 0);
  };
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000); // refresh every minute
    return () => clearInterval(id);
  }, []);

  const totalSeconds =
    (parseInt(rounds) || 3) * getRoundDurationSeconds() +
    ((parseInt(rounds) || 3) - 1) * getRestDurationSeconds();

  const projected = new Date(now.getTime() + totalSeconds * 1000);
  const projectedStr = projected.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const handleStartTimer = () => {
    const parsedRounds = parseInt(rounds) || 3;
    const parsedRoundDurationSeconds = getRoundDurationSeconds() || 180; // default 3 minutes
    const parsedRestDuration = getRestDurationSeconds() || 30;

    updateSettings({
      rounds: Math.max(1, parsedRounds),
      roundDuration: Math.max(60, parsedRoundDurationSeconds),
      restDuration: Math.max(0, parsedRestDuration) * 60,
    });

    onNavigateToTimer();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const setRoundDurationTotal = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    setRoundMinutes(mins.toString());
    setRoundSeconds(secs.toString());
  };

  const setRestDurationTotal = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    setRestMinutes(mins.toString());
    setRestSeconds(secs.toString());
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DING DING</Text>
      </View>

      <View style={styles.content}>
        {/* Rounds Input */}
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Rounds</Text>
            <View style={styles.inputContainer}>
              <Picker
                selectedValue={rounds}
                style={[styles.input, { height: 50 }]}
                onValueChange={(itemValue) => setRounds(itemValue)}
              >
                {Array.from({ length: 25 }, (_, i) => i + 1).map((num) => (
                  <Picker.Item
                    key={num}
                    label={num.toString()}
                    value={num.toString()}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Round Duration Input */}
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Duration</Text>
            <View style={styles.inputContainer}>
              <Picker
                selectedValue={roundMinutes}
                style={[styles.input, { height: 50 }]}
                onValueChange={(itemValue) => {
                  const minutes = parseInt(itemValue as string) || 0;
                  const seconds = parseInt(roundSeconds) || 0;
                  setRoundDurationTotal(minutes * 60 + seconds);
                }}
              >
                {Array.from({ length: 61 }, (_, i) => i).map((num) => (
                  <Picker.Item
                    key={num}
                    label={num.toString()}
                    value={num.toString()}
                  />
                ))}
              </Picker>
              <Text style={styles.unit}>minutes</Text>
              <Picker
                selectedValue={roundSeconds}
                style={[styles.input, { height: 50 }]}
                onValueChange={(itemValue) => {
                  const seconds = parseInt(itemValue as string) || 0;
                  const minutes = parseInt(roundMinutes) || 0;
                  setRoundDurationTotal(minutes * 60 + seconds);
                }}
              >
                {Array.from({ length: 60 }, (_, i) => i).map((num) => (
                  <Picker.Item
                    key={num}
                    label={num.toString()}
                    value={num.toString()}
                  />
                ))}
              </Picker>
              <Text style={styles.unit}>seconds</Text>
            </View>
            <Text style={styles.preview}>
              {formatTime(getRoundDurationSeconds() * parseInt(rounds))}
            </Text>
          </View>
        </View>
        {/* Rest Duration Input */}
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Rest</Text>
            <View style={styles.inputContainer}>
              <Picker
                selectedValue={restMinutes}
                style={[styles.input, { height: 50 }]}
                onValueChange={(itemValue) => {
                  const minutes = parseInt(itemValue as string) || 0;
                  const seconds = parseInt(restSeconds) || 0;
                  setRestDurationTotal(minutes * 60 + seconds);
                }}
              >
                {Array.from({ length: 61 }, (_, i) => i).map((num) => (
                  <Picker.Item
                    key={`rest_${num}`}
                    label={num.toString()}
                    value={num.toString()}
                  />
                ))}
              </Picker>
              <Text style={styles.unit}>Minutes</Text>
              <Picker
                selectedValue={restSeconds}
                style={[styles.input, { height: 50 }]}
                onValueChange={(itemValue) => {
                  const seconds = parseInt(itemValue as string) || 0;
                  const minutes = parseInt(restMinutes) || 0;
                  setRestDurationTotal(minutes * 60 + seconds);
                }}
              >
                {Array.from({ length: 60 }, (_, i) => i).map((num) => (
                  <Picker.Item
                    key={`rest_${num}`}
                    label={num.toString()}
                    value={num.toString()}
                  />
                ))}
              </Picker>
              <Text style={styles.unit}>Seconds</Text>
            </View>
            <Text style={styles.preview}>
              {formatTime((parseInt(rounds) - 1) * getRestDurationSeconds())}
            </Text>
          </View>
        </View>

        {/* Summary */}
        <View>
          {/* TODO: Remove the button styling. this should be a label */}
          <Text style={styles.summaryTitle}>Total</Text>
          <Text style={styles.summaryValue}>
            {formatTime(
              (parseInt(rounds) || 3) * getRoundDurationSeconds() +
                ((parseInt(rounds) || 3) - 1) * getRestDurationSeconds()
            )}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.9)", marginTop: 8 }}>
            Projected finish: {projectedStr}
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleStartTimer}>
          <Text style={styles.buttonText}>Start Training</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f9f8f8ff",
    marginBottom: 12,
  },
  labelContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    // width: "10%",
    marginBottom: 8,
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#3953c9ff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    marginRight: 12,
    color: "#333",
  },
  unit: {
    fontSize: 14,
    color: "#a3a0a0ff",
    fontWeight: "500",
  },
  preview: {
    fontSize: 14,
    color: "#3953c9ff",
    fontWeight: "600",
    marginTop: 8,
  },
  summary: {
    backgroundColor: "#3953c9ff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.88)",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: "#3953c9ff",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
