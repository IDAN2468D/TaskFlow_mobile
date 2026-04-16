import { useState, useCallback, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { taskService, Task } from '../services/taskService';
import * as Haptics from 'expo-haptics';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks || []);
    } catch (error) {
      console.error('[useTasks] fetchTasks failed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Data Synchronization: Auto-refresh on App foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        fetchTasks();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [fetchTasks]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTasks();
  }, [fetchTasks]);

  const toggleTaskStatus = useCallback(async (taskId: string, currentStatus: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newStatus = currentStatus === 'Done' ? 'Todo' : 'Done';
    
    // Optimistic update
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus as any } : t));

    try {
      await taskService.updateTask(taskId, { status: newStatus as any });
      
      // Award XP when task is completed (fire-and-forget)
      if (newStatus === 'Done') {
        taskService.awardTaskXP(taskId).catch(err => 
          console.warn('[Gamification] XP award failed silently:', err)
        );
      }
    } catch (error) {
      console.error('[useTasks] toggleTaskStatus failed:', error);
      // Rollback
      fetchTasks();
    }
  }, [fetchTasks]);

  const deleteTask = useCallback(async (taskId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Optimistic update
    setTasks(prev => prev.filter(t => t._id !== taskId));

    try {
      const success = await taskService.deleteTask(taskId);
      if (!success) {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error('[useTasks] deleteTask failed:', error);
      fetchTasks();
    }
  }, [fetchTasks]);

  const toggleSubtask = useCallback(async (taskId: string, subtaskId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Optimistic update
    setTasks(prev => prev.map(t => {
      if (t._id === taskId) {
        return {
          ...t,
          subTasks: t.subTasks.map(st => st._id === subtaskId ? { ...st, status: st.status === 'Done' ? 'Todo' : 'Done' } : st)
        };
      }
      return t;
    }));

    try {
      await taskService.toggleSubtask(taskId, subtaskId);
    } catch (error) {
      console.error('[useTasks] toggleSubtask failed:', error);
      fetchTasks();
    }
  }, [fetchTasks]);

  const generateTaskInsights = useCallback(async (taskId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      await taskService.generateInsights(taskId);
      await fetchTasks();
    } catch (error) {
      console.error('[useTasks] generateInsights failed:', error);
    }
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    refreshing,
    fetchTasks,
    onRefresh,
    toggleTaskStatus,
    deleteTask,
    toggleSubtask,
    generateTaskInsights
  };
};
