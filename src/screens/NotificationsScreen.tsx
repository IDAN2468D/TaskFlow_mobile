import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Bell, Zap, CalendarDays, BrainCircuit, Activity, ShieldCheck, Fingerprint, Cpu } from 'lucide-react-native';
import { MotiView } from 'moti';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

export default function NotificationsScreen() {
  const { colors: themeColors } = useTheme();
  const [taskReminders, setTaskReminders] = useState(true);
  const [aiInsights, setAiInsights] = useState(true);
  const [morningBriefing, setMorningBriefing] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  return (
    <View className="flex-1 bg-obsidian">
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1" edges={['top']}>
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
                   <Text className="text-text-dim text-[10px] font-black uppercase tracking-[2px]">COMM_CENTER_ACTIVE</Text>
                </View>
                <Text className="text-text-main text-2xl font-black tracking-tighter">התראות חכמות</Text>
              </View>
            </View>
            
            <View className="w-10 h-10 rounded-inner bg-surface-mid items-center justify-center border border-white/5">
               <Bell size={20} color={themeColors.primary} />
            </View>
          </View>
        </MotiView>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          className="flex-1"
        >
          {/* AI Strategy Banner - High Density Surface */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="bg-surface-low p-6 rounded-outer mb-8 border border-primary/20 shadow-2xl overflow-hidden"
          >
            <View className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full -me-16 -mt-16" />
            
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-10 h-10 bg-primary/20 rounded-inner items-center justify-center border border-primary/30">
                <BrainCircuit color={themeColors.primary} size={22} />
              </View>
              <View className="items-start">
                <Text className="text-primary text-[10px] font-black uppercase tracking-[2px]">מנוע AI פעיל</Text>
                <Text className="text-text-main text-xl font-black tracking-tight">אסטרטגיית קשב</Text>
              </View>
            </View>
            <Text className="text-text-dim text-sm font-bold leading-5 opacity-80">
              המערכת לומדת את דפוסי הקשב שלך ומצמצמת הסחות דעת בזמן עבודה אינטנסיבית.
            </Text>
          </MotiView>

          <View className="flex-row items-center gap-3 mb-6 px-1">
            <Text className="text-text-dim text-[10px] font-black uppercase tracking-[3px]">הגדרות ליבה</Text>
            <View className="h-[1px] flex-1 bg-white/10" />
          </View>

          <View className="gap-y-4">
            {[
              { 
                title: "תזכורות למשימות", 
                subtitle: "התראות חמות על דדליינים", 
                icon: <CalendarDays color="#3b82f6" size={20} />, 
                value: taskReminders, 
                setValue: setTaskReminders,
                color: '#3b82f6'
              },
              { 
                title: "תובנות סוכן AI", 
                subtitle: "רעיונות אוטומטיים לפירוק משימה", 
                icon: <Zap color="#6366f1" size={20} />, 
                value: aiInsights, 
                setValue: setAiInsights,
                color: '#6366f1'
              },
              { 
                title: "תדריך בוקר", 
                subtitle: "ריכוז יעדים בממשק אחד (08:00)", 
                icon: <Activity color="#10b981" size={20} />, 
                value: morningBriefing, 
                setValue: setMorningBriefing,
                color: '#10b981'
              },
              { 
                title: "אבטחה ופרטיות", 
                subtitle: "התראות על סנכרון וגישה", 
                icon: <ShieldCheck color="#f43f5e" size={20} />, 
                value: securityAlerts, 
                setValue: setSecurityAlerts,
                color: '#f43f5e'
              }
            ].map((item, idx) => (
              <MotiView 
                key={idx}
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 100, type: 'timing', duration: 400 }}
              >
                <View className="bg-surface-low rounded-outer flex-row items-center justify-between p-4 border border-white/5 shadow-sm">
                  <View className="flex-row items-center flex-1 gap-4">
                    <View 
                      style={{ backgroundColor: item.color + '15' }} 
                      className="w-11 h-11 rounded-inner items-center justify-center border border-white/5"
                    >
                      {item.icon}
                    </View>
                    <View className="flex-1 items-start">
                      <Text className="text-text-main text-lg font-black tracking-tight">{item.title}</Text>
                      <Text className="text-text-dim text-[11px] font-bold opacity-60 mt-0.5">{item.subtitle}</Text>
                    </View>
                  </View>
                  <Switch
                    value={item.value}
                    onValueChange={(val) => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      item.setValue(val);
                    }}
                    trackColor={{ false: '#1C1C1E', true: themeColors.primary }}
                    thumbColor="#fff"
                    style={{ transform: [{ scale: Platform.OS === 'ios' ? 0.75 : 0.9 }] }}
                  />
                </View>
              </MotiView>
            ))}
          </View>

          {/* Footer Branding */}
          <View className="mt-16 items-center opacity-30 pb-20">
            <View className="w-10 h-10 rounded-inner bg-surface-low items-center justify-center border border-white/10 mb-4">
                <Fingerprint size={18} color="#fff" />
            </View>
            <Cpu size={20} color="#fff" className="mb-3" />
            <Text className="text-[9px] text-white font-black uppercase tracking-[5px] text-center leading-4">
              TASKFLOW_PROTOCOL v2.1{"\n"}
              ENCRYPTED_END_TO_END
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

