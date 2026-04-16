import React, { useCallback, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Dimensions,
  Image,
  InteractionManager,
  ActivityIndicator
} from 'react-native';
import { Easing } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Plus, ListTodo, TrendingUp, BrainCircuit, User as UserIcon, MonitorSmartphone, Target, Sparkles, Zap, Bell, Trophy, BarChart3 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { AIPulseCard } from '../components/ai/AIPulseCard';
import { TaskRiskBadge } from '../components/ai/TaskRiskBadge';
import { useTasks } from '../hooks/useTasks';
import PairWithWebModal from '../components/auth/PairWithWebModal';
import { Skeleton } from 'moti/skeleton';
import { router } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';
import SmartInputModal from '../components/SmartInputModal';
import TaskCard from '../components/TaskCard';
import { taskService } from '../services/taskService';
import { authService } from '../services/authService';
import { LinearGradient } from 'expo-linear-gradient';
import { Task } from '../services/taskService';
import { runIdle, chunkWork } from '../lib/performance';
import MobileTimelineList from '../components/timeline/MobileTimelineList';

const { width } = Dimensions.get('window');

import { useTheme } from '../context/ThemeContext';

export default function DashboardScreen() {
  const { colors: themeColors } = useTheme();
  // const router = useRouter(); removed in favor of singleton
  const [userData, setUserData] = React.useState<any>(null);
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
  
  const [displayTasks, setDisplayTasks] = React.useState<Task[]>([]);

  // Incremental rendering of tasks to keep UI responsive
  React.useEffect(() => {
    if (tasks.length > 0) {
      if (displayTasks.length === 0) {
        // Initial load: show first 3 items immediately
        setDisplayTasks(tasks.slice(0, 3));
        
        // Then load the rest incrementally
        runIdle(() => {
          const remaining = tasks.slice(3);
          chunkWork(remaining, (item) => {
            setDisplayTasks(prev => [...prev, item]);
          }, 3);
        });
      } else {
        setDisplayTasks(tasks);
      }
    } else {
      setDisplayTasks([]);
    }
  }, [tasks]);
  
  const urgentTasks = React.useMemo(() => tasks.filter(t => t.priority === 'High' && t.status !== 'Done'), [tasks]);
  const generalTasks = React.useMemo(() => tasks.filter(t => t.priority !== 'High' || t.status === 'Done'), [tasks]);

  const [isDecomposing, setIsDecomposing] = React.useState(false);
  const [isPairModalVisible, setIsPairModalVisible] = React.useState(false);
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const handleCreateTask = async (prompt: string) => {
    setIsDecomposing(true);
    try {
      await taskService.createTaskWithAI(prompt);
      await fetchTasks();
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setIsDecomposing(false);
    }
  };

  const fetchProfile = React.useCallback(async () => {
    const response = await authService.getProfile();
    if (response.success && response.user) {
      setUserData(response.user);
    }
  }, []);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
      fetchTasks();
      fetchProfile();
    });
    return () => task.cancel();
  }, [fetchTasks, fetchProfile]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: themeColors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={themeColors.primary} size="large" />
      </View>
    );
  }

  const renderSkeleton = () => (
    <View className="w-full gap-4">
      {[1, 2, 3].map((i) => (
        <View key={i}>
          <Skeleton colorMode="dark" width="100%" height={220} radius={24} />
        </View>
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      {/* Layered Background Gradient Effect */}
      <LinearGradient 
        colors={[themeColors.secondary, themeColors.background]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} 
      />
      
      {/* Visual Flavor: Background Orbs */}
      <MotiView
        from={{ opacity: 0.05, scale: 1 }}
        animate={{ opacity: 0.1, scale: 1.2 }}
        transition={{ loop: true, type: 'timing', duration: 8000, repeatReverse: true }}
        style={{ position: 'absolute', top: -50, left: -50, width: 300, height: 300, borderRadius: 150, backgroundColor: themeColors.primary + '33' }}
      />
      <MotiView
        from={{ opacity: 0.03, scale: 1.2 }}
        animate={{ opacity: 0.06, scale: 0.9 }}
        transition={{ loop: true, type: 'timing', duration: 10000, repeatReverse: true }}
        style={{ position: 'absolute', top: 300, right: -100, width: 400, height: 400, borderRadius: 200, backgroundColor: themeColors.accent + '22' }}
      />

      <SafeAreaView edges={['top']} className="flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={themeColors.primary} />
          }
        >
          {/* Dynamic Header Section */}
          <View className="flex-row-reverse items-center justify-between px-6 pt-4 mb-2">
            <View>
              <Text className="text-white/60 font-bold text-[14px] text-right">בוקר טוב,</Text>
              <Text className="text-white font-black text-[26px] text-right leading-none">{userData?.name || 'משתמש'}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/notifications')}
              className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center border border-white/10"
            >
              <View className="relative">
                <Bell size={24} color="#fff" />
                <View style={{ backgroundColor: themeColors.primary, borderColor: themeColors.background }} className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2" />
              </View>
            </TouchableOpacity>
          </View>

          {/* AIPulseCard - "Daily Pulse" (דופק יומי) */}
          <MotiView
            from={{ opacity: 0, scale: 0.9, translateY: -20 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ delay: 100, type: 'spring' }}
            className="px-6 mt-4 mb-4"
          >
            <AIPulseCard 
              userName={userData?.name || 'משתמש'} 
              topTask={tasks.find(t => t.priority === 'High' && t.status !== 'Done')?.title || 'תכנון פרויקט חדש בעזרת AI'}
              urgentCount={tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length}
              onPress={() => router.push('/ai')}
            />
          </MotiView>

          {/* Daily Briefing Banner */}
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200, type: 'spring', stiffness: 120 }}
            className="px-6 mt-2 mb-2"
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/daily-briefing');
              }}
              className="overflow-hidden rounded-[24px] border border-white/10"
            >
              <LinearGradient
                colors={[themeColors.primary + '18', themeColors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-5 py-4"
              >
                <View className="flex-row-reverse items-center justify-between">
                  <View className="flex-row-reverse items-center gap-3">
                    <View style={{ backgroundColor: themeColors.primary + '22' }} className="w-10 h-10 rounded-2xl items-center justify-center">
                      <Sparkles size={20} color={themeColors.primary} />
                    </View>
                    <View>
                      <Text className="text-white font-black text-[15px] text-right">תדרוך בוקר AI ✨</Text>
                      <Text className="text-white/50 text-[12px] text-right font-medium">סיכום יומי חכם מהסוכן שלך&rlm;</Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor: themeColors.primary + '1A', borderColor: themeColors.primary + '44' }} className="px-4 py-2 rounded-2xl border">
                    <Text style={{ color: themeColors.primary }} className="text-[11px] font-black">פתח →</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>

          {/* Gamification Banner */}
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 300, type: 'spring', stiffness: 120 }}
            className="px-6 mt-2 mb-2"
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/gamification');
              }}
              className="overflow-hidden rounded-[24px] border border-white/10"
            >
              <LinearGradient
                colors={['#f59e0b18', themeColors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-5 py-4"
              >
                <View className="flex-row-reverse items-center justify-between">
                  <View className="flex-row-reverse items-center gap-3">
                    <View style={{ backgroundColor: '#f59e0b22' }} className="w-10 h-10 rounded-2xl items-center justify-center">
                      <Trophy size={20} color="#f59e0b" />
                    </View>
                    <View>
                      <Text className="text-white font-black text-[15px] text-right">XP והישגים 🏆</Text>
                      <Text className="text-white/50 text-[12px] text-right font-medium">רמות, רצפים ותגמולים&rlm;</Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor: '#f59e0b1A', borderColor: '#f59e0b44' }} className="px-4 py-2 rounded-2xl border">
                    <Text style={{ color: '#f59e0b' }} className="text-[11px] font-black">צפה →</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>

          {/* AI Chat Banner */}
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 350, type: 'spring', stiffness: 120 }}
            className="px-6 mt-2 mb-2"
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/ai-chat');
              }}
              className="overflow-hidden rounded-[24px] border border-white/10"
            >
              <LinearGradient
                colors={['#10b98118', themeColors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-5 py-4"
              >
                <View className="flex-row-reverse items-center justify-between">
                  <View className="flex-row-reverse items-center gap-3">
                    <View style={{ backgroundColor: '#10b98122' }} className="w-10 h-10 rounded-2xl items-center justify-center">
                      <BrainCircuit size={20} color="#10b981" />
                    </View>
                    <View>
                      <Text className="text-white font-black text-[15px] text-right">צ'אט AI חכם 🧠</Text>
                      <Text className="text-white/50 text-[12px] text-right font-medium">שאל כל שאלה על המשימות שלך&rlm;</Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor: '#10b9811A', borderColor: '#10b98144' }} className="px-4 py-2 rounded-2xl border">
                    <Text style={{ color: '#10b981' }} className="text-[11px] font-black">שאל →</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>

          {/* Weekly Review Banner */}
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 400, type: 'spring', stiffness: 120 }}
            className="px-6 mt-2 mb-2"
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/weekly-review');
              }}
              className="overflow-hidden rounded-[24px] border border-white/10"
            >
              <LinearGradient
                colors={['#ec489918', themeColors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-5 py-4"
              >
                <View className="flex-row-reverse items-center justify-between">
                  <View className="flex-row-reverse items-center gap-3">
                    <View style={{ backgroundColor: '#ec489922' }} className="w-10 h-10 rounded-2xl items-center justify-center">
                      <BarChart3 size={20} color="#ec4899" />
                    </View>
                    <View>
                      <Text className="text-white font-black text-[15px] text-right">סיכום שבועי AI 📈</Text>
                      <Text className="text-white/50 text-[12px] text-right font-medium">ניתוח ביצועים ותובנות לשבוע הבא&rlm;</Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor: '#ec48991A', borderColor: '#ec489944' }} className="px-4 py-2 rounded-2xl border">
                    <Text style={{ color: '#ec4899' }} className="text-[11px] font-black">צפה →</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>

          {/* Urgent Tasks Section (Horizontal Scroll) */}
          {urgentTasks.length > 0 && (
            <MotiView
              from={{ opacity: 0, translateX: 50 }}
              animate={{ opacity: 1, translateX: 0 }}
              className="mb-10 px-6"
            >
              <View className="flex-row-reverse items-center justify-between mb-5">
                <View className="flex-row-reverse items-center gap-2">
                  <Zap color="#f43f5e" size={20} fill="#f43f5e" />
                  <Text className="text-white font-black text-[22px] text-right">דחוף וקריטי&rlm;</Text>
                </View>
                <View className="bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                  <Text className="text-rose-400 text-[10px] font-black uppercase tracking-wider">High Focus</Text>
                </View>
              </View>

              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ 
                  flexDirection: 'row-reverse',
                  paddingLeft: 0,
                  paddingRight: 4
                }}
              >
                {urgentTasks.map((task, i) => (
                  <View key={task._id} style={{ width: width * 0.82, marginLeft: 16 }}>
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
            </MotiView>
          )}

          {/* Timeline / Activity Peek */}
          <MotiView
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 400 }}
            className="px-6 mb-10"
          >
            <MobileTimelineList />
          </MotiView>

          <View className="flex-row-reverse justify-between items-center px-6 mb-6 mt-4">
            <View className="flex-row-reverse items-center gap-2">
              <ListTodo color={themeColors.primary} size={20} />
              <Text className="text-[22px] font-black text-white tracking-tight">כל המשימות&rlm;</Text>
            </View>
            <View style={{ backgroundColor: themeColors.primary + '1A', borderColor: themeColors.primary + '33' }} className="px-4 py-2 rounded-2xl border">
              <Text style={{ color: themeColors.primary }} className="text-[12px] font-black">{generalTasks.length} פעילות</Text>
            </View>
          </View>

          {/* Tasks Container */}
          <View className="px-6">
            {(loading || isDecomposing) && !refreshing ? (
              renderSkeleton()
            ) : (
              displayTasks.length > 0 ? (
                generalTasks.map((task, index) => (
                  <TaskCard 
                    key={task._id} 
                    task={task as any} 
                    index={index} 
                    onToggleStatus={toggleTaskStatus}
                    onDelete={deleteTask}
                    onToggleSubtask={toggleSubtask}
                    onGetInsights={generateTaskInsights}
                  />
                ))
              ) : (
                <MotiView 
                  from={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 200 }}
                  className="items-center mt-8 px-8 py-10 bg-white/5 rounded-[32px] border border-white/10"
                >
                  <View className="w-24 h-24 bg-white/5 rounded-[24px] items-center justify-center mb-6 border border-white/10">
                     <Text className="text-[40px]">🎯</Text>
                  </View>
                  <Text className="text-white text-[20px] font-black text-center mb-3">אין לך משימות פעילות</Text>
                  <Text className="text-slate-400 text-center leading-[24px] text-[15px] font-medium">השתמש בכפתור ה-Plus למטה כדי לתכנן את הפרויקט הבא שלך בעזרת AI&rlm;.</Text>
                </MotiView>
              )
            )}
          </View>
        </ScrollView>

        <MotiView
           from={{ scale: 0, rotate: '90deg', opacity: 0 }}
           animate={{ scale: 1, rotate: '0deg', opacity: 1 }}
           transition={{ delay: 600, type: 'spring', damping: 12 }}
           className="absolute bottom-10 left-8 z-50"
        >
          {/* Outer Pulse Rings */}
          <MotiView
            from={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ loop: true, duration: 2500, type: 'timing', easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) }}
            className="absolute inset-0 rounded-[34px]"
            style={{ backgroundColor: themeColors.primary + '4D' }}
          />
          <MotiView
            from={{ scale: 1, opacity: 0.4 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ loop: true, duration: 3000, type: 'timing', easing: Easing.bezier(0.25, 0.46, 0.45, 0.94), delay: 500 }}
            className="absolute inset-0 rounded-[34px]"
            style={{ backgroundColor: themeColors.primary + '33' }}
          />

          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              bottomSheetRef.current?.expand();
            }}
            className="w-[82px] h-[82px] rounded-[34px] justify-center items-center overflow-hidden border-2 border-white/30"
          >
            <LinearGradient 
              colors={[themeColors.accent, themeColors.primary]} 
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="absolute inset-0" 
            />
            {/* Inner Sheen Effect */}
            <MotiView
              from={{ translateX: -100 }}
              animate={{ translateX: 100 }}
              transition={{ loop: true, duration: 2000, type: 'timing', delay: 1000 }}
              className="absolute h-full w-10 bg-white/20 -skew-x-12"
            />
            <Plus color="#fff" size={44} strokeWidth={3.5} />
          </TouchableOpacity>
        </MotiView>

        <SmartInputModal 
          bottomSheetRef={bottomSheetRef}
          onSubmit={handleCreateTask}
        />
        <PairWithWebModal 
          isVisible={isPairModalVisible}
          onClose={() => setIsPairModalVisible(false)}
        />
      </SafeAreaView>
    </View>
  );
}
