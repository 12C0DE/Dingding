import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useBoxingTimer } from '../context/BoxingTimerContext';

interface SetupPageProps {
  onNavigateToTimer: () => void;
}

export const SetupPage: React.FC<SetupPageProps> = ({ onNavigateToTimer }) => {
  const { settings, updateSettings } = useBoxingTimer();
  const [rounds, setRounds] = useState(settings.rounds.toString());
  const [roundDuration, setRoundDuration] = useState((settings.roundDuration / 60).toString());
  const [restDuration, setRestDuration] = useState((settings.restDuration / 60).toString());

  const handleStartTimer = () => {
    const parsedRounds = parseInt(rounds) || 3;
    const parsedRoundDuration = parseInt(roundDuration) || 3;
    const parsedRestDuration = parseInt(restDuration) || 1;

    updateSettings({
      rounds: Math.max(1, parsedRounds),
      roundDuration: Math.max(1, parsedRoundDuration) * 60,
      restDuration: Math.max(0, parsedRestDuration) * 60,
    });

    onNavigateToTimer();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Boxing Timer Setup</Text>
      </View>

      <View style={styles.content}>
        {/* Rounds Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Rounds</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={rounds}
              onChangeText={setRounds}
              placeholder="3"
            />
            <Text style={styles.unit}>rounds</Text>
          </View>
        </View>

        {/* Round Duration Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Round Duration</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={roundDuration}
              onChangeText={setRoundDuration}
              placeholder="3"
            />
            <Text style={styles.unit}>minutes</Text>
          </View>
          <Text style={styles.preview}>{formatTime((parseInt(roundDuration) || 3) * 60)}</Text>
        </View>

        {/* Rest Duration Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Rest Duration</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={restDuration}
              onChangeText={setRestDuration}
              placeholder="1"
            />
            <Text style={styles.unit}>minutes</Text>
          </View>
          <Text style={styles.preview}>{formatTime((parseInt(restDuration) || 1) * 60)}</Text>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Total Duration</Text>
          <Text style={styles.summaryValue}>
            {formatTime(
              (parseInt(rounds) || 3) *
                (parseInt(roundDuration) || 3) * 60 +
                (parseInt(rounds) - 1 || 2) * (parseInt(restDuration) || 1) * 60
            )}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleStartTimer}>
        <Text style={styles.buttonText}>Start Training</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3953c9ff',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#3953c9ff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    marginRight: 12,
    color: '#333',
  },
  unit: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  preview: {
    fontSize: 14,
    color: '#3953c9ff',
    fontWeight: '600',
    marginTop: 8,
  },
  summary: {
    backgroundColor: '#3953c9ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: '#3953c9ff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
