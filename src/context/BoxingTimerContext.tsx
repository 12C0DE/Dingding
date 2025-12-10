import React, { createContext, useContext, useState, useCallback } from 'react';

export interface TimerSettings {
  rounds: number;
  roundDuration: number; // in seconds
  restDuration: number;  // in seconds
}

interface BoxingTimerContextType {
  settings: TimerSettings;
  updateSettings: (settings: TimerSettings) => void;
}

const BoxingTimerContext = createContext<BoxingTimerContextType | undefined>(undefined);

export const BoxingTimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<TimerSettings>({
    rounds: 3,
    roundDuration: 180, // 3 minutes
    restDuration: 60,   // 1 minute
  });

  const updateSettings = useCallback((newSettings: TimerSettings) => {
    setSettings(newSettings);
  }, []);

  return (
    <BoxingTimerContext.Provider value={{ settings, updateSettings }}>
      {children}
    </BoxingTimerContext.Provider>
  );
};

export const useBoxingTimer = () => {
  const context = useContext(BoxingTimerContext);
  if (!context) {
    throw new Error('useBoxingTimer must be used within BoxingTimerProvider');
  }
  return context;
};
