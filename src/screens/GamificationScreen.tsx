import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl, 
  ActivityIndicator, 
  StatusBar,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Trophy, 
  ChevronRight, 
  Flame, 
  CheckCircle2, 
  Zap, 
  Lock,
  Activity,
  Cpu,
  Sparkles,
  ArrowUpRight
} from 'lucide-react-native';
import { MotiView } from 'moti';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { taskService, GamificationProgress, GamificationAchievement } from '../services/taskService';
import { executeOnIdle } from '../lib/performance';

const { width } = Dimensions.get('window');

export default function GamificationScreen() {
  const { colors: themeColors } = useTheme();
  const [data, setData] = useState<GamificationProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    executeOnIdle(() => setIsReady(true));
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const result = await taskService.getGamificationProgress();
      setData(result);
    } catch (e) {
      console.error('[Gamification] Fetch failed:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isReady) fetchData();
  }, [isReady, fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  if (!isReady || loading) {
    return (
      <View className="flex-1 justify-center items-center bg-obsidian">
        <ActivityIndicator color={themeColors.primary} size="large" />
        <Text className="text-text-dim mt-6 text-[10px] font-black uppercase tracking-[4px]">טוען הישגים</Text>
      </View>
    );
  }

  if (!data) return null;

  const { progress, level, progressToNextLevel, xpToNextLevel, achievements } = data;
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <View className="flex-1 bg-obsidian">
      <StatusBar barStyle="light-content" />
      
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
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
                   <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                   <Text className="text-text-dim text-[10px] font-black uppercase tracking-[2px]">EVOLUTION_STREAM_ACTIVE</Text>
                </View>
                <Text className="text-text-main text-2xl font-black tracking-tighter">התקדמות אישית</Text>
              </View>
            </View>
            
            <View className="w-10 h-10 rounded-inner bg-surface-mid items-center justify-center border border-white/5">
               <Trophy size={20} color={themeColors.primary} />
            </View>
          </View>
        </MotiView>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={themeColors.primary} />
          }
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
          className="flex-1"
        >
          {/* Level Progress */}
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-low rounded-outer p-6 mb-8 mt-4 border border-white/5 shadow-2xl"
          >
            <View className="flex-row items-center gap-4 mb-6">
              <View className="w-16 h-16 rounded-inner bg-surface-mid items-center justify-center border border-white/5 shadow-sm">
                <Text className="text-4xl">{level.emoji}</Text>
              </View>
              <View className="items-start">
                <Text className="text-text-main text-xl font-black tracking-tight">{level.title}</Text>
                <Text className="text-primary text-xs font-black mt-1">רמה {level.level} • טייס מתקדם</Text>
              </View>
            </View>

            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-text-main font-black">{progress.xp.toLocaleString()} XP</Text>
                <Text className="text-text-dim text-xs font-bold opacity-60">
                  {xpToNextLevel > 0 ? `${xpToNextLevel.toLocaleString()} עד השלב הבא` : 'רמה מקסימלית'}
                </Text>
              </View>
              <View className="h-2 rounded-full bg-surface-mid overflow-hidden">
                <MotiView
                  from={{ width: '0%' }}
                  animate={{ width: `${Math.round(progressToNextLevel * 100)}%` }}
                  className="h-full bg-primary rounded-full"
                />
              </View>
            </View>

            <View className="flex-row gap-3 mt-8">
              <StatsChip icon={<Flame size={16} color="#f87171" />} value={progress.currentStreak.toString()} label="רצף" />
              <StatsChip icon={<CheckCircle2 size={16} color="#10b981" />} value={progress.totalTasksCompleted.toString()} label="משימות" />
              <StatsChip icon={<Zap size={16} color={themeColors.primary} />} value={progress.weeklyXp.toString()} label="שבועי" />
            </View>
          </MotiView>

          {/* Achievements Grid */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-text-main text-xl font-black tracking-tight">הישגים</Text>
            <View className="bg-surface-low px-4 py-1.5 rounded-full border border-white/5">
              <Text className="text-primary text-xs font-black">{unlockedCount}/{totalCount}</Text>
            </View>
          </View>

          <View className="flex-row flex-wrap -mx-2 mb-10">
            {achievements.map((achievement, index) => (
              <AchievementCard key={achievement.id} achievement={achievement} index={index} />
            ))}
          </View>

          {/* Road Map */}
          <View className="flex-row items-center gap-3 mb-6">
            <Text className="text-text-dim text-xs font-black uppercase tracking-[3px]">מפת הדרכים</Text>
            <View className="h-[1px] flex-1 bg-white/10" />
          </View>
          
          <View className="bg-surface-low rounded-outer overflow-hidden border border-white/5">
            {data.levels.map((lvl, i) => {
              const isCurrent = lvl.level === level.level;
              const isUnlocked = progress.xp >= lvl.xpRequired;

              return (
                <View 
                  key={lvl.level}
                  className={`flex-row items-center p-5 gap-4 ${i < data.levels.length - 1 ? 'border-b border-white/5' : ''} ${isCurrent ? 'bg-primary/5' : ''}`}
                >
                  <View className={`w-12 h-12 rounded-inner items-center justify-center border border-white/5 ${isUnlocked ? 'bg-surface-mid' : 'bg-surface-mid/50 opacity-40'}`}>
                    <Text className="text-xl">{lvl.emoji}</Text>
                  </View>
                  <View className="flex-1 items-start">
                    <Text className={`text-base font-black tracking-tight ${isUnlocked ? 'text-text-main' : 'text-text-dim opacity-40'}`}>{lvl.title}</Text>
                    <Text className="text-text-dim text-[10px] font-black mt-1 uppercase tracking-widest opacity-60">{lvl.xpRequired.toLocaleString()} XP</Text>
                  </View>
                  {isCurrent && (
                    <View className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      <Text className="text-primary text-[10px] font-black uppercase">נוכחי</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Branding */}
          <View className="mt-16 items-center opacity-20 pb-16">
            <Cpu size={20} color="#fff" />
            <Text className="text-[10px] text-white font-black uppercase tracking-[4px] mt-3">METRIC_ENGINE v2.1 • OBSIDIAN</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function StatsChip({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <View className="flex-1 bg-surface-mid rounded-inner p-4 items-center border border-white/5">
      <View className="flex-row items-center gap-2 mb-1.5">
        {icon}
        <Text className="text-text-main text-lg font-black tracking-tight">{value}</Text>
      </View>
      <Text className="text-text-dim text-[10px] font-black uppercase tracking-widest opacity-60">{label}</Text>
    </View>
  );
}

function AchievementCard({ achievement, index }: { achievement: GamificationAchievement; index: number }) {
  const isUnlocked = achievement.unlocked;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 15 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', delay: index * 50 }}
      style={{ width: '50%' }}
      className="px-2 mb-4"
    >
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        className={`rounded-outer p-5 items-center justify-center h-44 border border-white/5 ${isUnlocked ? 'bg-surface-low shadow-xl' : 'bg-surface-low/40 opacity-60'}`}
      >
        <View className={`w-16 h-16 rounded-inner items-center justify-center mb-4 border border-white/5 ${isUnlocked ? 'bg-surface-mid' : 'bg-surface-mid/50 opacity-20'}`}>
          {isUnlocked ? <Text className="text-3xl">{achievement.emoji}</Text> : <Lock size={24} color="#fff" opacity={0.5} />}
        </View>
        <Text className={`text-xs font-black text-center mb-1.5 tracking-tight ${isUnlocked ? 'text-text-main' : 'text-text-dim'}`} numberOfLines={1}>{achievement.title}</Text>
        <Text className="text-text-dim text-[10px] font-bold text-center leading-4 px-2 opacity-60" numberOfLines={2}>{achievement.description}</Text>
      </TouchableOpacity>
    </MotiView>
  );
}
