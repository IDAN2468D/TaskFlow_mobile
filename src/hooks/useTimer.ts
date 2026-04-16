import { useState, useEffect, useCallback, useRef } from 'react';
import * as Haptics from 'expo-haptics';

export type TimerMode = 'work' | 'break';

export const useTimer = (workMinutes: number = 25, breakMinutes: number = 5) => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleTimer = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsActive(!isActive);
  }, [isActive]);

  const resetTimer = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsActive(false);
    setMode('work');
    setTimeLeft(workMinutes * 60);
  }, [workMinutes]);

  const switchMode = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    const newMode = mode === 'work' ? 'break' : 'work';
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? workMinutes * 60 : breakMinutes * 60);
    setIsActive(false);
  }, [mode, workMinutes, breakMinutes]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      switchMode();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, switchMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = timeLeft / (mode === 'work' ? workMinutes * 60 : breakMinutes * 60);

  return {
    mode,
    timeLeft,
    isActive,
    toggleTimer,
    resetTimer,
    switchMode,
    formatTime,
    progress,
  };
};
