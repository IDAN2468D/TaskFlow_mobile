import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, InteractionManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Trophy, Flame, Zap, Star, Target, TrendingUp, Lock,
  CheckCircle2, Crown, Sparkles, Medal
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { taskService, GamificationProgress, GamificationAchievement } from '../services/taskService';

export default function GamificationScreen() {
  const { colors: themeColors } = useTheme();
  const [data, setData] = useState<GamificationProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => setIsReady(true));
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
      <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }} edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <MotiView
            from={{ opacity: 0.4, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1.1 }}
            transition={{ loop: true, type: 'timing', duration: 800 }}
          >
            <Trophy size={48} color={themeColors.primary} />
          </MotiView>
          <Text className="text-white/50 mt-4 font-medium text-[13px]">טוען את ההתקדמות שלך&rlm;...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }} edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <Text className="text-white/50 text-[14px]">לא ניתן לטעון את המידע&rlm;</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { progress, level, progressToNextLevel, xpToNextLevel, achievements } = data;
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={themeColors.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ─── Hero Card: Level & XP ─── */}
        <MotiView
          from={{ opacity: 0, translateY: -30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="mx-5 mt-4"
        >
          <LinearGradient
            colors={[themeColors.primary + '22', themeColors.secondary, themeColors.background]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-[28px] p-6 border border-white/10"
          >
            {/* Level Badge */}
            <View className="items-center mb-5">
              <MotiView
                from={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 200, type: 'spring', stiffness: 150 }}
              >
                <View
                  style={{ backgroundColor: themeColors.primary + '1A', borderColor: themeColors.primary + '44' }}
                  className="w-24 h-24 rounded-full items-center justify-center border-2"
                >
                  <Text className="text-[44px]">{level.emoji}</Text>
                </View>
              </MotiView>
              <Text className="text-white font-black text-[22px] mt-3">{level.title}</Text>
              <Text className="text-white/40 font-medium text-[13px]">רמה {level.level}</Text>
            </View>

            {/* XP Progress Bar */}
            <View className="mb-4">
              <View className="flex-row-reverse justify-between mb-2">
                <Text className="text-white/70 font-bold text-[12px]">{progress.xp.toLocaleString()} XP</Text>
                <Text className="text-white/40 text-[12px] font-medium">
                  {xpToNextLevel > 0 ? `${xpToNextLevel.toLocaleString()} XP לרמה הבאה` : 'רמה מקסימלית! 💎'}
                </Text>
              </View>
              <View
                style={{ backgroundColor: themeColors.primary + '15' }}
                className="h-3 rounded-full overflow-hidden"
              >
                <MotiView
                  from={{ width: '0%' }}
                  animate={{ width: `${Math.round(progressToNextLevel * 100)}%` }}
                  transition={{ type: 'timing', duration: 1200 }}
                  style={{ backgroundColor: themeColors.primary, height: '100%', borderRadius: 999 }}
                />
              </View>
            </View>

            {/* Quick Stats Row */}
            <View className="flex-row-reverse gap-3 mt-2">
              <StatsChip 
                icon={<Flame size={14} color="#f59e0b" />} 
                value={`${progress.currentStreak}`}
                label="Streak"
                color={themeColors}
              />
              <StatsChip 
                icon={<CheckCircle2 size={14} color="#10b981" />} 
                value={`${progress.totalTasksCompleted}`}
                label="משימות"
                color={themeColors}
              />
              <StatsChip 
                icon={<Zap size={14} color={themeColors.primary} />} 
                value={`${progress.weeklyXp}`}
                label="XP שבועי"
                color={themeColors}
              />
            </View>
          </LinearGradient>
        </MotiView>

        {/* ─── Streak Section ─── */}
        <MotiView
          from={{ opacity: 0, translateX: 30 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 200, type: 'spring', stiffness: 120 }}
          className="mx-5 mt-5"
        >
          <View
            style={{ backgroundColor: themeColors.secondary, borderColor: 'rgba(255,255,255,0.06)' }}
            className="rounded-[24px] p-5 border"
          >
            <View className="flex-row-reverse items-center gap-3 mb-3">
              <View style={{ backgroundColor: '#f59e0b22' }} className="w-10 h-10 rounded-2xl items-center justify-center">
                <Flame size={20} color="#f59e0b" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-black text-[16px] text-right">רצף יומי 🔥</Text>
                <Text className="text-white/40 text-[12px] text-right font-medium">המשך להשלים משימות כל יום&rlm;</Text>
              </View>
            </View>

            <View className="flex-row-reverse gap-3">
              <View className="flex-1 rounded-2xl p-4 items-center" style={{ backgroundColor: '#f59e0b11' }}>
                <Text className="text-[28px] font-black text-[#f59e0b]">{progress.currentStreak}</Text>
                <Text className="text-white/40 text-[11px] font-bold mt-1">נוכחי</Text>
              </View>
              <View className="flex-1 rounded-2xl p-4 items-center" style={{ backgroundColor: '#f59e0b08' }}>
                <Text className="text-[28px] font-black text-[#f59e0b]/60">{progress.longestStreak}</Text>
                <Text className="text-white/40 text-[11px] font-bold mt-1">שיא</Text>
              </View>
            </View>

            {/* Streak dots (last 7 days visual) */}
            <View className="flex-row-reverse justify-center gap-2 mt-4">
              {[...Array(7)].map((_, i) => {
                const isActive = i < progress.currentStreak && i < 7;
                return (
                  <MotiView
                    key={i}
                    from={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 300 + i * 60, type: 'spring', stiffness: 200 }}
                  >
                    <View
                      style={{
                        backgroundColor: isActive ? '#f59e0b' : 'rgba(255,255,255,0.06)',
                        shadowColor: isActive ? '#f59e0b' : 'transparent',
                        shadowOpacity: isActive ? 0.5 : 0,
                        shadowRadius: 6,
                      }}
                      className="w-8 h-8 rounded-full items-center justify-center"
                    >
                      {isActive && <Flame size={14} color="#fff" />}
                    </View>
                  </MotiView>
                );
              })}
            </View>
          </View>
        </MotiView>

        {/* ─── Achievements Section ─── */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 350, type: 'spring', stiffness: 120 }}
          className="mx-5 mt-5"
        >
          <View className="flex-row-reverse items-center justify-between mb-3 px-1">
            <View className="flex-row-reverse items-center gap-2">
              <Medal size={18} color={themeColors.primary} />
              <Text className="text-white font-black text-[17px]">הישגים</Text>
            </View>
            <View style={{ backgroundColor: themeColors.primary + '1A' }} className="px-3 py-1 rounded-full">
              <Text style={{ color: themeColors.primary }} className="text-[11px] font-black">
                {unlockedCount}/{totalCount}
              </Text>
            </View>
          </View>

          {/* Achievement Grid */}
          <View className="flex-row-reverse flex-wrap gap-3">
            {achievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                index={index}
                themeColors={themeColors}
              />
            ))}
          </View>
        </MotiView>

        {/* ─── Level Roadmap ─── */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 500, type: 'spring', stiffness: 120 }}
          className="mx-5 mt-5"
        >
          <View className="flex-row-reverse items-center gap-2 mb-3 px-1">
            <TrendingUp size={18} color={themeColors.primary} />
            <Text className="text-white font-black text-[17px]">מפת הרמות</Text>
          </View>

          <View
            style={{ backgroundColor: themeColors.secondary, borderColor: 'rgba(255,255,255,0.06)' }}
            className="rounded-[24px] p-4 border"
          >
            {data.levels.map((lvl, i) => {
              const isCurrentLevel = lvl.level === level.level;
              const isUnlocked = progress.xp >= lvl.xpRequired;

              return (
                <MotiView
                  key={lvl.level}
                  from={{ opacity: 0, translateX: 20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ delay: 550 + i * 50, type: 'spring', stiffness: 130 }}
                >
                  <View
                    className="flex-row-reverse items-center gap-3 py-3"
                    style={{
                      borderBottomWidth: i < data.levels.length - 1 ? 1 : 0,
                      borderBottomColor: 'rgba(255,255,255,0.04)',
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: isCurrentLevel
                          ? themeColors.primary + '22'
                          : isUnlocked
                            ? '#10b98115'
                            : 'rgba(255,255,255,0.04)',
                        borderColor: isCurrentLevel ? themeColors.primary + '55' : 'transparent',
                      }}
                      className="w-11 h-11 rounded-2xl items-center justify-center border"
                    >
                      <Text className="text-[22px]">{lvl.emoji}</Text>
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-right font-black text-[14px]"
                        style={{ color: isCurrentLevel ? themeColors.primary : isUnlocked ? '#10b981' : 'rgba(255,255,255,0.35)' }}
                      >
                        {lvl.title}
                      </Text>
                      <Text className="text-white/30 text-[11px] text-right font-medium">
                        {lvl.xpRequired.toLocaleString()} XP
                      </Text>
                    </View>
                    {isCurrentLevel && (
                      <View style={{ backgroundColor: themeColors.primary + '22' }} className="px-2 py-1 rounded-lg">
                        <Text style={{ color: themeColors.primary }} className="text-[10px] font-black">אתה כאן</Text>
                      </View>
                    )}
                    {isUnlocked && !isCurrentLevel && (
                      <CheckCircle2 size={16} color="#10b981" />
                    )}
                    {!isUnlocked && (
                      <Lock size={14} color="rgba(255,255,255,0.2)" />
                    )}
                  </View>
                </MotiView>
              );
            })}
          </View>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────

