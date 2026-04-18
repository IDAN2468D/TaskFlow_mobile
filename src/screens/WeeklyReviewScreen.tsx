import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  ChevronRight, 
  ChevronLeft,
  Calendar, 
  Brain, 
  Zap,
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Layout,
  Activity,
  Award,
  Cpu
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const StatCard = ({ title, value, change, trend, icon: Icon, color }: any) => (
  <TouchableOpacity 
    activeOpacity={0.8}
    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    className="w-[48%] mb-4 rounded-outer bg-surface-low p-4 border border-white/5 shadow-sm"
  >
    <View className="flex-row justify-between items-start mb-4">
      <View className="w-9 h-9 rounded-inner bg-surface-mid items-center justify-center border border-white/5">
        <Icon size={18} color={color} />
      </View>
      <View className={`px-2 py-0.5 rounded-full flex-row items-center gap-1 ${trend === 'up' ? 'bg-emerald-500/10' : trend === 'down' ? 'bg-rose-500/10' : 'bg-blue-500/10'}`}>
        {trend === 'up' ? <ArrowUpRight size={10} color="#10b981" /> : trend === 'down' ? <ArrowDownRight size={10} color="#f43f5e" /> : <Activity size={10} color="#3b82f6" />}
        <Text className={`text-[9px] font-black ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-blue-500'}`}>{change}%</Text>
      </View>
    </View>
    <View className="items-start">
        <Text className="text-text-dim text-[9px] font-black uppercase tracking-widest opacity-60 mb-0.5">{title}</Text>
        <Text className="text-text-main text-2xl font-black tracking-tight">{value}</Text>
    </View>
  </TouchableOpacity>
);

const InsightItem = ({ text, type, index }: { text: string, type: 'positive' | 'negative' | 'neutral', index: number }) => (
  <MotiView
    from={{ opacity: 0, translateX: 20 }}
    animate={{ opacity: 1, translateX: 0 }}
    transition={{ delay: 400 + (index * 100) }}
    className="flex-row items-center gap-4 mb-3 bg-surface-low p-4 rounded-outer border border-white/5"
  >
    <View className={`w-1.5 h-1.5 rounded-full ${type === 'positive' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : type === 'negative' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'bg-blue-500 shadow-[0_0_8_rgba(59,130,246,0.5)]'}`} />
    <Text className="flex-1 text-text-main text-[13px] font-bold leading-5">{text}</Text>
  </MotiView>
);

export default function WeeklyReviewScreen() {
  const { colors: themeColors } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-obsidian">
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['top']} className="flex-1">
        
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
                <View className="flex-row items-center gap-1.5 mb-1">
                   <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                   <Text className="text-text-dim text-[10px] font-black uppercase tracking-[2px]">INTEL_STREAM_ACTIVE</Text>
                </View>
                <Text className="text-text-main text-2xl font-black tracking-tighter">סיכום שבועי</Text>
              </View>
            </View>
            
            <View className="flex-row items-center gap-2 bg-surface-mid px-3 py-1.5 rounded-inner border border-white/5">
               <Calendar size={12} color={themeColors.primary} />
               <Text className="text-text-main text-[11px] font-black tracking-tighter">14-20 באפריל</Text>
            </View>
          </View>
        </MotiView>

        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
        >
          {/* Main Scorecard - Premium Design */}
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 rounded-outer bg-surface-low p-6 border border-white/5 overflow-hidden shadow-2xl"
          >
            <View className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
            
            <View className="flex-row justify-between items-center mb-6">
              <View className="items-start">
                <Text className="text-text-dim text-[10px] font-black uppercase tracking-[3px] mb-1">ציון אפקטיביות</Text>
                <View className="flex-row items-baseline gap-1">
                    <Text className="text-text-main text-5xl font-black">94</Text>
                    <Text className="text-primary text-xl font-black">%</Text>
                </View>
              </View>
              <View className="w-20 h-20 rounded-full border-[6px] border-surface-mid items-center justify-center shadow-lg">
                 <View className="absolute w-full h-full rounded-full border-[6px] border-primary border-t-transparent -rotate-45" />
                 <View className="w-14 h-14 rounded-full bg-surface-mid items-center justify-center">
                    <Sparkles size={24} color={themeColors.primary} />
                 </View>
              </View>
            </View>
            
            <View className="h-1.5 bg-surface-mid rounded-full overflow-hidden mb-4 border border-white/5">
              <View className="h-full bg-primary w-[94%]" />
            </View>
            
            <View className="flex-row items-center gap-2">
                <View className="w-6 h-6 rounded-full bg-emerald-500/20 items-center justify-center">
                    <TrendingUp size={12} color="#10b981" />
                </View>
                <Text className="text-text-dim text-xs font-bold">עלית ב-12% מהשבוע שעבר. המשך כך!</Text>
            </View>
          </MotiView>

          {/* Grid Stats */}
          <View className="flex-row flex-wrap justify-between mb-8">
            <StatCard 
              title="משימות שהושלמו" 
              value="42" 
              change="15" 
              trend="up" 
              icon={Target} 
              color="#3b82f6" 
            />
            <StatCard 
              title="שעות ריכוז" 
              value="28.5" 
              change="8" 
              trend="up" 
              icon={Zap} 
              color="#fbbf24" 
            />
            <StatCard 
              title="זמן תגובה" 
              value="12m" 
              change="4" 
              trend="down" 
              icon={Activity} 
              color="#10b981" 
            />
            <StatCard 
              title="פרויקטים" 
              value="3" 
              change="0" 
              trend="neutral" 
              icon={Layout} 
              color="#a855f7" 
            />
          </View>

          {/* AI Neural Insights */}
          <View className="mb-10">
            <View className="flex-row items-center gap-3 mb-5 px-1">
              <View className="w-8 h-8 rounded-inner bg-primary/10 items-center justify-center">
                <Brain size={18} color={themeColors.primary} />
              </View>
              <Text className="text-text-main font-black text-xl tracking-tight">תובנות בינה מלאכותית</Text>
            </View>
            
            <InsightItem 
              index={0}
              text="הפרודוקטיביות שלך בשיאה בימי שלישי בבוקר (10:00-12:00)." 
              type="positive" 
            />
            <InsightItem 
              index={1}
              text="משימות ארוכות נוטות להידחות. כדאי לפרק אותן לתת-משימות קטנות יותר." 
              type="negative" 
            />
            <InsightItem 
              index={2}
              text="השלמת 90% מהמשימות שהוגדרו כ-'דחוף' בתוך פחות מ-24 שעות." 
              type="positive" 
            />
          </View>

          {/* Action Hub */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 800 }}
            className="mb-4"
          >
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/daily-briefing');
              }}
              className="rounded-outer bg-primary p-6 flex-row items-center justify-between shadow-2xl border border-white/10"
            >
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-inner bg-white/20 items-center justify-center border border-white/20">
                  <BarChart3 size={24} color="#fff" />
                </View>
                <View className="items-start">
                  <Text className="text-white text-lg font-black tracking-tight">הפק דו״ח מפורט</Text>
                  <Text className="text-white/70 text-xs font-bold">ניתוח מעמיק של הביצועים שלך</Text>
                </View>
              </View>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
          </MotiView>

          {/* Footer Branding */}
          <View className="mt-12 items-center opacity-20 pb-8">
            <Cpu size={20} color="#fff" />
            <Text className="text-[9px] text-white font-black uppercase tracking-[4px] mt-3">INSIGHT_ENGINE v0.9 • ARCHITECT</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
