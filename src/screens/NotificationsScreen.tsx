import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Bell, Zap, CalendarDays, BrainCircuit } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { router } from 'expo-router';

export default function NotificationsScreen() {
  // const router = useRouter();
  const [taskReminders, setTaskReminders] = useState(true);
  const [aiInsights, setAiInsights] = useState(true);
  const [morningBriefing, setMorningBriefing] = useState(false);

  return (
    <View className="flex-1 bg-obsidian">
      {/* Background ambient glow */}
      <LinearGradient
        colors={['rgba(99, 102, 241, 0.08)', 'transparent']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 500 }}
      />

      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Premium Header */}
        <View className="flex-row-reverse items-center justify-between px-6 pt-6 pb-4 relative z-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-12 h-12 bg-white/5 rounded-[18px] items-center justify-center border border-white/10 backdrop-blur-xl shadow-lg"
          >
            <ChevronRight color="#fff" size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text className="text-[26px] font-black text-white tracking-tighter text-right">התראות חכמות</Text>
          <View className="w-12 h-12" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>

          <MotiView
            from={{ opacity: 0, translateY: 20, scale: 0.95 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 18 }}
            className="relative bg-indigo-600 p-8 rounded-[36px] mb-10 overflow-hidden shadow-2xl flex-row-reverse items-center justify-between"
          >
            <LinearGradient colors={['#6366f1', '#4338ca']} className="absolute inset-0" />
            <View className="flex-1 mr-4 z-10">
              <View className="flex-row-reverse items-center gap-2 mb-2">
                <Text className="text-indigo-100 text-[12px] font-black uppercase tracking-widest text-right">מנוע AI פעיל</Text>
                <MotiView 
                  animate={{ opacity: [0.4, 1, 0.4] }} 
                  transition={{ loop: true, duration: 2000 }}
                  className="w-2 h-2 bg-emerald-400 rounded-full" 
                />
              </View>
              <Text className="text-white text-[24px] font-black text-right leading-none tracking-tighter mb-3">מערכת פוש חכמה</Text>
              <Text className="text-indigo-100/80 text-[15px] text-right font-bold leading-[22px]">
                המערכת לומדת את דפוסי הקשב שלך ומצמצמת הסחות דעת בזמן עבודה.
              </Text>
            </View>
            <View className="w-20 h-20 bg-white/20 rounded-[24px] items-center justify-center border border-white/30 z-10">
              <BrainCircuit color="#fff" size={36} />
            </View>
          </MotiView>

          <View className="gap-6">
            {/* Setting Item 1 */}
            <MotiView from={{ opacity: 0, translateX: 50 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 150, type: 'spring', damping: 20 }}>
              <View className="bg-[#121214]/60 rounded-[32px] border border-white/10 flex-row-reverse items-center justify-between p-6 shadow-2xl relative overflow-hidden">
                <LinearGradient colors={['rgba(255,255,255,0.02)', 'transparent']} className="absolute inset-0" />
                <View className="flex-row-reverse items-center flex-1 gap-4 z-10">
                  <View className="w-14 h-14 bg-blue-500/10 rounded-[22px] items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-500/5">
                    <CalendarDays color="#60a5fa" size={26} />
                  </View>
                  <View className="flex-1 items-end">
                    <Text className="text-white text-[19px] font-black tracking-tight text-right mb-1">תזכורות למשימות</Text>
                    <Text className="text-slate-500 text-[14px] font-bold text-right leading-[18px]">התראות חמות על דדליינים</Text>
                  </View>
                </View>
                <Switch
                  value={taskReminders}
                  onValueChange={setTaskReminders}
                  trackColor={{ false: '#27272a', true: '#4f46e5' }}
                  thumbColor="#fff"
                  style={{ transform: [{ scale: 1.2 }] }}
                />
              </View>
            </MotiView>

            {/* Setting Item 2 */}
            <MotiView from={{ opacity: 0, translateX: 50 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 300, type: 'spring', damping: 20 }}>
              <View className="bg-[#121214]/60 rounded-[32px] border border-white/10 flex-row-reverse items-center justify-between p-6 shadow-2xl relative overflow-hidden">
                <LinearGradient colors={['rgba(255,255,255,0.02)', 'transparent']} className="absolute inset-0" />
                <View className="flex-row-reverse items-center flex-1 gap-4 z-10">
                  <View className="w-14 h-14 bg-indigo-500/10 rounded-[22px] items-center justify-center border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                    <Zap color="#818cf8" size={26} />
                  </View>
                  <View className="flex-1 items-end">
                    <Text className="text-white text-[19px] font-black tracking-tight text-right mb-1">תובנות סוכן AI</Text>
                    <Text className="text-slate-500 text-[14px] font-bold text-right leading-[18px]">רעיונות אוטומטיים לפירוק משימה</Text>
                  </View>
                </View>
                <Switch
                  value={aiInsights}
                  onValueChange={setAiInsights}
                  trackColor={{ false: '#27272a', true: '#4f46e5' }}
                  thumbColor="#fff"
                  style={{ transform: [{ scale: 1.2 }] }}
                />
              </View>
            </MotiView>

            {/* Setting Item 3 */}
            <MotiView from={{ opacity: 0, translateX: 50 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 450, type: 'spring', damping: 20 }}>
              <View className="bg-[#121214]/60 rounded-[32px] border border-white/10 flex-row-reverse items-center justify-between p-6 shadow-2xl relative overflow-hidden">
                <LinearGradient colors={['rgba(255,255,255,0.02)', 'transparent']} className="absolute inset-0" />
                <View className="flex-row-reverse items-center flex-1 gap-4 z-10">
                  <View className="w-14 h-14 bg-emerald-500/10 rounded-[22px] items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                    <Bell color="#34d399" size={26} />
                  </View>
                  <View className="flex-1 items-end">
                    <Text className="text-white text-[19px] font-black tracking-tight text-right mb-1">תדריך בוקר</Text>
                    <Text className="text-slate-500 text-[14px] font-bold text-right leading-[18px]">ריכוז יעדים בממשק אחד (08:00)</Text>
                  </View>
                </View>
                <Switch
                  value={morningBriefing}
                  onValueChange={setMorningBriefing}
                  trackColor={{ false: '#27272a', true: '#4f46e5' }}
                  thumbColor="#fff"
                  style={{ transform: [{ scale: 1.2 }] }}
                />
              </View>
            </MotiView>
          </View>

        </ScrollView>

      </SafeAreaView>
    </View>
  );
}
