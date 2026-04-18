import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions, 
  StatusBar,
  ScrollView,
  Platform,
  InteractionManager,
  ActivityIndicator,
  Modal
} from 'react-native';
import { executeOnIdle } from '../lib/performance';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView, AnimatePresence } from 'moti';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Brain, 
  Zap, 
  Target, 
  ChevronRight,
  Settings,
  Flame,
  Battery,
  ShieldCheck,
  Cpu,
  Infinity as InfinityIcon,
  Wind
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useTimer } from '../hooks/useTimer';
import { taskService } from '../services/taskService';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const PremiumCard = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <MotiView
    from={{ opacity: 0, translateY: 15 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: 'spring', delay }}
    className={`rounded-outer overflow-hidden bg-surface-low p-5 border border-white/5 ${className}`}
  >
    {children}
  </MotiView>
);

export default function FocusModeScreen() {
  const router = useRouter();
  const { colors: themeColors } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [noiseBlocking, setNoiseBlocking] = useState(true);

  const { timeLeft: time, isActive, toggleTimer, resetTimer: reset, formatTime } = useTimer(workDuration, breakDuration);
  const [topTask, setTopTask] = useState<any>(null);

  useEffect(() => {
    const task = executeOnIdle(() => {
      setIsReady(true);
      fetchTopTask();
    });
    return () => task.cancel();
  }, []);

  const fetchTopTask = async () => {
    try {
      const task = await taskService.getTopTask();
      setTopTask(task);
    } catch (err) {
      console.error('[FocusMode] Failed to fetch top task:', err);
    }
  };

  const handleStartPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleTimer();
  };

  const handleReset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    reset();
  };

  if (!isReady) {
    return (
      <View className="flex-1 bg-obsidian justify-center items-center">
        <ActivityIndicator color={themeColors.primary} size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-obsidian">
      <StatusBar barStyle="light-content" />
      
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View className="flex-1">
        {/* Standardized Obsidian Header */}
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="px-6 pt-4 pb-6 border-b border-white/5"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-4">
              <TouchableOpacity 
                onPress={() => {
                   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                   router.back();
                }}
                className="w-12 h-12 rounded-outer bg-surface-low justify-center items-center border border-white/5"
              >
                <ChevronRight size={24} color="#fff" />
              </TouchableOpacity>
              <View className="items-start">
                <View className="flex-row items-center gap-1.5 mb-0.5">
                   <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                   <Text className="text-text-dim text-[10px] font-black uppercase tracking-[2px]">SHIELD_PROTOCOL_ACTIVE</Text>
                </View>
                <Text className="text-text-main text-2xl font-black tracking-tighter">מצב ריכוז עמוק</Text>
              </View>
            </View>
            
            <View className="w-10 h-10 rounded-inner bg-surface-mid items-center justify-center border border-white/5">
               <Target size={20} color={themeColors.primary} />
            </View>
          </View>
        </MotiView>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 140 }}
            className="flex-1"
          >
            {/* Timer Core */}
            <View className="items-center py-12">
              <MotiView
                animate={{ scale: isActive ? [1, 1.05, 1] : 1 }}
                transition={{ loop: true, duration: 4000, type: 'timing' }}
                className="w-64 h-64 rounded-full bg-surface-low items-center justify-center shadow-2xl border border-white/5"
              >
                <View className="w-56 h-56 rounded-full bg-surface-mid items-center justify-center border border-white/5">
                  <Text className="text-text-main text-6xl font-black tracking-tighter tabular-nums">
                    {formatTime(time)}
                  </Text>
                  <View className="mt-4 px-4 py-1.5 rounded-full bg-obsidian/50 border border-white/5">
                    <Text className="text-primary text-[10px] font-black uppercase tracking-widest">
                      {isActive ? 'בסנכרון פעיל' : 'ממתין לפעולה'}
                    </Text>
                  </View>
                </View>
              </MotiView>
            </View>

            {/* Neural Context */}
            <View className="bg-surface-low rounded-outer p-6 mb-4 border border-white/5 shadow-2xl">
              <View className="flex-row items-center gap-3 mb-6">
                <View className="w-8 h-8 rounded-inner bg-primary/10 items-center justify-center border border-primary/20">
                  <Brain size={18} color={themeColors.primary} />
                </View>
                <Text className="text-text-dim text-[10px] font-black uppercase tracking-widest opacity-60">משימה נוכחית</Text>
              </View>

              {topTask ? (
                <View>
                  <Text className="text-text-main text-xl font-black mb-2 tracking-tight">{topTask.title}</Text>
                  <Text className="text-text-dim text-sm font-bold leading-5 mb-6 opacity-70">{topTask.description}</Text>
                  
                  <View className="flex-row gap-3 pt-6 border-t border-white/5">
                    <View className="flex-1 bg-surface-mid rounded-inner p-4 items-center border border-white/5">
                      <Cpu size={20} color={themeColors.primary} />
                      <Text className="text-text-main text-[10px] font-black mt-2 text-center uppercase tracking-widest opacity-80">ריכוז מקסימלי</Text>
                    </View>
                    <View className="flex-1 bg-surface-mid rounded-inner p-4 items-center border border-white/5">
                      <Flame size={20} color="#f87171" />
                      <Text className="text-text-main text-[10px] font-black mt-2 text-center uppercase tracking-widest opacity-80">רצף יומי</Text>
                    </View>
                  </View>
                </View>
              ) : (
                <Text className="text-text-dim text-sm font-bold italic py-4 opacity-50">אין משימות קריטיות כרגע</Text>
              )}
            </View>

            {/* System Status */}
            <MotiView 
              animate={{ 
                backgroundColor: noiseBlocking ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                borderColor: noiseBlocking ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)'
              }}
              className="p-6 rounded-outer flex-row items-center border mb-6"
            >
              <View className={`w-12 h-12 rounded-inner items-center justify-center me-4 ${noiseBlocking ? 'bg-emerald-500/20' : 'bg-white/10'}`}>
                <ShieldCheck color={noiseBlocking ? '#10b981' : '#94a3b8'} size={24} />
              </View>
              <View className="flex-1 items-start">
                <Text className="text-text-main text-lg font-black tracking-tight">חסימת רעשים</Text>
                <Text className="text-text-dim text-xs font-bold mt-1 opacity-60">
                  {noiseBlocking ? 'ההתראות מסוננות דרך מנוע ה-AI' : 'סינון התראות מושבת כרגע'}
                </Text>
              </View>
            </MotiView>

            {/* Streak & Stats Section */}
            <View className="flex-row gap-4 mb-8">
              <View className="flex-1 bg-surface-low rounded-outer p-5 border border-white/5">
                <View className="flex-row items-center gap-2 mb-3">
                  <Flame size={16} color="#f59e0b" />
                  <Text className="text-text-dim text-[10px] font-black uppercase tracking-wider">רצף נוכחי</Text>
                </View>
                <Text className="text-text-main text-2xl font-black">4 ימים</Text>
                <View className="h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                  <View className="h-full bg-orange-500 w-[60%]" />
                </View>
              </View>
              
              <View className="flex-1 bg-surface-low rounded-outer p-5 border border-white/5">
                <View className="flex-row items-center gap-2 mb-3">
                  <Battery size={16} color="#10b981" />
                  <Text className="text-text-dim text-[10px] font-black uppercase tracking-wider">מיקוד יומי</Text>
                </View>
                <Text className="text-text-main text-2xl font-black">120 דק׳</Text>
                <View className="h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                  <View className="h-full bg-emerald-500 w-[85%]" />
                </View>
              </View>
            </View>

            {/* Branding */}
            <View className="mt-16 items-center opacity-20 pb-16">
              <Cpu size={20} color="#fff" />
              <Text className="text-[10px] text-white font-black uppercase tracking-[4px] mt-3">NEURAL_HUB v4.8 • OBSIDIAN</Text>
            </View>
          </ScrollView>

          {/* Controls */}
          <View className="absolute bottom-10 left-0 right-0 items-center">
            <View className="flex-row items-center bg-surface-low/95 rounded-outer p-2 shadow-2xl border border-white/10">
              <TouchableOpacity 
                onPress={handleReset}
                className="w-14 h-14 rounded-inner items-center justify-center"
              >
                <RotateCcw size={22} color="#94a3b8" />
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleStartPause}
                className="w-20 h-20 rounded-inner bg-primary items-center justify-center mx-4 shadow-xl shadow-primary/40 border border-white/10"
              >
                {isActive ? <Pause size={32} color="#fff" fill="#fff" /> : <Play size={32} color="#fff" fill="#fff" />}
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setIsSettingsOpen(true);
                }}
                className="w-14 h-14 rounded-inner items-center justify-center"
              >
                <Settings size={22} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Settings Modal */}
          <Modal
            visible={isSettingsOpen}
            transparent
            animationType="fade"
            onRequestClose={() => setIsSettingsOpen(false)}
          >
            <View className="flex-1 bg-obsidian/80 justify-end">
              <TouchableOpacity 
                activeOpacity={1} 
                className="flex-1" 
                onPress={() => setIsSettingsOpen(false)} 
              />
              <MotiView
                from={{ translateY: 300 }}
                animate={{ translateY: 0 }}
                className="bg-surface-low rounded-t-[32px] p-8 border-t border-white/10"
              >
                <View className="flex-row items-center justify-between mb-8">
                   <Text className="text-text-main text-2xl font-black tracking-tight">הגדרות ריכוז</Text>
                   <TouchableOpacity 
                    onPress={() => setIsSettingsOpen(false)}
                    className="w-10 h-10 rounded-full bg-surface-mid items-center justify-center border border-white/5"
                   >
                     <Text className="text-white font-bold">X</Text>
                   </TouchableOpacity>
                </View>

                {/* Work Duration */}
                <View className="mb-8">
                  <Text className="text-text-dim text-[10px] font-black uppercase tracking-widest mb-4">זמן עבודה (דקות)</Text>
                  <View className="flex-row gap-3">
                    {[15, 25, 45, 60].map(val => (
                      <TouchableOpacity
                        key={val}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setWorkDuration(val);
                        }}
                        className={`flex-1 py-3 rounded-inner border ${workDuration === val ? 'bg-primary border-primary' : 'bg-surface-mid border-white/5'}`}
                      >
                        <Text className={`text-center font-black ${workDuration === val ? 'text-white' : 'text-text-dim'}`}>{val}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Break Duration */}
                <View className="mb-8">
                  <Text className="text-text-dim text-[10px] font-black uppercase tracking-widest mb-4">זמן הפסקה (דקות)</Text>
                  <View className="flex-row gap-3">
                    {[5, 10, 15, 20].map(val => (
                      <TouchableOpacity
                        key={val}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setBreakDuration(val);
                        }}
                        className={`flex-1 py-3 rounded-inner border ${breakDuration === val ? 'bg-primary border-primary' : 'bg-surface-mid border-white/5'}`}
                      >
                        <Text className={`text-center font-black ${breakDuration === val ? 'text-white' : 'text-text-dim'}`}>{val}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Noise Blocking Toggle */}
                <TouchableOpacity 
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setNoiseBlocking(!noiseBlocking);
                  }}
                  className="flex-row items-center justify-between bg-surface-mid p-5 rounded-outer border border-white/5 mb-10"
                >
                  <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 rounded-inner bg-emerald-500/20 items-center justify-center">
                      <ShieldCheck size={20} color="#10b981" />
                    </View>
                    <View className="items-start">
                      <Text className="text-text-main font-black">חסימת רעשי מערכת</Text>
                      <Text className="text-text-dim text-[11px] font-bold opacity-60">סינון התראות AI פעיל</Text>
                    </View>
                  </View>
                  <View className={`w-10 h-6 rounded-full p-1 items-start ${noiseBlocking ? 'bg-primary' : 'bg-obsidian'}`}>
                    <MotiView 
                      animate={{ translateX: noiseBlocking ? -16 : 0 }}
                      className="w-4 h-4 rounded-full bg-white"
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    setIsSettingsOpen(false);
                    // Force timer reset to apply new durations immediately
                    if (!isActive) reset();
                  }}
                  className="bg-primary py-5 rounded-outer shadow-xl shadow-primary/40"
                >
                  <Text className="text-white text-center font-black text-lg">שמור הגדרות</Text>
                </TouchableOpacity>
              </MotiView>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </View>
  );
}
