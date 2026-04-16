import { useState } from 'react';
import { taskService, Task } from '../services/taskService';
import * as Haptics from 'expo-haptics';
import { Alert } from 'react-native';

export const useAIAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Task | null>(null);

  const generateTask = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setResult(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      const resp = await taskService.createTaskWithAI(prompt);
      if (resp && !resp.error) {
        setResult(resp);
        setPrompt('');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return resp;
      } else {
        const errorMsg = resp?.error || 'לא הצלחנו ליצור את המשימה. נסה שוב מאוחר יותר&rlm;.';
        Alert.alert('שגיאה', errorMsg);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (error) {
      console.error('[useAIAssistant] generateTask failed:', error);
      Alert.alert('שגיאה', 'משהו השתבש בחיבור לשרת. וודא שהשרת פעיל&rlm;.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    prompt,
    setPrompt,
    loading,
    result,
    setResult,
    generateTask
  };
};
