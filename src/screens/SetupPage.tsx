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
import DropDownPicker from "react-native-dropdown-picker";

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
  const [open, setOpen] = useState({
    rounds: false,
    roundMinutes: false,
    roundSeconds: false,
    restMinutes: false,
    restSeconds: false,
  });
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DING DING</Text>
      </View>

      <View style={styles.content}>
        <View>
          {/* Rounds Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rounds</Text>
            <View style={styles.inputContainer}>
              <View>
                <DropDownPicker
                  open={open.rounds}
                  setOpen={() => setOpen({ ...open, rounds: !open.rounds })}
                  value={rounds}
                  setValue={(itemValue) => setRounds(itemValue)}
                  items={Array.from({ length: 25 }, (_, i) => i + 1).map(
                    (num) => ({
                      label: num.toString(),
                      value: num.toString(),
                    })
                  )}
                  style={[styles.input, { zIndex: 1100, width: 240 }]}
                />
              </View>
            </View>
          </View>

          {/* Round Duration Input */}
          <View style={[styles.inputGroup, { zIndex: 1000 }]}>
            <View>
              <Text style={styles.label}>Duration</Text>
            </View>
            <View style={styles.inputContainer}>
              <View style={[styles.timeContainer, {}]}>
                <View
                  style={{
                    width: 100,
                  }}
                >
                  <DropDownPicker
                    open={open.roundMinutes}
                    setOpen={() =>
                      setOpen({ ...open, roundMinutes: !open.roundMinutes })
                    }
                    value={roundMinutes}
                    setValue={(itemValue) => setRoundMinutes(itemValue)}
                    items={Array.from({ length: 60 }, (_, i) => i).map(
                      (num) => ({
                        label: num.toString(),
                        value: num.toString(),
                      })
                    )}
                    style={[styles.input, { zIndex: 1050 }]}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 40,
                      color: "#FFFFFFFF",
                      textAlignVertical: "center",
                    }}
                  >
                    {" "}
                    :{" "}
                  </Text>
                </View>
                <View style={{ width: 100 }}>
                  <DropDownPicker
                    open={open.roundSeconds}
                    setOpen={() =>
                      setOpen({ ...open, roundSeconds: !open.roundSeconds })
                    }
                    value={roundSeconds}
                    setValue={(itemValue) => setRoundSeconds(itemValue)}
                    items={Array.from({ length: 59 }, (_, i) => i).map(
                      (num) => ({
                        label: num.toString(),
                        value: num.toString(),
                      })
                    )}
                    style={[styles.input, { zIndex: 1049 }]}
                  />
                </View>
              </View>
            </View>
            <Text style={styles.preview}>
              {formatTime(getRoundDurationSeconds() * parseInt(rounds))}
            </Text>
          </View>

          {/****** REST Duration Input ******/}
          <View style={[styles.inputGroup, { zIndex: 900 }]}>
            <Text style={styles.label}>Rest</Text>
            <View style={styles.inputContainer}>
              <View style={styles.timeContainer}>
                <View
                  style={{
                    width: 100,
                  }}
                >
                  <DropDownPicker
                    open={open.restMinutes}
                    setOpen={() =>
                      setOpen({ ...open, restMinutes: !open.restMinutes })
                    }
                    value={restMinutes}
                    setValue={(itemValue) => setRestMinutes(itemValue)}
                    items={Array.from({ length: 60 }, (_, i) => i).map(
                      (num) => ({
                        label: num.toString(),
                        value: num.toString(),
                      })
                    )}
                    style={[styles.input, { zIndex: 950 }]}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 40,
                      color: "#FFFFFFFF",
                      textAlignVertical: "center",
                    }}
                  >
                    {" "}
                    :{" "}
                  </Text>
                </View>
                <View style={{ width: 100 }}>
                  <DropDownPicker
                    open={open.restSeconds}
                    setOpen={() =>
                      setOpen({ ...open, restSeconds: !open.restSeconds })
                    }
                    value={restSeconds}
                    setValue={(itemValue) => setRestSeconds(itemValue)}
                    items={Array.from({ length: 59 }, (_, i) => i).map(
                      (num) => ({
                        label: num.toString(),
                        value: num.toString(),
                      })
                    )}
                    style={[styles.input, { zIndex: 949 }]}
                  />
                </View>
              </View>
            </View>
            <Text style={styles.preview}>
              {formatTime((parseInt(rounds) - 1) * getRestDurationSeconds())}
            </Text>

            {/* Summary */}
            <View>
              <Text style={styles.summaryTitle}>Total</Text>
              <Text style={styles.summaryValue}>
                {formatTime(
                  (parseInt(rounds) || 3) * getRoundDurationSeconds() +
                    ((parseInt(rounds) || 3) - 1) * getRestDurationSeconds()
                )}
              </Text>
              <Text
                style={{
                  color: "rgba(255,255,255,0.9)",
                  marginTop: 8,
                  textAlign: "right",
                }}
              >
                Projected finish: {projectedStr}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleStartTimer}>
          <Text style={styles.buttonText}>Start Training</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    top: 36,
  },
  content: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f9f8f8ff",
    marginBottom: 12,
  },
  input: {
    borderWidth: 2,
    borderColor: "#3953c9ff",
    borderRadius: 8,
    fontSize: 16,
    width: 100,
  },
  inputContainer: {
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "center",
  },
  inputGroup: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
  },
  timeContainer: {
    flexDirection: "row",
  },
  unit: {
    fontSize: 14,
    color: "#FFFFFFFF",
    fontWeight: "500",
  },
  preview: {
    fontSize: 14,
    color: "#3953c9ff",
    fontWeight: "600",
    marginTop: 8,
    textAlign: "right",
  },
  summary: {
    backgroundColor: "#3953c9ff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "rgba(255, 255, 255, 0.88)",
    marginBottom: 8,
    marginTop: 16,
  },
  summaryValue: {
    fontSize: 48,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 48,
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
