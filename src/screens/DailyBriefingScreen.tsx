import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sunrise,
  ChevronRight,
  Target,
  Zap,
  Clock,
  Quote,
  BrainCircuit,
  ArrowLeft,
  Activity,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { taskService, DailyBriefing } from '../services/taskService';
import * as Haptics from 'expo-haptics';

export default function DailyBriefingScreen() {
  const { colors: themeColors } = useTheme();
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBriefing = useCallback(async () => {
    try {
      const data = await taskService.getDailyBriefing();
      if (data) {
        setBriefing(data);
      }
    } catch (err) {
      console.error('[DailyBriefing] Fetch failed:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBriefing();
  }, [fetchBriefing]);

  const onRefresh = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    fetchBriefing();
  }, [fetchBriefing]);

  const getGreetingEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅';
    if (hour < 17) return '☀️';
    if (hour < 21) return '🌆';
    return '🌙';
  };

  if (loading) {
    return (
      <View className="flex-1 bg-obsidian justify-center items-center">
        <ActivityIndicator color={themeColors.primary} size="large" />
        <Text className="text-text-dim text-[10px] font-bold mt-6 tracking-[4px] uppercase text-center">סנתז תדרוך אסטרטגי...</Text>
      </View>
    );
  }

  const data = briefing;
  const stats = data?.stats;
  const critical = data?.criticalTasks || [];

  return (
    <View className="flex-1 bg-obsidian">
      <StatusBar barStyle="light-content" />
      
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            className="w-10 h-10 rounded-inner bg-surface-low items-center justify-center border border-white/5"
          >
            <ChevronRight size={24} color="#fff" />
          </TouchableOpacity>

          <View className="flex-row items-center gap-4">
            <View className="items-start">
              <Text className="text-text-main text-3xl font-black tracking-tighter">תדרוך יומי</Text>
              <View className="flex-row items-center gap-1.5 mt-1">
                <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-2xl" />
                <Text className="text-text-dim text-[10px] font-black uppercase tracking-widest opacity-60">STRATEGIC_INTEL_ACTIVE</Text>
              </View>
            </View>
            <View className="w-12 h-12 rounded-outer bg-surface-low items-center justify-center border border-white/5 shadow-2xl">
              <Sunrise size={24} color={themeColors.primary} />
            </View>
          </View>
        </View>

        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={themeColors.primary} />
          }
        >
          {/* Neural Hero Greeting */}
          <MotiView
            from={{ opacity: 0, scale: 0.95, translateY: 15 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            className="mb-8 mt-4"
          >
            <View className="bg-surface-low rounded-outer p-6 border border-white/5 shadow-2xl overflow-hidden relative">
              <LinearGradient colors={[themeColors.primary + '1A', 'transparent']} className="absolute inset-0" />
              <View className="flex-row items-center justify-between mb-6">
                 <View className="bg-surface-mid px-3 py-1.5 rounded-full border border-white/5">
                    <Text className="text-primary text-[10px] font-black uppercase tracking-widest">CORTEX_SYNC_READY</Text>
                 </View>
                 <View className="w-14 h-14 rounded-inner bg-surface-mid items-center justify-center border border-white/5">
                    <Text className="text-4xl">{getGreetingEmoji()}</Text>
                 </View>
              </View>
              
              <Text className="text-text-main text-3xl font-black tracking-tight mb-2">
                {new Date().getHours() < 12 ? 'בוקר טוב, אסטרטג' : 'ערב טוב, אסטרטג'}
              </Text>
              
              <Text className="text-text-dim text-sm leading-5 font-bold opacity-70">
                חישבתי מחדש את מסלול ההצלחה שלך להיום בהתבסס על עדיפויות המערכת והביצועים האחרונים.
              </Text>
            </View>
          </MotiView>

          {/* Core Analytics Cards */}
          <View className="flex-row gap-3 mb-10">
            <View className="flex-1 bg-surface-low rounded-outer p-5 items-center border border-white/5 shadow-xl">
              <View className="flex-row items-center gap-2 mb-3">
                <Activity size={16} color="#10b981" />
                <Text className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">EFFICIENCY</Text>
              </View>
              <Text className="text-text-main text-3xl font-black tracking-tighter">{stats?.productivityScore || 0}%</Text>
              <Text className="text-text-dim text-[10px] font-black mt-1.5 uppercase tracking-widest opacity-40 text-center">מגמת צמיחה</Text>
            </View>
            <View className="flex-1 bg-surface-low rounded-outer p-5 items-center border border-white/5 shadow-xl">
              <View className="flex-row items-center gap-2 mb-3">
                <Target size={16} color={themeColors.primary} />
                <Text className="text-primary text-[10px] font-black uppercase tracking-widest">COMPLETION</Text>
              </View>
              <Text className="text-text-main text-3xl font-black tracking-tighter">{stats?.completedThisWeek || 0}</Text>
              <Text className="text-text-dim text-[10px] font-black mt-1.5 uppercase tracking-widest opacity-40 text-center">יעדים שהושגו</Text>
            </View>
          </View>

          {/* AI Strategy Summary */}
          <View className="flex-row items-center gap-3 mb-6 px-1">
            <Text className="text-text-dim text-xs font-black uppercase tracking-[3px]">תובנות המערכת</Text>
            <View className="h-[1px] flex-1 bg-white/10" />
          </View>

          <View className="bg-surface-low rounded-outer p-6 mb-10 border border-white/5 flex-row items-start gap-4 shadow-2xl">
            <View className="bg-surface-mid p-3 rounded-inner border border-white/10">
               <Quote size={20} color={themeColors.primary} />
            </View>
            <View className="flex-1">
               <Text className="text-text-main text-base font-bold leading-6 italic">
                  "{data?.briefing?.strategicTip || 'המערכת מנתחת את נתוני המשימות שלך...'}"
               </Text>
            </View>
          </View>

          {/* Critical Tasks */}
          <View className="flex-row items-center justify-between mb-6 px-1">
            <View className="flex-row items-center gap-3">
                <View className="w-1.5 h-6 bg-rose-500 rounded-full" />
                <Text className="text-text-main text-2xl font-black tracking-tighter">יעדים קריטיים</Text>
            </View>
            <View className="bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
               <Text className="text-rose-400 text-[10px] font-black uppercase">{critical.length} MISSION_CRITICAL</Text>
            </View>
          </View>

          <View className="gap-y-4 mb-12">
            {critical.map((task, index) => (
              <MotiView
                 key={task.id}
                 from={{ opacity: 0, translateY: 10 }}
                 animate={{ opacity: 1, translateY: 0 }}
                 transition={{ delay: 400 + index * 100 }}
              >
                  <TouchableOpacity 
                     activeOpacity={0.8}
                     onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                     className="bg-surface-low rounded-outer p-5 flex-row items-center justify-between border border-white/5 shadow-lg"
                  >
                      <View className="flex-row items-center gap-4 flex-1">
                          <View className="w-11 h-11 rounded-inner bg-rose-500/10 items-center justify-center border border-rose-500/20 shadow-sm">
                              <Zap size={20} color="#f43f5e" fill="#f43f5e" />
                          </View>
                          <View className="flex-1 items-start">
                              <Text className="text-text-main text-lg font-black tracking-tight mb-1">{task.title}</Text>
                              <View className="flex-row items-center gap-1.5">
                                 <Clock size={12} color="rgba(255,255,255,0.4)" />
                                 <Text className="text-text-dim text-[10px] font-black uppercase tracking-widest opacity-60">HIGH_PRIORITY_PULSE</Text>
                              </View>
                          </View>
                      </View>
                  </TouchableOpacity>
              </MotiView>
            ))}
          </View>

          {/* Action Call */}
          <MotiView
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 800 }}
          >
             <TouchableOpacity 
               activeOpacity={0.9}
               onPress={() => {
                 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                 router.replace('/home');
               }}
               className="h-[68px] rounded-outer overflow-hidden bg-primary items-center justify-center flex-row gap-3 shadow-2xl shadow-primary/40 border border-white/10"
             >
                <Text className="text-white text-xl font-black tracking-tight">התחל משימה ראשונה</Text>
                <ArrowLeft size={24} color="#fff" strokeWidth={3} />
             </TouchableOpacity>
          </MotiView>

          {/* Branding */}
          <View className="mt-16 items-center opacity-20 pb-16">
            <BrainCircuit size={20} color="#fff" />
            <Text className="text-[10px] text-white font-black uppercase tracking-[4px] mt-3 text-center">NEURAL_INTEL_ENGINE v4.2 • OBSIDIAN</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
