import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, InteractionManager, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Timer, Zap, Play, Pause, RotateCcw, Coffee, Target, Sparkles, Brain } from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { useTimer } from '../hooks/useTimer';
import { taskService, Task } from '../services/taskService';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function FocusModeScreen() {
  const [isReady, setIsReady] = React.useState(false);
  const { mode, timeLeft, isActive, toggleTimer, resetTimer, switchMode, formatTime, progress } = useTimer();

  React.useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => task.cancel();
  }, []);

  const [topTask, setTopTask] = React.useState<Task | null>(null);

  React.useEffect(() => {
    if (!isReady) return;
    const fetchTop = async () => {
      const task = await taskService.getTopTask();
      setTopTask(task);
    };
    fetchTop();
  }, [isReady]);

  if (!isReady) {
    return (
      <View className="flex-1 bg-obsidian items-center justify-center">
        <ActivityIndicator color="#6366f1" size="small" />
      </View>
    );
  }

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    toggleTimer();
  };

  const handleReset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    resetTimer();
  };

  // mode-based styles
  const themeColor = mode === 'work' ? '#6366f1' : '#10b981';
  const ambientColor = mode === 'work' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.15)';

  return (
    <View className="flex-1 bg-[#09090b]">
      {/* Dynamic Ambient Background */}
      <AnimatePresence>
        <MotiView
          key={mode}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 800 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 800 }}
        >
          <LinearGradient 
            colors={[ambientColor, 'transparent']} 
            style={{ width: '100%', height: '100%' }} 
          />
        </MotiView>
      </AnimatePresence>

      <SafeAreaView edges={['top']} className="flex-1">
        <View className="flex-1 items-center px-8 pt-10">
          
          {/* Header - Mode Selector Display */}
          <MotiView 
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="w-full flex-row-reverse justify-between items-center mb-6"
          >
            <View>
              <Text className="text-white font-black text-xl text-right tracking-tight">מרחב עבודה</Text>
              <Text className="text-slate-500 text-[11px] font-bold text-right tracking-widest uppercase">Deep Focus</Text>
            </View>
            <View className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 items-center justify-center">
              <Brain color={themeColor} size={20} />
            </View>
          </MotiView>

          {/* Mission Control Card */}
          <MotiView 
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white/5 rounded-[24px] border border-white/10 p-4 mb-10 shadow-2xl relative overflow-hidden"
          >
             <LinearGradient 
                colors={['rgba(255,255,255,0.02)', 'transparent']} 
                className="absolute inset-0" 
             />
             
             <View className="flex-row-reverse items-center justify-between mb-2">
               <View className="flex-row-reverse items-center gap-2 px-2.5 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                 <Sparkles size={10} color="#818cf8" fill="#818cf8" />
                 <Text className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">משימה למיקוד</Text>
               </View>
               <View className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
             </View>

             <Text className="text-white font-black text-lg text-right leading-tight mb-1" numberOfLines={1}>
               {topTask?.title || 'טוען משימה...'}
             </Text>
             <Text className="text-slate-500 text-[12px] text-right font-medium leading-[18px]" numberOfLines={2}>
               {topTask?.description || 'ה-AI מציג את המשימה הדחופה ביותר עבורך ברגע זה&rlm;.'}
             </Text>
          </MotiView>

          {/* New Advanced Timer Visuals */}
          <View className="items-center justify-center mb-8 relative">
             {/* Outer Glow Ring */}
             <MotiView 
               animate={{ 
                 scale: isActive ? [1, 1.1, 1] : 1,
                 opacity: isActive ? [0.2, 0.4, 0.2] : 0.2
               }}
               transition={{ loop: true, duration: 4000, type: 'timing' }}
               style={{ 
                 position: 'absolute', 
                 width: 270, 
                 height: 270, 
                 borderRadius: 135, 
                 borderWidth: 1, 
                 borderColor: themeColor,
                 borderStyle: 'dashed'
               }}
             />

             {/* Main Circle - Scaled Down */}
             <View className="w-[230px] h-[230px] rounded-full bg-[#18181b]/80 border-[6px] border-white/5 items-center justify-center shadow-2xl relative overflow-hidden">
                <LinearGradient 
                  colors={['rgba(255,255,255,0.05)', 'transparent']} 
                  className="absolute inset-0"
                />
                
                <Text 
                  style={{ fontSize: 60, fontFamily: 'System' }}
                  className={`font-black tracking-tighter tabular-nums ${mode === 'work' ? 'text-white' : 'text-emerald-400'}`}
                >
                  {formatTime(timeLeft)}
                </Text>

                <MotiView 
                  animate={{ opacity: isActive ? 1 : 0.5 }}
                  className="mt-1 flex-row items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/10"
                >
                  <Timer size={10} color="#94a3b8" />
                  <Text className="text-slate-400 font-black uppercase text-[9px] tracking-[1px]">פומודורו</Text>
                </MotiView>
             </View>

             {/* Seconds Orbiter */}
             <MotiView 
               animate={{ rotate: isActive ? '360deg' : '0deg' }}
               transition={{ loop: true, duration: 60000, type: 'timing' }}
               className="absolute w-[256px] h-[256px] items-center"
             >
               <MotiView
                 animate={{ scale: isActive ? [1, 1.3, 1] : 1 }}
                 transition={{ loop: true, duration: 2000 }}
                 className="w-3.5 h-3.5 rounded-full items-center justify-center"
               >
                 <LinearGradient 
                   colors={[themeColor, '#fff']} 
                   className="w-full h-full rounded-full" 
                 />
               </MotiView>
             </MotiView>
          </View>

          <View className="w-full h-px bg-white/5 mb-8" />

          {/* Controls Area */}
          <View className="w-full flex-row-reverse justify-around items-center px-4">
            {/* Mode Indicator */}
            <TouchableOpacity 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                switchMode();
              }}
              className="items-center gap-2"
            >
              <View className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 items-center justify-center">
                <Zap color={themeColor} size={20} fill={mode === 'work' ? themeColor : 'none'} />
              </View>
              <Text className="text-[9px] font-black text-slate-500 uppercase tracking-widest">מצב</Text>
            </TouchableOpacity>

            {/* Play/Pause Button - Premium */}
            <TouchableOpacity 
              onPress={handleToggle}
              activeOpacity={0.8}
              className="w-20 h-20 rounded-[28px] items-center justify-center shadow-2xl elevation-10 relative overflow-hidden"
            >
              <LinearGradient 
                colors={mode === 'work' ? ['#6366f1', '#4338ca'] : ['#10b981', '#059669']}
                className="absolute inset-0"
              />
              <AnimatePresence exitBeforeEnter>
                {isActive ? (
                  <MotiView key="pause" from={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="items-center">
                    <Pause color="#fff" size={28} fill="#fff" />
                    <Text className="text-white text-[9px] font-black uppercase tracking-[1px] mt-0.5">השהה</Text>
                  </MotiView>
                ) : (
                  <MotiView key="play" from={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="items-center">
                    <Play color="#fff" size={28} fill="#fff" style={{ marginLeft: 3 }} />
                    <Text className="text-white text-[9px] font-black uppercase tracking-[1px] mt-0.5">התחל</Text>
                  </MotiView>
                )}
              </AnimatePresence>
            </TouchableOpacity>

            {/* Reset Button */}
            <TouchableOpacity 
              onPress={handleReset}
              className="items-center gap-2"
            >
              <View className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 items-center justify-center">
                <RotateCcw color="#94a3b8" size={20} />
              </View>
              <Text className="text-[9px] font-black text-slate-500 uppercase tracking-widest">איפוס</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Floating Quote */}
          <MotiView 
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 1000 }}
            className="mt-auto mb-4 w-full"
          >
            <View className="bg-white/5 p-4 rounded-[20px] border border-white/10 items-center">
              <Text className="text-slate-500 text-center text-[12px] leading-[18px] italic font-bold">
                "תנועה מתמדת יוצרת את הכוח להתמיד&rlm;."
              </Text>
            </View>
          </MotiView>
        </View>
      </SafeAreaView>
    </View>
  );
}


