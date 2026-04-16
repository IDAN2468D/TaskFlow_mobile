import { useState } from 'react';
import { taskService } from '../services/taskService';
import * as Haptics from 'expo-haptics';
import { Alert } from 'react-native';

export const usePRD = () => {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generatePRD = async () => {
    if (!idea.trim() || loading) return;

    setLoading(true);
    setResult(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const resp = await taskService.generatePRD(idea);
      if (resp && !resp.error) {
        setResult(resp);
        setIdea('');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        const errorMsg = resp?.error || 'לא הצלחנו ליצור את ה-PRD. נסה שוב מאוחר יותר&rlm;.';
        Alert.alert('שגיאה', errorMsg);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (error) {
      console.error('[usePRD] generatePRD failed:', error);
      Alert.alert('שגיאה', 'משהו השתבש בחיבור לשרת&rlm;.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setIdea('');
  };

  return {
    idea,
    setIdea,
    loading,
    result,
    generatePRD,
    reset
  };
};
