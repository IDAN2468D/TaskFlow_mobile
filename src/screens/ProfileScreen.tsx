import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Image, Alert, InteractionManager, ActivityIndicator } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User as UserIcon, Settings, LogOut, BrainCircuit, CheckCircle2, ListTodo, ChevronLeft, Bell, Palette, CloudSync, Zap, Target, Star, ShieldCheck, Focus } from 'lucide-react-native';
import { MotiView } from 'moti';
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

// Services
import UserSkillsManager from '../components/users/UserSkillsManager';
import { toggleFocusMode, getUserSettings } from '../services/userService';
import { taskService } from '../services/taskService';

interface StatsState {
  user: { name: string; email: string; avatar?: string | null };
  activeTasks: number;
  completedTasks: number;
  aiActions: number;
  productivityScore: number;
}

import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen() {
  const { colors: themeColors } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [stats, setStats] = useState<StatsState>({
    user: { name: '', email: '' },
    activeTasks: 0,
    completedTasks: 0,
    aiActions: 0,
    productivityScore: 85
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const fetchStats = async () => {
    try {
      const defaultUser = { name: 'משתמש', email: '...', avatar: null };
      
      const [statsData, settingsData] = await Promise.allSettled([
        taskService.getStats(),
        getUserSettings()
      ]);

      if (statsData.status === 'fulfilled' && statsData.value) {
        setStats(prev => ({ ...prev, ...statsData.value }));
      } else {
        setStats(prev => ({ ...prev, user: defaultUser }));
      }

      if (settingsData.status === 'fulfilled' && settingsData.value) {
        setIsFocusMode(settingsData.value.isFocusModeEnabled);
      }
    } catch (error) {
      console.error('[ProfileScreen] Fetch Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
      fetchStats();
    });
    return () => task.cancel();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    router.replace('/auth' as any);
  };

  const handleToggleFocus = async () => {
    const previousState = isFocusMode;
    setIsFocusMode(!previousState);

    try {
      const result = await toggleFocusMode();
      setIsFocusMode(result.isFocusModeEnabled);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        result.isFocusModeEnabled ? 'מצב ריכוז עמוק הופעל' : 'מצב ריכוז כבוי',
        result.isFocusModeEnabled ? 'ה-AI יתעדף כעת משימות עבודה עמוקה.' : 'חזור לתצוגת משימות סטנדרתית.'
      );
    } catch (error) {
      setIsFocusMode(previousState);
      Alert.alert('שגיאה', 'לא הצלחנו לעדכן את מצב הריכוז בשרת.');
    }
  };

  if (!isReady || loading) {
    return (
      <View style={{ backgroundColor: themeColors.background }} className="flex-1 justify-center items-center">
        <ActivityIndicator color={themeColors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: themeColors.background }} className="flex-1">
      <LinearGradient
        colors={[themeColors.secondary, themeColors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 600 }}
      />

      {/* Dynamic Background Glow Orbs */}
      <MotiView
        from={{ opacity: 0.05, scale: 1 }}
        animate={{ opacity: 0.1, scale: 1.3 }}
        transition={{ loop: true, type: 'timing', duration: 9000, repeatReverse: true }}
        style={{ position: 'absolute', top: 200, left: -100, width: 400, height: 400, borderRadius: 200, backgroundColor: themeColors.primary + '22' }}
      />
      <MotiView
        from={{ opacity: 0.03, scale: 1.1 }}
        animate={{ opacity: 0.08, scale: 0.8 }}
        transition={{ loop: true, type: 'timing', duration: 11000, repeatReverse: true }}
        style={{ position: 'absolute', bottom: 50, right: -150, width: 500, height: 500, borderRadius: 250, backgroundColor: themeColors.accent + '1A' }}
      />

      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchStats(); }} tintColor={themeColors.primary} />}
        >
          <View className="flex-1 px-6 pt-10">
            {/* New Vivid Profile Header */}
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="mb-12 rounded-[48px] border border-white/10 overflow-hidden shadow-2xl relative"
            >
              <LinearGradient 
                colors={[themeColors.primary, themeColors.secondary]} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 1 }} 
                className="p-10"
              >
                {/* Decorative elements */}
                <View className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-40" />
                
                <View className="flex-row-reverse items-center justify-between z-10">
                  <View className="items-end flex-1 ml-6">
                    <Text className="text-white font-black text-[34px] tracking-tighter leading-none mb-2 text-right">
                      {stats.user.name || 'משתמש'}
                    </Text>
                    <View className="bg-white/20 self-end px-3 py-1 rounded-full border border-white/30 mb-3">
                      <Text className="text-[11px] font-black text-white uppercase tracking-tighter">Pro Architect</Text>
                    </View>
                    <Text className="text-white font-bold text-[15px] text-right opacity-80">{stats.user.email}</Text>
                  </View>

                  <View className="relative shadow-2xl">
                    <View className="w-28 h-28 rounded-[32px] overflow-hidden border-4 border-white/30 bg-white/10">
                      {stats.user.avatar ? (
                        <Image source={{ uri: stats.user.avatar }} style={{ width: '100%', height: '100%' }} />
                      ) : (
                        <View className="w-full h-full items-center justify-center">
                          <UserIcon size={48} color="#fff" strokeWidth={1.5} />
                        </View>
                      )}
                    </View>
                    <MotiView 
                      from={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 600 }}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-400 rounded-2xl border-4 items-center justify-center shadow-lg"
                      style={{ borderColor: themeColors.primary }}
                    >
                      <ShieldCheck size={20} color="#fff" />
                    </MotiView>
                  </View>
                </View>
              </LinearGradient>
            </MotiView>

            {/* AI Productivity Meter */}
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 200 }}
              className="mb-12 bg-white/5 p-6 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <View className="flex-row-reverse justify-between items-center z-10">
                <View className="items-end">
                  <Text className="text-white font-black text-[22px] tracking-tight text-right">מדד פרודוקטיביות AI</Text>
                  <Text className="text-slate-500 font-bold text-[14px] mt-0.5 text-right">ביצועים גבוהים ב-12% מהשבוע שעבר</Text>
                </View>
                <View style={{ backgroundColor: themeColors.primary + '1A', borderColor: themeColors.primary + '33' }} className="w-16 h-16 rounded-[22px] items-center justify-center border">
                  <Text style={{ color: themeColors.primary }} className="font-black text-[24px]">{stats.productivityScore}%</Text>
                </View>
              </View>
              <View className="w-full h-2.5 bg-white/5 rounded-full mt-6 overflow-hidden border border-white/5">
                <MotiView 
                  from={{ width: '0%' }}
                  animate={{ width: `${stats.productivityScore}%` }}
                  transition={{ type: 'timing', duration: 1500, delay: 500 }}
                  style={{ backgroundColor: themeColors.primary }}
                  className="h-full shadow-lg shadow-indigo-500/50"
                />
              </View>
            </MotiView>

            {/* Bento Grid Stats as Interactive Buttons */}
            <View className="flex-row-reverse justify-between gap-4 mb-8">
              {/* Active Tasks - Soft Secondary */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ backgroundColor: themeColors.secondary, borderColor: themeColors.primary + '33' }}
                className="flex-1 rounded-[32px] border overflow-hidden shadow-2xl"
              >
                  <View className="p-6 relative">
                  <View style={{ backgroundColor: themeColors.primary + '1A' }} className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-10 -mt-10 blur-xl" />
                  <View style={{ backgroundColor: themeColors.primary + '1A', borderColor: themeColors.primary + '33' }} className="w-12 h-12 rounded-[18px] items-center justify-center mb-4 border backdrop-blur-md">
                    <ListTodo size={24} color={themeColors.primary} />
                  </View>
                  <Text className="text-[38px] font-black text-white mb-0.5 tracking-tighter">{stats.activeTasks}</Text>
                  <Text className="text-[14px] font-black text-white text-right">משימות פתוחות</Text>
                  </View>
              </TouchableOpacity>

              {/* Completed Tasks - Soft Accent */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ backgroundColor: themeColors.secondary, borderColor: themeColors.accent + '33' }}
                className="flex-1 rounded-[32px] border overflow-hidden shadow-2xl"
              >
                 <View className="p-6 relative">
                  <View style={{ backgroundColor: themeColors.accent + '1A' }} className="absolute top-0 left-0 w-32 h-32 rounded-full -ml-10 -mt-10 blur-xl" />
                  <View style={{ backgroundColor: themeColors.accent + '1A', borderColor: themeColors.accent + '33' }} className="w-12 h-12 rounded-[18px] items-center justify-center mb-4 border backdrop-blur-md">
                    <CheckCircle2 size={24} color={themeColors.accent} />
                  </View>
                  <Text className="text-[38px] font-black text-white mb-0.5 tracking-tighter">{stats.completedTasks}</Text>
                  <Text className="text-[14px] font-black text-white text-right">הישגים שבוצעו</Text>
                  </View>
              </TouchableOpacity>
            </View>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 500 }}
              style={{ backgroundColor: themeColors.secondary, borderColor: themeColors.primary + '33' }}
              className="p-8 rounded-[36px] mb-12 relative overflow-hidden shadow-2xl border"
            >
              <LinearGradient colors={[themeColors.primary + '1A', 'transparent']} className="absolute inset-0" />
              <View className="flex-row-reverse items-center justify-between z-10">
                <View className="flex-1 mr-4">
                  <Text style={{ color: themeColors.primary }} className="font-black text-[14px] uppercase tracking-widest text-right mb-2 opacity-60">תובנות בינה מלאכותית</Text>
                  <Text className="text-white font-black text-[32px] leading-none tracking-tighter text-right">חסכת {Math.round(stats.aiActions * 2.5)} דקות</Text>
                  <Text className="text-slate-400 font-bold text-[15px] mt-2 text-right">באמצעות {stats.aiActions} פעולות אוטומטיות שביצעת</Text>
                </View>
                <MotiView 
                  from={{ rotate: '0deg' }}
                  animate={{ rotate: '360deg' }}
                  transition={{ loop: true, duration: 20000, type: 'timing', easing: Easing.bezier(0, 0, 1, 1) }}
                  style={{ backgroundColor: themeColors.primary + '1A', borderColor: themeColors.primary + '33' }}
                  className="w-20 h-20 rounded-[24px] items-center justify-center border overflow-hidden shadow-2xl"
                >
                  <BrainCircuit size={40} color={themeColors.primary} />
                </MotiView>
              </View>
            </MotiView>

            {/* User Skills */}
            <UserSkillsManager onNavigate={(path) => router.push(path as any)} />

            {/* Focus Mode Toggle */}
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 600, type: 'spring' }}
              className="mt-6 mb-2"
            >
              <TouchableOpacity onPress={handleToggleFocus} activeOpacity={0.9} className="overflow-hidden rounded-[32px]">
                <View className={`flex-row-reverse items-center justify-between p-6 rounded-[32px] border ${isFocusMode ? 'bg-white/5 border-white/20' : 'bg-white/5 border-white/10'}`}>
                  {isFocusMode && (
                    <LinearGradient colors={[themeColors.primary + '1A', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
                  )}
                  <View className="flex-row-reverse items-center gap-4">
                    <View 
                      style={{ backgroundColor: isFocusMode ? themeColors.primary : 'rgba(255,255,255,0.05)', borderColor: isFocusMode ? themeColors.accent : 'rgba(255,255,255,0.1)' }}
                      className={`w-14 h-14 rounded-[22px] items-center justify-center border-2`}
                    >
                      <Focus size={30} color={isFocusMode ? '#fff' : '#4b5563'} strokeWidth={2} />
                    </View>
                    <View className="items-end">
                      <Text className="text-white font-black text-[22px] tracking-tight text-right">מצב ריכוז עמוק</Text>
                      <Text className={`${isFocusMode ? 'text-indigo-300' : 'text-slate-500'} text-[13px] font-bold mt-0.5 text-right`}>
                        {isFocusMode ? 'ביצועי AI משופרים' : 'סדר עדיפויות מבוסס AI'}
                      </Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor: isFocusMode ? themeColors.primary + '33' : 'rgba(255,255,255,0.05)' }} className={`w-[60px] h-[34px] rounded-full p-1 border border-white/10 items-start`}>
                    <MotiView
                      animate={{ translateX: isFocusMode ? 0 : 26, backgroundColor: isFocusMode ? '#fff' : '#3f3f46', scale: isFocusMode ? 1.1 : 1 }}
                      transition={{ type: 'spring', damping: 15, stiffness: 150 }}
                      style={{ width: 26, height: 26, borderRadius: 13, shadowColor: isFocusMode ? '#fff' : '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10, elevation: 5 }}
                    >
                      {isFocusMode && <View className="w-full h-full items-center justify-center"><Zap size={14} color={themeColors.primary} fill={themeColors.primary} /></View>}
                    </MotiView>
                  </View>
                </View>
              </TouchableOpacity>
            </MotiView>

            {/* Settings Options */}
            <View className="w-full mb-10 mt-6 gap-4">
              
              <TouchableOpacity 
                onPress={() => router.push('/account-settings' as any)} 
                style={{ backgroundColor: themeColors.secondary, borderColor: 'rgba(255,255,255,0.05)' }}
                className="flex-row-reverse items-center justify-between p-5 rounded-[24px] border shadow-lg"
              >
                <View className="flex-row-reverse items-center gap-4">
                  <View className="w-12 h-12 bg-white/5 rounded-[16px] items-center justify-center border border-white/10">
                    <Settings size={22} color="#f8fafc" />
                  </View>
                  <Text className="text-white font-bold text-[17px]">הגדרות חשבון</Text>
                </View>
                <View className="w-8 h-8 rounded-full bg-white/5 items-center justify-center">
                  <ChevronLeft size={18} color="#cbd5e1" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => router.push('/notifications' as any)} 
                style={{ backgroundColor: themeColors.secondary, borderColor: themeColors.primary + '1A' }}
                className="flex-row-reverse items-center justify-between p-5 rounded-[24px] border shadow-lg"
              >
                <View className="flex-row-reverse items-center gap-4">
                  <View style={{ backgroundColor: themeColors.primary + '22' }} className="w-12 h-12 rounded-[16px] items-center justify-center border border-white/5">
                    <Bell size={22} color={themeColors.primary} />
                  </View>
                  <Text className="text-white font-bold text-[17px]">התראות ומועדים</Text>
                </View>
                <View style={{ backgroundColor: themeColors.primary + '33' }} className="px-3 py-1 rounded-full border border-white/10">
                  <Text style={{ color: themeColors.primary }} className="text-[12px] font-bold">פעיל</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => router.push('/theme-settings' as any)} 
                style={{ backgroundColor: themeColors.secondary, borderColor: themeColors.accent + '1A' }}
                className="flex-row-reverse items-center justify-between p-5 rounded-[24px] border shadow-lg"
              >
                <View className="flex-row-reverse items-center gap-4">
                  <View style={{ backgroundColor: themeColors.accent + '22' }} className="w-12 h-12 rounded-[16px] items-center justify-center border border-white/5">
                    <Palette size={22} color={themeColors.accent} />
                  </View>
                  <Text className="text-white font-bold text-[17px]">התאמה אישית</Text>
                </View>
                <View className="w-8 h-8 rounded-full bg-white/5 items-center justify-center">
                  <ChevronLeft size={18} color={themeColors.accent} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => router.push('/cloud-sync' as any)} 
                style={{ backgroundColor: themeColors.secondary, borderColor: 'rgba(255,255,255,0.05)' }}
                className="flex-row-reverse items-center justify-between p-5 rounded-[24px] border shadow-lg"
               >
                <View className="flex-row-reverse items-center gap-4">
                  <View className="w-12 h-12 bg-white/5 rounded-[16px] items-center justify-center border border-white/10">
                    <CloudSync size={22} color="#93c5fd" />
                  </View>
                  <Text className="text-white font-bold text-[17px]">סנכרון ענן AI</Text>
                </View>
                <View className="w-8 h-8 rounded-full bg-white/5 items-center justify-center">
                  <ChevronLeft size={18} color="#bfdbfe" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity onPress={handleLogout} className="flex-row-reverse items-center justify-center gap-3 bg-red-500/10 py-5 rounded-[24px] border border-red-500/30 mx-4 shadow-lg">
              <LogOut size={20} color="#f87171" />
              <Text className="text-red-400 font-black text-[15px] uppercase tracking-wider">התנתקות מהמערכת</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}