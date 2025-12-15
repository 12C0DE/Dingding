import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
} from 'react-native';
import { useBoxingTimer } from '../context/BoxingTimerContext';

interface TimerPageProps {
  onNavigateToSetup: () => void;
}

type TimerState = 'ROUND' | 'REST';

export const TimerPage: React.FC<TimerPageProps> = ({ onNavigateToSetup }) => {
  const { settings } = useBoxingTimer();
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(settings.roundDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [timerState, setTimerState] = useState<TimerState>('ROUND');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer when settings change
  useEffect(() => {
    setCurrentRound(1);
    setTimeLeft(settings.roundDuration);
    setIsRunning(false);
    setTimerState('ROUND');
  }, [settings]);

  // Timer logic
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up for current phase
          Vibration.vibrate(200);

          if (timerState === 'ROUND') {
            // Check if this was the last round
            if (currentRound >= settings.rounds) {
              // Training complete
              setIsRunning(false);
              Alert.alert('Training Complete!', 'Great job! You finished all rounds.');
              return prev;
            }
            // Move to rest phase
            setTimerState('REST');
            setCurrentRound((prev) => prev + 1);
            return settings.restDuration;
          } else {
            // Rest phase complete, move to next round
            setTimerState('ROUND');
            return settings.roundDuration;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timerState, currentRound, settings]);

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentRound(1);
    setTimeLeft(settings.roundDuration);
    setTimerState('ROUND');
  };

  const handleBackToSetup = () => {
    if (isRunning) {
      Alert.alert(
        'Stop Training?',
        'Are you sure you want to go back? Your timer will reset.',
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Go Back',
            onPress: () => {
              setIsRunning(false);
              onNavigateToSetup();
            },
            style: 'destructive',
          },
        ]
      );
    } else {
      onNavigateToSetup();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage =
    timerState === 'ROUND'
      ? ((settings.roundDuration - timeLeft) / settings.roundDuration) * 100
      : ((settings.restDuration - timeLeft) / settings.restDuration) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.roundInfo}>
          Round {currentRound} / {settings.rounds}
        </Text>
        <Text style={styles.phaseLabel}>{timerState === 'ROUND' ? '🥊 ROUND' : '⏸️  REST'}</Text>
      </View>

      {/* Timer Display */}
      <View style={styles.timerSection}>
        <View
          style={[
            styles.timerCircle,
            { backgroundColor: timerState === 'ROUND' ? '#FF6B6B' : '#4ECDC4' },
          ]}
        >
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercentage}%`,
                backgroundColor: timerState === 'ROUND' ? '#FF6B6B' : '#4ECDC4',
              },
            ]}
          />
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.pauseButton]}
          onPress={handlePlayPause}
        >
          <Text style={styles.buttonLabel}>{isRunning ? '⏸ Pause' : '▶ Start'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlButton, styles.resetButton]} onPress={handleReset}>
          <Text style={styles.buttonLabel}>↻ Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Back to Setup */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackToSetup}>
        <Text style={styles.backButtonText}>← Edit Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    width: '100%',
  },
  roundInfo: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
  },
  phaseLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  timerSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  timerText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressContainer: {
    width: '80%',
    marginVertical: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  controlButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 120,
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: '#FF6B6B',
  },
  resetButton: {
    backgroundColor: '#FFA500',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#3953c9ff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
