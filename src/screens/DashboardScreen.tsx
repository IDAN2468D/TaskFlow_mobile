import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Dimensions,
  Image,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { 
  Plus, 
  BrainCircuit, 
  Zap, 
  Bell, 
  Trophy, 
  Layout,
  Cpu
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { AIPulseCard } from '../components/ai/AIPulseCard';
import { useTasks } from '../hooks/useTasks';
import PairWithWebModal from '../components/auth/PairWithWebModal';
import { router } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';
import SmartInputModal from '../components/SmartInputModal';
import TaskCard from '../components/TaskCard';
import { taskService, Task } from '../services/taskService';
import { authService } from '../services/authService';
import { executeOnIdle, chunkWork } from '../lib/performance';
import MobileTimelineList from '../components/timeline/MobileTimelineList';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { colors: themeColors } = useTheme();
  const [userData, setUserData] = useState<any>(null);
  const { 
    tasks, 
    loading, 
    refreshing, 
    fetchTasks, 
    onRefresh, 
    toggleTaskStatus, 
    deleteTask,
    toggleSubtask,
    generateTaskInsights 
  } = useTasks();
    
  const [displayTasks, setDisplayTasks] = useState<Task[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isDecomposing, setIsDecomposing] = useState(false);
  const [isPairModalVisible, setIsPairModalVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (tasks.length > 0) {
      if (displayTasks.length === 0) {
        setDisplayTasks(tasks.slice(0, 5));
        executeOnIdle(() => {
          const remaining = tasks.slice(5);
          chunkWork(remaining, (item) => {
            setDisplayTasks(prev => [...prev, item]);
          }, 5);
        });
      } else {
        setDisplayTasks(tasks);
      }
    } else {
      setDisplayTasks([]);
    }
  }, [tasks]);
    
  const urgentTasks = useMemo(() => tasks.filter(t => t.priority === 'High' && t.status !== 'Done'), [tasks]);
  const generalTasks = useMemo(() => tasks.filter(t => t.priority !== 'High' || t.status === 'Done'), [tasks]);

  const handleCreateTask = async (prompt: string) => {
    setIsDecomposing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      await taskService.createTaskWithAI(prompt);
      await fetchTasks();
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setIsDecomposing(false);
    }
  };

  const fetchProfile = useCallback(async () => {
    const response = await authService.getProfile();
    if (response.success && response.user) {
      setUserData(response.user);
    }
  }, []);

  useEffect(() => {
    const task = executeOnIdle(() => {
      setIsReady(true);
      fetchTasks();
      fetchProfile();
    });
    return () => task.cancel();
  }, [fetchTasks, fetchProfile]);

  if (!isReady) {
    return (
      <View className="flex-1 bg-obsidian items-center justify-center">
        <ActivityIndicator color={themeColors.primary} size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-obsidian">
      <StatusBar barStyle="light-content" />
      
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Obsidian Header */}
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="px-6 pt-4 pb-6"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-4">
              <TouchableOpacity 
                onPress={() => {
                   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                   router.push('/profile');
                }}
                className="w-14 h-14 rounded-outer overflow-hidden bg-surface-mid p-0.5 border border-white/5 shadow-2xl"
              >
                <View className="w-full h-full rounded-outer overflow-hidden bg-surface-low">
                  <Image 
                    source={{ uri: userData?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100' }} 
                    className="w-full h-full opacity-80"
                  />
                </View>
              </TouchableOpacity>
              <View className="items-start">
                <View className="flex-row items-center gap-1.5 mb-0.5">
                   <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                   <Text className="text-text-dim text-[10px] font-black uppercase tracking-[2px]">CORTEX_SYNC_ACTIVE</Text>
                </View>
                <Text className="text-text-main text-3xl font-black tracking-tighter">שלום, {userData?.name?.split(' ')[0] || 'גיבור'}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center gap-3">
              <TouchableOpacity 
                onPress={() => {
                   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                   router.push('/notifications');
                }}
                className="w-12 h-12 rounded-outer bg-surface-low justify-center items-center border border-white/5 shadow-xl"
              >
                <Bell size={24} color="#fff" />
                <View className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface-low" />
              </TouchableOpacity>
            </View>
          </View>
        </MotiView>

        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={themeColors.primary} />
          }
        >
          {/* AI Intelligence Hub */}
          <View className="px-6 mb-8">
            <AIPulseCard 
              userName={userData?.name || 'משתמש'} 
              topTask={tasks.find(t => t.priority === 'High' && t.status !== 'Done')?.title || 'התחל לתכנן את המהלך הבא שלך'}
              urgentCount={tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length}
              onPress={() => router.push('/ai')}
            />
          </View>

          {/* Neural Tools Grid */}
          <View className="mb-10">
            <View className="px-6 flex-row items-center gap-3 mb-5">
              <Text className="text-text-dim text-xs font-black uppercase tracking-[3px]">מרכז פיקוד עצבי</Text>
              <View className="h-[1px] flex-1 bg-white/10" />
            </View>

            <View className="px-6 flex-row flex-wrap -mx-2">
              {[
                { title: "מחולל פרויקטים", label: "ENGINE", icon: <Layout size={22} color="#10b981" />, path: '/idea-to-prd', color: '#10b981' },
                { title: "הישגים ודירוג", label: "RANK", icon: <Trophy size={22} color="#fbbf24" />, path: '/gamification', color: '#fbbf24' },
                { title: "מרחב ריכוז", label: "FOCUS", icon: <Zap size={22} color="#f43f5e" />, path: '/focus-mode', color: '#f43f5e' },
                { title: "ניתוח שבועי", label: "DATA", icon: <BrainCircuit size={22} color={themeColors.secondary} />, path: '/weekly-review', color: themeColors.secondary }
              ].map((tool, idx) => (
                <View key={idx} className="w-1/2 px-2 mb-4">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push(tool.path as any);
                    }}
                    className="rounded-outer bg-surface-low p-5 h-36 justify-between border border-white/5 shadow-sm"
                  >
                    <View className="w-12 h-12 rounded-inner bg-surface-mid items-center justify-center border border-white/5">
                      {tool.icon}
                    </View>
                    <View className="items-start">
                      <Text className="text-text-main font-black text-lg tracking-tight">{tool.title}</Text>
                      <Text className="text-text-dim text-[10px] font-black tracking-widest uppercase opacity-60 mt-0.5">{tool.label}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* High Priority Stream */}
          {urgentTasks.length > 0 && (
            <View className="mb-10">
              <View className="px-6 flex-row-reverse items-center justify-between mb-5">
                <View className="flex-row-reverse items-center gap-3">
                  <View className="w-1.5 h-6 bg-primary rounded-full" />
                  <Text className="text-text-main font-black text-2xl tracking-tighter">מיקוד דחוף</Text>
                </View>
                <TouchableOpacity 
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push('/ai-assistant');
                    }}
                >
                  <Text className="text-primary text-xs font-black uppercase tracking-widest">הצג הכל</Text>
                </TouchableOpacity>
              </View>

              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, gap: 14, flexDirection: 'row' }}
              >
                {urgentTasks.map((task, i) => (
                  <View key={task._id} style={{ width: width * 0.78 }}>
                    <TaskCard 
                      task={task} 
                      index={i} 
                      onToggleStatus={toggleTaskStatus}
                      onDelete={deleteTask}
                      onToggleSubtask={toggleSubtask}
                      onGetInsights={generateTaskInsights}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Timeline Peek */}
          <View className="px-6 mb-10">
            <View className="flex-row-reverse items-center gap-3 mb-5">
              <Text className="text-text-dim text-xs font-black uppercase tracking-[3px]">פעילות אחרונה</Text>
              <View className="h-[1px] flex-1 bg-white/10" />
            </View>
            <View className="rounded-outer bg-surface-low overflow-hidden border border-white/5">
              <MobileTimelineList />
            </View>
          </View>

          {/* General Task Stream */}
          <View className="px-6 mb-10">
            <View className="flex-row-reverse justify-between items-center mb-6">
              <View className="flex-row-reverse items-center gap-3">
                <View className="w-1.5 h-6 bg-surface-mid rounded-full" />
                <Text className="text-2xl font-black text-text-main tracking-tighter">כל המשימות</Text>
              </View>
              <View className="bg-surface-mid px-4 py-1.5 rounded-full border border-white/5">
                <Text className="text-text-main text-xs font-black tracking-widest">{generalTasks.length}</Text>
              </View>
            </View>

            <View className="gap-y-1">
              {generalTasks.map((task, index) => (
                <TaskCard 
                  key={task._id} 
                  task={task as any} 
                  index={index} 
                  onToggleStatus={toggleTaskStatus}
                  onDelete={deleteTask}
                  onToggleSubtask={toggleSubtask}
                  onGetInsights={generateTaskInsights}
                />
              ))}
            </View>
          </View>
          
          {/* Branding Footer */}
          <View className="mt-8 items-center opacity-20 pb-16">
            <Cpu size={20} color="#fff" />
            <Text className="text-[10px] text-white font-black tracking-[4px] mt-3 uppercase text-center">TaskFlow AI • Obsidian Architecture V.4.0</Text>
          </View>
        </ScrollView>

        {/* Primary Action Trigger */}
        <MotiView
           from={{ scale: 0, translateY: 50 }}
           animate={{ scale: 1, translateY: 0 }}
           transition={{ type: 'spring', delay: 800 }}
           className="absolute bottom-10 right-8"
        >
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              bottomSheetRef.current?.expand();
            }}
            className="w-16 h-16 rounded-outer justify-center items-center shadow-2xl bg-primary border border-white/10"
          >
            <Plus color="#fff" size={32} strokeWidth={3} />
          </TouchableOpacity>
        </MotiView>

        <SmartInputModal bottomSheetRef={bottomSheetRef} onSubmit={handleCreateTask} />
        <PairWithWebModal isVisible={isPairModalVisible} onClose={() => setIsPairModalVisible(false)} />
      </SafeAreaView>
    </View>
  );
}
