import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, CloudSync, History, CheckCircle2, ShieldCheck, DatabaseBackup, Cpu } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function CloudSyncScreen() {
  // const router = useRouter();
  return (
    <View className="flex-1 bg-obsidian">
      {/* Background ambient glow */}
      <LinearGradient 
        colors={['rgba(59, 130, 246, 0.08)', 'transparent']} 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 500 }} 
      />

      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row items-center justify-between px-6 py-4">
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-outer bg-surface-low items-center justify-center border border-white/5 shadow-2xl">
              <CloudSync size={24} color="#3b82f6" />
            </View>
            <View>
              <Text className="text-text-main text-3xl font-black tracking-tighter">סנכרון ענן</Text>
              <View className="flex-row items-center gap-1.5 mt-1">
                <View className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-2xl" />
                <Text className="text-text-dim text-[10px] font-black uppercase tracking-widest opacity-60">CLOUD_PULSE_ACTIVE</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            className="w-10 h-10 rounded-inner bg-surface-low items-center justify-center border border-white/5"
          >
            <ChevronRight size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          className="flex-1"
        >
          
          <MotiView
             from={{ opacity: 0, scale: 0.95, translateY: 15 }}
             animate={{ opacity: 1, scale: 1, translateY: 0 }}
             transition={{ type: 'spring', damping: 18 }}
             className="items-center mb-10 mt-6"
          >
            <View className="w-40 h-40 rounded-outer bg-surface-low items-center justify-center border border-white/5 shadow-2xl relative overflow-hidden">
               <LinearGradient colors={['rgba(59, 130, 246, 0.1)', 'transparent']} className="absolute inset-0" />
               <View className="w-28 h-28 rounded-inner bg-surface-mid items-center justify-center border border-white/5 shadow-inner">
                  <CloudSync color="#3b82f6" size={56} strokeWidth={1.5} />
               </View>
            </View>
            
            <Text className="text-text-main text-3xl font-black text-center mt-8 tracking-tighter">M-Cloud פעיל</Text>
            <Text className="text-text-dim text-sm font-bold text-center leading-5 px-6 mt-3 opacity-70">
              המשימות והאסטרטגיות שלך מסונכרנות בזמן אמת ומגובות בהצפנה צבאית מקצה לקצה.
            </Text>
          </MotiView>

          {/* Sync Progress Card */}
          <MotiView 
            from={{ opacity: 0, translateY: 15 }} 
            animate={{ opacity: 1, translateY: 0 }} 
            transition={{ delay: 200, type: 'spring' }}
            className="bg-surface-low rounded-outer border border-white/5 p-6 mb-8 shadow-2xl overflow-hidden relative"
          >
            <LinearGradient colors={['rgba(255,255,255,0.02)', 'transparent']} className="absolute inset-0" />
            
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 bg-emerald-500/10 rounded-inner items-center justify-center border border-emerald-500/20 shadow-sm">
                   <CheckCircle2 color="#10b981" size={20} />
                </View>
                <View>
                  <Text className="text-text-main font-black text-lg tracking-tight">מצב סנכרון</Text>
                  <Text className="text-text-dim font-bold text-[10px] uppercase tracking-widest opacity-60">DATA_INTEGRITY_VERIFIED</Text>
                </View>
              </View>
              <View className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <Text className="text-emerald-500 font-black text-[10px] uppercase">מעודכן</Text>
              </View>
            </View>
            
            <View className="h-2 rounded-full bg-surface-mid overflow-hidden flex-row border border-white/5">
              <MotiView 
                from={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ delay: 500, type: 'timing', duration: 1500 }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </View>

            <View className="flex-row justify-between mt-4">
              <Text className="text-text-dim text-[10px] font-black uppercase tracking-[2px] opacity-40">LAST_PULSE: 12_MIN_AGO</Text>
              <Text className="text-emerald-500 text-[10px] font-black">100% SUCCESS</Text>
            </View>
          </MotiView>

          {/* Action Blocks */}
          <View className="gap-y-4">
            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              className="flex-row items-center bg-surface-low p-5 rounded-outer border border-white/5 shadow-lg relative overflow-hidden gap-4"
            >
              <View className="w-12 h-12 bg-surface-mid rounded-inner items-center justify-center border border-white/5 shadow-inner">
                <DatabaseBackup color="#3b82f6" size={22} />
              </View>
              <View className="flex-1">
                 <Text className="text-text-main text-lg font-black tracking-tight">סנכרון ידני</Text>
                 <Text className="text-text-dim text-xs font-bold opacity-60">דחוף שינויים אחרונים לענן</Text>
              </View>
              <ChevronRight color="rgba(255,255,255,0.2)" size={18} style={{ transform: [{ scaleX: -1 }] }} />
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              className="flex-row items-center bg-surface-low p-5 rounded-outer border border-white/5 shadow-lg relative overflow-hidden gap-4"
            >
              <View className="w-12 h-12 bg-surface-mid rounded-inner items-center justify-center border border-white/5 shadow-inner">
                <History color="#3b82f6" size={22} />
              </View>
              <View className="flex-1">
                 <Text className="text-text-main text-lg font-black tracking-tight">היסטוריית גרסאות</Text>
                 <Text className="text-text-dim text-xs font-bold opacity-60">שחזר נתונים מנקודות זמן</Text>
              </View>
              <ChevronRight color="rgba(255,255,255,0.2)" size={18} style={{ transform: [{ scaleX: -1 }] }} />
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              className="flex-row items-center bg-surface-low p-5 rounded-outer border border-white/5 shadow-lg relative overflow-hidden gap-4"
            >
              <View className="w-12 h-12 bg-surface-mid rounded-inner items-center justify-center border border-white/5 shadow-inner">
                <ShieldCheck color="#3b82f6" size={22} />
              </View>
              <View className="flex-1">
                 <Text className="text-text-main text-lg font-black tracking-tight">אבטחה והצפנה</Text>
                 <Text className="text-text-dim text-xs font-bold opacity-60">ניהול מפתחות גישה</Text>
              </View>
              <ChevronRight color="rgba(255,255,255,0.2)" size={18} style={{ transform: [{ scaleX: -1 }] }} />
            </TouchableOpacity>
          </View>

          {/* Branding */}
          <View className="mt-16 items-center opacity-20 pb-16">
            <Cpu size={20} color="#fff" />
            <Text className="text-[10px] text-white font-black uppercase tracking-[4px] mt-3">M-CLOUD ENGINE v4.2 • OBSIDIAN</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
