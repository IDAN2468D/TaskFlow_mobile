import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl, 
  Image, 
  Alert, 
  ActivityIndicator,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { executeOnIdle } from '../lib/performance';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User as UserIcon, 
  Settings, 
  LogOut, 
  BrainCircuit, 
  CheckCircle2, 
  ListTodo, 
  ChevronLeft, 
  ChevronRight,
  Bell, 
  Palette, 
  CloudSync, 
  Zap, 
  ShieldCheck, 
  Crown,
  Heart,
  Cpu,
  Layers
} from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

// Services
import { toggleFocusMode, getUserSettings } from '../services/userService';
import { taskService } from '../services/taskService';

const { width, height } = Dimensions.get('window');

const PremiumCard = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <MotiView
    from={{ opacity: 0, translateY: 15 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: 'spring', delay }}
    className={`rounded-outer overflow-hidden bg-surface-low p-5 ${className}`}
  >
    {children}
  </MotiView>
);

interface StatsState {
  user: { name: string; email: string; avatar?: string | null };
  activeTasks: number;
  completedTasks: number;
  aiActions: number;
  productivityScore: number;
}

export default function ProfileScreen() {
  const { colors: themeColors } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [stats, setStats] = useState<StatsState>({
    user: { name: '', email: '' },
    activeTasks: 0,
    completedTasks: 0,
    aiActions: 0,
    productivityScore: 88
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const fetchStats = async () => {
    try {
      const [statsData, settingsData] = await Promise.allSettled([
        taskService.getStats(),
        getUserSettings()
      ]);

      if (statsData.status === 'fulfilled' && statsData.value) {
        setStats(prev => ({ ...prev, ...statsData.value }));
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
    const task = executeOnIdle(() => {
      setIsReady(true);
      fetchStats();
    });
    return () => task.cancel();
  }, []);

  const handleLogout = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await SecureStore.deleteItemAsync('token');
    router.replace('/auth' as any);
  };

  const handleToggleFocus = async () => {
    const previousState = isFocusMode;
    setIsFocusMode(!previousState);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const result = await toggleFocusMode();
      setIsFocusMode(result.isFocusModeEnabled);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      setIsFocusMode(previousState);
      Alert.alert('שגיאה', 'לא הצלחנו לעדכן את מצב הריכוז בשרת.');
    }
  };

  if (!isReady || loading) {
    return (
      <View className="flex-1 bg-obsidian justify-center items-center">
        <ActivityIndicator color={themeColors.primary} size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-obsidian">
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchStats(); }} tintColor={themeColors.primary} />
          }
        >
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
                    <Text className="text-text-dim text-[10px] font-black uppercase tracking-[2px]">USER_PROTOCOL_V4</Text>
                  </View>
                  <Text className="text-text-main text-3xl font-black tracking-tighter">פרופיל אישי</Text>
                </View>
              </View>
            </View>
          </MotiView>

          {/* Profile Hero Card */}
          <MotiView
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="mb-4"
          >
            <View className="rounded-outer overflow-hidden bg-surface-low p-5">
              <View className="flex-row items-center gap-4">
                <View className="items-start flex-1">
                   <Text className="text-text-main text-[22px] font-black tracking-tight mb-1">
                    {stats.user.name || 'משתמש'}
                  </Text>
                  <View className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20 mb-2 flex-row items-center gap-1.5">
                     <Crown size={12} color={themeColors.primary} />
                     <Text className="text-[11px] font-black text-primary uppercase tracking-widest">PRO ARCHITECT</Text>
                  </View>
                  <Text className="text-text-dim font-bold text-[13px]">{stats.user.email}</Text>
                </View>

                <View className="relative">
                  <View className="w-20 h-20 rounded-inner overflow-hidden border-2 border-white/10 bg-obsidian">
                    {stats.user.avatar ? (
                      <Image source={{ uri: stats.user.avatar }} style={{ width: '100%', height: '100%' }} />
                    ) : (
                      <View className="flex-1 items-center justify-center">
                        <UserIcon size={34} color="#fff" strokeWidth={1.5} />
                      </View>
                    )}
                  </View>
                  <View className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-lg border-2 border-surface-low items-center justify-center shadow-lg">
                    <ShieldCheck size={16} color="#fff" />
                  </View>
                </View>
              </View>
            </View>
          </MotiView>

          {/* AI Productivity Card */}
          <PremiumCard delay={200} className="mb-4">
             <View className="flex-row justify-between items-center mb-4">
                <View className="items-start">
                   <Text className="text-text-dim text-[11px] font-black uppercase tracking-widest mb-1">PERFORMANCE_ENGINE</Text>
                   <Text className="text-text-main text-[18px] font-black tracking-tight">מדד פרודוקטיביות</Text>
                </View>
                <View className="w-12 h-12 rounded-inner items-center justify-center bg-primary/10">
                   <Text className="text-primary font-black text-[16px]">{stats.productivityScore}%</Text>
                </View>
             </View>
             
             <View className="h-2 bg-obsidian rounded-full overflow-hidden mb-3">
                <MotiView 
                  from={{ width: '0%' }}
                  animate={{ width: `${stats.productivityScore}%` }}
                  transition={{ type: 'timing', duration: 1500, delay: 500 }}
                  className="h-full rounded-full bg-primary"
                />
             </View>
             
             <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1.5">
                   <Heart size={12} color={themeColors.primary} fill={themeColors.primary} />
                    <Text className="text-text-dim text-[11px] font-black uppercase tracking-[1px]">Antigravity Algorithm</Text>
                </View>
                <Text className="text-text-dim text-[11px] font-black uppercase tracking-wider">{stats.productivityScore}/100 SCORE</Text>
              </View>
            </PremiumCard>

          {/* Quick Stats Grid */}
          <View className="flex-row gap-3 mb-4">
            <PremiumCard delay={300} className="flex-1 p-5 items-center bg-surface-mid">
                 <View className="w-12 h-12 rounded-inner bg-obsidian items-center justify-center mb-2">
                  <ListTodo size={22} color={themeColors.primary} />
                 </View>
                 <Text className="text-text-main text-[22px] font-black tracking-tighter">{stats.activeTasks}</Text>
                 <Text className="text-text-dim text-[12px] font-black uppercase tracking-widest mt-1">משימות</Text>
            </PremiumCard>
 
            <PremiumCard delay={400} className="flex-1 p-5 items-center bg-surface-mid">
                 <View className="w-12 h-12 rounded-inner bg-obsidian items-center justify-center mb-2">
                  <CheckCircle2 size={22} color="#10b981" />
                 </View>
                 <Text className="text-text-main text-[22px] font-black tracking-tighter">{stats.completedTasks}</Text>
                 <Text className="text-text-dim text-[12px] font-black uppercase tracking-widest mt-1">הישגים</Text>
            </PremiumCard>
          </View>
 
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 500 }}
            className="mb-4"
          >
            <TouchableOpacity 
              onPress={handleToggleFocus} 
              activeOpacity={0.9} 
              className={`flex-row items-center justify-between p-5 rounded-outer ${isFocusMode ? 'bg-primary' : 'bg-surface-low'}`}
            >
                <View className="flex-row items-center gap-4">
                  <View 
                    className={`w-12 h-12 rounded-inner items-center justify-center ${isFocusMode ? 'bg-white/20' : 'bg-obsidian'}`}
                  >
                    <Zap size={22} color="#fff" fill={isFocusMode ? '#fff' : 'none'} />
                  </View>
                  <View className="items-start">
                    <Text className="text-white text-[21px] font-black tracking-tight">מצב ריכוז עמוק</Text>
                    <Text className={`${isFocusMode ? 'text-white/70' : 'text-text-dim'} text-[14px] font-bold mt-1`}>
                      {isFocusMode ? 'פרוטוקול AI פעיל' : 'תיעדוף בינה מלאכותית'}
                    </Text>
                  </View>
                </View>
                
                <View className={`w-10 h-6 rounded-full items-start p-1 ${isFocusMode ? 'bg-white/30' : 'bg-obsidian'}`}>
                  <MotiView
                    animate={{ translateX: isFocusMode ? -16 : 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-4 h-4 rounded-full bg-white shadow-lg"
                  />
                </View>
            </TouchableOpacity>
          </MotiView>

          {/* System Protocol Settings */}
          <View className="gap-y-3">
              <Text className="text-text-dim text-[13px] font-black uppercase tracking-widest px-3 mb-1">SYSTEM_PROTOCOLS</Text>
              
               {[
                 { icon: Settings, label: 'הגדרות חשבון', route: '/account-settings', color: '#f8fafc' },
                 { icon: Bell, label: 'התראות ומועדים', route: '/notifications', color: themeColors.primary, badge: 'פעיל' },
                 { icon: Palette, label: 'התאמה אישית', route: '/theme-settings', color: themeColors.accent },
                 { icon: CloudSync, label: 'סנכרון ענן AI', route: '/cloud-sync', color: '#38bdf8' }
               ].map((item, idx) => (
                 <TouchableOpacity 
                    key={idx}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push(item.route as any);
                    }}
                    className="flex-row items-center justify-between p-5 rounded-outer bg-surface-low"
                 >
                     <View className="flex-row items-center gap-4">
                        <View className="w-10 h-10 rounded-inner bg-obsidian items-center justify-center">
                          <item.icon size={20} color={item.color} />
                        </View>
                        <Text className="text-text-main text-[16px] font-bold tracking-tight">{item.label}</Text>
                     </View>
                     <View className="flex-row items-center gap-3">
                        {item.badge && (
                          <View className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                             <Text className="text-primary text-[11px] font-black uppercase tracking-widest">{item.badge}</Text>
                          </View>
                        )}
                        <ChevronLeft size={20} color="rgba(255,255,255,0.2)" />
                     </View>
                 </TouchableOpacity>
               ))}
           </View>

              {/* Logout Protocol */}
              <TouchableOpacity 
                onPress={handleLogout}
                activeOpacity={0.8}
                className="mt-4 flex-row items-center justify-center h-14 rounded-outer bg-rose-500/10 border border-rose-500/20 gap-3"
              >
                  <LogOut size={22} color="#f43f5e" />
                  <Text className="text-rose-500 font-black text-[15px] uppercase tracking-widest">ניתוק מערכת</Text>
              </TouchableOpacity>

          {/* Antigravity Footer */}
          <View className="mt-14 items-center opacity-30 pb-10">
             <View className="flex-row items-center gap-3 mb-2">
                <View className="h-[0.5px] w-14 bg-white/10" />
                <Cpu size={18} color="#fff" />
                <View className="h-[0.5px] w-14 bg-white/10" />
             </View>
             <Text className="text-[14px] text-white font-black text-center mb-1 tracking-[1px]">אנטיגרביטי</Text>
             <Text className="text-[12px] text-white/60 font-black uppercase tracking-[2px] text-center">SECURE_SYNC_ACTIVE_V4.2.8</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}