function StatsChip({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: any }) {
  return (
    <View
      className="flex-1 rounded-2xl p-3 items-center"
      style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
    >
      <View className="flex-row-reverse items-center gap-1.5 mb-1">
        {icon}
        <Text className="text-white font-black text-[16px]">{value}</Text>
      </View>
      <Text className="text-white/35 text-[10px] font-bold">{label}</Text>
    </View>
  );
}

function AchievementCard({ achievement, index, themeColors }: { achievement: GamificationAchievement; index: number; themeColors: any }) {
  const isUnlocked = achievement.unlocked;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 400 + index * 40, type: 'spring', stiffness: 150 }}
      style={{ width: '47%' }}
    >
      <View
        style={{
          backgroundColor: isUnlocked ? themeColors.primary + '0D' : 'rgba(255,255,255,0.03)',
          borderColor: isUnlocked ? themeColors.primary + '33' : 'rgba(255,255,255,0.05)',
        }}
        className="rounded-[20px] p-4 border items-center"
      >
        <View
          className="w-12 h-12 rounded-2xl items-center justify-center mb-2"
          style={{
            backgroundColor: isUnlocked ? themeColors.primary + '1A' : 'rgba(255,255,255,0.04)',
          }}
        >
          {isUnlocked ? (
            <Text className="text-[24px]">{achievement.emoji}</Text>
          ) : (
            <Lock size={20} color="rgba(255,255,255,0.15)" />
          )}
        </View>
        <Text
          className="text-center font-black text-[13px]"
          style={{ color: isUnlocked ? '#fff' : 'rgba(255,255,255,0.25)' }}
        >
          {achievement.title}
        </Text>
        <Text
          className="text-center text-[10px] font-medium mt-1"
          style={{ color: isUnlocked ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.15)' }}
          numberOfLines={2}
        >
          {achievement.description}
        </Text>
      </View>
    </MotiView>
  );
}
