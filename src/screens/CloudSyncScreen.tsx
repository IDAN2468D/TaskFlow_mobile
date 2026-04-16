import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, CloudSync, History, CheckCircle2, ShieldCheck, DatabaseBackup } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { router } from 'expo-router';

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
        {/* Header */}
        <View className="flex-row-reverse items-center justify-between px-6 pt-4 pb-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-12 h-12 bg-white/5 rounded-full items-center justify-center border border-white/10 backdrop-blur-md"
          >
            <ChevronRight color="#fff" size={24} />
          </TouchableOpacity>
          <Text className="text-[22px] font-extrabold text-white tracking-widest text-shadow-sm shadow-blue-500">סנכרון ענן AI</Text>
          <View className="w-12 h-12" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
          
          <MotiView
             from={{ opacity: 0, scale: 0.9, translateY: 20 }}
             animate={{ opacity: 1, scale: 1, translateY: 0 }}
             transition={{ type: 'spring', damping: 18 }}
             className="items-center mb-12 mt-4 relative"
          >
            <View className="absolute inset-0 bg-blue-500/20 rounded-full blur-[80px] scale-150" />
            
            <MotiView 
               from={{ scale: 0.9 }}
               animate={{ scale: 1.05 }}
               transition={{ loop: true, type: 'timing', duration: 2500 }}
               className="w-40 h-40 rounded-full items-center justify-center relative shadow-2xl shadow-blue-500/30"
            >
               <LinearGradient colors={['#1e3a8a', '#3b82f6']} className="absolute inset-0 rounded-[40px] opacity-80 blur-md" />
               <View className="w-32 h-32 bg-blue-500/10 rounded-[30px] items-center justify-center border-2 border-blue-400/50 backdrop-blur-md">
                 <CloudSync color="#93c5fd" size={56} strokeWidth={1.5} />
               </View>
            </MotiView>
            
            <Text className="text-[28px] font-extrabold text-white text-center mt-6 tracking-tight shadow-md">M-Cloud פעיל</Text>
            <Text className="text-[15px] font-medium text-blue-200/80 text-center leading-[24px] px-6 mt-2">
              המשימות ופעולות המחולל שלך מסונכרנות בזמן אמת ומגובות בקידוד אבטחה מחמיר.
            </Text>
          </MotiView>

          {/* Sync Progress Card */}
          <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 200, type: 'spring' }}>
            <View className="bg-black/40 rounded-[32px] border border-white/5 p-6 mb-8 shadow-2xl overflow-hidden relative">
              <LinearGradient colors={['rgba(255,255,255,0.03)', 'transparent']} className="absolute inset-0" />
              
              <View className="flex-row-reverse items-center justify-between mb-6">
                <View className="flex-row-reverse items-center gap-3">
                  <View className="bg-emerald-500/20 p-2 rounded-full border border-emerald-500/30 shadow-inner">
                     <CheckCircle2 color="#34d399" size={24} />
                  </View>
                  <View>
                    <Text className="text-white font-extrabold text-[18px] text-right">מצב סנכרון</Text>
                    <Text className="text-slate-400 font-medium text-[12px] text-right">הכל מגובה בהצלחה</Text>
                  </View>
                </View>
                <View className="bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <Text className="text-emerald-400 font-extrabold text-[12px] uppercase tracking-widest">מעודכן</Text>
                </View>
              </View>
              
              <View className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex-row-reverse shadow-inner border border-white/5">
                <MotiView 
                  from={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 500, type: 'timing', duration: 1500 }}
                  className="h-full"
                >
                  <LinearGradient colors={['#34d399', '#10b981']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} className="h-full rounded-full" />
                </MotiView>
              </View>

              <View className="flex-row-reverse justify-between mt-4 px-1">
                <Text className="text-slate-500 text-[12px] font-extrabold tracking-widest uppercase">לפני שתים עשרה דק׳</Text>
                <Text className="text-emerald-500 text-[12px] font-extrabold">100%</Text>
              </View>
            </View>
          </MotiView>

          {/* Action Blocks */}
          <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 350, type: 'spring' }}>
            
            <TouchableOpacity activeOpacity={0.7} className="flex-row-reverse items-center bg-black/40 p-5 rounded-[24px] border border-white/5 shadow-lg relative overflow-hidden mb-5">
              <LinearGradient colors={['rgba(255,255,255,0.02)', 'transparent']} className="absolute inset-0" />
              <View className="w-12 h-12 bg-indigo-500/10 rounded-[16px] items-center justify-center border border-indigo-500/20 shadow-inner ml-4">
                <DatabaseBackup color="#818cf8" size={24} />
              </View>
              <View className="flex-1 items-end">
                 <Text className="text-white text-[17px] font-extrabold mb-0.5">סנכרון עכשיו</Text>
                 <Text className="text-slate-400 text-[12px] font-medium">דחוף מידע משתנה ידנית לענן</Text>
              </View>
              <ChevronRight color="#64748b" size={20} style={{ transform: [{ scaleX: -1 }] }} />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} className="flex-row-reverse items-center bg-black/40 p-5 rounded-[24px] border border-white/5 shadow-lg relative overflow-hidden mb-5">
              <LinearGradient colors={['rgba(255,255,255,0.02)', 'transparent']} className="absolute inset-0" />
              <View className="w-12 h-12 bg-indigo-500/10 rounded-[16px] items-center justify-center border border-indigo-500/20 shadow-inner ml-4">
                <History color="#818cf8" size={24} />
              </View>
              <View className="flex-1 items-end">
                 <Text className="text-white text-[17px] font-extrabold mb-0.5">היסטוריית גרסאות</Text>
                 <Text className="text-slate-400 text-[12px] font-medium">שחזר מחיקות מהעבר</Text>
              </View>
              <ChevronRight color="#64748b" size={20} style={{ transform: [{ scaleX: -1 }] }} />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} className="flex-row-reverse items-center bg-black/40 p-5 rounded-[24px] border border-white/5 shadow-lg relative overflow-hidden">
              <LinearGradient colors={['rgba(255,255,255,0.02)', 'transparent']} className="absolute inset-0" />
              <View className="w-12 h-12 bg-emerald-500/10 rounded-[16px] items-center justify-center border border-emerald-500/20 shadow-inner ml-4">
                <ShieldCheck color="#34d399" size={24} />
              </View>
              <View className="flex-1 items-end">
                 <Text className="text-white text-[17px] font-extrabold mb-0.5">אבטחת מידע</Text>
                 <Text className="text-slate-400 text-[12px] font-medium">ניהול גישה והצפנה</Text>
              </View>
              <ChevronRight color="#64748b" size={20} style={{ transform: [{ scaleX: -1 }] }} />
            </TouchableOpacity>

          </MotiView>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
