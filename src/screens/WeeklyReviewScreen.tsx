import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  BarChart3, TrendingUp, CheckCircle2, Clock, 
  ArrowLeft, BrainCircuit, Target, Zap, Award
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { taskService, WeeklyReview } from '../services/taskService';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function WeeklyReviewScreen() {
  const { colors: themeColors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<WeeklyReview | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const result = await taskService.getWeeklyReview();
    setData(result);
    setLoading(false);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text className="text-white/40 mt-4 font-medium">מנתח את השבוע שלך...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center p-6" style={{ backgroundColor: themeColors.background }}>
        <Text className="text-white text-lg text-center mb-4">לא הצלחנו לטעון את הנתונים&rlm;</Text>
        <TouchableOpacity onPress={loadData} className="px-6 py-3 bg-indigo-500 rounded-2xl">
          <Text className="text-white font-bold">נסה שוב</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const maxDaily = Math.max(...data.dailyStats.map(s => s.count), 1);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }} edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-4 flex-row-reverse justify-between items-center">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white/5 items-center justify-center">
            <ArrowLeft size={20} color="white" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          <Text className="text-white font-black text-xl">סיכום שבועי AI</Text>
          <View className="w-10" />
        </View>

        {/* Hero Card */}
        <MotiView 
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-6 mt-2"
        >
          <LinearGradient
            colors={[themeColors.primary, '#4f46e5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-6 rounded-[32px] overflow-hidden"
          >
            <View className="flex-row-reverse justify-between items-center">
              <View>
                <Text className="text-white/70 font-bold text-right">אחוז ביצוע</Text>
                <View className="flex-row-reverse items-baseline gap-1">
                  <Text className="text-white font-black text-4xl">{Math.round(data.summary.completionRate)}%</Text>
                  <Text className="text-white/60 font-bold">סיים</Text>
                </View>
              </View>
              <View className="w-16 h-16 rounded-2xl bg-white/20 items-center justify-center">
                <TrendingUp size={32} color="white" />
              </View>
            </View>

            <View className="mt-6 h-2 bg-black/20 rounded-full overflow-hidden">
               <MotiView 
                from={{ width: 0 }}
                animate={{ width: `${data.summary.completionRate}%` }}
                transition={{ type: 'timing', duration: 1000 }}
                className="h-full bg-white" 
               />
            </View>
            <Text className="text-white/60 text-xs text-right mt-2 font-medium">
              {data.summary.completed} משימות הושלמו מתוך {data.summary.total}
            </Text>
          </LinearGradient>
        </MotiView>

        {/* AI Insight Card */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 300 }}
          className="mx-6 mt-6 p-5 rounded-[24px] border border-white/10"
          style={{ backgroundColor: themeColors.secondary }}
        >
          <View className="flex-row-reverse items-center gap-3 mb-3">
            <View className="w-8 h-8 rounded-xl bg-indigo-500/20 items-center justify-center">
              <BrainCircuit size={18} color={themeColors.primary} />
            </View>
            <Text className="text-indigo-400 font-black text-[15px]">תובנות הסוכן</Text>
          </View>
          <Text className="text-white/80 leading-6 text-right font-medium">
            {data.aiInsight}
          </Text>
        </MotiView>

        {/* Activity Chart */}
        <View className="px-6 mt-8">
          <Text className="text-white font-black text-lg text-right mb-4">פעילות יומית</Text>
          <View className="flex-row-reverse justify-between items-end h-40 px-4">
            {data.dailyStats.map((item, index) => (
              <View key={index} className="items-center gap-2">
                <MotiView
                  from={{ height: 0 }}
                  animate={{ height: (item.count / maxDaily) * 100 }}
                  transition={{ delay: 500 + (index * 100), type: 'spring' }}
                  className="w-8 rounded-t-lg"
                  style={{ backgroundColor: index === 6 ? themeColors.primary : themeColors.primary + '44' }}
                />
                <Text className="text-white/40 text-[10px] font-bold">{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Grid Stats */}
        <View className="flex-row flex-wrap px-4 mt-8 pb-10">
          {[
             { label: 'משימות חדשות', value: data.summary.total, icon: Zap, color: '#f59e0b' },
             { label: 'הושלמו', value: data.summary.completed, icon: CheckCircle2, color: '#10b981' },
             { label: 'מיומנויות ששופרו', value: data.tagStats.length, icon: Target, color: '#6366f1' },
             { label: 'זמן בביצוע', value: '~12.5h', icon: Clock, color: '#ec4899' }
          ].map((stat, i) => (
            <View key={i} style={{ width: '50%', padding: 8 }}>
              <View className="p-4 rounded-[24px] border border-white/5" style={{ backgroundColor: themeColors.secondary }}>
                <View className="w-10 h-10 rounded-xl mb-3 items-center justify-center" style={{ backgroundColor: stat.color + '22' }}>
                  <stat.icon size={20} color={stat.color} />
                </View>
                <Text className="text-white font-black text-2xl">{stat.value}</Text>
                <Text className="text-white/40 text-[11px] font-bold mt-1 text-right">{stat.label}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
